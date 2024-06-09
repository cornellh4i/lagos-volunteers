import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridSlots,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

interface TableProps {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rows: Object[];
  /** The length of the entire dataset */
  dataSetLength: number;
  /** The pagination model should come from the data layer, the parent component */
  paginationModel: GridPaginationModel;
  sortModel?: GridSortModel;
  handlePaginationModelChange: (newModel: GridPaginationModel) => void;
  handleSortModelChange: (newModel: GridSortModel) => void;
  loading?: boolean;
}

/** A Table component */
const Table = ({
  columns,
  rows,
  dataSetLength,
  paginationModel,
  sortModel,
  handlePaginationModelChange,
  handleSortModelChange,
  loading,
}: TableProps) => {
  return (
    <DataGrid
      className={`w-full ${rows.length === 0 ? "h-[500px]" : "h-auto"}`}
      columns={columns}
      slots={{
        loadingOverlay: LinearProgress as GridSlots["loadingOverlay"],
        noRowsOverlay: () => (
          <div className="flex justify-center items-center h-full">
            No results found
          </div>
        ),
      }}
      rows={rows}
      sx={{ border: 0 }}
      disableRowSelectionOnClick
      rowCount={dataSetLength} // number of rows in the entire dataset
      paginationModel={paginationModel} // current page and page size
      onPaginationModelChange={handlePaginationModelChange}
      pageSizeOptions={[]}
      paginationMode="server"
      disableColumnMenu
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={handleSortModelChange}
      sortingOrder={["desc", "asc"]}
      loading={loading}
    />
  );
};

export default Table;
