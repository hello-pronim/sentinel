import React, { useContext, useEffect, useState } from "react";

import SidebarNavList from "./SidebarNavList";
import { AppContext } from "../../../../contexts/AppContext";

const SidebarNavSection = (props) => {
  const {
    features: { showBrandsView },
  } = useContext(AppContext);
  const {
    title,
    pages,
    className,
    component: Component = "nav",
    ...rest
  } = props;
  const [visibleItems, setVisibleItems] = useState(pages);

  useEffect(() => {
    if (!showBrandsView) {
      setVisibleItems(pages.filter((page) => page.slug !== "brands"));
    } else setVisibleItems(pages);
  }, [showBrandsView, pages]);

  return (
    <Component {...rest}>
      <SidebarNavList pages={visibleItems} depth={0} />
    </Component>
  );
};

export default SidebarNavSection;
