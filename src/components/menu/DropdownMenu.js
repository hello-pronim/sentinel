import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";

const DropdownButton = ({ className, text, children, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="button-dropdown"
        aria-controls="menu-dropdown"
        aria-haspopup="true"
        aira-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        variant="contained"
      >
        {text}
      </Button>
      <Menu
        id="menu-dropdown"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "button-dropdown",
        }}
        {...props}
      >
        {children}
      </Menu>
    </>
  );
};

export default DropdownButton;
