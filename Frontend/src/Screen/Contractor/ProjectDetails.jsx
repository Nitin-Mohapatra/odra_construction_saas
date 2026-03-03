import React, { useEffect, useState, useRef } from 'react';
import ContractorNavbar from '../../Components/ContractorNavbar';
import Footer from '../../Components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import ChatModal from '../../Components/ChatModal';
import axiosInstance from '../../utils/axiosInstance';
import { useTranslation } from "react-i18next";
import LockIcon from "@mui/icons-material/Lock";
import { canAccess } from "../../utils/subscription";

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleCompleteProject = async () => {
    const confirm = window.confirm(
      "Are you sure? This will free all workers and lock attendance."
    );
    if (!confirm) return;

    try {
      await axiosInstance.post(
        `/projects/${id}/complete`
      );

      toast.success("Project completed");
      setProject(prev => ({ ...prev, status: "Completed" }));

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosInstance.get(`/projects/${id}`);
        console.log(res);

        if (res.status === 200) {
          setProject(res.data.project);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching project");
        setLoading(false);
      }
    };
    fetchProject();

    // set the socket connection
    socketRef.current = io("http://localhost:8080", {
      transports: ['websocket']
    });
    socketRef.current.emit("join", {
      projectId: id
    });

    // listen for report:new event
    socketRef.current.on("report:new", (data) => {
      console.log("New report received:", data);
      // update the project state with the new report
      setProject((prevData) => {
        if (!prevData) return prevData;
        // Prevent duplicate reports by checking _id
        if (
          prevData.reports.some(
            (report) => report._id === data.newReport._id
          )
        ) {
          return prevData;
        }
        return {
          ...prevData,
          reports: [
            ...prevData.reports,
            {
              ...data.newReport,
              siteEngineerId: {
                ...data.newReport.siteEngineerId,
                name: data.siteEngName
              }
            }
          ]
        };

      });
      toast.info(`New report received: ${data.projectTitle}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  console.log(project)
  if (loading) return <CircularProgress />;

  // Safe checks for when project is not loaded due to error
  if (!project) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <ContractorNavbar />
        <Box className="container py-5">
          <Typography variant="h6" color="error">
            {t("project.unable_load")}
          </Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9fafb",
      }}
    >
      <ContractorNavbar />

      <Box className="container py-5">
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t("project.project_overview")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("project.project_overview_desc")}
          </Typography>
        </Box>

        {/* PROJECT INFO CARD */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 4,
            mb: 5,
          }}
        >
          {/* LEFT: DETAILS */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              p: 4,
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {project.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {project.description}
            </Typography>

            <Box sx={{ display: "grid", rowGap: 1 }}>
              <Typography variant="body2">
                <strong>{t("project.status")}:</strong>{" "}
                <span
                  className={`badge ${project.status === "Completed"
                    ? "bg-success"
                    : "bg-warning text-dark"
                    }`}
                >
                  {project.status}
                </span>
              </Typography>

              <Typography variant="body2">
                <strong>{t("project.start_date")}:</strong>{" "}
                {new Date(project.startDate).toLocaleDateString()}
              </Typography>

              <Typography variant="body2">
                <strong>{t("project.end_date")}:</strong>{" "}
                {new Date(project.endDate).toLocaleDateString()}
              </Typography>

              <Typography variant="body2">
                <strong>{t("project.contractor")}:</strong>{" "}
                {project.contractor?.name || "N/A"}
              </Typography>

              <Typography variant="body2">
                <strong>{t("project.site_engineer")}:</strong>{" "}
                {project.siteEngineer?.name || "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* RIGHT: ACTIONS */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              p: 4,
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "fit-content",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {t("project.actions")}
            </Typography>

            <Button
              variant="contained"
              onClick={() => {
                if (!canAccess("attendance")) {
                  toast.error("Upgrade to Business Plan to unlock Attendance.");
                  return;
                }
                navigate(`/contractor/projects/${id}/attendance`);
              }}
              sx={{
                position: "relative",
                opacity: canAccess("attendance") ? 1 : 0.6
              }}
            >
              {t("project.view_attendance")}

              {!canAccess("attendance") && (
                <LockIcon
                  fontSize="small"
                  sx={{
                    ml: 1,
                    fontSize: 18,
                    color: "#ff9800"
                  }}
                />
              )}
            </Button>

            {project.status === "Ongoing" && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (!canAccess("assignWorkers")) {
                      toast.error("Upgrade to Business Plan to unlock Worker Assignment.");
                      return;
                    }
                    navigate(`/contractor/projects/${id}/assign-workers`);
                  }}
                  sx={{
                    position: "relative",
                    opacity: canAccess("assignWorkers") ? 1 : 0.6
                  }}
                >
                  {t("project.assign_workers")}

                  {!canAccess("assignWorkers") && (
                    <LockIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#ff9800"
                      }}
                    />
                  )}
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCompleteProject}
                >
                  {t("project.mark_completed")}
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/contractor/projects/${id}/inventory`)
              }
            >
              {t("project.view_inventory")}
            </Button>

            {project.status === "Completed" && (
              <Typography color="error" variant="body2">
                {t("project.project_locked")}
              </Typography>
            )}

            <Box sx={{ position: "relative" }}>
              {!canAccess("chat") ? (
                <Button
                  variant="outlined"
                  sx={{
                    opacity: 0.6,
                    position: "relative"
                  }}
                  onClick={() =>
                    toast.error("Upgrade to Business Plan to unlock Chat.")
                  }
                >
                  Chat
                  <LockIcon
                    fontSize="small"
                    sx={{
                      ml: 1,
                      fontSize: 16,
                      color: "#ff9800"
                    }}
                  />
                </Button>
              ) : (
                <ChatModal projectId={id} />
              )}
            </Box>
          </Box>
        </Box>

        {/* REPORTS SECTION */}

        {!canAccess("reports") ? (

          <Box
            sx={{
              mt: 4,
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              border: "1px dashed #ddd",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              🔒 {t("project.reports")}
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              Upgrade to Business Plan to unlock Reports feature.
            </Typography>

          </Box>

        ) : <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {t("project.reports")}
          </Typography>

          {Array.isArray(project.reports) && project.reports.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t("project.no_reports")}
            </Typography>
          )}

          <Box sx={{ display: "grid", gap: 3, mt: 3 }}>
            {Array.isArray(project.reports) &&
              project.reports.map((report) => (
                <Box
                  key={report._id}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "14px",
                    p: 3,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography fontWeight={600}>
                    {t("project.report_by", { name: report.siteEngineerId?.name || "Unknown" })}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>{t("project.work_done")}:</strong> {report.workDone}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>{t("project.issues")}:</strong> {report.issuesFound}
                  </Typography>

                  {report.contractorStatus && (
                    <Box sx={{ mt: 1 }}>
                      <span className="badge bg-warning">
                        {report.contractorStatus}
                      </span>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 2,
                      opacity: canAccess("reports") ? 1 : 0.6,
                      position: "relative"
                    }}
                    onClick={() => {
                      if (!canAccess("reports")) {
                        toast.error("Upgrade to Business Plan to unlock Reports.");
                        return;
                      }
                      navigate(`/contractor/view-report/${report._id}`);
                    }}
                  >
                    {t("project.view_report")}

                    {!canAccess("reports") && (
                      <LockIcon
                        fontSize="small"
                        sx={{
                          ml: 1,
                          fontSize: 16,
                          color: "#ff9800"
                        }}
                      />
                    )}
                  </Button>

                </Box>
              ))}
          </Box>
        </Box>}

      </Box>

      <Footer />
    </Box>
  );

}
