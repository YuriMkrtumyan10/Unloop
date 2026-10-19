import { redirect } from "next/navigation";

// requireGroup() on /spin sends people without a group to /group, and the middleware sends strangers to /welcome.
export default function Root() {
  redirect("/spin");
}
