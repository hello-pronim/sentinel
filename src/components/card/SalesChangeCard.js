import React from "react";
import { XYPlot, LineSeries } from "react-vis";
import styled from "styled-components/macro";

import {
  Card as MuiCard,
  CardContent,
  Grid,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { grey } from "@mui/material/colors";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import {
  convertPercentFormat,
  convertPriceFormat,
} from "../../utils/functions";

import "../../../node_modules/react-vis/dist/style.css";

const Card = styled(MuiCard)`
  position: relative;
  margin-bottom: ${(props) => props.theme.spacing(6)};
  border: ${(props) =>
    props.variant === "outlined" &&
    (props.change > 0
      ? `1px solid ${props.pcolor}`
      : `1px solid ${props.ncolor}`)};
`;

const Typography = styled(MuiTypography)(spacing);
const IconWrapper = styled.div`
  display: flex;
  align-item: center;
  justify-content: center;
  color: ${(props) => props.color};
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
`;

const SalesChangeCard = ({
  label,
  description = "",
  data,
  hasTrendLine = false,
  trendLineData,
  positiveColor,
  negativeColor,
  variant,
  size = "small",
}) => {
  const { revenue, revenueChange } = data;

  return (
    <Card
      variant={variant}
      change={revenueChange}
      pcolor={positiveColor}
      ncolor={negativeColor}
    >
      <CardContent>
        {size === "medium" ? (
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="body2">{label}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h2">
                    {convertPriceFormat(revenue)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                alignItems="flex-end"
                spacing={4}
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-end"
                    spacing={4}
                  >
                    <Grid item>
                      <IconWrapper
                        color={
                          revenueChange > 0 ? positiveColor : negativeColor
                        }
                      >
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="flex-end"
                          spacing={1}
                        >
                          <Grid item>
                            {revenueChange > 0 ? (
                              <ArrowUpwardIcon size="small" />
                            ) : revenueChange < 0 ? (
                              <ArrowDownwardIcon size="small" />
                            ) : (
                              <></>
                            )}
                          </Grid>
                          <Grid item>
                            {convertPercentFormat(Math.abs(revenueChange))}
                          </Grid>
                        </Grid>
                      </IconWrapper>
                    </Grid>
                    <Grid item>
                      {hasTrendLine ? (
                        <XYPlot width={120} height={60}>
                          <LineSeries
                            color="black"
                            data={Object.keys(
                              trendLineData.comparison_revenue
                            ).map((x) => ({
                              x: parseInt(x),
                              y: trendLineData.comparison_revenue[x],
                            }))}
                          />
                          <LineSeries
                            color="red"
                            data={Object.keys(trendLineData.revenue).map(
                              (x) => ({
                                x: parseInt(x),
                                y: trendLineData.revenue[x],
                              })
                            )}
                          />
                        </XYPlot>
                      ) : (
                        <XYPlot width={120} height={60} />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="body2" sx={{ color: grey[700] }}>
                    {description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : size === "small" ? (
          <Grid container direction="column" alignItems="center" spacing={4}>
            <Grid item>
              <Typography variant="body2">{label}</Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <IconWrapper
                    color={revenueChange > 0 ? positiveColor : negativeColor}
                  >
                    {revenueChange > 0 ? (
                      <ArrowUpwardIcon />
                    ) : revenueChange < 0 ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <></>
                    )}
                  </IconWrapper>
                </Grid>
                <Grid item>
                  <Typography variant="h3">
                    {convertPercentFormat(Math.abs(revenueChange))}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesChangeCard;
