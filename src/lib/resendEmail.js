import { supabase } from './supabase.js'

/**
 * Sends email via Supabase Edge Function `send-email`.
 * Set RESEND_API_KEY in Supabase project secrets (your real key, not re_xxxxxxxxx).
 */
export function sendEmailViaResend(body = {}, client = supabase) {
  return client.functions.invoke('send-email', { body })
}
