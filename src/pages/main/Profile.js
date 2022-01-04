import React from "react";
import styled, { css } from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import {
  // Avatar,
  // Button as MuiButton,
  Card as MuiCard,
  // CardActions as MuiCardActions,
  CardHeader as MuiCardHeader,
  CardContent,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { green, grey, indigo } from "@mui/material/colors";
// import { CloudUpload as MuiCloudUpload } from "@mui/icons-material";
import { spacing } from "@mui/system";

import { THEMES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Card = styled(MuiCard)(spacing);
// const CardActions = styled(MuiCardActions)(spacing);
const CardHeader = styled(MuiCardHeader)(spacing);

const TextField = styled(MuiTextField)(spacing);

// const Button = styled(MuiButton)(spacing);

// const CloudUpload = styled(MuiCloudUpload)(spacing);

// const CenteredContent = styled.div`
//   text-align: center;
// `;

// const BigAvatar = styled(Avatar)`
//   width: 120px;
//   height: 120px;
//   margin: 0 auto ${(props) => props.theme.spacing(2)};
// `;

const DemoWrapper = styled.div`
  width: 80px;
  margin: auto;
`;

const DemoTitle = styled(Typography)`
  text-align: center;
`;

const DemoButton = styled.div`
  cursor: pointer;
  background: ${(props) => props.theme.palette.background.paper};
  height: 80px;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.825rem;
  position: relative;
  border: 1px solid
    ${(props) =>
      !props.active
        ? props.theme.palette.action.selected
        : props.theme.palette.action.active};
`;

const DemoButtonInner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px ${(props) => props.theme.palette.action.selected};
  position: relative;

  ${(props) =>
    props.selectedTheme === THEMES.DEFAULT &&
    css`
      background: linear-gradient(-45deg, #23303f 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.DARK &&
    css`
      background: #23303f;
    `}
  ${(props) =>
    props.selectedTheme === THEMES.LIGHT &&
    css`
      background: ${grey[100]};
    `}
  ${(props) =>
    props.selectedTheme === THEMES.BLUE &&
    css`
      background: linear-gradient(-45deg, #4782da 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.GREEN &&
    css`
      background: linear-gradient(-45deg, ${green[500]} 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.INDIGO &&
    css`
      background: linear-gradient(-45deg, ${indigo[500]} 50%, ${grey[100]} 0);
    `}
`;

const UserInfo = ({ user }) => {
  return (
    <Card mb={6}>
      <CardHeader title="User info" />
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={8} sm={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={12} sm={12}>
                <TextField
                  id="display-name"
                  label="Display name"
                  variant="outlined"
                  value={user.displayName}
                  fullWidth
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={12} sm={12}>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={user.email}
                  fullWidth
                  readOnly
                />
              </Grid>
              {/* <Grid item xs={12} md={12} sm={12}>
                <TextField
                  id="address"
                  label="Address"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} sm={12}>
                <TextField
                  id="address2"
                  label="Apartment, studio, or floor"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} sm={12}>
                <Grid container spacing={4}>
                  <Grid item xs={4}>
                    <TextField
                      id="city"
                      label="City"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="state"
                      label="State"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="zip"
                      label="Zip"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </Grid>
          {/* <Grid item md={4} sm={12}>
            <CenteredContent>
              <BigAvatar alt={user.displayName} />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" color="primary" component="span">
                  <CloudUpload mr={2} /> Upload
                </Button>

                <Typography variant="caption" display="block" gutterBottom>
                  For best results, use an image at least 128px by 128px in .jpg
                  format
                </Typography>
              </label>
            </CenteredContent>
          </Grid> */}
        </Grid>
      </CardContent>
      {/* <CardActions>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="primary" mt={3}>
              Save changes
            </Button>
          </Grid>
        </Grid>
      </CardActions> */}
    </Card>
  );
};

const Demo = ({ title, themeVariant }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DemoWrapper>
      <DemoButton
        active={themeVariant === theme}
        onClick={() => setTheme(themeVariant)}
      >
        <DemoButtonInner selectedTheme={themeVariant} />
      </DemoButton>
      <DemoTitle variant="subtitle2" gutterBottom>
        {title}
      </DemoTitle>
    </DemoWrapper>
  );
};

const ThemeSelect = () => {
  return (
    <Card mb={6}>
      <CardHeader title="Select your theme" />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item md={2} sm={4}>
            <Demo title="Dark" themeVariant={THEMES.DARK} />
          </Grid>
          <Grid item md={2} sm={4}>
            <Demo title="Light" themeVariant={THEMES.LIGHT} />
          </Grid>
          <Grid item md={2} sm={4}>
            <Demo title="Default" themeVariant={THEMES.DEFAULT} />
          </Grid>
          <Grid item md={2} sm={4}>
            <Demo title="Blue" themeVariant={THEMES.BLUE} />
          </Grid>
          <Grid item md={2} sm={4}>
            <Demo title="Green" themeVariant={THEMES.GREEN} />
          </Grid>
          <Grid item md={2} sm={4}>
            <Demo title="Indigo" themeVariant={THEMES.INDIGO} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const Profile = () => {
  const { user } = useAuth();

  return (
    <React.Fragment>
      <Helmet title="Profile" />

      <Typography variant="h3" gutterBottom display="inline">
        Profile
      </Typography>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserInfo user={user} />
          <ThemeSelect />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;
