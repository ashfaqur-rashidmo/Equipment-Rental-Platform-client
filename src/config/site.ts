export interface NavLink {
  label: string;
  href: string;
}

export type UserRole = "Customer" | "Owner" | "Admin";

export const USER_ROLES: UserRole[] = ["Customer", "Owner", "Admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  Customer: "Customer",
  Owner: "Equipment Owner",
  Admin: "Administrator",
};

export interface DashboardRoute {
  path: string;
  label: string;
  subRoutes?: DashboardRoute[];
}

export const DASHBOARD_ROUTES: Record<UserRole, DashboardRoute> = {
  Customer: {
    path: "/dashboard/customer",
    label: "My Rentals",
    subRoutes: [
      { path: "/dashboard/customer/my-rentals", label: "My Rentals" },
      { path: "/dashboard/customer/favorites", label: "Favorites" },
      { path: "/dashboard/customer/profile", label: "Profile" },
    ],
  },
  Owner: {
    path: "/dashboard/owner",
    label: "My Equipment",
    subRoutes: [
      { path: "/dashboard/owner/add-equipment", label: "Add Equipment" },
      { path: "/dashboard/owner/my-equipment", label: "My Equipment" },
      { path: "/dashboard/owner/my-equipment-rental", label: "My Equipment Rental" },
      { path: "/dashboard/owner/profile", label: "Profile" },
    ],
  },
  Admin: {
    path: "/dashboard/admin",
    label: "Dashboard",
    subRoutes: [
      { path: "/dashboard/admin/users", label: "All Users" },
      { path: "/dashboard/admin/equipment", label: "All Equipment" },
      { path: "/dashboard/admin/rentals", label: "All Rentals" },
      { path: "/dashboard/admin/profile", label: "My Profile" },
    ],
  },
};

export const DEFAULT_DASHBOARD_PATH = "/dashboard";

export const siteConfig = {
  name: "EquipRent",
  tagline: "Rent the equipment you need, when you need it.",
  description:
    "EquipRent connects equipment owners with customers through a transparent and secure rental marketplace — construction, photography, agriculture, events and more.",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "All Equipment", href: "/all-equipment" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ] satisfies NavLink[],
  contact: {
    email: "support@equiprent.com",
    phone: "+880 1700-000000",
    address: "Dhaka, Bangladesh",
  },
  roles: USER_ROLES,
  dashboardRoutes: DASHBOARD_ROUTES,
} as const;

export type SiteConfig = typeof siteConfig;
