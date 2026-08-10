import Stripe from 'https://esm.sh/stripe@16.10.0?target=deno&dts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!stripeKey || !webhookSecret) {
      throw new Error('Missing Stripe configuration')
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-11-20' })

    // Get the Stripe signature header
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('Missing stripe-signature header')
    }

    // Get the raw body as text
    const body = await req.text()

    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      throw new Error('Invalid webhook signature')
    }

    console.log(`Received Stripe event: ${event.type}`)

    // Handle payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Log the successful payment
      console.log(`Payment succeeded: ${paymentIntent.id}`)

      // Update the order status to "Paid" in Supabase
      // We'll look up the order by stripe_payment_intent and update its status
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration')
      }

      // Update order status to "Paid"
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent=eq.${paymentIntent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({
          status: 'Paid',
          payment_verified_at: new Date().toISOString(),
        }),
      })

      if (!updateResponse.ok) {
        const error = await updateResponse.text()
        console.error('Failed to update order status:', error)
        throw new Error(`Failed to update order: ${updateResponse.status}`)
      }

      console.log(`Order status updated for payment intent: ${paymentIntent.id}`)

      // Log webhook event to database for audit trail
      try {
        await fetch(`${supabaseUrl}/rest/v1/webhook_logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            event_type: event.type,
            event_id: event.id,
            payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            processed_at: new Date().toISOString(),
          }),
        })
      } catch (logErr) {
        console.error('Failed to log webhook event:', logErr)
        // Don't fail the webhook if logging fails
      }
    }

    // Handle payment_intent.payment_failed event
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      console.log(`Payment failed: ${paymentIntent.id}`)

      // Update order status to "Payment Failed"
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

      if (supabaseUrl && supabaseKey) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent=eq.${paymentIntent.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
            },
            body: JSON.stringify({
              status: 'Payment Failed',
              updated_at: new Date().toISOString(),
            }),
          })
        } catch (err) {
          console.error('Failed to update failed payment status:', err)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        eventId: event.id,
        eventType: event.type,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    console.error('Webhook error:', err)

    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}
