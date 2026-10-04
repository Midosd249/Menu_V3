export type Tab = "overview" | "tenants" | "orders" | "clients" | "branches" | "projects" | "subscriptions" | "analytics" | "activity" | "system";
export type AdminRoutePath = "/admin" | "/admin/restaurants" | "/admin/orders" | "/admin/clients" | "/admin/branches" | "/admin/projects" | "/admin/subscriptions" | "/admin/analytics" | "/admin/activity" | "/admin/system";

export const ADMIN_ROUTES: Record<Tab, AdminRoutePath> = {
  overview: "/admin",
  tenants: "/admin/restaurants",
  orders: "/admin/orders",
  clients: "/admin/clients",
  branches: "/admin/branches",
  projects: "/admin/projects",
  subscriptions: "/admin/subscriptions",
  analytics: "/admin/analytics",
  activity: "/admin/activity",
  system: "/admin/system",
};

export const ADMIN_WORKSPACE_TABS: Record<string, Tab> = {
  restaurants: "tenants",
  orders: "orders",
  clients: "clients",
  branches: "branches",
  projects: "projects",
  subscriptions: "subscriptions",
  analytics: "analytics",
  activity: "activity",
  system: "system",
};
