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
import DeleteIcon from  "@mui/icons-material/Delete"

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // update to use conventional lowercase
  const [tab, setTab] = useState(0);
  const {t} = useTranslation();


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
  useEffect(() => {
    fetchProjects();
  }, []); 

  const handleDelete = async (projectId) => {
    const ans = window.confirm(
      "Are you sure? This will permanently delete the project."
    );
  
    if (!ans) return;
  
    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch (err) {
      console.log(err)
      toast.error("Delete failed");
    }
  };

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
          <Typography variant="h1" fontWeight={700} >
            {t("project.projects")}
          </Typography>
          <Typography variant="body1"  className="my-3">
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
                  {/* TOP RIGHT ACTIONS */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Tooltip title={t("project.open_project")}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/contractor/project/${pro._id}`)}
                        sx={{
                          backgroundColor: "primary.main",
                          color: "text.primary",
                          width: 34,
                          height: 34,
                          "&:hover": {
                            backgroundColor: "secondary.main",
                            color:"text.secondary"
                          },
                        }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Project">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(pro._id)}
                        sx={{
                          backgroundColor: "#fff",
                          color: "#ef4444",
                          width: 34,
                          height: 34,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                          "&:hover": {
                            backgroundColor: "#fee2e2",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <CardContent sx={{ p:2 }}>
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