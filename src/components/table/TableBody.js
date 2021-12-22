import React from "react";

import {
  Box,
  Checkbox,
  IconButton,
  TableCell,
  TableBody as MuiTableBody,
  TableRow,
} from "@mui/material";
import {
  Archive as ArchiveIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => ({
    el,
    index,
  }));
  stabilizedThis.sort((a, b) => {
    const order = comparator(a.el, b.el);
    if (order !== 0) return order;
    return a.index - b.index;
  });
  return stabilizedThis.map((element) => element.el);
}

const TableBody = ({
  rows,
  page,
  rowsPerPage,
  order,
  orderBy,
  checkable = false,
  selectedRows,
  handleSelectRow,
}) => {
  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <MuiTableBody>
      {stableSort(rows, getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, index) => {
          const isItemSelected = isSelected(row.id);
          const labelId = `table-checkbox-${index}`;

          return (
            <TableRow
              hover
              role="table-row"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={`${row.id}-${index}`}
              selected={isItemSelected}
            >
              {checkable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    inputProps={{ "aria-labelledby": labelId }}
                    onClick={(event) => handleSelectRow(event, row.id)}
                  />
                </TableCell>
              )}

              {Object.keys(row).map((key) => (
                <TableCell key={key} align="center">
                  {row[key]}
                </TableCell>
              ))}

              <TableCell align="right" padding="none">
                <Box mr={2}>
                  <IconButton aria-label="delete" size="large">
                    <ArchiveIcon />
                  </IconButton>
                  <IconButton aria-label="details" size="large">
                    <RemoveRedEyeIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
      {emptyRows > 0 && (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell colSpan={8} />
        </TableRow>
      )}
    </MuiTableBody>
  );
};

export default TableBody;
