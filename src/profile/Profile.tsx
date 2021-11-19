import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons";
import { LogoutButton } from "../security/LogoutButton"

export const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  console.log(user);

  if (isAuthenticated && user) {
    return (
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {user.email}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Log Out</MenuItem>
        </MenuList>
      </Menu>
    )
  } else {
    return <div/>
  }
};
