import {
  MonetizationOnOutlined as MonetizationOnOutlinedIcon,
  StorefrontOutlined as StorefrontOutlinedIcon,
} from "@mui/icons-material";

const pagesSection = [
  {
    slug: "sales",
    href: "/sales",
    icon: MonetizationOnOutlinedIcon,
    title: "Sales",
  },
  {
    slug: "brands",
    href: "/brands",
    icon: StorefrontOutlinedIcon,
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
