import Admin from "~/components/admin/Admin";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Welcome to the Admin Dashboard!" },
  ];
}

export default function Home() {
  return <Admin  />;
}
