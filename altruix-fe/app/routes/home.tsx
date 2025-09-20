import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { getSession } from "~/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionData = {
    // token: session.get("token"),
    // userId: session.get("userId"),
    user: session.get("user"),
  };
  

  return sessionData;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "testing" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const sessionData = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Home</h1>
      {sessionData.user ? (
        <div>
          <p>Welcome, {sessionData.user.name}</p>
        </div>
      ) : (
        <p>No user session found</p>
      )}
    </div>
  );
}
