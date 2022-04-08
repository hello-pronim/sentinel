import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";
import GaugeChart from "react-gauge-chart";
import MaterialTable from "@material-table/core";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  Tab,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import { getCurrentViolationsData } from "../../../../services/MAPService";
import {
  convertPercentFormat,
  convertPriceFormat,
} from "../../../../utils/functions";

const Divider = styled(MuiDivider)(spacing);

const ProductsMAPTable = () => {
  const queryParamsString = window.location.search;
  const tabs = [
    {
      id: 0,
      label: "Current Listing Violations",
      value: "current_listing_violations",
    },
    {
      id: 1,
      label: "Current Listings Without a Price",
      value: "current_listings_without_price",
    },
    {
      id: 2,
      label: "Violations by Time Period",
      value: "violations_by_time_period",
    },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);
  const [loadingCurrentViolationsData, setLoadingCurrentViolationsData] =
    useState(false);
  const [currentViolationsData, setCurrentViolationsData] = useState(null);
  const columns = [
    {
      field: "name",
      title: "Listing",
      width: "55%",
      render: (rowData) => {
        const { name } = rowData;

        return (
          <Link component={NavLink} to="#">
            {name}
          </Link>
        );
      },
    },
    {
      field: "currentPrice",
      title: "Current Price",
      customSort: (a, b) => a.currentPrice - b.currentPrice,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { currentPrice } = rowData;

        return `${convertPriceFormat(currentPrice)}`;
      },
    },
    {
      field: "mapPrice",
      title: "MAP Price",
      customSort: (a, b) => a.mapPrice - b.mapPrice,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { mapPrice } = rowData;

        return `${convertPriceFormat(mapPrice)}`;
      },
    },
    {
      field: "priceDiff",
      title: "Price Diff",
      customSort: (a, b) => a.priceDiff - b.priceDiff,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { priceDiff } = rowData;

        return convertPercentFormat(priceDiff);
      },
    },
  ];

  useEffect(() => {
    //call to get the table data
    setLoadingCurrentViolationsData(true);
    getCurrentViolationsData(queryParamsString).then((res) => {
      console.log(res);
      const { data } = res.data.body;

      setLoadingCurrentViolationsData(false);
      if (data) {
        const tableData = data.map((item) => ({
          name: item.name,
          currentPrice: item.current_price,
          mapPrice: item.map_price,
          priceDiff: item.price_diff,
          companyId: item?.company_id,
        }));

        setCurrentViolationsData(tableData);
      }
    });
  }, [queryParamsString]);

  const handleTabChanged = (event, value) => {
    setSelectedTab(value);
  };

  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <TabContext value={selectedTab}>
                <TabList
                  onChange={handleTabChanged}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </TabList>
                <Divider />
                <TabPanel value="current_listing_violations">
                  <Grid container>
                    <Grid item xs={12}>
                      {currentViolationsData !== null &&
                      !loadingCurrentViolationsData ? (
                        <MaterialTable
                          data={currentViolationsData}
                          columns={columns}
                        />
                      ) : (
                        <Grid container justifyContent="center">
                          <Grid item>
                            <CircularProgress />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value="current_listings_without_price">
                  Coming soon
                </TabPanel>
                <TabPanel value="violations_by_time_period">
                  Coming soon
                </TabPanel>
              </TabContext>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ProductsMAPTable;
