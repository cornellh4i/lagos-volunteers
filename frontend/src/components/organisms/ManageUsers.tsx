import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonIcon from "@mui/icons-material/Person";
import SearchBar from "@/components/atoms/SearchBar";
import Link from "next/link";
import Card from "../molecules/Card";
import useManageUserState from "@/utils/useManageUserState";

interface ManageUsersProps {}

type ManageUsersTableProps = {
  rows: userInfo[];
  usersLength: number;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  handlePaginationModelChange: (newModel: GridPaginationModel) => void;
  handleSortModelChange: (newModel: GridSortModel) => void;
  handleNewSearchQuery: (newQuery: string) => void;
  isLoading: boolean;
};

type userInfo = {
  id: string;
  firstName: string;
  email: string;
  role: string;
  createdAt: Date;
  hours: number;
};

const Active = ({
  rows,
  usersLength,
  paginationModel,
  sortModel,
  handlePaginationModelChange,
  handleSortModelChange,
  handleNewSearchQuery,
  isLoading,
}: ManageUsersTableProps) => {
  const eventColumns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Name",
      flex: 2,
      minWidth: 200,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined on",
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      type: "date",
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "hours",
      headerName: "Total hours",
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      headerName: "",
      field: "actions",
      flex: 0.5,
      minWidth: 140,
      renderCell: (params) => (
        <div>
          <Link
            href={`/users/${params.row.id}/manage`}
            className="no-underline"
          >
            <Button variety="tertiary" size="small" icon={<PersonIcon />}>
              View Profile
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  /** Search bar */
  // TODO: Implement seach bar with new pagination logic.
  const [value, setValue] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    event.preventDefault();
    handleNewSearchQuery(value);
  };

  const handleResetSearch = () => {
    setValue("");
    handleNewSearchQuery("");
  };

  return (
    <div>
      <div className="pb-5 w-full sm:w-[600px]">
        <SearchBar
          placeholder="Search member by name, email"
          value={value}
          onChange={handleChange}
          onSubmit={handleSubmitSearch}
          resetSearch={handleResetSearch}
          showCancelButton={value !== ""}
        />
      </div>
      <Card size="table">
        <Table
          handlePaginationModelChange={handlePaginationModelChange}
          handleSortModelChange={handleSortModelChange}
          columns={eventColumns}
          rows={rows}
          dataSetLength={usersLength}
          paginationModel={paginationModel}
          sortModel={sortModel}
          loading={isLoading}
        />
      </Card>
    </div>
  );
};

const Blacklisted = ({
  rows,
  usersLength,
  paginationModel,
  sortModel,
  handlePaginationModelChange,
  handleSortModelChange,
  handleNewSearchQuery,
  isLoading,
}: ManageUsersTableProps) => {
  const eventColumns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Name",
      flex: 2,
      minWidth: 200,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined on",
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      type: "date",
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "hours",
      headerName: "Total hours",
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      headerName: "",
      field: "actions",
      flex: 0.5,
      minWidth: 140,
      renderCell: (params) => (
        <div>
          <Link
            href={`/users/${params.row.id}/manage`}
            className="no-underline"
          >
            <Button variety="tertiary" size="small" icon={<PersonIcon />}>
              View Profile
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  /** Search bar */
  const [value, setValue] = React.useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    event.preventDefault();
    handleNewSearchQuery(value);
  };

  const handleResetSearch = () => {
    setValue("");
    handleNewSearchQuery("");
  };

  return (
    <div>
      <div className="pb-5 w-full sm:w-[600px]">
        <SearchBar
          placeholder="Search member by name, email"
          value={value}
          onChange={handleChange}
          onSubmit={handleSubmitSearch}
          resetSearch={handleResetSearch}
          showCancelButton={value !== ""}
        />
      </div>
      <Card size="table">
        <Table
          columns={eventColumns}
          handlePaginationModelChange={handlePaginationModelChange}
          handleSortModelChange={handleSortModelChange}
          rows={rows}
          dataSetLength={usersLength}
          paginationModel={paginationModel}
          sortModel={sortModel}
          loading={isLoading}
        />
      </Card>
    </div>
  );
};

/** A ManageUsers component */
const ManageUsers = ({}: ManageUsersProps) => {
  const {
    rows: activeUsersRows,
    isPending: isActivePending,
    error: isActiveError,
    handlePaginationModelChange: handleActivePaginationModelChange,
    handleSortModelChange: handleActiveSortModelChange,
    handleSearchQuery: handleActiveSearchQuery,
    paginationModel: activePaginationModel,
    sortModel: activeSortModel,
    searchQuery: activeSearchQuery,
    totalNumberofData: totalNumberofActiveData,
  } = useManageUserState("ACTIVE");

  const {
    rows: blacklistedUsersRows,
    isPending: isBlacklistedPending,
    error: isBlacklistedError,
    handlePaginationModelChange: handleBlacklistedPaginationModelChange,
    handleSortModelChange: handleBlacklistedSortModelChange,
    handleSearchQuery: handleBlacklistedSearchQuery,
    paginationModel: blacklistedPaginationModel,
    sortModel: blacklistedSortModel,
    searchQuery: blacklistedSearchQuery,
    totalNumberofData: totalNumberofBlacklistedData,
  } = useManageUserState("INACTIVE");

  const tabs = [
    {
      label: "Active",
      panel: (
        <Active
          handlePaginationModelChange={handleActivePaginationModelChange}
          handleSortModelChange={handleActiveSortModelChange}
          handleNewSearchQuery={handleActiveSearchQuery}
          rows={activeUsersRows}
          usersLength={totalNumberofActiveData}
          paginationModel={activePaginationModel}
          sortModel={activeSortModel}
          isLoading={isActivePending}
        />
      ),
    },

    {
      label: "Blacklisted",
      panel: (
        <Blacklisted
          handlePaginationModelChange={handleBlacklistedPaginationModelChange}
          handleSortModelChange={handleBlacklistedSortModelChange}
          handleNewSearchQuery={handleBlacklistedSearchQuery}
          rows={blacklistedUsersRows}
          usersLength={totalNumberofBlacklistedData}
          paginationModel={blacklistedPaginationModel}
          sortModel={blacklistedSortModel}
          isLoading={isBlacklistedPending}
        />
      ),
    },
  ];

  return (
    <TabContainer
      left={<div className="font-semibold text-3xl">Manage Members</div>}
      tabs={tabs}
    />
  );
};

export default ManageUsers;
