import React, { ChangeEvent, FormEvent } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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
            background: "white",
            borderRadius: "8px",
          },
          "& .MuiInputBase-input": {
            height: "9px",
          },
        }}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {props.showCancelButton && (
                <div className="flex flex-row items-center">
                  <IconButton
                    type="button"
                    aria-label="cancel"
                    edge="end"
                    onClick={() => {
                      props.resetSearch();
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <div className="ml-3 text-gray-400">|</div>
                </div>
              )}
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
