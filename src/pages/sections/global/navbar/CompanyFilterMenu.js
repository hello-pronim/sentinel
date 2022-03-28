import React from "react";
import styled from "styled-components/macro";

import { Box, Divider, Typography } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import TreeViewCheckboxGroup from "../../../../components/checkbox/TreeViewCheckboxGroup";

const FilterMenu = styled("div")`
  min-width: 320px;
`;

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
    <FilterMenu>
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
    </FilterMenu>
  );
};

export default CompanyFilterMenu;
