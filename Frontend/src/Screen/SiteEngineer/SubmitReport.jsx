import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import SiteEngineerNavbar from "../../Components/SiteEngineerNavbar";
import Footer from "../../Components/Footer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";

export default function SubmitReport() {
    const { t } = useTranslation();
    const [data, setData] = useState({
      workDone: "",
      issuesFound: "",
    });
  
    const { id } = useParams();
    const navigate = useNavigate();
  
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
                variant="h5"
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                {t("project.submit_report")}
              </Typography>
    
              <Typography
                variant="body2"
                color="text.secondary"
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
                <button className="btn btn-success">
                  {t("project.submit")}
                </button>
              </Box>
            </form>
          </Paper>
        </Box>
    
        <Footer />
      </div>
    );
    
  }
  
