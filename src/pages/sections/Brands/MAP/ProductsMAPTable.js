import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import MaterialTable from "@material-table/core";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Alert as MuiAlert,
  Card,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Snackbar,
  Tab,
} from "@mui/material";
import { spacing } from "@mui/system";
import LaunchIcon from "@mui/icons-material/Launch";

import { AuthContext } from "../../../../contexts/CognitoContext";

import {
  getCurrentViolationsData,
  updateMAPStatus,
} from "../../../../services/MAPService";
import {
  convertPercentFormat,
  convertPriceFormat,
} from "../../../../utils/functions";

const Divider = styled(MuiDivider)(spacing);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingCurrentViolationsData, setLoadingCurrentViolationsData] =
    useState(false);
  const [currentViolationsData, setCurrentViolationsData] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isStatusUpdateSuccess, setIsStatusUpdateSuccess] = useState(false);
  const columns = [
    {
      field: "name",
      title: "Listing",
      width: "30%",
      render: (rowData) => {
        const { name, url } = rowData;

        return url ? (
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              {/* <Link component={NavLink} to="#" target="_blank"> */}
              {name}
              {/* </Link> */}
            </Grid>
            <Grid item>
              <Link component="button" onClick={() => window.open(url)}>
                <LaunchIcon />
              </Link>
            </Grid>
          </Grid>
        ) : (
          name
        );
      },
    },
    {
      field: "marketId",
      title: "ID",
      width: "10%",
      render: (rowData) => {
        const { marketId } = rowData;

        return marketId;
      },
    },
    {
      field: "marketplace",
      title: "Market",
      width: "10%",
      render: (rowData) => {
        const { marketplace } = rowData;

        return marketplace;
      },
    },
    {
      field: "seller",
      title: "Seller",
      width: "10%",
      render: (rowData) => {
        const { seller } = rowData;

        return seller;
      },
    },
    {
      field: "currentPrice",
      title: "Current Price",
      customSort: (a, b) => a.currentPrice - b.currentPrice,
      width: "10%",
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
      width: "10%",
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
      width: "10%",
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
    {
      field: "status",
      title: "Status",
      width: "10%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { priceId, status } = rowData;

        return (
          <FormControl
            sx={{ m: 1, minWidth: 120 }}
            variant="outlined"
            size="small"
          >
            <Select
              value={status ?? ""}
              onChange={(e) => handleStatusUpdated(e, priceId)}
              disabled={updatingStatus}
            >
              <MenuItem>
                <em>None</em>
              </MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Ignored">Ignored</MenuItem>
              <MenuItem value="Investigating">Investigating</MenuItem>
            </Select>
          </FormControl>
        );
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

      setLoadingCurrentViolationsData(false);
      if (listings) {
        const tableData = listings.map((item) => ({
          name: item.name,
          marketplace: item.marketplace,
          seller: item.seller,
          marketId: item.market_id,
          currentPrice: item.price,
          mapPrice: item.map_price,
          priceDiff: item.price_diff,
          priceId: item.price_id,
          companyId: item?.company_id,
          url: item.url,
          status: item.status,
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
  const handleStatusFilterChanged = (e) => {
    setStatusFilter(e.target.value);
  };
  const handleStatusUpdated = (e, priceId) => {
    setUpdatingStatus(true);
    updateMAPStatus(e.target.value, priceId).then((res) => {
      const {
        data: {
          body: { Success: success },
        },
      } = res;

      setUpdatingStatus(false);
      if (success) {
        setIsStatusUpdateSuccess(true);
        initializeProductsMAPData();
      }
    });
  };
  const handleAlertClose = () => {
    setIsStatusUpdateSuccess(false);
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
                          data={currentViolationsData.filter(
                            (item) =>
                              item.status === statusFilter ||
                              statusFilter === ""
                          )}
                          columns={columns}
                          options={{
                            actionsColumnIndex: -1,
                            pageSize: 20,
                            search: true,
                            showTitle: false,
                            emptyRowsWhenPaging: false,
                            toolbarButtonAlignment: "left",
                          }}
                          components={{
                            Action: (props) => (
                              <FormControl
                                sx={{ m: 1, minWidth: 240 }}
                                variant="standard"
                                size="small"
                              >
                                <InputLabel>Status</InputLabel>
                                <Select
                                  value={statusFilter ?? ""}
                                  onChange={handleStatusFilterChanged}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  <MenuItem value="Contacted">
                                    Contacted
                                  </MenuItem>
                                  <MenuItem value="Ignored">Ignored</MenuItem>
                                  <MenuItem value="Investigating">
                                    Investigating
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            ),
                          }}
                          actions={[
                            {
                              onClick: (event, rowData) => alert("something"),
                              isFreeAction: true,
                            },
                          ]}
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        open={isStatusUpdateSuccess}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity="success">
          The MAP status has been updated successfully!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default ProductsMAPTable;
