import { FriendsPage } from 'app/pages/Friends.page';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Friends Page" },
    { name: "description", content: "" },
  ];
}

export default function Friends() {
  return <FriendsPage />;
}
