import React from 'react'
import Navbar from '../Components/Navbar'
import Caroucell from '../Components/Caroucell'
import { Grid, Box, Typography } from "@mui/material";
import Footer from '../Components/Footer';
import secImg from "../assets/sec-img.jpg"
import secBg from "../assets/sec-4bg.jpg"
import ImgSlider from '../Components/ImgSlider';
import vd from '../assets/homepage-hero-animation.mp4'
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* main should grow */}
      <main style={{ flexGrow: 1 }}>

        {/* ===== HERO SECTION===== */}
        <Box
          sx={{
            backgroundColor: "#cfc3b7",   // exact beige tone
            px: { xs: 3, md: 10 },
            py: { xs: 8, md: 6 },
          }}
        >
          <Grid container spacing={6} alignItems="center">

            {/* LEFT SIDE */}
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontSize: "12px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                <span style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#ff5a00",
                  marginRight: "10px",
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                }} />
                  {t("dashboard.home.tagline")}
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "48px", md: "90px" },
                  lineHeight: 1.05,
                  color: "#000",
                }}
              >
                {/* {t("dashboard.home.hero_line_1")} <br />
                {t("dashboard.home.hero_line_2")} */}
                From Site To Dashboard
              </Typography>
            </Grid>

            {/* RIGHT SIDE */}

          </Grid>
        </Box>

        {/* =====  CAROUSEL ===== */}
        <Caroucell />

        {/* =====  VIDEO SECTION ===== */}
        <Box sx={{ my: 5 }}>
          <video
            src={vd}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/homepage-hero-animation.mp4';
            }}
          />
        </Box>

        {/* ===== REST REMAINS SAME ===== */}
        <Box>
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              display: { xs: "none", sm: "block" },
            }}
          >
            {/* {t("dashboard.home.mission_short")} */}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              display: { xs: "block", sm: "none" },
            }}
          >
            Intelligent Solutions for Modern Construction
          </Typography>

          <Box>
            <Box component="img" src={secBg} sx={{ width: "100%" }} />
          </Box>

          <Box className="mx-1">
            <ImgSlider />
          </Box>
        </Box>

      </main>
      <Footer />
    </div>
  )
}
