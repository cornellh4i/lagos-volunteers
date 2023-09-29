import React from "react";
// import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { FilledInput, Input, InputAdornment, Grid } from "@mui/material";

interface SearchBarProps {
  value: string;
}

/**
 * A SearchBar component
 */
const SearchBar = ({ value }: SearchBarProps) => {
  return (
    <>
      <div>
        <Grid container>
          <Grid item xs={4}>
            <TextField
              fullWidth
              sx={{ m: 1 }}
              id="search-bar"
              className="text"
              label="Search member by name, email"
              variant="outlined"
              placeholder="Search..."
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" aria-label="search">
                      <SearchIcon style={{ fill: "gray" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default SearchBar;
