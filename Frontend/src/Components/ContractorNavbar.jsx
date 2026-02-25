import React from "react";
import logo from "../assets/Logo/lg-1.png";
import { Link, useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Select,
  MenuItem
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { deepOrange } from "@mui/material/colors";

export default function ContractorNavbar() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("IsLogin");
    localStorage.removeItem("User_id");
    localStorage.removeItem("name");
    navigate("/home");
  };

  const menuItems = [
    { label: t("navbar.add_project"), path: "/contractor/add-project" },
    { label: t("navbar.all_projects"), path: "/contractor/project" },
    { label: t("navbar.workers"), path: "/contractor/workers" },
    { label: t("navbar.add_worker"), path: "/contractor/add-worker" },
  ];

  return (
    <>
      {/* TOP BAR */}
      <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            sx={{ display: { md: "none" } }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src={logo}
              alt="logo"
              style={{ width: 48, cursor: "pointer" }}
              onClick={() => navigate("/home")}
            />
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {menuItems.map((item) => (
              <Typography
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Avatar */}
          <Avatar
            sx={{
              bgcolor: deepOrange[500],
              ml: 3,
              mr: 2,
              width: 36,
              height: 36,
              fontSize: 16,
            }}
          >
            {localStorage.getItem("name")?.charAt(0)}
          </Avatar>

          {/* Logout Button */}
          <Button
            variant="contained"
            onClick={logout}
            sx={{
              backgroundColor: "#f5a623",
              color: "#000",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#e0941d",
              },
            }}
          >
            {t("navbar.logout")}
          </Button>

          <Select
            size="small"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            sx={{
              ml: 2,
              backgroundColor: "#fff",
              borderRadius: 1,
              height: 35
            }}
          >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="hi">हिं</MenuItem>
            <MenuItem value="or">ଓଡ଼ିଆ</MenuItem>
          </Select>

        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 260, p: 2 }}>
          <img src={logo} alt="logo" style={{ width: 60, marginBottom: 20 }} />

            
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                component={Link}
                to={item.path}
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {/* Avatar + Logout in Drawer */}
          <Box sx={{ mt: 3, textAlign: "center", display:"flex",justifyContent:"flexStart", alignItems:"center", gap:1}}>
            <Avatar
              sx={{
                bgcolor: deepOrange[500],
              }}
            >
              {localStorage.getItem("name")?.charAt(0)}
            </Avatar>

            <Button
              small
              variant="contained"
              onClick={logout}
              sx={{
                mt: 0,
                backgroundColor: "#f5a623",
                color: "#000",
                fontWeight: 600,
              }}
            >
              {t("navbar.logout")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
