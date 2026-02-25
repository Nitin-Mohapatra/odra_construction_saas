import React from 'react'
import Navbar from '../Components/Navbar'
import Caroucell from '../Components/Caroucell'
import { Grid, Box, Typography } from "@mui/material";
import Footer from '../Components/Footer';
import secImg from "../assets/sec-img.jpg"
import secBg from "../assets/sec-4bg.jpg"
import ImgSlider from '../Components/ImgSlider';
import vd from '../assets/homepage-hero-animation.mp4'

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* main should grow */}
      <main style={{ flexGrow: 1 }}>

        {/* ===== HERO SECTION (Exact Design) ===== */}
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
                Construction Management Software
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "48px", md: "90px" },
                  lineHeight: 1.05,
                  color: "#000",
                }}
              >
                Together, we can <br /> build it all
              </Typography>
            </Grid>

            {/* RIGHT SIDE
            <Grid item xs={12} md={12}>
              <Typography
                sx={{
                  fontSize: "20px",
                  lineHeight: 1.6,
                  mb: 4,
                  fontWeight: 500,
                }}
              >
                Manage your construction projects from preconstruction to closeout with the insights you need to maximise safety, efficiency, and return.
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Box
                  component="button"
                  sx={{
                    backgroundColor: "#ff5a00",
                    color: "#fff",
                    border: "none",
                    px: 4,
                    py: 1.8,
                    fontSize: "18px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#e14f00",
                    },
                  }}
                >
                  Learn more
                </Box>

                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  See it in action →
                </Typography>
              </Box>
            </Grid> */}

          </Grid>
        </Box>

        {/* ===== KEEP EXISTING CAROUSEL ===== */}
        <Caroucell />

        {/* ===== EXISTING VIDEO SECTION ===== */}
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
            variant="h4"
            sx={{
              textAlign: "center",
              display: { xs: "none", sm: "block" },
              fontWeight: "bold",
            }}
          >
            We are on an Unstoppable Mission to Digitise The <br /> Indian Construction Industry
          </Typography>

          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              display: { xs: "block", sm: "none" },
              fontWeight: "bold",
            }}
          >
            Digitising Indian Construction
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
