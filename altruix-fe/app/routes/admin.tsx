import { redirect } from "react-router";
import type { Route } from "./+types/admin";
import { getSession } from "~/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  
  if (!user) {
    // Redirect to login if no user session found
    return redirect("/login");
  }
  
  // Use username if available, otherwise fall back to name, or a default
  const userIdentifier = user.username || user.name || "default-user";
  
  // Redirect to the user-specific admin page
  return redirect(`/admin/${userIdentifier}`);
}

export default function AdminRedirect() {
  // This component shouldn't render since we redirect in the loader
  return <div>Redirecting to admin dashboard...</div>;
}
