import React from "react";
import styled from "styled-components/macro";

import {
  Card as MuiCard,
  CardContent,
  Grid,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { grey } from "@mui/material/colors";
import {
  KeyboardArrowUpOutlined as KeyboardArrowUpOutlinedIcon,
  KeyboardArrowDownOutlined as KeyboardArrowDownOutlinedIcon,
} from "@mui/icons-material";

import {
  convertPercentFormat,
  convertPriceFormat,
  convertNumberFormat,
} from "../../utils/functions";

import "../../../node_modules/react-vis/dist/style.css";

const Card = styled(MuiCard)`
  position: relative;
  margin-bottom: ${(props) => props.theme.spacing(6)};
`;

const Typography = styled(MuiTypography)(spacing);
const CardIconWrapper = styled.div`
  width: 56px;
  height: 56p;
  padding: 8px;
  display: flex;
  align-item: center;
  justify-content: center;
  background: ${(props) => props.color};
  border-radius: 8px;
  color: ${(props) => props.theme.palette.common.white};
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
`;
const IconWrapper = styled.div`
  display: flex;
  align-item: center;
  justify-content: center;
  color: ${(props) => props.color};
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
`;

const AccountingOverviewStatsCard = ({
  data,
  icon,
  iconColor,
  positiveColor,
  negativeColor,
  variant,
}) => {
  const { change, label, stats, unit } = data;

  return (
    <Card variant={variant}>
      <CardContent>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={4}
        >
          <Grid item>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h3">
                  {unit === "price"
                    ? convertPriceFormat(stats)
                    : unit === "percent"
                    ? convertPercentFormat(stats)
                    : unit === "unit"
                    ? convertNumberFormat(stats)
                    : stats}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography variant="body2">{label}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" sx={{ color: grey[700] }}>
                      {convertPercentFormat(change)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconWrapper
                      color={change > 0 ? positiveColor : negativeColor}
                    >
                      {change > 0 ? (
                        <KeyboardArrowUpOutlinedIcon fontSize="small" />
                      ) : change < 0 ? (
                        <KeyboardArrowDownOutlinedIcon fontSize="small" />
                      ) : (
                        <></>
                      )}
                    </IconWrapper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <CardIconWrapper color={iconColor}>{icon}</CardIconWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountingOverviewStatsCard;
