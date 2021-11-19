import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import { LoginButton } from "./security/LoginButton"
import { Header } from "./layout/Header"
import { useAuth0 } from "@auth0/auth0-react";

export const Container = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <ChakraProvider theme={theme}>
      { !isAuthenticated && <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <VStack spacing={8}>
              <Logo h="40vmin" pointerEvents="none" />
              <Text>
                Sentinel by MBG, coming soon...
              </Text>
              <LoginButton/>

            </VStack>
          </Grid>
        </Box>
      }
      { isAuthenticated && <Box textAlign="center" fontSize="xl">
          <Header/>
          <Grid minH="100vh" p={3}>

          </Grid>
        </Box>
      }
    </ChakraProvider>
  )
}
