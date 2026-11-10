# Auth email templates

Copies of the email templates set in the Supabase dashboard
(Authentication → Emails → Templates). Supabase doesn't read these files; they're
kept here so the wording and links have a history. Change them in both places.

| Template | Subject | File |
|---|---|---|
| Confirm sign up | Unloop: confirm your email | `confirm-signup.html` |
| Reset password | Unloop: set a new password | `reset-password.html` |

The reset link uses `{{ .TokenHash }}` instead of `{{ .ConfirmationURL }}`, so it works
even when it opens in a different browser from the one that asked for it (for example
the Gmail app's browser instead of the home-screen app). `/auth/callback` handles both.

Emails are sent through Gmail SMTP (see the decisions log, 2026-11-10).
