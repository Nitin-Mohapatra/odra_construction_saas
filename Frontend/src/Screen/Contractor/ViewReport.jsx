import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ContractorNavbar from "../../Components/ContractorNavbar";
import Footer from "../../Components/Footer";
import { io } from "socket.io-client";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


export default function ViewReport() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState({});
    const [comment, setComment] = useState("");
    const [reviewed, setReviewed] = useState(false);
    const socketRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        socketRef.current = io("http://localhost:8080", {
            transports: ['websocket']
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }, [])

    useEffect(() => {

        // fetching the report
        const fetchReport = async () => {
            try {
                const res = await axiosInstance.get(`/reports/${id}`);
                setReport(res.data.report);
                console.log(res.data.report);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }
        fetchReport();

    }, [id]);

    useEffect(() => {
        if (!report.projectId) return;

        socketRef.current.emit("join", {
            projectId: report.projectId
        });

        
    }, [report.projectId])

    const handleAction = async (status) => {
        try {
            const res = await axiosInstance.post(
                `/reports/${id}/review`,
                {
                    contractorComment: comment,
                    contractorStatus: status
                }
            )
            setReviewed(true);

        } catch (e) {
            console.log(e);
        }
    }

    if (loading) return <CircularProgress />;
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
      
          {/* HEADER */}
          <Box className="container py-5">
            <Typography variant="h4" fontWeight={700} gutterBottom>
              View Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review site engineer submission and take action
            </Typography>
          </Box>
      
          {/* PROJECT INFO */}
          <Box className="container mb-4">
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                p: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Project Information
              </Typography>
      
              <Typography variant="body2">
                <strong>Project:</strong> {report.projectId?.title}
              </Typography>
              <Typography variant="body2">
                <strong>Project ID:</strong> {report.projectId?._id}
              </Typography>
              <Typography variant="body2">
                <strong>Created At:</strong>{" "}
                {new Date(report.createdAt).toDateString()}
              </Typography>
            </Box>
          </Box>
      
          {/* SITE ENGINEER INFO */}
          <Box className="container mb-4">
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                p: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Site Engineer Details
              </Typography>
      
              <Typography variant="body2">
                <strong>Name:</strong> {report.siteEngineerId?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {report.siteEngineerId?.email}
              </Typography>
            </Box>
          </Box>
      
          {/* REPORT CONTENT */}
          <Box className="container mb-4">
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                p: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Report Details
              </Typography>
      
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Work Done:</strong> {report.workDone}
              </Typography>
      
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Issues Found:</strong> {report.issuesFound}
              </Typography>
      
              {/* IMAGES */}
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Uploaded Images
              </Typography>
      
              {report?.images && report.images.length > 0 ? (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {report.images.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Report ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No images uploaded.
                </Typography>
              )}
            </Box>
          </Box>
      
          {/* ACTION SECTION */}
          <Box className="container mb-5">
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                p: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Contractor Review
              </Typography>
      
              {!reviewed ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Comment"
                    multiline
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
      
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAction("approved")}
                    >
                      Approve
                    </Button>
      
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAction("declined")}
                    >
                      Decline
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography color="success.main">
                  Report has been reviewed.
                </Typography>
              )}
            </Box>
          </Box>
      
          <Footer />
        </Box>
      );
      
}
