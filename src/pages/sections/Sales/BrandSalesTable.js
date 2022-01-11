import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";

import {
  Card as MuiCard,
  CardHeader,
  Chip as MuiChip,
  Link,
  Paper,
} from "@mui/material";
import { spacing } from "@mui/system";

import MaterialTable from "@material-table/core";

const Card = styled(MuiCard)(spacing);

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

const BrandSalesTable = ({ brand, data }) => {
  return (
    <Card mb={6}>
      <CardHeader title={`${brand} Products`} />

      <Paper>
        <TableWrapper>
          <MaterialTable
            columns={[
              {
                field: "name",
                title: "Product",
                width: "55%",
                render: (rowData) => {
                  const { name } = rowData;

                  return (
                    <Link component={NavLink} to="#" underline="none">
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
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
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

                  return `$${revenue}`;
                },
              },
              {
                field: "comparisonRevenue",
                title: "Comparison Revenue",
                type: "currency",
                currencySetting: {
                  currencyCode: "$",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
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
                  const { comparisonRevenue } = rowData;

                  return `$${comparisonRevenue}`;
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
                      label={`${revenueChange}%`}
                      color={
                        revenueChange > 75
                          ? "success"
                          : revenueChange > 50
                          ? "info"
                          : revenueChange > 25
                          ? "warning"
                          : "error"
                      }
                    />
                  );
                },
              },
            ]}
            data={data}
            options={{
              pageSize: 10,
              search: true,
              showTitle: false,
            }}
          />
        </TableWrapper>
      </Paper>
    </Card>
  );
};
export default BrandSalesTable;