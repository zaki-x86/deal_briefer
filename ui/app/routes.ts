import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("deals/:id", "routes/deals.detail.tsx"),
] satisfies RouteConfig;
