
import Login from "~/components/Login";
import { handleAuth } from "../utils/auth";
import { getSession, commitSession } from "~/sessions.server";
import { redirect } from "react-router";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const data = await handleAuth({ username, password });
    // console.log("Auth data:", data);
    const token = (data && (data.access_token || data.token));

    const session = await getSession(request.headers.get("Cookie"));
    if (token) session.set('token', token);

  
    const user = data?.user;
    if (user) session.set('user', user);

    const setCookie = await commitSession(session);

    return redirect("/", {
      headers: {
        "Set-Cookie": setCookie,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message || 'Authentication failed' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
}

export default function LoginRoute() {
  return (
    <div>
      <Login />
    </div>
  );
}