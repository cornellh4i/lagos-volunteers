import React, { useEffect } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

interface TableProps {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rowData: Object[];
  /** The length of the entire dataset [NEEDED FOR PAGINATION] */
  dataSetLength: number;
  /** The ID of the first element [NEEDED FOR PAGINATION] */
  initialID: string;
  /** The function called to obtain the next elements [NEEDED FOR PAGINATION] */
  nextFunction: (cursor: string) => Promise<any[]>;
}
/**
 * A Table component
 */
// initialCursor
const Table = ({
  columns,
  rowData,
  dataSetLength,
  initialID,
  nextFunction,
}: TableProps) => {
  const PAGE_SIZE = 5;
  const [rows, setRows] = React.useState<any[]>(rowData);
  const [cursor, setCursor] = React.useState<any[]>([initialID]);
  const [lastElementID, setlastElementID] = React.useState<string>("");
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [rowCountState, setRowCountState] = React.useState(dataSetLength);

  const handlePaginationModelChange = async (
    newPaginationModel: GridPaginationModel
  ) => {
    // stores the result from pagination request
    var userData = [];
    // tracks which page we on ["","userid1","userid2"...] --> [page1,page2,page3...]
    var cursorArray = cursor;

    if (paginationModel.page < newPaginationModel.page) {
      cursorArray.push(lastElementID);
      userData = await nextFunction(lastElementID);
    } else {
      // one pop to get rid of last element
      cursorArray.pop();
      // second pop to get the details of last element
      var cursor_after_pop = cursorArray.pop();
      // push the cursor back on
      cursorArray.push(cursor_after_pop);
      userData = await nextFunction(cursor_after_pop);
    }
    setCursor(cursorArray);
    setPaginationModel(newPaginationModel);
    adjustRows(userData);
  };

  const adjustRows = async (rows: any[]) => {
    var userData = [...rows];
    const last_element_id = userData.pop().id;
    setRows(userData);
    setlastElementID(last_element_id);
  };
  useEffect(() => {
    adjustRows(rows);
  }, []);

  return (
    <div>
      {rows.length > 0 && (
        <DataGrid
          columns={columns}
          rows={rows}
          sx={{ border: 0 }}
          disableRowSelectionOnClick
          rowCount={rowCountState}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[]}
          paginationMode="server"
          disableColumnMenu
        />
      )}
    </div>
  );
};

export default Table;
