import * as React from "react"
import { Auth0Provider } from "@auth0/auth0-react"
import { Container } from "./Container"

export const App = () => (
    <Auth0Provider
    domain="mbgapps.us.auth0.com"
    clientId="GCWUm4Czgn256oq8qnbH4XXsfEQeniEp"
    redirectUri={window.location.origin}
    >
      <Container/>
    </Auth0Provider>
)
