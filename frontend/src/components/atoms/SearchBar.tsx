import React, { ChangeEvent, FormEvent } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSubmit: any;
  [key: string]: any;
}

/** A simple searchbar */
const SearchBar = ({ onSubmit, ...props }: SearchBarProps) => {
  return (
    <form onSubmit={onSubmit}>
      <TextField
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "8px",
          },
          "& .MuiInputBase-input": {
            height: "12px",
          },
        }}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="search" edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </form>
  );
};

export default SearchBar;
