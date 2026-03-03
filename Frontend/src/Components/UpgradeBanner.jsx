import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UpgradeBanner() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "static",
        top: 0,
        width: "100%",
        background: "linear-gradient(90deg, #ff8c00, #ff3d00)",
        color: "#fff",
        py: 1, // thin height
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: { xs: "13px", md: "14px" },
        }}
      >
        You’re on the <strong>Free Plan</strong> — Upgrade to unlock premium features.
      </Typography>

      <Button
        size="small"
        variant="contained"
        onClick={() => navigate("/pricing")}
        sx={{
          backgroundColor: "#fff",
          color: "#ff3d00",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "20px",
          px: 2.5,
          py: 0.5,
          minWidth: "auto",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        Upgrade
      </Button>
    </Box>
  );
}