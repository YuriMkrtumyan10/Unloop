import { requireGroup } from "@/lib/group";
import { AccountScreen } from "@/components/AccountScreen";

export default async function AccountPage() {
  const { user, group, me } = await requireGroup();
  return <AccountScreen profile={me} email={user.email ?? ""} groupName={group.name} />;
}
