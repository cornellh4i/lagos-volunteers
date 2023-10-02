import React from "react";
import CustomModal from "../components/molecules/Modal";
import Button from "../components/atoms/Button";
import { Box } from "@mui/material";

const test = () => {
	return (
		<div>
			<CustomModal
				open={true}
				title={"Terms and Conditions"}
				bodyText={
					"By registering, I agree that I will attend the event. If I cannot attend, I will cancel my registration at least 24 hours before the event begins. Failure to cancel my registration may negatively impact my status as a volunteer"
				}
				leftButtonText={"Disagree"}
				rightButtonText={"Agree & Continue"}
			/>
		</div>
	);
};

export default test;
