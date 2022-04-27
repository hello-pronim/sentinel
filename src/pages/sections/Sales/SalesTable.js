import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";
import { getSalesExport } from "../../../services/SalesService";

import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  Chip as MuiChip,
  Grid,
  Link,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { spacing } from "@mui/system";
import MaterialTable from "@material-table/core";

import { AppContext } from "../../../contexts/AppContext";
import {
  convertPriceFormat,
  convertPercentFormat,
} from "../../../utils/functions";

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

const SalesTable = ({ title, data, salesType, loading }) => {
  const queryParamsString = window.location.search;
  const { filterOptions } = useContext(AppContext);
  const mobileScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [dateFilterOptions, setDateFilterOptions] = useState(
    filterOptions.date
  );
  const [selectedMarketOptions, setSelectedMarketOptions] = useState(
    filterOptions.market.selectedOptions
  );

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
      field: "revenue",
      title: "Revenue",
      type: "currency",
      currencySetting: {
        currencyCode: "$",
      },
      customSort: (a, b) => a.revenue - b.revenue,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { revenue } = rowData;

        return `${convertPriceFormat(revenue)}`;
      },
    },
    {
      field: "comparisonRevenue",
      title: "Comparison Revenue",
      type: "currency",
      currencySetting: {
        currencyCode: "$",
      },
      customSort: (a, b) => a.comparisonRevenue - b.comparisonRevenue,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { comparisonRevenue } = rowData;

        return `${convertPriceFormat(comparisonRevenue)}`;
      },
    },
    {
      field: "revenueChange",
      title: "Revenue Change",
      customSort: (a, b) => a.revenueChange - b.revenueChange,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { revenueChange } = rowData;

        return (
          <Chip
            label={`${convertPercentFormat(revenueChange)}`}
            color={
              revenueChange > 0
                ? "success"
                : revenueChange === 0
                ? "warning"
                : "error"
            }
          />
        );
      },
    },
  ];
  const productsTableColumns = [
    {
      field: "name",
      title: "Brand",
      width: "55%",
      render: (rowData) => {
        const { name } = rowData;

        return name;
      },
    },
    {
      field: "revenue",
      title: "Revenue",
      type: "currency",
      currencySetting: {
        currencyCode: "$",
      },
      customSort: (a, b) => a.revenue - b.revenue,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { revenue } = rowData;

        return `${convertPriceFormat(revenue)}`;
      },
    },
    {
      field: "comparisonRevenue",
      title: "Comparison Revenue",
      type: "currency",
      currencySetting: {
        currencyCode: "$",
      },
      customSort: (a, b) => a.comparisonRevenue - b.comparisonRevenue,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      defaultSort: "desc",
      render: (rowData) => {
        const { comparisonRevenue } = rowData;

        return `${convertPriceFormat(comparisonRevenue)}`;
      },
    },
    {
      field: "revenueChange",
      title: "Revenue Change",
      customSort: (a, b) => a.revenueChange - b.revenueChange,
      width: "15%",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => {
        const { revenueChange } = rowData;

        return (
          <Chip
            label={`${convertPercentFormat(revenueChange)}`}
            color={
              revenueChange > 0
                ? "success"
                : revenueChange === 0
                ? "warning"
                : "error"
            }
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
    let url = "/sales?";

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
    url += selectedMarketOptions.length ? "&" : "";

    selectedMarketOptions.forEach((opt, index) => {
      url +=
        "market_ids[]=" +
        opt.option.id +
        (index < selectedMarketOptions.length - 1 ? "&" : "");
    });
    url += "&show_returns=" + filterOptions.showReturns;

    return url;
  };

  const downloadReport = async () => {
    const response = await getSalesExport("csv", queryParamsString);
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
  };

  return (
    <Card mb={6}>
      <CardHeader
        title={title}
        action={
          <IconButton size="large" onClick={downloadReport}>
            <Download />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        {data !== null && !loading ? (
          <TableWrapper>
            <MaterialTable
              columns={
                salesType === "product"
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
  );
};
export default SalesTable;
