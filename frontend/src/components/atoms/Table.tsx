import React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

type TableProps = {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef;
  /** The table rows represented as an object array */
  rows: Object[];
};

/**
 * A Table component
 */
const Table = ({ columns, rows }: TableProps) => {
  return <>Hello there</>;
};

export default Table;
