import type { Route } from "./+types/home";
import { HomePage } from '../pages/Home.page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home Page" },
    { name: "description", content: "" },
  ];
}

export default function Home() {
  return <HomePage />;
}
