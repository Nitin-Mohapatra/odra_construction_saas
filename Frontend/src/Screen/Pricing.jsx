import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getSubscription } from "../utils/subscription";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export default function Pricing() {
  const navigate = useNavigate();
  const sub = getSubscription();

  const currentPlan = sub?.plan ;
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
        backgroundColor: "#f9fafb",
        py: 6,
        px: 3
      }}
    >
      <Typography
        variant="h3"
        align="center"
        fontWeight={700}
        gutterBottom
      >
        Choose Your Plan
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Unlock powerful tools to manage unlimited construction projects.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        {/* FREE PLAN */}
        <Card sx={{ width: 320, borderRadius: "16px" }}>
          <CardContent>
            <Typography variant="h5" fontWeight={600}>
              Free Plan
            </Typography>

            <Typography variant="h4" sx={{ my: 2 }}>
              ₹0
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ 1 Project
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ Inventory Access
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✖ Attendance
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✖ Reports
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              ✖ Chat
            </Typography>

            {currentPlan === "free" ? (
              <Button
                variant="outlined"
                fullWidth
                disabled
              >
                Current Plan
              </Button>
            ) : (
              <Button
                variant="outlined"
                fullWidth
              >
                Free Plan
              </Button>
            )}
          </CardContent>
        </Card>

        {/* BUSINESS 6 MONTH */}
        <Card
          sx={{
            width: 320,
            borderRadius: "16px",
            border: "2px solid #1976d2"
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={600}>
              Business – 6 Months
            </Typography>

            <Typography variant="h4" sx={{ my: 2 }}>
              ₹15,000
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ Unlimited Projects
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ Attendance
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ Reports
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              ✔ Chat
            </Typography>

            {currentPlan === "business" && currentStatus === "active" && currentTenure === "6m" ? (
              <Button
                variant="contained"
                fullWidth
                disabled
              >
                Active Plan
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() =>
                  handlePayment(6)
                }
              >
                Upgrade
              </Button>
            )}
          </CardContent>
        </Card>

        {/* BUSINESS 1 YEAR */}
        <Card
          sx={{
            width: 320,
            borderRadius: "16px",
            backgroundColor: "#f0f7ff"
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={600}>
              Business – 1 Year
            </Typography>

            <Typography variant="h4" sx={{ my: 2 }}>
              ₹34,000
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ Unlimited Projects
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ Attendance
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✔ Reports
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              ✔ Chat
            </Typography>

            {currentPlan === "business" && currentStatus === "active" && currentTenure === "12m" ? (
              <Button
                variant="contained"
                fullWidth
                disabled
              >
                Active Plan
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() =>
                  handlePayment(12)
                }
              >
                Upgrade
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}