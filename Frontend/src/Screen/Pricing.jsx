import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getSubscription } from "../utils/subscription";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

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
          color: "#1976d2"
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef5ff 100%)",
        py: 8,
        px: { xs: 2, md: 6 },
      }}
    >
      <Typography
        variant="h3"
        align="center"
        fontWeight={800}
        sx={{ mb: 1 }}
      >
        Choose Your Plan
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{ mb: 7, fontSize: "1.05rem" }}
      >
        Choose the perfect plan for your construction business.
      </Typography>

      <div className="container">
        <div className="row g-4 justify-content-center">

          {/* FREE PLAN */}
          <div className="col-12 col-md-6 col-xl-4 d-flex">
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
              <CardContent sx={{ p: 4 }}>
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

                <Box sx={{ mb: 4 }}>
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
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ py: 1.3 }}
                  >
                    Continue Free
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

        {/* BUSINESS 6 MONTH */}
          <div className="col-12 col-md-6 col-xl-4 d-flex">
            <Card
              elevation={8}
              sx={{
                width: "100%",
                borderRadius: 4,
                border: "2px solid #1976d2",
                position: "relative",
                transition: "0.35s",
                "&:hover": {
                  transform: "translateY(-14px)",
                  boxShadow: 14,
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "primary.main",
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

              <CardContent sx={{ p: 4 }}>
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

                <Box sx={{ mb: 4 }}>
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
                    Active Plan
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ py: 1.4 }}
                    onClick={() => handlePayment(6)}
                  >
                    Upgrade Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

        {/* BUSINESS 1 YEAR */}
          <div className="col-12 col-md-6 col-xl-4 d-flex">
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
              <CardContent sx={{ p: 4 }}>
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

                <Box sx={{ mb: 4 }}>
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
                    Active Plan
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ py: 1.4 }}
                    onClick={() => handlePayment(12)}
                  >
                    Upgrade Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
      </div>
      </div>
    </Box>
  );
}