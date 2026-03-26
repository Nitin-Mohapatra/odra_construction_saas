import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #eee",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        p: 2,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)"
        }
      }}
    >
      <CardContent>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body2" color="#777">
            {title}
          </Typography>

          <Box sx={{ color: "#ffcc00" }}>
            {icon}
          </Box>
        </Box>

        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>

      </CardContent>
    </Card>
  );
}