import React, { ChangeEvent, FormEvent } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onClick: (event: FormEvent<any>) => void;
  [key: string]: any;
}

/**
 * A SearchBar component
 */
const SearchBar = ({ onClick, ...props }: SearchBarProps) => {
  return (
    <Box component="form" onClick={onClick}>
      <TextField
        size="small"
        fullWidth={true}
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
    </Box>
  );
};

export default SearchBar;
