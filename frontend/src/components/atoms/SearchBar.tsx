import React from "react";
// import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Paper, InputBase } from "@mui/material";

interface SearchBarProps {
  value: string;
}

/**
 * A SearchBar component
 */
const SearchBar = ({ value }: SearchBarProps) => {
  return (
    <>
      <Paper
        component="form"
        variant="outlined"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search member by name, email"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
};

export default SearchBar;
