import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function Services() {
  return (
    <Box>
      <Navbar />

      {/* HERO SECTION */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
          px: { xs: 3, md: 8 },
          py: { xs: 8, md: 12 },
        }}
      >
        {/* HEADER */}
        <Box sx={{ maxWidth: 900, mx: "auto", textAlign: "center", mb: 10 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ color: "#0f172a", mb: 2 }}
          >
            Powerful Tools for Modern Construction Teams
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#6b7280", maxWidth: 700, mx: "auto" }}
          >
            Manage labour, projects, attendance, inventory and communication —
            all from one intelligent platform built for efficiency.
          </Typography>
        </Box>

        {/* SERVICES GRID */}
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {/* Attendance */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle}>
              <IconWrapper>
                <EventAvailableIcon />
              </IconWrapper>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Attendance Management
              </Typography>

              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Track worker attendance digitally with real-time monitoring and accurate reporting.
              </Typography>
            </Paper>
          </Grid>

          {/* Project */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle}>
              <IconWrapper>
                <AssignmentTurnedInIcon />
              </IconWrapper>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Project Management
              </Typography>

              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Assign tasks, track progress, manage reports and keep projects on schedule.
              </Typography>
            </Paper>
          </Grid>

          {/* Chat */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle}>
              <IconWrapper>
                <ChatBubbleOutlineIcon />
              </IconWrapper>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Real-Time Chat
              </Typography>

              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Instant communication between contractors and site engineers to reduce delays.
              </Typography>
            </Paper>
          </Grid>

          {/* Labour */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle}>
              <IconWrapper>
                <GroupIcon />
              </IconWrapper>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Labour Management
              </Typography>

              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Add workers, assign them to projects and optimize workforce utilization efficiently.
              </Typography>
            </Paper>
          </Grid>

          {/* Inventory */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={cardStyle}>
              <IconWrapper>
                <Inventory2Icon />
              </IconWrapper>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Inventory Management
              </Typography>

              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Add materials, track usage, monitor stock levels and control project costs in real-time.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* CTA SECTION */}
        <Box
          sx={{
            mt: 12,
            textAlign: "center",
            backgroundColor: "#ffffff",
            borderRadius: 3,
            p: { xs: 4, md: 6 },
            maxWidth: 900,
            mx: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Ready to streamline your construction workflow?
          </Typography>

          <Typography sx={{ color: "#6b7280", mb: 4 }}>
            Start managing attendance, projects, labour and inventory more efficiently today.
          </Typography>

          <Button
            component={Link}
            to="/Login"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#111827",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#000",
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

/* ---------- STYLES ---------- */

const cardStyle = {
  p: 4,
  borderRadius: 3,
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  height: "100%",
  transition: "all 0.25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    borderColor: "#d1d5db",
  },
};

const IconWrapper = ({ children }) => (
  <Box
    sx={{
      width: 44,
      height: 44,
      borderRadius: 2,
      backgroundColor: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2,
      color: "#111827",
    }}
  >
    {children}
  </Box>
);
