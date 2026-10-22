import { BottomNav } from "@/components/BottomNav";
import { requireUser } from "@/lib/group";

export default async function TabsLayout({ children }: { children: React.ReactNode }) {
  // Requests to crews you run (row-level security only shows those, plus your own).
  const { supabase, user } = await requireUser();
  const { count } = await supabase.from("join_requests").select("user_id", { count: "exact", head: true }).neq("user_id", user.id);
  return (
    <>
      <main className="flex grow flex-col">{children}</main>
      <BottomNav requests={count ?? 0} />
    </>
  );
}
