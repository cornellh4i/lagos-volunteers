import React from "react";
import { Chip } from "@mui/material";

interface BoxTextProps {
  box_text: string;
}

/**
 * A BoxText component is a piece of text surrounded by a colored box
 */
const BoxText = (props: BoxTextProps) => {
 return (
  <div>
    <Chip 
    sx = {{width: "150px", height: "37px" }}
    label= {props.box_text}
    color={props.box_text=="Supervisor"?"primary":"success"}
    variant="outlined"/>
  </div>
  );
};

export default BoxText;
