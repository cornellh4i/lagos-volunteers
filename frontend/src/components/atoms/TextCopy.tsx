import React, { useState } from "react";
import { Snackbar } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import IconButton from "@mui/material/IconButton";
import IconTextHeader from "./IconTextHeader";

interface TextCopyProps {
  label: string;
  text: string;
}

/**
 * A TextCopy component has a label and a text body, along with a copy button.
 * Pressing the button copies the text body to the clipboard.
 */
const TextCopy = ({ label, text }: TextCopyProps) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
      <div className="flex overflow-auto">
        <div className="flex items-center pr-2">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg text-gray-700">
            <IconButton onClick={handleClick}>
              <FileCopyIcon />
            </IconButton>
          </div>
        </div>
        <div className="flex items-center truncate">
          <div className="flex flex-col max-w-full">
            <div className="font-semibold">{label}</div>
            <div className="truncate">{text}</div>
          </div>
        </div>
      </div>
    </>
    // <div className="overflow-auto">
    //   <div className="flow-root">
    //     <div className="pt-3 float-left">{label}:</div>
    //     <div className="float-right">
    //       <IconButton onClick={handleClick}>
    //         <FileCopyIcon />
    //       </IconButton>
    //       <Snackbar
    //         open={open}
    //         onClose={() => setOpen(false)}
    //         autoHideDuration={2000}
    //         message="Copied to clipboard"
    //       />
    //     </div>
    //   </div>
    //   <div>{text}</div>
    // </div>
  );
};

export default TextCopy;
