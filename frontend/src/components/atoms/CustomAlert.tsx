import React from "react";
import Alert from "@mui/material/Alert";

interface CustomAlertProps {
	severity: "error" | "warning" | "info" | "success";
	title: string;
	message: string;
}

function CustomAlert({ severity, title, message }: CustomAlertProps) {
	return (
		<Alert severity={severity}>
			{title}: {message}
		</Alert>
	);
}

export default CustomAlert;
