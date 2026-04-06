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
import { useTheme } from '@emotion/react';

export default function Home() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* main should grow */}
      <main style={{ flexGrow: 1 }}>

        {/* ===== HERO SECTION===== */}
        <Box
          sx={{
            backgroundColor: "secondary.main",   
            px: { xs: 3, md: 10 },
            py: { xs: 5, md: 6 },
          }}
        >
          <Grid container spacing={6} alignItems="center">

            {/* LEFT SIDE */}
            <Grid item xs={12} md={12}>
              <Typography
                variant='body1'
                sx={{
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  mb: 3,
                  color:"text.secondary"
                }}
              >
                <span style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#83C441",
                  marginRight: "10px",
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                }} />
                  {t("dashboard.home.tagline")}
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  color: "text.secondary",
                }}
              >
                {/* {t("dashboard.home.hero_line_1")} <br />
                {t("dashboard.home.hero_line_2")} */}
                From Site To Dashboard
              </Typography>
            </Grid>


          </Grid>
        </Box>

        {/* =====  CAROUSEL ===== */}
        <Caroucell />

     
        <Box className="mx-1">
          <Typography
            variant='h2'
            className='text-center my-3'
            >
            Trusted By 
          </Typography>
          <ImgSlider />
        </Box>

      </main>
      <Footer />
    </div>
  )
}
