import React from "react";
import { Box, Typography as MuiTypography, Button, Card, CardContent } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import { useNavigate } from "react-router-dom";
import { getSubscription } from "../utils/subscription";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import homeBg from "../assets/Home bg image.png";

function Typography({ children, className = "", ...props }) {
  if (typeof children === "string") {
    const featureMatch = children.trim().match(/^(✅|❌|🤖|🎤|🎙️?)\s+(.+)$/u);
    if (featureMatch) {
      const [, marker, label] = featureMatch;
      const specialIcon = marker === "🤖"
        ? <AutoAwesomeOutlinedIcon />
        : marker === "🎤" || marker.startsWith("🎙")
          ? <KeyboardVoiceOutlinedIcon />
          : null;
      return (
        <MuiTypography {...props} className={`pricing-feature ${className}`}>
          {specialIcon ? (
            <span className="pricing-special-feature-icon">{specialIcon}</span>
          ) : (
            <span className={`pricing-feature-mark ${marker === "✅" ? "is-included" : "is-excluded"}`}>
              {marker === "✅" ? <CheckRoundedIcon /> : <CloseRoundedIcon />}
            </span>
          )}
          <span>{label}</span>
        </MuiTypography>
      );
    }
  }
  return <MuiTypography {...props} className={className}>{children}</MuiTypography>;
}

export default function Pricing() {
  const navigate = useNavigate();
  const sub = getSubscription();

  const currentPlan = sub?.plan;
  const currentStatus = sub?.status;
  const currentTenure = sub?.tenure;

  const handlePayment = async (tenure) => {
    try {

      const token = localStorage.getItem("token");

      // 🔴 Not logged in
      if (!token) {
        toast.info("Please signup to upgrade your plan.");
        navigate("/signup");
        return;
      }


      const res = await axiosInstance.post(
        "/subscription/create-order",
        { tenure }
      );

      const { order, key } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "ODRABUILD",
        description: "Business Plan Subscription",
        order_id: order.id,
        handler: async function (response) {
          await axiosInstance.post(
            "/subscription/verify-payment",
            {
              ...response,
              tenure
            }
          );

          // refresh subscription
          const subRes = await axiosInstance.get("/subscription/me");
          localStorage.setItem(
            "subscription",
            JSON.stringify(subRes.data)
          );
          toast.success("Subscription upgraded successfully!");
          navigate("/contractor/home");
        },
        theme: {
          color: "#F97316"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="pricing-page">
      <Navbar />
      <Box component="main" className="pricing-main" style={{ "--pricing-art": `url("${homeBg}")` }}>
      <Box className="pricing-content">
      <Typography component="h1" variant="h3" align="center" fontWeight={800} className="pricing-title">
        CHOOSE THE <span>RIGHT PLAN</span>
      </Typography>

      <Typography align="center" color="text.secondary" className="pricing-subtitle">
        Simple, flexible pricing for every stage of your construction business.
      </Typography>

      <div className="container">
        <div className="row g-4 justify-content-center">

          {/* FREE PLAN */}
          <div className="col-12 col-md-4 d-flex">
            <Card
              elevation={3}
              sx={{
                width: "100%",
                borderRadius: 4,
                transition: "0.35s",
                "&:hover": {
                  transform: "translateY(-12px)",
                  boxShadow: 10,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                >
                  Free Plan
                </Typography>

                <Typography
                  variant="h3"
                  color="primary"
                  fontWeight={800}
                  sx={{ my: 3 }}
                >
                  ₹0
                </Typography>

                <Box className="pricing-features" sx={{ mb: 4 }}>
                  <Typography sx={{ mb: 1 }}>✅ 1 Active Project</Typography>
                  <Typography sx={{ mb: 1 }}>✅ Inventory Management</Typography>
                  <Typography sx={{ mb: 1, color: "text.secondary" }}>
                    ❌ Worker Attendance
                  </Typography>
                  <Typography sx={{ mb: 1, color: "text.secondary" }}>
                    ❌ Worker Wages
                  </Typography>
                  <Typography sx={{ mb: 1, color: "text.secondary" }}>
                    ❌ Site Engineer Reports
                  </Typography>
                  <Typography sx={{ mb: 1, color: "text.secondary" }}>
                    ❌ Misc Expenses
                  </Typography>
                  <Typography sx={{ mb: 1, color: "text.secondary" }}>
                    ❌ Team Chat
                  </Typography>
                  <Typography sx={{mb:1, color: "text.secondary" }}>
                    ❌ Export Reports as PDF
                  </Typography>
                  <Typography sx={{ mb: 1 }} className="fw-bold">
                    ❌ AI-Powered Report Analysis
                  </Typography>
                  <Typography className="fw-bold">
                    ❌ AI Voice Report Generator
                  </Typography>
                </Box>

                {currentPlan === "free" ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled
                    sx={{ py: 1.3 }}
                  >
                    CURRENT PLAN
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ py: 1.3 }}
                  >
                    CONTINUE FREE
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

        {/* BUSINESS 6 MONTH */}
          <div className="col-12 col-md-4 d-flex">
            <Card
              elevation={8}
              sx={{
                width: "100%",
                borderRadius: 4,
                border: "2px solid #F97316",
                position: "relative",
                transition: "0.35s",
                "&:hover": {
                  transform: "translateY(-14px)",
                  boxShadow: 14,
                },
              }}
            >
              <Box
                className="pricing-popular"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "#F97316",
                  color: "#fff",
                  px: 2,
                  py: 0.5,
                  borderRadius: 5,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                MOST POPULAR
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                >
                  Business
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  6 Months
                </Typography>

                <Typography
                  variant="h3"
                  color="primary"
                  fontWeight={800}
                  sx={{ my: 3 }}
                >
                  ₹15,000
                </Typography>

                <Box className="pricing-features" sx={{ mb: 4 }}>
                  <Typography sx={{ mb: 1 }}>
                    ✅ Unlimited Projects
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Inventory Management
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Worker Attendance
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Worker Wages
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Site Engineer Reports
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Misc Expenses
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Team Chat
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Export Reports as PDF
                  </Typography>

                  <Typography sx={{ mb: 1 }} className="fw-bold">
                    🤖 AI-Powered Report Analysis
                  </Typography>

                  <Typography className="fw-bold">
                    🎤 AI Voice Report Generator
                  </Typography>
                </Box>

                {currentPlan === "business" &&
                  currentStatus === "active" &&
                  currentTenure === "6m" ? (
                  <Button
                    fullWidth
                    variant="contained"
                    disabled
                    sx={{ py: 1.4 }}
                  >
                    ACTIVE PLAN
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ py: 1.4 }}
                    onClick={() => handlePayment(6)}
                  >
                    ACTIVE PLAN
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

        {/* BUSINESS 1 YEAR */}
          <div className="col-12 col-md-4 d-flex">
            <Card
              elevation={3}
              sx={{
                width: "100%",
                borderRadius: 4,
                transition: "0.35s",
                "&:hover": {
                  transform: "translateY(-12px)",
                  boxShadow: 10,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                >
                  Business
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  1 Year
                </Typography>

                <Typography
                  variant="h3"
                  color="primary"
                  fontWeight={800}
                  sx={{ my: 3 }}
                >
                  ₹34,000
                </Typography>

                <Box className="pricing-features" sx={{ mb: 4 }}>
                  <Typography sx={{ mb: 1 }}>
                    ✅ Unlimited Projects
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Inventory Management
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Worker Attendance
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Worker Wages
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Site Engineer Reports
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Misc Expenses
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Team Chat
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    ✅ Export Reports as PDF
                  </Typography>

                  <Typography sx={{ mb: 1 }} className="fw-bold">
                    🤖 AI-Powered Report Analysis
                  </Typography>

                  <Typography className="fw-bold">
                    🎤 AI Voice Report Generator
                  </Typography>
                </Box>


                {currentPlan === "business" &&
                  currentStatus === "active" &&
                  currentTenure === "12m" ? (
                  <Button
                    fullWidth
                    variant="contained"
                    disabled
                    sx={{ py: 1.4 }}
                  >
                    ACTIVE PLAN
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ py: 1.4 }}
                    onClick={() => handlePayment(12)}
                  >
                    UPGRADE NOW
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
      </div>
      </div>
      </Box>
      </Box>
      <Footer />
    </div>
  );
}
