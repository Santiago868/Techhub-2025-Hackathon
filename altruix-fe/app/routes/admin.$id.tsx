import Admin from "~/components/admin/Admin";
import type { Route } from "./+types/admin.$id";
import { useLoaderData } from "react-router";
import { getSession } from "~/sessions.server";
import { getCauses } from "~/utils/getCauses";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const token = session.get("token");
  
  let causes = null;
  try {
    causes = await getCauses({ token });
  } catch (error) {
    console.error("Failed to fetch causes:", error);
    causes = { causes: [] };
  }
  
  return {
    user,
    causes,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Welcome to the Admin Dashboard!" },
  ];
}

export default function AdminPage() {
  const { user, causes } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {user && (
        <p>Welcome, {user.name || user.username}!</p>
      )}
      <Admin
        user={user}
        causes={causes}
      />
    </div>
  );
}
