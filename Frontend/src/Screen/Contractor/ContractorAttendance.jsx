import React, { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../Components/Footer";
import {
    Box,
    Typography,
    Paper,
    TextField,
    CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";
import {io} from "socket.io-client"
import ContractorNavbar from "../../Components/ContractorNavbar";
import axiosInstance from "../../utils/axiosInstance";

export default function ContractorAttendance() {
    const { id: projectId } = useParams();
    const [date, setDate] = useState("");
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const socketRef = useRef(null);

    // fetch attendance
    const fetchAttendance = async () => {
        if (!date) return;

        try {
            const res = await axiosInstance.get(`/attendance/${projectId}/${date}`);

            setProject(res.data.attendance.projectId);
            setAttendance(res.data.attendance);
            setLoading(false);
        } catch (err) {
            setAttendance({});
            setLoading(false);
            toast.error("Failed to fetch attendance");
        }
    }

    // make the socket connection one time
    useEffect(()=>{
        socketRef.current = io("http://localhost:8080",{
            transports:["websocket"]
        })
        return ()=> socketRef.current.disconnect();
    },[projectId]);

    useEffect(()=>{
        socketRef.current.emit("join",{projectId});
        socketRef.current.on("attendance:updated",(data)=>{
            if(data.date === date){
                toast.success("Attendance has been marked");
                fetchAttendance()
            }
        })
        return ()=> socketRef.current.off("attendance:updated");
    },[date]);


    return (
        <>
          <ContractorNavbar />
      
          <Box
            sx={{
              minHeight: "100vh",
              backgroundColor: "#f9fafb",
              py: 5,
            }}
          >
            <Box className="container">
              {/* HEADER */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Attendance Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View daily attendance marked for this project
                </Typography>
              </Box>
      
              {/* DATE SELECT */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: "16px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Select Date
                </Typography>
      
                <TextField
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={fetchAttendance}
                  sx={{ mt: 1 }}
                  inputProps={{
                    min: project?.startDate?.split("T")[0],
                    max:
                      project?.status === "Completed"
                        ? project?.endDate?.split("T")[0]
                        : new Date().toISOString().split("T")[0],
                  }}
                />
              </Paper>
      
              {/* ATTENDANCE LIST */}
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              )}
      
              {!loading && attendance && attendance.records && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Worker Attendance
                  </Typography>
      
                  {attendance.records.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No attendance records found for this date.
                    </Typography>
                  )}
      
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                    {attendance.records.map((rec) => (
                      <Box
                        key={rec.workerId._id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <Typography fontWeight={500}>
                          {rec.workerId.name}
                        </Typography>
      
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color:
                              rec.status === "present"
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {rec.status === "present" ? "Present" : "Absent"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>
          </Box>
      
          <Footer />
        </>
      );
      
}