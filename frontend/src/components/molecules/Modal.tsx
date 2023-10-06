import React from "react";
import { Modal, Grid, Backdrop, Fade, Box, Typography } from "@mui/material";
import Button from "../../components/atoms/Button";
import { StringLiteral } from "typescript";

interface CustomModalProps {
	open: boolean;
	title: string;
	bodyText: string;
	leftButtonText: string;
	rightButtonText: string;
}

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	borderRadius: "5px",
	width: "50%",
	paddingLeft: 10,
	paddingRight: 10,
	paddingTop: 5,
	paddingBottom: 5,
	fontweight: "bold",
};

/**
 * A Modal component is a styled modal that takes in a body component
 */
const CustomModal = ({
	title,
	bodyText,
	leftButtonText,
	rightButtonText,
}: CustomModalProps) => {
	const [open, setOpen] = React.useState(true);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	return (
		<Modal
			className="w-full"
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Box sx={style}>
				<h2>{title}</h2>
				<p>{bodyText}</p>
				<Grid container spacing={2}>
					<Grid item md={6} xs={12}>
						<Button color="gray" type="button" onClick={handleClose}>
							{leftButtonText}
						</Button>
					</Grid>
					<Grid item md={6} xs={12}>
						<Button color="dark-gray" type="button" onClick={handleClose}>
							{rightButtonText}
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Modal>
	);
}; 

export default CustomModal;
