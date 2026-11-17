export interface NavLink {
  label: string;
  href: string;
}

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
} as const;

export type SiteConfig = typeof siteConfig;
