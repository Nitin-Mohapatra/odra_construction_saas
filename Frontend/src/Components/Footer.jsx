import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import logo from "../assets/Logo/lg-1.png";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#111111",
        color: "#ffffff",
        marginTop: "auto",
      }}
    >
      <div className="container py-5">
        <div className="row gy-4">

          {/* LEFT - BRAND */}
          <div className="col-md-4">
            <img
              src={logo}
              alt="PBM Intel"
              style={{ height: "45px", marginBottom: "15px" }}
            />
            <p style={{ color: "#aaa", fontSize: "14px" }}>
              Construction Management Software designed to simplify
              project tracking, attendance, reporting and inventory management.
            </p>

            {/* CTA Button */}
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#ff5a00",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#e14f00",
                },
              }}
            >
              Get Started
            </Button>
          </div>

          {/* CENTER - QUICK LINKS */}
          <div className="col-md-4">
            <h6 style={{ fontWeight: 600, marginBottom: "15px" }}>
              Quick Links
            </h6>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                to="/"
                style={{ textDecoration: "none", color: "#aaa" }}
              >
                Home
              </Link>

              <Link
                to="/services"
                style={{ textDecoration: "none", color: "#aaa" }}
              >
                Services
              </Link>

              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#aaa" }}
              >
                Login
              </Link>

              <Link
                to="/contact-us"
                style={{ textDecoration: "none", color: "#aaa" }}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* RIGHT - CONTACT */}
          <div className="col-md-4">
            <h6 style={{ fontWeight: 600, marginBottom: "15px" }}>
              Contact
            </h6>
            <p style={{ color: "#aaa", marginBottom: "6px" }}>
              📧 nitinmohapatra26@gmail.com
            </p>
            <p style={{ color: "#aaa", marginBottom: "6px" }}>
              📞 +91 6370627088
            </p>
            <p style={{ color: "#aaa" }}>
              📍 Bhubaneswar, India
            </p>
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
