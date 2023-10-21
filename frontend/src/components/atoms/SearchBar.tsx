import React, { ChangeEvent, FormEvent } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Paper, InputBase, InputAdornment } from "@mui/material";

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
      <Paper
        component="form"
        onClick={onClick}
        variant="outlined"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <InputBase
          sx={{ ml: 1, p: 0.5, flex: 1 }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Paper>
    </>
  );
};

export default SearchBar;
