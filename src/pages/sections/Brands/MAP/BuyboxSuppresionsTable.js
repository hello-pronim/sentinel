import React, { useCallback, useContext, useEffect, useState } from "react";
import MaterialTable from "@material-table/core";

import {
  Alert as MuiAlert,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Snackbar,
} from "@mui/material";
import { Download } from "@mui/icons-material";

import { AuthContext } from "../../../../contexts/CognitoContext";
import {
  getSuppressionsData,
  getSuppressionsExport,
} from "../../../../services/MAPService";
import { convertDateToMMDDYY } from "../../../../utils/functions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BuyboxSuppressionsTable = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState(null);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  const columns = [
    {
      field: "name",
      title: "Product Name",
    },
    {
      field: "url",
      title: "Product URL",
      render: (rowData) => {
        const { url } = rowData;

        return (
          <Link component="button" onClick={() => window.open(url)}>
            {url}
          </Link>
        );
      },
    },
    {
      field: "suppressed_date",
      title: "Suppressed Date",
      render: (rowData) => {
        const { suppressed_date: date } = rowData;

        return convertDateToMMDDYY(date);
      },
    },
  ];

  const initializeTableData = useCallback(() => {
    //call to get the table data
    setLoadingData(true);
    getSuppressionsData(queryParamsString).then((res) => {
      const {
        data: {
          body: { data: _suppressions },
        },
      } = res;

      setData(_suppressions);
      setLoadingData(false);
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

  const downloadReport = async () => {
    setDownloadingCSV(true);
    const queryParamsString = window.location.search;
    const response = await getSuppressionsExport(queryParamsString);
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
  const handleAlertClose = () => {};

  return (
    <React.Fragment>
      {data !== null && !loadingData ? (
        <MaterialTable
          style={{ width: "100%", overflow: "auto" }}
          data={data}
          columns={columns}
          options={{
            pageSize: 50,
            pageSizeOptions: [5, 10, 20, 50, 100],
            search: true,
            showTitle: false,
            emptyRowsWhenPaging: false,
            tableLayout: "fixed",
          }}
          components={{
            Action: (props) => (
              <Grid container alignItems="end" spacing={0}>
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
        open={downloadingCSV}
        onClose={handleAlertClose}
      >
        <Alert icon={<></>} onClose={handleAlertClose} severity="success">
          Preparing download, please wait...
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default BuyboxSuppressionsTable;
