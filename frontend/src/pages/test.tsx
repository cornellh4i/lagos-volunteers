import React from "react"; 
import CustomModal from "../components/molecules/Modal";
import Button from "../components/atoms/Button";

const test = () => {
    return (
        <div>
        <CustomModal open = {true} body={<div></div>}
        />
        </div>
    );
};

export default test;
