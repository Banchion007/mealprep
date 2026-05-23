import { Resend } from 'npm:resend@6'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'RESEND_API_KEY is not set. Add your Resend key (replace re_xxxxxxxxx) as a secret.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const resend = new Resend(apiKey)

  try {
    const body = await req.json().catch(() => ({}))
    const from =
      typeof body.from === 'string' ? body.from : 'onboarding@resend.dev'
    const to =
      typeof body.to === 'string' ? body.to : 'grghyperlink.007@gmail.com'
    const subject =
      typeof body.subject === 'string' ? body.subject : 'Hello World'
    const html =
      typeof body.html === 'string'
        ? body.html
        : '<p>Congrats on sending your <strong>first email</strong>!</p>'

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
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
