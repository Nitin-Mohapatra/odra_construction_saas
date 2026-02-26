import React, { useEffect, useState } from "react";
import ContractorNavbar from "../../Components/ContractorNavbar";
import Footer from "../../Components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from '../../utils/axiosInstance';
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ContractorDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");
  if (!token) return;
  const decoded = jwtDecode(token);
  const contractorId = decoded.User_id;
  const { t } = useTranslation();

  useEffect(() => {
    fetchProjects();

    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket"]
    });
    if (!socketRef.current) return;
    socketRef.current.emit("join", {
      contractorId
    });
    socketRef.current.on("report:new", (data) => {
      toast.info(`New report received: ${data.projectTitle}`);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  const total = projects.length;
  const ongoing = projects.filter(
    p => p.status?.toLowerCase() === "ongoing"
  ).length;
  
  const completed = projects.filter(
    p => p.status?.toLowerCase() === "completed"
  ).length;
  
  return (
    <>
      <ContractorNavbar />
  
      <Box
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          padding: "3rem 1rem",
        }}
      >
        <div className="container">
          {/* HEADER */}
          <div className="mb-5">
            <h2 style={{ fontWeight: 700, color: "#1e1e1e" }}>
              {t("dashboard.contractor.title")}
            </h2>
            <p className="text-muted">
              {t("dashboard.contractor.subtitle")}
            </p>
          </div>
  
          {/* SUMMARY CARDS */}
          <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-body">
                  <h6 className="text-muted mb-2">{t("dashboard.contractor.total_projects")}</h6>
                  <h2 style={{ fontWeight: 700 }}>{total}</h2>
                </div>
              </div>
            </div>
  
            <div className="col-12 col-md-4">
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-body">
                  <h6 className="text-muted mb-2">{t("dashboard.contractor.ongoing_projects")}</h6>
                  <h2 style={{ fontWeight: 700, color: "#f5a623" }}>
                    {ongoing}
                  </h2>
                </div>
              </div>
            </div>
  
            <div className="col-12 col-md-4">
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-body">
                  <h6 className="text-muted mb-2">{t("dashboard.contractor.completed_projects")}</h6>
                  <h2 style={{ fontWeight: 700, color: "#16a34a" }}>
                    {completed}
                  </h2>
                </div>
              </div>
            </div>
          </div>
  
          {/* QUICK ACTIONS */}
          <div className="mb-5 d-flex flex-wrap gap-3">
            <Button
              variant="contained"
              color="success"
              component={Link} to="/contractor/add-project"
              sx={{
                backgroundColor: "#f5a623",
                color: "#000",
                fontWeight: 600,
              }}
            >
              {t("dashboard.contractor.add_project")}
            </Button>
  
            <Button
              variant="outlined"
              color="primary"
              component={Link} to="/contractor/project"
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                borderColor: "#f5a623",
                fontWeight: 600,
               
              }}
            >
              {t("dashboard.contractor.view_projects")}
            </Button>
          </div>
  
          {/* RECENT PROJECTS */}
          <div>
            <h5 style={{ fontWeight: 600 }} className="mb-3">
              {t("dashboard.contractor.view_projects")}
            </h5>
  
            {projects.slice(0, 5).length === 0 && (
              <p className="text-muted">{t("dashboard.contractor.no_projects")}</p>
            )}
  
            {projects.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="card border-0 mb-3"
                onClick={() =>
                  navigate(`/contractor/project/${project._id}`)
                }
                style={{
                  cursor: "pointer",
                  borderRadius: "14px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <span style={{ fontWeight: 500 }}>
                    {project.title}
                  </span>
  
                  <span
                    className={`badge ${
                      project.status?.toLowerCase() === "completed"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>
  
      <Footer />
    </>
  );
  
}
