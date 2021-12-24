import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";
import { MoreVertical } from "react-feather";

import {
  Card as MuiCard,
  CardHeader,
  Chip as MuiChip,
  IconButton,
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

const SalesTable = ({ data, columns }) => {
  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="sales" size="large">
            <MoreVertical />
          </IconButton>
        }
        title="Sales"
      />

      <Paper>
        <TableWrapper>
          <MaterialTable
            columns={[
              {
                field: "brand",
                title: "Brand",
                cellStyle: {
                  width: "55%",
                },
                render: (rowData) => {
                  const { brand } = rowData;

                  return (
                    <Link components={NavLink} to="/">
                      {brand}
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
                cellStyle: {
                  width: "15%",
                },
                render: (rowData) => {
                  const { revenue } = rowData;

                  return `$${revenue}`;
                },
              },
              {
                field: "comparisonRevenue",
                title: "Comparison Revenue",
                currencySetting: {
                  currencyCode: "$",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                },
                customSort: (a, b) => a.revenue - b.revenue,
                cellStyle: {
                  width: "15%",
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
                cellStyle: {
                  width: "15%",
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
export default SalesTable;
