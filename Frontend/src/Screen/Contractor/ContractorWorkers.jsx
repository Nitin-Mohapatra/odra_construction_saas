import React, { useState, useEffect } from "react";
import ContractorNavbar from "../../Components/ContractorNavbar";
import { Box, Typography, Paper, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axiosInstance from "../../utils/axiosInstance";
import workerImage from "../../assets/Worker.png";
import { useTranslation } from "react-i18next";

export default function ContractorWorkers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axiosInstance.get("/workers");
        if (res.status === 200) setWorkers(res.data.workers || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch workers");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="workers-page" style={{ "--workers-art": `url("${workerImage}")` }}>
      <ContractorNavbar />
      <main className="workers-layout">
        <div className="workers-art-panel" role="img" aria-label="Site engineer at a construction project" />
        <section className="workers-content-panel">
          <Paper className="workers-card" elevation={0}>
            <Typography component="h1" className="workers-title">{t("workers.workers")}</Typography>
            <Typography component="p" className="workers-subtitle">{t("workers.workers_desc")}</Typography>
            {loading ? (
              <Box className="workers-loading"><CircularProgress sx={{ color: "#F97316" }} /></Box>
            ) : (
              <TableContainer className="workers-table-container">
                <Table className="workers-table" size="small" aria-label="Workers">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("workers.worker_name")}</TableCell>
                      <TableCell>{t("workers.phone")}</TableCell>
                      <TableCell>{t("workers.status")}</TableCell>
                      <TableCell>{t("workers.assigned_project")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workers.map((worker) => {
                      const assigned = Boolean(worker.currentProjectId);
                      return (
                        <TableRow key={worker._id}>
                          <TableCell>{worker.name}</TableCell>
                          <TableCell>{worker.phone || "—"}</TableCell>
                          <TableCell><span className={`worker-status ${assigned ? "is-assigned" : "is-free"}`}>{assigned ? "Assigned" : "Free"}</span></TableCell>
                          <TableCell>{worker.currentProjectId?.title || t("workers.not_assigned")}</TableCell>
                        </TableRow>
                      );
                    })}
                    {workers.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="workers-empty-cell">No workers yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Button className="workers-add-button" variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/contractor/add-worker")}>
              {t("workers.add_worker_btn")}
            </Button>
          </Paper>
        </section>
      </main>
    </div>
  );
}
