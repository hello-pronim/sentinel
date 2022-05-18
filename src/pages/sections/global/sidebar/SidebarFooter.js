import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { IconMenuItem, NestedMenuItem } from "mui-nested-menu";

import {
  Divider,
  Grid,
  ListItemButton,
  Menu,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  ArrowRight,
  ExitToAppOutlined,
  StorefrontOutlined,
} from "@mui/icons-material";

import { AppContext } from "../../../../contexts/AppContext";
import useAuth from "../../../../hooks/useAuth";

const Item = styled(ListItemButton)`
  padding: ${(props) => props.theme.spacing(2.75)}
    ${(props) => props.theme.spacing(4)};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: ${(props) => props.theme.sidebar.color};
  }
`;

const Footer = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: 0 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const FooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const FooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`;

const SidebarFooter = ({ ...rest }) => {
  const navigate = useNavigate();
  const {
    features: { showAdminBrands },
  } = useContext(AppContext);
  const { user, signOut } = useAuth();
  const [anchorMenu, setAnchorMenu] = React.useState(null);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToAdminBrands = () => {
    navigate("/admin/brands");
  };

  return (
    <Footer {...rest}>
      <Tooltip disableHoverListener title="">
        <Item
          aria-owns={Boolean(anchorMenu) ? "menu-sidebar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <Grid container spacing={2}>
            <Grid item>
              {!!user && (
                <FooterText variant="body2">{user.displayName}</FooterText>
              )}
              {!user && <FooterText variant="body2">User</FooterText>}
              <FooterSubText variant="caption">{user.email}</FooterSubText>
            </Grid>
          </Grid>
        </Item>
      </Tooltip>
      <Menu
        id="menu-sidebar"
        anchorEl={anchorMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(anchorMenu) ?? false}
        onClose={closeMenu}
      >
        <IconMenuItem
          label="Profile"
          leftIcon={<AccountCircleOutlined />}
          onClick={goToProfile}
        />
        <Divider />
        {showAdminBrands && (
          <>
            <NestedMenuItem
              label="Admin"
              leftIcon={<AdminPanelSettingsOutlined />}
              rightIcon={<ArrowRight />}
              parentMenuOpen={Boolean(anchorMenu) ?? false}
            >
              {showAdminBrands && (
                <IconMenuItem
                  label="Companies/Brands"
                  leftIcon={<StorefrontOutlined />}
                  onClick={goToAdminBrands}
                />
              )}
            </NestedMenuItem>
            <Divider />
          </>
        )}
        <IconMenuItem
          label="Sign out"
          leftIcon={<ExitToAppOutlined />}
          onClick={handleSignOut}
        />
      </Menu>
    </Footer>
  );
};

export default SidebarFooter;
