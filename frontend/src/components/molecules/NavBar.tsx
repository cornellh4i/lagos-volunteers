import * as React from "react";
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

const drawerWidth = 240;
const navLinks = ["/", "/", "/events/view", "/", "/profile", "/"];
const navItems = [
  "Home",
  "About",
  "My Events",
  "Request Certificate",
  "Profile",
  "Log Out",
];

const DrawerAppBar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar color="default" component="nav" elevation={0} position="static">
        <Toolbar variant="dense" className="pt-1 pb-1">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LFBI
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {/* {navItems.map((item) => (
              <Button key={item} className="text-black capitalize">
                {item}
              </Button>
            ))} */}
            {navLinks.map((item, index) => (
              <Link href={item}>
                <Button className="text-black capitalize">
                  {navItems[index]}
                </Button>
              </Link>
            ))}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
            className="ml-auto"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
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
