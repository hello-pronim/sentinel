import React from "react";

import { Box, Divider, Typography } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import TreeViewCheckboxGroup from "../../../../components/checkbox/TreeViewCheckboxGroup";

const CompanyFilterMenu = ({ title, filterOptions, ...props }) => {
  return (
    <React.Fragment>
      <Box p={2}>
        <Typography variant="body2">{title}</Typography>
      </Box>
      <Divider />
      <TreeViewCheckboxGroup
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        data={filterOptions}
        {...props}
      />
    </React.Fragment>
  );
};

export default CompanyFilterMenu;
