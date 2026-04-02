import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import logo from "../assets/Logo/lg-1.png";
import { useTheme } from "@emotion/react";

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
          <div className="col-md-4 d-block">
            <img
              src={logo}
              alt="PBM Intel"
              style={{ height: "45px", marginBottom: "15px" }}
            />
            <Typography  sx={{ color: "text.secondary"}} variant="p">
              Construction Management Software designed to simplify
              project tracking, attendance, reporting and inventory management.
            </Typography>

          </div>

          {/* CENTER - QUICK LINKS */}
          <div className="col-md-4">
            <Typography
              variant="h4"
              sx={{
                color:"text.secondary"
              }}
              >
              Quick Links
            </Typography>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                to="/"
                style={{ textDecoration: "none", color: "text.secondary" }}
              >
                Home
              </Link>

              <Link
                to="/services"
                style={{ textDecoration: "none", color: "text.secondary" }}
              >
                Services
              </Link>

              <Link
                to="/login"
                style={{ textDecoration: "none", color: "text.secondary" }}
              >
                Login
              </Link>

              <Link
                to="/contact-us"
                style={{ textDecoration: "none", color: "text.secondary" }}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* RIGHT - CONTACT */}
          <div className="col-md-4">
           <Typography
              variant="h4"
              sx={{
                color:"text.secondary"
              }}
              >
              Contact
            </Typography>

              <div style={{display: "flex", flexDirection: "column", gap: "8px" }}>
                <Typography  variant="p" sx={{ color: "text.secondary" }}>
                  📧  odraops@gmail.com
                </Typography>
                <Typography  variant="p" sx={{ color: "text.secondary"}}>
                  📞 +91 6370627088
                </Typography>
                <Typography  variant="p" sx={{ color: "text.secondary" }}>
                  📍 Bhubaneswar, India
                </Typography>
              </div>
          </div>

        </div>
      </div>

      {/* Bottom Strip */}
      <div
        style={{
          borderTop: "1px solid #222",
          textAlign: "center",
          padding: "15px 0",
          fontSize: "14px",
          color: "#777",
        }}
      >
        © {new Date().getFullYear()} PBM Intel. All rights reserved.
      </div>
    </footer>
  );
}
