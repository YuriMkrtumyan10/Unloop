// Avatar colors from the approved mockups. Keep in sync with public.random_avatar_color().
export const AVATAR_COLORS = ["#C8F03C", "#FFB36B", "#9DB8FF", "#F59BD0", "#7FD1AE", "#FF9A4D", "#E2C6FF"] as const;

export function isAvatarColor(color: string): boolean {
  return (AVATAR_COLORS as readonly string[]).includes(color);
}
