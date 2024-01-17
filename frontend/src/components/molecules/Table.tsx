import React, { useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

interface TableProps {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rows: Object[];
  /** The length of the entire dataset */
  dataSetLength: number;
  /** The pagination model should come from the data layer, the parent component */
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
}
/** A Table component */
const Table = ({
  columns,
  rows,
  dataSetLength,
  paginationModel,
  setPaginationModel,
}: TableProps) => {
  return (
    <div>
      {rows.length > 0 && (
        <DataGrid
          columns={columns}
          rows={rows}
          sx={{ border: 0 }}
          disableRowSelectionOnClick
          rowCount={dataSetLength} // number of rows in the entire dataset
          paginationModel={paginationModel} // current page and page size
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[]}
          paginationMode="server"
          disableColumnMenu
        />
      )}
    </div>
  );
};

export default Table;
