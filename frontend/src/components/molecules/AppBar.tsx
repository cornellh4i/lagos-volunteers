import React, { ReactElement } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Link from "next/link";

interface AppBarProps {
  /** A list of nav labels and links in order of display */
  navs: { label: string; link: string }[];
  /** A list of components to display on the right of the appbar */
  rightAlignedComponents: ReactElement[];
}

const drawerWidth = 240;

const DrawerAppBar = ({ navs, rightAlignedComponents }: AppBarProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {navs.map((nav) => (
          <Link href={nav.link} className="text-black no-underline">
            <ListItem key={nav.label} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={nav.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
        {rightAlignedComponents.map((component) => (
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              {component}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar color="default" component="nav" elevation={0} position="static">
        <Toolbar
          variant="dense"
          sx={{
            paddingTop: 1,
            paddingBottom: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {/* LFBI navbar brand */}
          <div className="flex-1 h-8">
            <img src="/lfbi_logo.png" className="h-full" />
          </div>

          {/* Navbar items */}
          <Box className="hidden sm:flex">
            {navs.map((nav) => (
              <Link href={nav.link}>
                <Button className="text-black capitalize">{nav.label}</Button>
              </Link>
            ))}
            <div className="ml-2 min-w-0">
              {rightAlignedComponents.map((component) => (
                <>{component}</>
              ))}
            </div>
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className="default sm:hidden"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={() => document.getElementById("__next")}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          className="block sm:hidden"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default DrawerAppBar;
