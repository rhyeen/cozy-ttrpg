import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/Primary.layout.tsx", [
    index("routes/home.tsx"),
    route("campaigns", "routes/campaigns.tsx"),
    route("campaigns/:campaignId", "routes/campaign.tsx"),
    route("campaigns/:campaignId/players", "routes/campaign.tsx", { id: "players" }),
    route("login", "routes/login.tsx"),
    route("profile", "routes/profile.tsx"),
    route("characters", "routes/characters.tsx"),
    route("friends", "routes/friends.tsx"),
  ]),
] satisfies RouteConfig;