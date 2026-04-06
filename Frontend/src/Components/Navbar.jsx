import React from "react";
import logo from "../assets/Logo/lg-1.png";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "@emotion/react";
import {Divider} from "@mui/material"
import SocialBar from "./SocialBar"

import {
  Select,
  MenuItem,
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
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme()

  const [login, setLogin] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  React.useEffect(() => {
    const checkValidity = async () => {

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axiosInstance.get("/token/me");

        if (response.status === 200) {
          // console.log(response.data)
          if (response.data.role != "admin") {
            setLogin(true);
          }

          const backendRole = response.data.role;

          if (backendRole === "manager") {
            navigate("/contractor/home");
          } else if (backendRole === "site engineer") {
            navigate("/engineer/home");
          } else {
            navigate("/");
          }
        }

      } catch (err) {
        console.log(err);
        setLogin(false);
        localStorage.removeItem("token");
        localStorage.removeItem("IsLogin");
        localStorage.removeItem("User_id");
      }
    };

    checkValidity();
  }, [navigate]);

  const menuItems = [
    { label: t("navbar.home"), path: "/home" },
    { label: t("navbar.services"), path: "/services" },
    { label: t("navbar.contact"), path: "/Contact-Us" },
    { label: t("navbar.pricing"), path: "/pricing" },
  ];

  return (
    <>
      {/* TOP BAR */}
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
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
            <img src={logo} alt="logo" style={{ width: "10em", cursor: "pointer" }} onClick={() => navigate("/home")} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, mr: 3 }}>
              {menuItems.map((item) => (
                <Typography
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>

            {/* CTA Buttons */}
            {!login && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={Link}
                  to="/Login"
                  variant="outlined"
                  sx={{
                    color: "text.secondary",
                    borderColor: "text.secondary",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "primary.main",
                      color: "primary.main",
                    },
                  }}
                >
                  {t("navbar.login")}
                </Button>

                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "#000",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "text.secondary",
                    },
                  }}
                >
                  {t("navbar.signup")}
                </Button>
              </Box>
            )}

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
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <img
                src={logo}
                alt="logo"
                style={{ width: 70, cursor: "pointer" }}
                onClick={() => {
                  navigate("/home");
                  setOpenDrawer(false);
                }}
              />
            </Box>

            {/* DIVIDER */}
            <Divider sx={{ mb: 2 ,backgroundColor:"text.primary"}} />

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
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{color:"text.primary"}}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* BOTTOM SECTION */}
          <Box>
            {/* CTA BUTTONS */}
            {!login && (
              <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 2 }}>
                <Button
                  
                  component={Link}
                  to="/Login"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {t("navbar.login")}
                </Button>

                <Button
                  
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    fontWeight: 600,
                    color:"text.primary"
                  }}
                >
                  {t("navbar.signup")}
                </Button>
              </Box>
            )}

            {/* SOCIAL BAR */}
            <Divider sx={{ mb: 1 , backgroundColor:"text.primary"}} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <SocialBar colourStyle={{"color":"black"}}/>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
