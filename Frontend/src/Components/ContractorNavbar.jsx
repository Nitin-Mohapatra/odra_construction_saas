import React from "react";
import logo from "../assets/Logo/lg-1.png";
import { Link, useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";
import { canAccess } from "../utils/subscription";
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

export default function ContractorNavbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);

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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
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
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", flexGrow: 1 }}>
            <img
              src={logo}
              alt="logo"
              style={{ width: "10em", cursor: "pointer" }}
              onClick={() => navigate("/contractor/home")}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>



            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              {menuItems.map((item) => {
                const isAddWorker = item.path === "/contractor/add-worker" || item.path === "/contractor/workers";
                const allowed = !isAddWorker || canAccess("addWorker") || canAccess("viewWorkers");

                return (
                  <Typography
                    key={item.label}
                    onClick={() => {
                      if (!allowed) {
                        toast.error("Upgrade to Business Plan to unlock this feature.");
                        return;
                      }
                      navigate(item.path);
                    }}
                    sx={{
                      color: "white",
                      textDecoration: "none",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      opacity: allowed ? 1 : 0.6,
                    }}
                  >
                    {item.label}

                    {!allowed && (
                      <LockIcon
                        fontSize="small"
                        sx={{ ml: 1, fontSize: 16, color: "#ff9800" }}
                      />
                    )}
                  </Typography>
                );
              })}
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
                  navigate("/contractor/home");
                  setOpenDrawer(false);
                }}
              />
            </Box>

            {/* DIVIDER */}
            <Divider sx={{ mb: 2, bgcolor: "divider" }} />

            {/* MENU ITEMS */}
            <List>
              {menuItems.map((item) => {
                const isAddWorker =
                  item.path === "/contractor/add-worker" ||
                  item.path === "/contractor/workers";

                const allowed =
                  !isAddWorker ||
                  canAccess("addWorker") ||
                  canAccess("viewWorkers");

                return (
                  <ListItem
                    key={item.label}
                    onClick={() => {
                      if (!allowed) {
                        toast.error(
                          "Upgrade to Business Plan to unlock this feature."
                        );
                        return;
                      }
                      navigate(item.path);
                      setOpenDrawer(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      cursor: "pointer",
                      opacity: allowed ? 1 : 0.6,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                    />

                    {!allowed && (
                      <LockIcon
                        fontSize="small"
                        sx={{ fontSize: 16, color: "#ff9800" }}
                      />
                    )}
                  </ListItem>
                );
              })}
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
