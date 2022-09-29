import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";

import {
  Box,
  CardContent,
  CardHeader,
  Card as MuiCard,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { red, green } from "@mui/material/colors";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { AuthContext } from "../../../contexts/CognitoContext";
import { getDataSources } from "../../../services/SalesService";
import {
  convertDateToMMDDYY,
  convertMMDDYYYYDateStringToTime,
  getPastDate,
} from "../../../utils/functions";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);

const Sources = ({ title }) => {
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const refreshSourcesStatusData = useCallback(() => {
    setLoading(true);
    getDataSources().then((res) => {
      const { data } = res.data.body;
      const { "audit/daily-sales": dailySales } = data;

      setLoading(false);
      if (dailySales?.length) {
        const lastSalesData = dailySales[0];
        const auditDate = Object.keys(lastSalesData)[0];
        const auditData = lastSalesData[auditDate];
        const yesterdayDate = getPastDate(new Date(), 1);

        if (auditDate === convertDateToMMDDYY(yesterdayDate, "-")) {
          setData(auditData);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      refreshSourcesStatusData();
    }
  }, [isInitialized, isAuthenticated, refreshSourcesStatusData]);

  const getStatusColor = (market) => {
    const yesterdayDate = getPastDate(new Date(), 1);

    if (
      market.last_sale !== null &&
      convertMMDDYYYYDateStringToTime(market.last_sale) >=
        convertMMDDYYYYDateStringToTime(convertDateToMMDDYY(yesterdayDate, "-"))
    )
      return green[500];
    return red[500];
  };

  return (
    <Card variant="outlined" mb={1}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        {data !== null && !loading ? (
          <Grid container>
            <Grid item xs={6}>
              <Grid container spacing={4}>
                {data.map((item, index) => (
                  <Grid item key={index} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h5">{item.company}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box pl={6}>
                          <Grid container spacing={2}>
                            {item.marketplaces.map((market, index) => (
                              <Grid item key={index} xs={12}>
                                <Grid container spacing={4}>
                                  <Grid item xs={6}>
                                    <Grid container spacing={2}>
                                      <Grid item>
                                        <FiberManualRecordIcon
                                          sx={{
                                            color: () => getStatusColor(market),
                                          }}
                                        />
                                      </Grid>
                                      <Grid item>
                                        <Typography variant="body1">
                                          {market.marketplace}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={6}>
                                    {market.last_sale}
                                  </Grid>
                                </Grid>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container justifyContent="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default Sources;
