import React from "react";

import { Box, Divider, Typography } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import TreeViewCheckboxGroup from "../../../../components/checkbox/TreeViewCheckboxGroup";

const CompanyFilterMenu = ({
  title,
  filterData,
  filterOptions,
  selected,
  setSelected,
  setSelectedOptions,
  onSelectedOptionsChanged,
  ...props
}) => {
  return (
    <React.Fragment>
      <Box p={2}>
        <Typography variant="body2">{title}</Typography>
      </Box>
      <Divider />
      <TreeViewCheckboxGroup
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        data={filterData}
        options={filterOptions}
        selected={selected}
        setSelected={setSelected} // store only option id
        setSelectedOptions={setSelectedOptions} // store option objects
        onSelectedOptionsChanged={onSelectedOptionsChanged}
        {...props}
      />
    </React.Fragment>
  );
};

export default CompanyFilterMenu;
