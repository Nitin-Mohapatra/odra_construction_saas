import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Box, Divider, Paper, Typography } from "@mui/material";
import GoogleLoginButton from "../Components/GoogleLoginButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [validated, setValidated] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      return;
    }

    try {
      const { name, email, password } = formData;

      const res = await axiosInstance.post(
        "/auth/signUp",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("User_id", res.data.User_id);
        localStorage.setItem("IsLogin", true);
        localStorage.setItem("name", res.data.name);
        // set in local storage
        const subRes = await axiosInstance.get("/subscription/me");
        localStorage.setItem("subscription", JSON.stringify(subRes.data));

        toast.success("Account created successfully!");

        navigate("/contractor/home");
      }
    } catch (e) {
      console.log(e)
      const status = e.response?.status;

      if (status === 409) {
        toast.error(e.response.data.error);
        navigate("/Login");
        return;
      }

      if (status === 422) {
        toast.error(e.response.data.error?.[0]?.msg || "Validation error");
        return;
      }

      toast.error("Something went wrong. Please try again.");
      console.log(e);
    }

    setValidated(true);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
      }}
    >
      {/* LEFT IMAGE */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* RIGHT FORM */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              {t("auth.create_account")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("auth.signup_start")}
            </Typography>
          </Box>

          <form
            noValidate
            className={validated ? "was-validated" : ""}
            onSubmit={handleSubmit}
          >
            {/* Name */}
            <Box mb={2}>
              <label className="form-label fw-semibold">{t("auth.full_name")}</label>
              <input
                name="name"
                type="text"
                className="form-control"
                placeholder={t("auth.name_placeholder")}
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </Box>

            {/* Email */}
            <Box mb={2}>
              <label className="form-label fw-semibold">{t("auth.email")}</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder={t("auth.email_placeholder")}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Box>

            {/* Password */}
            <Box mb={2}>
              <label className="form-label fw-semibold">{t("auth.password")}</label>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder={t("auth.min_password_placeholder")}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </Box>

            {/* Submit */}
            <button
              type="submit"
              className="btn w-100 fw-semibold"
              style={{
                backgroundColor: "#1e1e1e",
                color: "#fff",
              }}
            >
              {t("auth.sign_up")}
            </button>
          </form>

          {/* Divider */}
          {/* <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography sx={{ px: 2 }} variant="body2" color="text.secondary">
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box> */}

          {/* Google Signup */}
          {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
            <GoogleLoginButton />
          </Box> */}
        </Paper>
      </Box>
    </Box>
  );
}
