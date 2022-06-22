import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";
import { getUntisShippedExport } from "../../../services/InventoryService";

import {
  Alert as MuiAlert,
  Card as MuiCard,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  Chip as MuiChip,
  Grid,
  Link,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { spacing } from "@mui/system";
import MaterialTable from "@material-table/core";

import { AppContext } from "../../../contexts/AppContext";
import { convertPercentFormat } from "../../../utils/functions";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const InventoryTable = ({ title, data, shippedType, loading }) => {
  const { filterOptions } = useContext(AppContext);
  const [dateFilterOptions, setDateFilterOptions] = useState(
    filterOptions.date
  );
  const [selectedMarketOptions, setSelectedMarketOptions] = useState(
    filterOptions.market.selectedOptions
  );
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  const brandsTableColumns = [
    {
      field: "name",
      title: "Brand",
      width: "55%",
      render: (rowData) => {
        const { companyId, name } = rowData;

        return (
          <Link
            to={generateUrl(companyId)}
            component={NavLink}
            underline="none"
          >
            {name}
          </Link>
        );
      },
    },
    {
      field: "unitsShipped",
      title: "Shipped",
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
    },
    {
      field: "comparisonUnitsShipped",
      title: "Comparison Shipped",
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
    },
    {
      field: "change",
      title: "Change",
      customSort: (a, b) => a.change - b.change,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { change } = rowData;

        return (
          <Chip
            label={`${convertPercentFormat(change)}`}
            color={change > 0 ? "success" : change === 0 ? "warning" : "error"}
          />
        );
      },
    },
  ];
  const productsTableColumns = [
    {
      field: "name",
      title: "Product",
      width: "55%",
      render: (rowData) => {
        const { name } = rowData;

        return name;
      },
    },
    {
      field: "unitsShipped",
      title: "Shipped",
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
    },
    {
      field: "comparisonUnitsShipped",
      title: "Comparison Shipped",
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
    },
    {
      field: "change",
      title: "Change",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { change } = rowData;

        return (
          <Chip
            label={`${convertPercentFormat(change)}`}
            color={change > 0 ? "success" : change === 0 ? "warning" : "error"}
          />
        );
      },
    },
  ];

  useEffect(() => {
    setDateFilterOptions(filterOptions.date);
    setSelectedMarketOptions(filterOptions.market.selectedOptions);
  }, [filterOptions]);

  const generateUrl = (companyId) => {
    let url = "/inventory?";

    url += "company_ids[]=" + companyId;
    url +=
      "&date_range=" +
      dateFilterOptions.dateRange +
      "&view_by=" +
      dateFilterOptions.viewMode +
      "&from=" +
      dateFilterOptions.from +
      "&to=" +
      dateFilterOptions.to;
    if (dateFilterOptions.dateRange === "custom")
      url +=
        "&comp_from=" +
        dateFilterOptions.compFrom +
        "&comp_to=" +
        dateFilterOptions.compTo;
    url += selectedMarketOptions.length ? "&market_ids[]=" : "";

    selectedMarketOptions.forEach((opt, index) => {
      url +=
        opt.option.id + (index < selectedMarketOptions.length - 1 ? "," : "");
    });
    url += "&show_returns=" + filterOptions.showReturns;

    return url;
  };

  const downloadReport = async () => {
    setDownloadingCSV(true);
    const queryParamsString = window.location.search;
    const response = await getUntisShippedExport(queryParamsString);
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

  const handleAlertClose = () => {
    setDownloadingCSV(false);
  };

  return (
    <>
      <Card mb={6}>
        <CardHeader
          title={title}
          action={
            <Tooltip title="Units Shipped">
              <IconButton
                size="large"
                onClick={downloadReport}
                disabled={downloadingCSV}
              >
                <Download />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>
          {data !== null && !loading ? (
            <TableWrapper>
              <MaterialTable
                columns={
                  shippedType === "product"
                    ? productsTableColumns
                    : brandsTableColumns
                }
                data={data}
                options={{
                  pageSize: 20,
                  search: true,
                  showTitle: false,
                  emptyRowsWhenPaging: false,
                }}
              />
            </TableWrapper>
          ) : (
            <Grid container justifyContent="center">
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={downloadingCSV}
        onClose={handleAlertClose}
      >
        <Alert icon={<></>} onClose={handleAlertClose} severity="success">
          Preparing download, please wait...
        </Alert>
      </Snackbar>
    </>
  );
};
export default InventoryTable;
