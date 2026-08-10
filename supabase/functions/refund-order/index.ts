import Stripe from 'https://esm.sh/stripe@16.10.0?target=deno&dts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RefundRequest {
  order_id: string
  order_number: string
  stripe_payment_intent: string
  total: number
  customer_email: string
}

export default async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured')
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-11-20' })

    const { order_id, order_number, stripe_payment_intent, total, customer_email } = (await req.json()) as RefundRequest

    if (!stripe_payment_intent) {
      throw new Error('No payment intent ID for this order')
    }

    // Create refund via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: stripe_payment_intent,
      amount: Math.round(total * 100), // Stripe expects cents
    })

    if (refund.status !== 'succeeded') {
      throw new Error(`Refund failed with status: ${refund.status}`)
    }

    // Send cancellation email via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'orders@humblchef.com',
            to: customer_email,
            subject: `Order ${order_number} Cancelled - Refund Processed`,
            html: `
              <h2>Order Cancelled</h2>
              <p>Your order <strong>${order_number}</strong> has been cancelled.</p>
              <p>A refund of <strong>$${(total).toFixed(2)}</strong> has been initiated to your original payment method.</p>
              <p>Please allow 2-3 business days for the refund to appear in your account.</p>
              <p>If you have any questions, please contact us at support@humblechef.com</p>
            `,
          }),
        })
      } catch (emailErr) {
        console.error('Failed to send cancellation email:', emailErr)
        // Don't fail the refund if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        refund_id: refund.id,
        amount_refunded: refund.amount / 100,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    console.error('Refund error:', err)

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
