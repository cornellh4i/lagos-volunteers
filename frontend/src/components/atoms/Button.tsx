import React from 'react';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface ButtonProps {
	children: string;
	color: 'gray' | 'dark-gray';
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset' | undefined;
	isLoading?: boolean;
}

/** A Button page */
const CustomButton = ({
	children,
	color,
	onClick,
	type,
	isLoading,
}: ButtonProps) => {
	return (
		<Button
			fullWidth={true}
			type={type}
			variant='contained'
			onClick={onClick}
			disableElevation
			sx={{ textTransform: 'capitalize' }}
			className={
				color == 'gray'
					? 'bg-gray-300 text-black'
					: color == 'dark-gray'
					? 'bg-gray-400 text-black'
					: ''
			}>
			{isLoading && (
				<CircularProgress
					size={16}
					style={{
						marginRight: 10,
					}}
				/>
			)}
			{isLoading ? 'loading...' : children}
		</Button>
	);
};

export default CustomButton;
