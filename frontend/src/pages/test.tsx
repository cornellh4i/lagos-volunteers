import React from "react"; 
import CustomModal from "../components/molecules/Modal";
import Button from "../components/atoms/Button";

const test = () => {
    return (
        <div>
        <CustomModal open = {true} header={"hello"} bodyText={"hi"} buttonText={"toodaloo"} buttonText2={"teehee"}
        />
        </div>
    );
};

export default test;
