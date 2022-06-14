import React, { useContext, useEffect, useState } from "react";

import SidebarNavList from "./SidebarNavList";
import { AppContext } from "../../../../contexts/AppContext";

const SidebarNavSection = (props) => {
  const {
    features: { showInventoryView },
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
    let visiblePages = [...pages];
    if (!showInventoryView) {
      visiblePages = visiblePages.filter((page) => page.slug !== "inventory");
    }
    setVisibleItems(visiblePages);
  }, [showInventoryView, pages]);

  return (
    <Component {...rest}>
      <SidebarNavList pages={visibleItems} depth={0} />
    </Component>
  );
};

export default SidebarNavSection;
