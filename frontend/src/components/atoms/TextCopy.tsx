import React, { useState } from "react";
import { Button, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

interface Props {
  label: string;
  text: string;
}

/**
 * A TextCopy component has a label and a text body, along with a copy button.
 * Pressing the button copies the text body to the clipboard.
 */
const TextCopy = ({ label, text }: Props) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex ">
        <div className="pt-3">{label}:</div>
        <div className="absolute right-0">
          <IconButton onClick={handleClick}>
            <ContentCopyIcon />
          </IconButton>
          <Snackbar
            open={open}
            onClose={() => setOpen(false)}
            autoHideDuration={2000}
            message="Copied to clipboard"
          />
        </div>
      </div>
      <div>{text}</div>
    </div>
  );
};

export default TextCopy;
