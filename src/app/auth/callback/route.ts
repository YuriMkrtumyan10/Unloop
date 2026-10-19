import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const OTP_TYPES: readonly string[] = ["signup", "invite", "magiclink", "recovery", "email_change", "email"] satisfies EmailOtpType[];

// Email links and Google land here. Default email templates and Google send a one-time `code`
// (works in the browser that asked for it); templates using {{ .TokenHash }} send `token_hash`
// and `type`, which work in any browser, e.g. a reset link opened outside the installed app.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/spin";
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabase = await createClient();
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  } else if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ type: type as EmailOtpType, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }
  // A reset link that didn't work sends you to ask for a fresh one; anything else to log in.
  if (safeNext === "/new-password") return NextResponse.redirect(`${origin}/welcome?error=reset`);
  return NextResponse.redirect(`${origin}/welcome?error=link&next=${encodeURIComponent(safeNext)}`);
}
