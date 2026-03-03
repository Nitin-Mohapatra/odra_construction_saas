import React from "react";
import logo from "../assets/Logo/lg-1.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

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

  const [login, setLogin] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  React.useEffect(() => {
    const checkValidity = async () => {
      const token = localStorage.getItem("token");

      try {
        if (token) {
          const response = await axios.get(
            "http://localhost:8080/token/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            setLogin(true);

            const backendRole = response.data.role;

            if (backendRole === "manager") {
              navigate("/contractor/home");
            } else if (backendRole === "site engineer") {
              navigate("/engineer/home");
            } else {
              navigate("/");
            }
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
            <img src={logo} alt="logo" style={{ width: 48, cursor: "pointer" }} onClick={() => navigate("/home")} />
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

          {/* CTA Buttons */}
          {!login && (
            <Box sx={{ display: "flex", gap: 1, ml: 3 }}>
              <Button
                component={Link}
                to="/Login"
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#f5a623",
                    color: "#f5a623",
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
                  backgroundColor: "#f5a623",
                  color: "#000",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#e0941d",
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
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
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

          {!login && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                component={Link}
                to="/Login"
                variant="outlined"
                sx={{
                  borderColor: "#1e1e1e",
                  color: "#1e1e1e",
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
                  backgroundColor: "#f5a623",
                  color: "#000",
                  fontWeight: 600,
                }}
              >
                 {t("navbar.signup")}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
