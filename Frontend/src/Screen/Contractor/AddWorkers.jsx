import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContractorNavbar from '../../Components/ContractorNavbar';
import Footer from '../../Components/Footer';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import workerImage from '../../assets/pic.png';
import { useTranslation } from "react-i18next";

export default function AddWorkers() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error('Please enter a worker name');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post(
                '/workers',
                {
                    name: name.trim(),
                    phone: phone.trim() || undefined
                }
            );

            if (res.status === 201) {
                toast.success('Worker added successfully!');
                setName('');
                setPhone('');
                // Optionally navigate back or refresh
                // navigate(-1);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Failed to add worker';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
            {/* LEFT IMAGE – DESKTOP ONLY */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                width: "45%",
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
      
            {/* RIGHT FORM */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: { xs: 2, md: 5 },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: "#1e1e1e" }}
                >
                  {t("workers.add_worker")}
                </Typography>
      
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("workers.add_worker_desc")}
                </Typography>
      
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label={t("workers.worker_name")}
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                  />
      
                  <TextField
                    fullWidth
                    label={t("workers.phone_optional")}
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    margin="normal"
                    disabled={loading}
                  />
      
                  <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                      sx={{
                        backgroundColor: "#f5a623",
                        color: "#000",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#e0941d",
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : t("workers.add_worker_btn")}
                    </Button>
      
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                      sx={{
                        borderColor: "#f5a623",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      {t("workers.cancel")}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Box>
          </Box>
      
          <Footer />
        </>
      );
      
}

