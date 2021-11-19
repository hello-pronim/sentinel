import {
  Button,
} from "@chakra-ui/react"
import { useAuth0 } from "@auth0/auth0-react"

export const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  console.log(isAuthenticated);
  if( !isAuthenticated ) {
    return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
  } else {
    return <div/>
  }
};
