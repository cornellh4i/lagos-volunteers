import React from "react"; 
import CustomModal from "../components/molecules/Modal";
import Button from "../components/atoms/Button";
import { Box } from '@mui/material';


const test = () => {
    return (
        <div>
        <CustomModal open = {true} title={"Title"} bodyText={"Lorem ipsum du bio bo"} leftButtonText={"Disagree"} rightButtonText={"Agree & Continue"}
        />
        </div>
    );
};

export default test;
