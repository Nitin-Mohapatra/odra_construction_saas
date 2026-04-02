import React from 'react'
import { useTheme } from "@emotion/react";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Typography, Divider, IconButton } from "@mui/material";

export default function SocialBar() {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                justifyContent: { xs: "center", md: "flex-start" },
            }}
        >
            <IconButton
                href="https://instagram.com"
                target="_blank"
                sx={{
                    color: "text.secondary",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                        color: "#E1306C", // insta color
                        borderColor: "#E1306C",
                        backgroundColor: "rgba(225,48,108,0.08)",
                    },
                }}
            >
                <InstagramIcon />
            </IconButton>

            <IconButton
                href="https://wa.me/916370627088"
                target="_blank"
                sx={{
                    color: "text.secondary",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                        color: "#25D366", // whatsapp
                        borderColor: "#25D366",
                        backgroundColor: "rgba(37,211,102,0.08)",
                    },
                }}
            >
                <WhatsAppIcon />
            </IconButton>
        </Box>
    )
}
