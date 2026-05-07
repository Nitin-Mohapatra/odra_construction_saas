import React, { useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import SiteEngineerNavbar from "../../Components/SiteEngineerNavbar";
import Footer from "../../Components/Footer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";
import { canAccess } from "../../utils/subscription";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

export default function SubmitReport() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const [data, setData] = useState({
    workDone: "",
    issuesFound: "",
  });

  // checking for access and setting io connection 
  useEffect(() => {
    if (!canAccess("reports")) {
      toast.error("Upgrade to Business Plan to unlock Report Submission.");
      navigate("/site-engineer/projects");
      return;
    }
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"]
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, []);

  const { id } = useParams();

  useEffect(() => {
    // Check if socket is initialized before using it
    if (!socketRef.current || !id) return;

    // join the room 
    socketRef.current.emit("join", { projectId: id });

    socketRef.current.on("project:deleted", (data) => {
      toast.info("Project has been deleted");
      navigate(`/site-engineer/projects`);
    });

  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axiosInstance.post(
      "/reports",
      { projectId: id, workDone: data.workDone, issuesFound: data.issuesFound }
    );

    navigate(-1);
  };

  // recording function
  const startrecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        })
        console.log("Audio Blob = ", audioBlob);

        // temporary testing
        console.log(
          "Audio URL =",
          URL.createObjectURL(audioBlob)
        );
      };

      mediaRecorder.start();
      setIsRecording(true);


    } catch (error) {
      console.error("Mic Error =", error);
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <SiteEngineerNavbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: { xs: 3, md: 4 },
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          {/* HEADER */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h1"
              sx={{ mb: 0.5 }}
            >
              {t("project.submit_report")}
            </Typography>

            <Typography
              variant="body2"

            >
              {t("project.report_date_label", {
                date: new Date().toLocaleDateString()
              })}
            </Typography>
          </Box>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <TextField
              label={t("project.work_done")}
              name="workDone"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              onChange={handleChange}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              {!isRecording ? (
                <Button
                  variant="outlined"
                  onClick={startRecording}
                >
                  🎤 Start Recording
                </Button>
              ) : (
                <Button
                  color="error"
                  variant="contained"
                  onClick={stopRecording}
                >
                  ⏹ Stop Recording
                </Button>
              )}
            </Box>

            <TextField
              label={t("project.issues")}
              name="issuesFound"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              onChange={handleChange}
            />



            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  color: "#000",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                {t("project.submit")}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>

      <Footer />
    </div>
  );

}

