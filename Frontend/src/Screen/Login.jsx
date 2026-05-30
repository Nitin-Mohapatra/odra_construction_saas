import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Box, Divider, Paper, Typography } from "@mui/material";
import GoogleLoginButton from "../Components/GoogleLoginButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerFCM }
from "../utils/fcm";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    role: "",
    password: "",
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
      setValidated(true);
      event.stopPropagation();
      return;
    }

    try {
      const { email, role, password } = formData;

      const response = await axiosInstance.post(
        "/auth/signIn",
        { email, password, role },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("User_id", response.data.User_id);
        localStorage.setItem("IsLogin", true);
        localStorage.setItem("name", response.data.name);

        // set the subscription in local storage
        const subRes = await axiosInstance.get("/subscription/me");
        localStorage.setItem("subscription", JSON.stringify(subRes.data));

        await registerFCM();

        toast.success("Logged in successfully!");

        switch (response.data.role) {
          case "site engineer":
            navigate("/engineer/home");
            break;
          case "manager":
            navigate("/contractor/home");
            break;
          default:
            navigate("/");
        }
      }
    } catch (e) {
      const status = e.response?.status;
      const data = e.response?.data;
      console.log(e)

      if (status === 422) return toast.error(data.error[0].msg);
      if (status === 404) return toast.error(data.error);
      if (status === 401) return toast.error(data.error);

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
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              {t("auth.welcome_back")}
            </Typography>
            <Typography variant="body2" color="white">
            {t("auth.sign_in_continue")}
            </Typography>
          </Box>

          <form
            noValidate
            className={validated ? "was-validated" : ""}
            onSubmit={handleSubmit}
          >
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
              <div className="invalid-feedback">
               Please enter a valid email.
              </div>
            </Box>

            {/* Role */}
            <Box mb={2}>
              <label className="form-label fw-semibold">{t("auth.role")}</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                {t("auth.choose_role")}
                </option>
                <option value="site engineer">{t("auth.site_engineer")}</option>
                <option value="manager">{t("auth.manager")}</option>
              </select>
              <div className="invalid-feedback">
                Please select a role.
              </div>
            </Box>

            {/* Password */}
            <Box mb={3}>
              <label className="form-label fw-semibold">{t("auth.password")}</label>
              <input
                name="password"
                type="text"
                className="form-control"
                placeholder={t("auth.password_placeholder")}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={5}
              />
             
              <div className="invalid-feedback">
                Password must be at least 5 characters.
              </div>
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
              {t("auth.sign_in")}
            </button>
          </form>

          {/* Divider */}
          <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
            <Divider sx={{ flex: 1 ,backgroundColor:"text.primary"}} />
            <Typography sx={{ px: 2, fontWeight:"bold" }} variant="body2" color="text.primary">
              OR
            </Typography>
            <Divider sx={{ flex: 1 ,backgroundColor:"text.primary"}} />
          </Box>

          {/* Google Login */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <GoogleLoginButton />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
