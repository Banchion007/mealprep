import { Resend } from 'npm:resend@6'
import { corsHeaders } from '../_shared/cors.ts'
import { clampString, escapeHtml } from '../_shared/sanitize.ts'

const MAX_HTML_LEN = 12_000

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  const contactTo = Deno.env.get('CONTACT_TO_EMAIL') ?? 'humblechefbrian@gmail.com'
  const contactFrom = Deno.env.get('CONTACT_FROM_EMAIL') ?? 'onboarding@resend.dev'

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Email service is not configured.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  const resend = new Resend(apiKey)

  try {
    const body = await req.json().catch(() => ({}))

    const subject = clampString(body.subject, 200) || 'Contact form submission'
    let html = clampString(body.html, MAX_HTML_LEN)

    if (!html) {
      const name = escapeHtml(body.name)
      const email = escapeHtml(body.email)
      const phone = escapeHtml(body.phone)
      const eventType = escapeHtml(body.eventType)
      const eventDate = escapeHtml(body.eventDate)
      const guestCount = escapeHtml(body.guestCount)
      const message = escapeHtml(body.message).replace(/\n/g, '<br>')

      html = `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Event Type:</strong> ${eventType}</p>
          <p><strong>Event Date:</strong> ${eventDate}</p>
          <p><strong>Guest Count:</strong> ${guestCount}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `.trim()
    }

    const { data, error } = await resend.emails.send({
      from: contactFrom,
      to: contactTo,
      subject,
      html,
      replyTo: typeof body.replyTo === 'string' && body.replyTo.includes('@')
        ? clampString(body.replyTo, 320)
        : undefined,
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ id: data?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
