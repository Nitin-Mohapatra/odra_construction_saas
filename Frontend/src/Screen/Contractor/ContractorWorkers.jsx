import React,{useState,useEffect} from 'react'
import ContractorNavbar from '../../Components/ContractorNavbar'
import Footer from '../../Components/Footer'
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axiosInstance from '../../utils/axiosInstance';
import workerImage from '../../assets/pic.png';
import { useTranslation } from "react-i18next";

export default function ContractorWorkers() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchWorkers = async ()=>{
            try{
                const res = await axiosInstance.get('/workers')
                if(res.status === 200){
                    setWorkers(res.data.workers)
                    setLoading(false)
                }
            }catch(err){
                console.error(err)
                toast.error('Failed to fetch workers')
                setLoading(false)
            }
        }
        fetchWorkers()
    },[])

    return (
        <>
          <ContractorNavbar />
      
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              backgroundColor: "#f9fafb",
            }}
          >
            {/* LEFT IMAGE (DESKTOP ONLY) */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                width: "40%",
                minHeight: "100vh",
              }}
            >
              <img
                src={workerImage}
                alt={workerImage}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
      
            {/* RIGHT CONTENT */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, md: 5 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: "900px",
                  p: { xs: 3, md: 4 },
                  borderRadius: "18px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: "#1e1e1e" }}
                >
                  {t("workers.workers")}
                </Typography>
      
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("workers.workers_desc")}
                </Typography>
      
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                          <TableCell sx={{ fontWeight: 600 }}>{t("workers.worker_name")}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{t("workers.phone")}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{t("workers.status")}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                          {t("workers.assigned_project")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
      
                      <TableBody>
                        {workers.map((worker) => (
                          <TableRow
                            key={worker._id}
                            hover
                            sx={{
                              transition: "0.2s",
                              "&:hover": {
                                backgroundColor: "#f9fafb",
                              },
                            }}
                          >
                            <TableCell>{worker.name}</TableCell>
                            <TableCell>{worker.phone}</TableCell>
                            <TableCell>{worker.status}</TableCell>
                            <TableCell>
                              {worker.currentProjectId
                                ? worker.currentProjectId.title
                                : t("workers.not_assigned")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/contractor/add-worker')}
                  sx={{
                    mt: 2,
                    backgroundColor: "#f5a623",
                    color: "#000",
                    fontWeight: 600,
                  }}
                >
                 {t("workers.add_worker_btn")}
                </Button>
              </Paper>
            </Box>
          </Box>
      
          <Footer />
        </>
      );
      
}
