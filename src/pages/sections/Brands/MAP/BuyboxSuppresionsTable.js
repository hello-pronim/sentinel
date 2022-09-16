import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import ShowMoreText from "react-show-more-text";
import MaterialTable from "@material-table/core";

import {
  Alert as MuiAlert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  FormControl,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Select,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Comment, Download } from "@mui/icons-material";
import LaunchIcon from "@mui/icons-material/Launch";
import { grey } from "@mui/material/colors";

import { AuthContext } from "../../../../contexts/CognitoContext";

import CommentEditor from "../../../../components/commentEditor";

import {
  addSellerNote,
  getCurrentViolationsData,
  getCurrentViolationsExport,
  getSellerNotes,
  updateMAPStatus,
} from "../../../../services/MAPService";
import {
  convertDateToFormattedDateString,
  convertPercentFormat,
  convertPriceFormat,
} from "../../../../utils/functions";

const CommentText = styled.div`
  > p {
    padding: 0;
    margin: 0;
  }
`;
const Divider = styled(MuiDivider)(spacing);
const CommentWrapper = styled.div`
  width: 100%;
  height: 320px;
  padding: 0 20px;
  overflow-y: scroll;
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BuyboxSuppressionsTable = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusList, setStatusList] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isStatusUpdateSuccess, setIsStatusUpdateSuccess] = useState(false);
  const [suppressionsData, setSuppressionsData] = useState(null);
  const [loadingSuppressionsData, setLoadingSuppresionsData] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [commentDlgOpen, setCommentDlgOpen] = useState(false);
  const [selectedMAPData, setSelectedMAPData] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notes, setNotes] = useState([]);

  const columns = [
    {
      field: "name",
      title: "Listing",
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
      render: (rowData) => {
        const { marketId } = rowData;

        return marketId;
      },
    },
    {
      field: "marketplace",
      title: "Market",
      render: (rowData) => {
        const { marketplace } = rowData;

        return marketplace;
      },
    },
    {
      field: "seller",
      title: "Seller",
      render: (rowData) => {
        const { seller } = rowData;

        return seller;
      },
    },
    {
      field: "currentPrice",
      title: "Current Price",
      customSort: (a, b) => a.currentPrice - b.currentPrice,
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
      field: "observedDate",
      title: "Observed Date",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
    },
    {
      field: "status",
      title: "Status",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { priceId } = rowData;

        return (
          <FormControl
            sx={{ m: 1, minWidth: 120 }}
            variant="outlined"
            size="small"
          >
            <Select
              value={statusList[priceId] ?? ""}
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
    {
      title: "Action",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        return (
          <IconButton
            onClick={() => handleCommentDialogOpen(rowData)}
            color="success"
          >
            <Comment />
          </IconButton>
        );
      },
    },
  ];

  const initializeTableData = useCallback(() => {
    //call to get the table data
    setLoadingData(true);
    getCurrentViolationsData(queryParamsString).then((res) => {
      const {
        data: {
          body: {
            data: { listings },
          },
        },
      } = res;
      console.log(listings);

      setLoadingData(false);
      if (listings) {
        let newStatusList = { ...statusList };
        const tableData = listings.map((item) => {
          newStatusList[item.price_id] = item.status || "";

          return {
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
            observedDate: item?.observed_date,
            status: item.status,
          };
        });

        setStatusList(newStatusList);
        setData(tableData);
      }
    });
  }, [queryParamsString]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      initializeTableData();
    }
  }, [isAuthenticated, isInitialized, initializeTableData]);

  useEffect(() => {
    if (selectedMAPData !== null) {
      setLoadingNotes(true);
      getSellerNotes(selectedMAPData.seller).then((res) => {
        const {
          data: {
            body: { data: _notes },
          },
        } = res;

        setLoadingNotes(false);
        setNotes(_notes);
      });
    }
  }, [selectedMAPData]);

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

        let newStatusList = { ...statusList };
        newStatusList[priceId] = e.target.value;
        setStatusList(newStatusList);
      }
    });
  };
  const handleAlertClose = () => {
    setIsStatusUpdateSuccess(false);
  };

  const downloadReport = async () => {
    setDownloadingCSV(true);
    const queryParamsString = window.location.search;
    const response = await getCurrentViolationsExport(queryParamsString);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const filename = response.headers["content-disposition"].replace(
      /attachment;\sfilename=/g,
      ""
    );
    link.setAttribute("download", `${filename}`);
    document.body.appendChild(link);
    link.click();
    setDownloadingCSV(false);
  };

  const handleCommentDialogOpen = (selected) => {
    setCommentDlgOpen(true);
    setSelectedMAPData(selected);
  };

  const handleCommentDialogClose = () => {
    setCommentDlgOpen(false);
    setSelectedMAPData(null);
  };

  const handleCommentPost = (newComment) => {
    const newNotes = [...notes];

    newNotes.push({
      comment: newComment,
      created_at: new Date(),
    });
    setNotes([...newNotes]);

    addSellerNote(selectedMAPData.seller, newComment);
  };

  const handleShowMoreClicked = (isExpanded) => {
    console.log(isExpanded);
  };

  return (
    <React.Fragment>
      {data !== null && !loadingData ? (
        <MaterialTable
          style={{ width: "100%", overflow: "auto" }}
          data={data.filter(
            (item) =>
              statusList[item.priceId] === statusFilter ||
              statusFilter === "all"
          )}
          columns={columns}
          options={{
            // actionsColumnIndex: -1,
            pageSize: 50,
            pageSizeOptions: [5, 10, 20, 50, 100],
            search: true,
            showTitle: false,
            emptyRowsWhenPaging: false,
            tableLayout: "fixed",
            // toolbarButtonAlignment: "left",
          }}
          components={{
            Action: (props) => (
              <Grid container alignItems="end" spacing={0}>
                <Grid item>
                  <FormControl
                    sx={{ m: 1, minWidth: 240 }}
                    variant="standard"
                    size="small"
                  >
                    {/* <InputLabel>Status</InputLabel> */}
                    <Select
                      value={statusFilter}
                      onChange={handleStatusFilterChanged}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="Contacted">Contacted</MenuItem>
                      <MenuItem value="Ignored">Ignored</MenuItem>
                      <MenuItem value="Investigating">Investigating</MenuItem>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <IconButton
                    size="large"
                    onClick={downloadReport}
                    disabled={downloadingCSV}
                    sx={{ padding: 0 }}
                  >
                    <Download />
                  </IconButton>
                </Grid>
              </Grid>
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={downloadingCSV}
        onClose={handleAlertClose}
      >
        <Alert icon={<></>} onClose={handleAlertClose} severity="success">
          Preparing download, please wait...
        </Alert>
      </Snackbar>

      <Dialog
        open={commentDlgOpen}
        maxWidth="sm"
        TransitionComponent={Transition}
        onClose={handleCommentDialogClose}
        aria-describedby="comment-dialog-description"
        fullWidth
        keepMounted
      >
        <DialogTitle>{selectedMAPData?.seller} Notes</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="comment-dialog-description"></DialogContentText>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CommentEditor handleCommentPost={handleCommentPost} />
            </Grid>
            <Grid item xs={12}>
              <Divider>Notes</Divider>
            </Grid>
            <Grid item xs={12}>
              {!loadingNotes ? (
                <CommentWrapper>
                  <Grid container spacing={3}>
                    {[...notes].reverse().map((item, index) => (
                      <Grid key={index} item xs={12}>
                        <Grid
                          key={index}
                          container
                          justifyContent="space-between"
                        >
                          <Grid item xs={9}>
                            <ShowMoreText
                              lines={2}
                              more="More"
                              less="Less"
                              onClick={handleShowMoreClicked}
                              expanded={false}
                              truncatedEndingComponent={"... "}
                            >
                              <CommentText
                                dangerouslySetInnerHTML={{
                                  __html: item.comment,
                                }}
                              />
                            </ShowMoreText>
                          </Grid>
                          <Grid item xs={3}>
                            <Grid container justifyContent="flex-end">
                              <Typography
                                variant="caption"
                                sx={{ color: grey[700] }}
                              >
                                {convertDateToFormattedDateString(
                                  new Date(item.created_at),
                                  false
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </CommentWrapper>
              ) : (
                <Grid container justifyContent="center">
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCommentDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default BuyboxSuppressionsTable;
