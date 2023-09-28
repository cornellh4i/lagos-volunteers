import React from "react"; 
import CustomModal from "../components/molecules/Modal";
import Button from "../components/atoms/Button";
import { Box } from '@mui/material';


const test = () => {
    return (
        <div>
        <CustomModal open = {true} body={<div>
            <Box sx={{
                        width: 400,
						height: 300,
						backgroundColor: 'gray',
						'&:hover': {
							backgroundColor: 'primary.main',
							opacity: [0.9, 0.8, 0.7],
						},
					}}>
                    </Box></div>}
        />
        </div>
    );
};

export default test;
