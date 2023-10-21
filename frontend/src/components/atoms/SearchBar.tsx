import React, { ChangeEvent, FormEvent } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<any>) => void;
  onClick: (event: FormEvent<any>) => void;
}

/**
 * A SearchBar component
 */
const SearchBar = ({
  value,
  placeholder,
  onChange,
  onClick,
}: SearchBarProps) => {
  return (
    <>
      <Box component="form" onClick={onClick}>
        <TextField
          onClick={onClick}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
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
        />
      </Box>
    </>
  );
};

export default SearchBar;
