import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";
import MaterialTable from "@material-table/core";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Card,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  Tab,
} from "@mui/material";
import { spacing } from "@mui/system";

import { AuthContext } from "../../../../contexts/CognitoContext";

import { getCurrentViolationsData } from "../../../../services/MAPService";
import {
  convertPercentFormat,
  convertPriceFormat,
} from "../../../../utils/functions";

const Divider = styled(MuiDivider)(spacing);

const ProductsMAPTable = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const tabs = [
    {
      id: 0,
      label: "Current Listing Violations",
      value: "current_listing_violations",
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
        const { name, url } = rowData;

        return url ? (
          <Link component={NavLink} to={url}>
            {name}
          </Link>
        ) : (
          name
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

  const initializeProductsMAPData = useCallback(() => {
    //call to get the table data
    setLoadingCurrentViolationsData(true);
    getCurrentViolationsData(queryParamsString).then((res) => {
      const {
        data: {
          body: {
            data: { listings },
          },
        },
      } = res;
      console.log(listings);

      setLoadingCurrentViolationsData(false);
      if (listings) {
        const tableData = listings.map((item) => ({
          name: item.name,
          currentPrice: item.price,
          mapPrice: item.map_price,
          priceDiff: item.price_diff,
          companyId: item?.company_id,
          url: item.url,
        }));

        setCurrentViolationsData(tableData);
      }
    });
  }, [queryParamsString]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      initializeProductsMAPData();
    }
  }, [isAuthenticated, isInitialized, initializeProductsMAPData]);

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
                          title="Products"
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
              </TabContext>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ProductsMAPTable;
