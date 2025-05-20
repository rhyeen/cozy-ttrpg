import { ProfilePage } from 'app/pages/Profile.page';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile Page" },
    { name: "description", content: "" },
  ];
}

export default function Profile() {
  return <ProfilePage />;
}
