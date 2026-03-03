import React, { useEffect, useState } from 'react'
import Footer from '../../Components/Footer';
import { useNavigate } from 'react-router-dom';
import SiteEngineerNavbar from '../../Components/SiteEngineerNavbar';
import axiosInstance from '../../utils/axiosInstance';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { useRef } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTranslation } from "react-i18next";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  if (!token) return;
  const decoded = jwtDecode(token);
  const siteEngineerId = decoded.User_id;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/projects/my-projects");
        setProjects(res.data.projects); // Fix: Use res instead of fetchData
        setLoading(false);
      } catch (e) {
        setError("Error fetching projects.");
        console.log(e);
      }
    }
    fetchData();

    // socket connection
    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket"]
    });

    if (!socketRef.current) return;
    socketRef.current.emit("join", {
      siteEngineerId
    });

    socketRef.current.on("project:assigned", (data) => {
      setProjects((prev) => [...prev, data.newProject])
      toast.info(`New project assigned: ${data.newProject.title} by ${data.contractorName}`);
    })

    socketRef.current.on("project:deleted", (data) => {
      setProjects((prev) =>
        prev.filter((pro) => pro._id !== data.project_id)
      );
    
      toast.info(`Contractor deleted the project ${data.project_name}`);
    });


    return () => {
      if (socketRef.current) {
        socketRef.current.off("project:assigned");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, []);



  if (loading) return <CircularProgress />;

  return (
    <>
      <SiteEngineerNavbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 6 },
        }}
      >
        {/* HEADER */}
        <Box sx={{ maxWidth: 1200, mx: "auto", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            {t("project.my_projects")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("project.track_projects")}
          </Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>

        {/* TABS */}
        <Box sx={{ maxWidth: 1200, mx: "auto", mb: 4 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
          >
            <Tab label={t("project.all_projects")} />
            <Tab label={t("project.ongoing")} />
            <Tab label={t("project.completed")} />
          </Tabs>
        </Box>

        {/* ERROR */}
        {error && (
          <Typography color="error" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {/* PROJECT GRID */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {projects
            .filter((project) => {
              if (tab === 1) return project.status === "Ongoing";
              if (tab === 2) return project.status === "Completed";
              return true; // All
            })
            .map((project) => (
              <Card
                key={project._id}
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                  },
                }}
              >


                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {project.title || t("project.untitled_project")}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {project.contractor?.name
                      ? t("project.contractor_with_name", { name: project.contractor.name })
                      : t("project.contractor_with_name", { name: t("project.na") })}
                  </Typography>

                  <Box sx={{ textAlign: "right" }}>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() =>
                        navigate(
                          `/site-engineer/projects/${project._id}`
                        )
                      }
                    >
                      {t("project.open_project")}
                    </button>
                  </Box>
                </CardContent>
              </Card>
            ))}

          {projects.length === 0 && (
            <Typography variant="body1" color="text.secondary">
              {t("project.no_assigned_projects")}
            </Typography>
          )}
        </Box>
      </Box>

      <Footer />
    </>
  );


}
