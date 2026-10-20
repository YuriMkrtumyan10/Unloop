import type { AuthError } from "@supabase/supabase-js";

export type AuthErrorKey = "wrongLogin" | "notConfirmed" | "userExists" | "weakPassword" | "samePassword" | "tooMany" | "emailFailed" | "generic";

/** Turns a Supabase Auth error into a key under "errors" in the messages files. */
export function authErrorKey(error: AuthError): AuthErrorKey {
  switch (error.code) {
    case "invalid_credentials":
      return "wrongLogin";
    case "email_not_confirmed":
      return "notConfirmed";
    case "user_already_exists":
    case "email_exists":
      return "userExists";
    case "weak_password":
      return "weakPassword";
    case "same_password":
      return "samePassword";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "tooMany";
    case "email_address_not_authorized":
      return "emailFailed";
    default:
      return error.status === 429 ? "tooMany" : "generic";
  }
}
