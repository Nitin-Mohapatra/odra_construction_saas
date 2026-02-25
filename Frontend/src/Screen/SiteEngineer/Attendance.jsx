import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SiteEngineerNavbar from "../../Components/SiteEngineerNavbar";
import Footer from "../../Components/Footer";
import {
  Box,
  Typography,
  Paper,
  Button,
  Switch,
  CircularProgress,
  TextField
} from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

export default function Attendance() {
  const { id: projectId } = useParams();

  const [project, setProject] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  /* --------------------------------
     Fetch project, workers & attendance
  --------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch project
        const projectRes = await axiosInstance.get(`/projects/${projectId}`);
        setProject(projectRes.data.project);

        // 2️⃣ Fetch workers assigned to this project
        const workerRes = await axiosInstance.get(`/attendance/workers/${projectId}`);
        setWorkers(workerRes.data.workers);

        // 3️⃣ Fetch attendance for selected date
        const attendanceRes = await axiosInstance.get(`/attendance/${projectId}/${date}`);

        // 4️⃣ Attendance exists → hydrate from DB
        if (attendanceRes.data.attendance) {
          const existing = {};
          attendanceRes.data.attendance.records.forEach(rec => {
            existing[rec.workerId._id] = rec.status;
          });
          setAttendance(existing);
        }
        // 5️⃣ Attendance does NOT exist → default all to absent
        else {
          const defaults = {};
          workerRes.data.workers.forEach(w => {
            defaults[w._id] = "absent";
          });
          setAttendance(defaults);
        }

      } catch (err) {
        toast.error("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, date]);

  /* --------------------------------
     Toggle present / absent
  --------------------------------- */
  const toggleAttendance = (workerId) => {
    setAttendance(prev => ({
      ...prev,
      [workerId]: prev[workerId] === "present" ? "absent" : "present"
    }));
  };

  

  /* --------------------------------
     Submit attendance
  --------------------------------- */
  const submitAttendance = async () => {
    if (project.status === "Completed") {
      toast.error("Attendance is locked for completed projects");
      return;
    }

    try {
      const records = Object.keys(attendance).map(workerId => ({
        workerId,
        status: attendance[workerId]
      }));

        await axiosInstance.post("/attendance/mark", { projectId, date, records });

      toast.success("Attendance saved successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save attendance"
      );
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <SiteEngineerNavbar />
  
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
      >
        {/* HEADER */}
        <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: "#1e1e1e" }}
          >
            Attendance
          </Typography>
  
          <Typography variant="body2" color="text.secondary">
            Mark and manage worker attendance for the selected date.
          </Typography>
        </Box>
  
        {/* DATE PICKER */}
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            mb: 3,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <TextField
            type="date"
            value={date}
            inputProps={{
              min: project?.startDate?.split("T")[0],
              max:
                project?.status === "Completed"
                  ? project?.endDate?.split("T")[0]
                  : new Date().toISOString().split("T")[0],
            }}
            disabled={project?.status === "Completed"}
            onChange={(e) => setDate(e.target.value)}
          />
        </Box>
  
        {/* ATTENDANCE LIST */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: 900,
            mx: "auto",
            p: { xs: 2, md: 3 },
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          {workers.length === 0 && (
            <Typography color="text.secondary">
              No workers assigned to this project.
            </Typography>
          )}
  
          {workers.map((worker) => (
            <Box
              key={worker._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                borderBottom: "1px solid #f1f1f1",
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>
                {worker.name}
              </Typography>
  
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color={
                    attendance[worker._id] === "present"
                      ? "success.main"
                      : "text.secondary"
                  }
                >
                  {attendance[worker._id] === "present"
                    ? "Present"
                    : "Absent"}
                </Typography>
  
                <Switch
                  checked={attendance[worker._id] === "present"}
                  onChange={() => toggleAttendance(worker._id)}
                  color="success"
                  disabled={project.status === "Completed"}
                />
              </Box>
            </Box>
          ))}
  
          {/* SAVE BUTTON / STATUS */}
          {project.status !== "Completed" && workers.length > 0 && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3 }}
              onClick={submitAttendance}
            >
              Save Attendance
            </Button>
          )}
  
          {project.status === "Completed" && (
            <Typography color="error" sx={{ mt: 3 }}>
              Project is completed. Attendance is read-only.
            </Typography>
          )}
        </Paper>
      </Box>
  
      <Footer />
    </>
  );
  
}
