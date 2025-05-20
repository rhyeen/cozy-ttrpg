import { LoginPage } from "../pages/Login.page";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Log In or Sign Up" },
    { name: "description", content: "" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
