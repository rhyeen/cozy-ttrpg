import { ImagesPage } from 'app/pages/Images.page';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Images Page" },
    { name: "description", content: "" },
  ];
}

export default function Images() {
  return <ImagesPage />;
}
