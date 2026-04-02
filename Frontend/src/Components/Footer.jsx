import { Link } from "react-router-dom";
import { Box, Typography, Divider , IconButton} from "@mui/material";
import logo from "../assets/Logo/lg-1.png";
import { useTheme } from "@emotion/react";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SocialBar from "./SocialBar";

const footerLinkStyle = {
  textDecoration: "none",
  color: "text.secondary",
};

export default function Footer() {
  const theme = useTheme();
  return (
    <footer
      style={{
        backgroundColor: "#000",
        color: "text.secondary",
        marginTop: "auto",
      }}
    >
      <div className="container py-5">
        <div className="row gy-4">

          {/* LEFT - BRAND */}
          <div className="col-md-4 text-center text-md-start d-none d-md-block">
            <img
              src={logo}
              alt="Odraops"
              style={{ height: "45px", marginBottom: "15px" }}
            />
            <Typography sx={{ color: "text.secondary", display: "block" }} variant="body1">
              Construction Management Software designed to simplify
              project tracking, attendance, reporting and inventory management.
            </Typography>
            
            <Box>
              <SocialBar/>
            </Box>

          </div>

          {/* CENTER - QUICK LINKS */}
          <div className="col-md-4 text-center text-md-start">
            <Typography
              variant="h4"
              sx={{
                color: "text.secondary",
                marginBottom: "0.5em"
              }}
            >
              Quick Links
            </Typography>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }} className="align-items-md-start">
              <Typography
                component={Link}
                variant="body1"
                to="/"
                sx={footerLinkStyle}
              >
                Home
              </Typography>

              <Typography
                component={Link}
                variant="body1"
                to="/services"
                sx={footerLinkStyle}
              >
                Services
              </Typography>

              <Typography
                component={Link}
                variant="body1"
                to="/login"
                sx={footerLinkStyle}
              >
                Login
              </Typography>

              <Typography
                component={Link}
                variant="body1"
                to="/contact-us"
                sx={{ textDecoration: "none", color: "text.secondary" }}
              >
                Contact
              </Typography>
            </div>
          </div>

          {/* RIGHT - CONTACT */}
          <div className="col-md-4 text-center text-md-start">
            <Typography
              variant="h4"
              sx={{
                color: "text.secondary",
                marginBottom: "0.5em"
              }}
            >
              Contact
            </Typography>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} className="align-items-md-start">
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                📧  odraops@gmail.com
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                📞 +91 6370627088
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                📍 Bhubaneswar, India
              </Typography>
            </div>

            <Box className="d-md-none">
              <SocialBar/>
            </Box>
          </div>

        </div>
      </div>

      {/* Bottom Strip */}
      <Box
        sx={{
          borderTop: "1px solid #fff",
          textAlign: "center",
          padding: "15px 0",
          fontSize: "14px",
          color: "text.secondary",
        }}
      >
        © {new Date().getFullYear()} PBM Intel. All rights reserved.
      </Box>
    </footer>
  );
}


