import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LFBI
          </Typography>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >      
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// import React from "react";
// import { useState } from "react";

// /** A NavBar page */
// const NavBar = () => {
//   const [menuOpen, setMenuOpen] = useState(false)

//   const handleNav = () => {
//     setMenuOpen(!menuOpen);
//   }
//   return (
//   <>
  
//   <div className = "grid grid-cols-12">
//     <div className = "col-span-11 justify-between items-center px-8 py-6 bg-gray-100 font-mono text-4xl">LFBI
//     </div>
//     <div className = "space-y-2 bg-gray-100 object-center py-8">
//       <div className = "sm:w-0 w-8 h-0.5 bg-black animate-pulse"></div>
//       <div className = "sm:w-0 w-8 h-0.5 bg-black animate-pulse"></div>
//       <div className = "sm:w-0 w-8 h-0.5 bg-black animate-pulse"></div>
//     </div>
//   </div>
//   </>
//   );
// };

// export default NavBar;
