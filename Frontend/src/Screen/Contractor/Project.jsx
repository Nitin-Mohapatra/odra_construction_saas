import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance';
import ContractorNavbar from "../../Components/ContractorNavbar"; // Corrected import path
import Footer from "../../Components/Footer"; // Corrected import path
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTranslation } from "react-i18next";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // update to use conventional lowercase
  const [tab, setTab] = useState(0);
  const {t} = useTranslation();


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects");
        if (res.status === 200) {
          setProjects(res.data.projects);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching projects");
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); // <-- fix: run only once on mount

  return (
    <>
      <ContractorNavbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t("project.projects")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("project.manage_projects")}
          </Typography>
        </Box>

        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ mb: 4 }}
        >
          <Tab label={t("project.all_projects")} />
          <Tab label={t("project.ongoing")} />
          <Tab label={t("project.completed")}  />
        </Tabs>

        {/* CONTENT */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "40vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
              gap: 3,
            }}
          >
            {projects
              .filter((pro) => {
                if (tab === 1) return pro.status === "Ongoing";
                if (tab === 2) return pro.status === "Completed";
                return true; // All
              })
              .map((pro) => (
                <Card
                  key={pro._id}
                  elevation={0}
                  sx={{
                    position: "relative",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    transition: "0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* TOP RIGHT ICON */}
                  <Tooltip title={t("project.open_project")}>
                    <IconButton
                      onClick={() => navigate(`/contractor/project/${pro._id}`)}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#f5a623",
                        color: "#000",
                        "&:hover": {
                          backgroundColor: "#e6a11e",
                        },
                      }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {pro.title.length > 20
                        ? pro.title.substring(0, 20) + "..."
                        : pro.title}
                    </Typography>
                  </CardContent>
                </Card>

              ))}

            {projects.length === 0 && (
              <Typography color="text.secondary">
                  {t("project.no_projects")}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Footer />
    </>
  );



}