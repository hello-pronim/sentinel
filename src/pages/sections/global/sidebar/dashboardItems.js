import {
  MonetizationOn as MonetizationOnIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";

const pagesSection = [
  {
    slug: "sales",
    href: "/sales",
    icon: MonetizationOnIcon,
    title: "Sales",
  },
  {
    slug: "brands",
    href: "/brands",
    icon: StorefrontIcon,
    title: "Brands",
  },
];

const navItems = [
  {
    title: "Pages",
    pages: pagesSection,
  },
];

export default navItems;
