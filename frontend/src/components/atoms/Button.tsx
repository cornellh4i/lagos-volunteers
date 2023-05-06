import React from 'react';
import { Button } from '@mui/material';

interface Props {
	buttonText: string;
	buttonTextColor: string;
	buttonColor: string;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset' | undefined;
}

/** A Button page */
const CustomButton = (props: Props) => {
	return (
		<Button
			fullWidth={true}
			type={props.type}
			variant='contained'
			onClick={props.onClick}
			style={{
				backgroundColor: props.buttonColor,
				color: props.buttonTextColor,
			}}>
			{props.buttonText}
		</Button>
	);
};

export default CustomButton;
