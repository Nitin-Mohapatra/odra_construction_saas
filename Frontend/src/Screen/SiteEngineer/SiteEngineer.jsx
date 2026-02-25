import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import SiteEngineerNavbar from "../../Components/SiteEngineerNavbar";
import Footer from "../../Components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import heroImg from "../../assets/pic.png";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function SiteEngineer() {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    // decode token to get REAL MongoDB user id
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const siteEngineerId = decoded.User_id; // IMPORTANT

    const socket = io("http://localhost:8080", {
      transports: ["websocket"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("join", {
        siteEngineerId
      });

      console.log("Joined room:", `siteEngineer-${siteEngineerId}`);
    });

    socket.on("project:assigned", (data) => {
      console.log("Project assigned event received:", data);
      toast.info(`New project assigned: ${data.newProject.title} by ${data.contractorName}`);
    });

    return () => {
      socket.off("project:assigned");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <SiteEngineerNavbar />

      {/* HERO SECTION */}
      <section
        style={{
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        <div className="container-fluid px-0">
          <div className="row g-0 align-items-center">
            {/* LEFT IMAGE */}
            <div className="col-12 col-md-6">
              <img
                src={heroImg}
                alt="Site Engineer"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "100vh",
                  objectFit: "cover",
                  clipPath: "polygon(0 0, 99% 0, 76% 100%, 0% 100%)",
                }}
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "3rem",
                  borderRadius: "20px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                  maxWidth: "520px",
                  margin: "2rem",
                }}
              >
                <h1
                  style={{
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "#1e1e1e",
                  }}
                >
                  Built for Site Engineers
                </h1>

                <p className="text-muted">
                  A dedicated platform designed to help site engineers manage
                  projects efficiently with real-time updates, reporting tools,
                  and seamless communication.
                </p>

                <ul className="text-muted mt-4">
                  <li className="mb-2">✔ Live project assignment updates</li>
                  <li className="mb-2">✔ Centralized project management</li>
                  <li className="mb-2">✔ Simple and intuitive interface</li>
                </ul>

                <Button
                  component={Link}
                  to="/site-engineer/projects"
                  variant="outlined"
                  sx={{
                    color: "#1e1e1e",
                    borderColor: "#f5a623",
                    backgroundColor:"#f5a623",
                    fontWeight: 600,
                    mt: 3,
                   
                  }}
                >
                  View Projects
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 700, color: "#1e1e1e" }}>
              Features Available for Site Engineers
            </h2>
            <p className="text-muted mt-2">
              Everything you need to manage site-level operations effectively
            </p>
          </div>

          <div className="row g-4">
            {/* REAL-TIME UPDATES */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: "18px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-3">
                    Real-Time Project Updates
                  </h5>
                  <p className="text-muted small">
                    Instantly receive notifications when projects are assigned or
                    updated by the contractor—no delays, no manual refresh.
                  </p>
                </div>
              </div>
            </div>

            {/* PROJECT MANAGEMENT */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: "18px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-3">Project Management</h5>
                  <ul className="text-muted small ps-3">
                    <li className="mb-2">Submit daily & progress reports</li>
                    <li className="mb-2">Chat with contractor in real time</li>
                    <li className="mb-2">Mark and manage attendance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* UI */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: "18px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-3">
                    Clean & User-Friendly UI
                  </h5>
                  <p className="text-muted small">
                    Designed to be simple, fast, and mobile-friendly so site
                    engineers can focus on work—not learning software.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </section>
    </>
  );

}
