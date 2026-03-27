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
import { useTranslation } from "react-i18next";
import UpgradeBanner from "../../Components/UpgradeBanner";
import { getSubscription } from "../../utils/subscription";

export default function SiteEngineer() {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

 
  useEffect(() => {
    // decode token to get REAL MongoDB user id
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const siteEngineerId = decoded.User_id; // IMPORTANT

    const socket = io(import.meta.env.VITE_API_URL, {
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

      {/* {getSubscription().plan === "free" && <UpgradeBanner />}   */}
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
                  {t("dashboard.engineer.hero_title")}
                </h1>

                <p className="text-muted">
                  {t("dashboard.engineer.hero_desc")}
                </p>

                <ul className="text-muted mt-4">
                  <li className="mb-2">{t("dashboard.engineer.feature_1")}</li>
                  <li className="mb-2">{t("dashboard.engineer.feature_2")}</li>
                  <li className="mb-2">{t("dashboard.engineer.feature_3")}</li>
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
                  {t("dashboard.engineer.view_projects")}
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 700, color: "#1e1e1e" }}>
              {t("dashboard.engineer.features_title")}
            </h2>
            <p className="text-muted mt-2">
              {t("dashboard.engineer.features_desc")}
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
                    {t("dashboard.engineer.real_time_title")}
                  </h5>
                  <p className="text-muted small">
                    {t("dashboard.engineer.real_time_desc")}
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
                  <h5 className="fw-semibold mb-3">{t("dashboard.engineer.project_mgmt_title")}</h5>
                  <ul className="text-muted small ps-3">
                    <li className="mb-2">{t("dashboard.engineer.pm_1")}Submit daily & progress reports</li>
                    <li className="mb-2">{t("dashboard.engineer.pm_2")}</li>
                    <li className="mb-2">{t("dashboard.engineer.pm_3")}</li>
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
                    {t("dashboard.engineer.ui_title")}
                  </h5>
                  <p className="text-muted small">
                    {t("dashboard.engineer.ui_desc")}
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
