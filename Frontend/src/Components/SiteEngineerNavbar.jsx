import React from "react";
import logo from "../assets/Logo/lg-1.png";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import {Divider} from "@mui/material";
import SocialBar from "./SocialBar";

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

export default function SiteEngineerNavbar() {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const { t } = useTranslation();
  // ❗ LOGIC UNCHANGED
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("IsLogin");
    localStorage.removeItem("User_id");
    localStorage.removeItem("name");
    localStorage.removeItem("subscription");
    localStorage.removeItem("organizationId");
    localStorage.removeItem("role");
    navigate("/home");
  };

  // 🔹 Site Engineer specific menu
  const menuItems = [
    { label: t("navbar.home"), path: "/engineer/home" },
    { label: t("navbar.all_projects"), path: "/site-engineer/projects" },
  ];

  return (
    <>
      {/* TOP BAR */}
      <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Mobile Menu */}
          <IconButton
            edge="start"
            color="inherit"
            sx={{ display: { md: "none" } }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", flexGrow: 1 }}>
            <img src={logo} alt="logo" style={{ width: "10em", cursor: "pointer" }} onClick={() => navigate("/engineer/home")} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

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

            {/* Logout */}
            <Button
              variant="contained"
              onClick={logout}
              sx={{
                backgroundColor: "primary.main",
                    color: "#000",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "text.secondary",
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

          </Box>

        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box
          sx={{
            width: 260,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          {/* TOP SECTION */}
          <Box>
            {/* LOGO */}
            <Box sx={{ textAlign: "start", mb: 2 }}>
              <img
                src={logo}
                alt="logo"
                style={{ width: 70, cursor: "pointer" }}
                onClick={() => {
                  navigate("/engineer/home"); // change if needed
                  setOpenDrawer(false);
                }}
              />
            </Box>

            {/* DIVIDER */}
            <Divider sx={{ mb: 2, bgcolor: "divider" }} />

            {/* MENU ITEMS */}
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.label}
                  component={Link}
                  to={item.path}
                  onClick={() => setOpenDrawer(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* BOTTOM SECTION */}
          <Box>
            {/* USER + LOGOUT */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Avatar sx={{ bgcolor: deepOrange[500] }}>
                {localStorage.getItem("name")?.charAt(0)}
              </Avatar>

              <Button
                variant="contained"
                onClick={logout}
                sx={{
                  flex: 1,
                  fontWeight: 600,
                }}
              >
                {t("navbar.logout")}
              </Button>
            </Box>

            {/* DIVIDER */}
            <Divider sx={{ mb: 1, bgcolor: "divider" }} />

            {/* SOCIAL BAR */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <SocialBar colourStyle={{ color: "#000" }} />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
