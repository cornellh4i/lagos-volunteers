import React, { useEffect } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";

interface TableProps {
  /** The columns of the table, following the MUI Data Grid spec */
  columns: GridColDef<object>[];
  /** The table rows represented as an object array */
  rows: Object[];
  /** The length of the entire dataset [NEEDED FOR PAGINATION] */
  dataSetLength: number;
  /** The ID of the first element [NEEDED FOR PAGINATION] */
  initialID: string;
  /** The function called to obtain the next elements [NEEDED FOR PAGINATION] */
  nextFunction: <T>(cursor: string) => Promise<T[]>;
}
/**
 * A Table component
 */
// initialCursor
const Table = ({
  columns,
  rows,
  dataSetLength,
  initialID,
  nextFunction,
}: TableProps) => {
  const PAGE_SIZE = 15;
  const [rowData, setRowData] = React.useState<any[]>(rows);
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
    setRowData(userData);
    setlastElementID(last_element_id);
  };
  useEffect(() => {
    adjustRows(rowData);
  }, []);

  const { data, isPending, refetch } = useQuery({
    queryKey: ["tableData", paginationModel.page, cursor[cursor.length - 1]],
    queryFn: async () => {
      return nextFunction(cursor[cursor.length - 1]);
    },
    staleTime: Infinity,
  });

  return (
    <div>
      {rowData.length > 0 && (
        <DataGrid
          columns={columns}
          rows={rowData}
          sx={{ border: 0 }}
          disableRowSelectionOnClick
          rowCount={rowCountState} // number of rows in the entire dataset
          paginationModel={paginationModel} // current page and page size
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[]}
          paginationMode="server"
          disableColumnMenu
          loading={isPending}
        />
      )}
    </div>
  );
};

export default Table;
