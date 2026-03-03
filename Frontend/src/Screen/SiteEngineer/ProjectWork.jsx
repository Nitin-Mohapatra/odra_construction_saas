// import React from 'react'
import React, { useEffect, useState } from "react";
import Footer from '../../Components/Footer';
import SiteEngineerNavbar from '../../Components/SiteEngineerNavbar';
import { useParams, useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { io } from "socket.io-client";
import { useRef } from "react";
import { toast } from "react-toastify";
import ChatModal from '../../Components/ChatModal';
import axiosInstance from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import LockIcon from "@mui/icons-material/Lock";
import { canAccess } from "../../utils/subscription";

export default function ProjectWork() {
  const { id } = useParams();
  const [project, setProjects] = useState({ reports: [] });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket"]
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [])

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    // Check if socket is initialized before using it
    if (!socketRef.current || !id) return;

    // join the room 
    socketRef.current.emit("join", { projectId: id })

    const handler = (data) => {
      setProjects((prev) => ({
        ...prev,
        reports: prev.reports.map((r) => {
          // Convert both IDs to strings for comparison
          const reportId = r._id?.toString();
          const dataReportId = data.reportId?.toString();

          if (reportId === dataReportId) {
            return {
              ...r,
              contractorStatus: data.contractorStatus,
              contractorComment: data.contractorComment
            };
          }
          return r;
        })
      }));
      toast.info("Report has Been Reviewed");
    };

    socketRef.current.on("report:reviewed", handler);
    socketRef.current.on("project:completed", ({ projectId }) => {
      toast.info("Project has been completed");
      navigate(`/site-engineer/projects`);
    })

    socketRef.current.on("project:deleted", (data) => {
      toast.info("Project has been deleted");
      navigate(`/site-engineer/projects`);
    })
    

    return () => {
      if (socketRef.current) {
        socketRef.current.off("report:reviewed", handler);
        socketRef.current.off("project:completed");
        socketRef.current.disconnect();
      }
    };
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get(`/projects/${id}`);
      setProjects(res.data.project);
      setLoading(false);

    } catch (e) {
      console.log(e);
    }
  }

  if (loading) return <CircularProgress />

  return (
    <div>
      <SiteEngineerNavbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
      >
        {/* PROJECT HEADER */}
        <Box sx={{ maxWidth: 1200, mx: "auto", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            {project.title}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {project.description}
          </Typography>

          <Divider />
        </Box>

        {/* CONTENT */}
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* REPORTS SECTION */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              mb: 4,
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              {t("project.previous_reports")}
            </Typography>


            {!canAccess("reports") ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  border: "1px dashed #ccc",
                  borderRadius: 3,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#ff9800" }}
                >
                  🔒 Upgrade to Premium
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  Unlock Reports feature by upgrading your plan.
                </Typography>
              </Box>

            ) : project.reports.length !== 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {project.reports.map((rept, idx) => (
                  <Card
                    key={rept._id || idx}
                    sx={{
                      borderRadius: "14px",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {rept.workDone}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {t("project.report_status")}: {rept.contractorStatus || t("project.pending")}
                      </Typography>

                      {rept.contractorComment && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            fontStyle: "italic",
                            color: "text.secondary",
                          }}
                        >
                          {t("project.comment")}: {rept.contractorComment}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t("project.no_reports_submitted")}
              </Typography>
            )}

          </Paper>

          {/* ACTIONS */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              {t("project.actions")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {project.status !== "Completed" ? (
                <>
                  <button
                    className="btn btn-sm btn-success"
                    style={{
                      opacity: canAccess("reports") ? 1 : 0.6,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onClick={() => {
                      if (!canAccess("reports")) {
                        toast.error("Upgrade to Business Plan to unlock Report Submission.");
                        return;
                      }
                      navigate(`/site-engineer/projects/${id}/report`);
                    }}
                  >
                    {t("project.submit_report_btn")}

                    {!canAccess("reports") && (
                      <LockIcon
                        fontSize="small"
                        sx={{ fontSize: 16, color: "#ff9800" }}
                      />
                    )}
                  </button>

                  <button
                    className="btn btn-sm btn-primary"
                    style={{
                      opacity: canAccess("attendance") ? 1 : 0.6,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onClick={() => {
                      if (!canAccess("attendance")) {
                        toast.error("Upgrade to Business Plan to unlock Attendance.");
                        return;
                      }
                      navigate(`/site-engineer/projects/${id}/attendance`);
                    }}
                  >
                    {t("project.mark_attendance")}

                    {!canAccess("attendance") && (
                      <LockIcon
                        fontSize="small"
                        sx={{ fontSize: 16, color: "#ff9800" }}
                      />
                    )}
                  </button>

                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(`/site-engineer/projects/${id}/inventory`)
                    }
                  >
                    {t("project.log_inventory")}
                  </button>
                </>
              ) : (
                <Typography color="error">
                  {t("project.project_completed_locked")}
                </Typography>
              )}

              {!canAccess("chat") ? (
                <button
                  className="btn btn-sm btn-primary"
                  style={{
                    opacity: 0.6,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onClick={() =>
                    toast.error("Upgrade to Business Plan to unlock Chat.")
                  }
                >
                  CHAT
                  <LockIcon
                    fontSize="small"
                    sx={{ fontSize: 16, color: "#ff9800" }}
                  />
                </button>
              ) : (
                <ChatModal projectId={id} />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Footer />
    </div>
  );

}
