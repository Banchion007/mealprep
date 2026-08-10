import Resend from 'https://esm.sh/resend@3.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface OrderConfirmationRequest {
  order_id: string
  order_number: string
  customer_name: string
  customer_email: string
  items: Array<{ name: string; qty: number; price: number }>
  subtotal: number
  tax: number
  delivery_fee: number
  total: number
  delivery_address: string
  delivery_date: string
  delivery_time: string
}

export default async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const resend = new Resend(resendKey)

    const {
      order_id,
      order_number,
      customer_name,
      customer_email,
      items,
      subtotal,
      tax,
      delivery_fee,
      total,
      delivery_address,
      delivery_date,
      delivery_time,
    } = (await req.json()) as OrderConfirmationRequest

    // Format items for email
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: left;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">×${item.qty}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${(item.price * item.qty).toFixed(2)}</td>
          </tr>`
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Montserrat', sans-serif; color: #1a1641; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1641 0%, #2d1b5e 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-number { font-size: 24px; font-weight: 700; margin: 10px 0; }
            .section { margin: 20px 0; padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #ff9a56; }
            .section-title { font-size: 14px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px; }
            table { width: 100%; }
            .price-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .total-row { font-weight: 700; font-size: 16px; padding-top: 10px; border-top: 2px solid #e2e8f0; }
            .cta { display: inline-block; background: #ff9a56; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Your Humble Chef meal prep order is ready</p>
            </div>

            <div class="content">
              <p>Hi ${customer_name},</p>
              <p>Thank you for your order! We're excited to prepare your meals. Below are your order details.</p>

              <div class="section">
                <div class="section-title">📦 Order Details</div>
                <p><strong>Order Number:</strong> <span class="order-number">${order_number}</span></p>
                <p><strong>Order ID:</strong> ${order_id}</p>
              </div>

              <div class="section">
                <div class="section-title">🍽️ Your Meals</div>
                <table>
                  <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0;">
                      <th style="padding: 8px; text-align: left; font-weight: 600;">Meal</th>
                      <th style="padding: 8px; text-align: center; font-weight: 600;">Qty</th>
                      <th style="padding: 8px; text-align: right; font-weight: 600;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </div>

              <div class="section">
                <div class="section-title">🚚 Delivery Details</div>
                <p><strong>Address:</strong><br>${delivery_address}</p>
                <p><strong>Delivery Date:</strong> ${delivery_date}</p>
                <p><strong>Time Window:</strong> ${delivery_time}</p>
              </div>

              <div class="section">
                <div class="section-title">💰 Order Total</div>
                <div class="price-row">
                  <span>Subtotal (${items.reduce((s, i) => s + i.qty, 0)} meals)</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="price-row">
                  <span>Delivery Fee</span>
                  <span>${delivery_fee === 0 ? 'Free' : `$${delivery_fee.toFixed(2)}`}</span>
                </div>
                <div class="price-row">
                  <span>Tax (8.25%)</span>
                  <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="price-row total-row">
                  <span>Total Charged</span>
                  <span style="color: #ff9a56;">$${total.toFixed(2)}</span>
                </div>
              </div>

              <p style="text-align: center;">
                <a href="https://humblechef.com/account" class="cta">Track Your Order</a>
              </p>

              <div class="section" style="border-left-color: #9b9b9b;">
                <div class="section-title">❓ Questions?</div>
                <p>If you have any questions about your order, please don't hesitate to reach out at <strong>support@humblechef.com</strong>.</p>
              </div>

              <div class="footer">
                <p>© 2026 Humble Chef. All rights reserved.</p>
                <p>This is an automated confirmation email. Please do not reply directly.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const { error: emailError } = await resend.emails.send({
      from: 'orders@humblechef.com',
      to: customer_email,
      subject: `Order Confirmation: ${order_number}`,
      html,
    })

    if (emailError) {
      throw new Error(`Failed to send email: ${emailError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Order confirmation sent to ${customer_email}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    console.error('Order confirmation error:', err)

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
