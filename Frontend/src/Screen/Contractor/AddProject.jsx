import React, { useState } from "react";
import ContractorNavbar from "../../Components/ContractorNavbar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [siteEngineerEmail, setSiteEngineerEmail] = useState("");
  const [siteEngineerName, setSiteEngineerName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post(
        "/projects",
        { title, description, siteEngineerEmail,siteEngineerName }
      );

      toast.success("Project created successfully");
      navigate("/contractor/home");
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ContractorNavbar />
  
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          padding: "3rem 1rem",
        }}
      >
        <div className="container">
          {/* HEADER */}
          <div className="mb-5">
            <h2 style={{ fontWeight: 700, color: "#1e1e1e" }}>
            {t("project.add_project")}
            </h2>
            <p className="text-muted">
            {t("project.add_project_desc")}
            </p>
          </div>
  
          {/* FORM CARD */}
          <div
            className="card border-0"
            style={{
              maxWidth: "720px",
              borderRadius: "16px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            }}
          >
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                {/* PROJECT TITLE */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    {t("project.project_title")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("project.enter_title")}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
  
                {/* PROJECT DESCRIPTION */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                  {t("project.project_description")}
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder={t("project.enter_description")}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
  
                {/* SITE ENGINEER EMAIL */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    {t("project.assign_engineer")}
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder={t("project.enter_engineer_email")}
                    required
                    value={siteEngineerEmail}
                    onChange={(e) =>
                      setSiteEngineerEmail(e.target.value)
                    }
                  />
                </div>


                {/* site eng name */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    SiteEngineer name 
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("SiteEngineer name")}
                    required
                    value={siteEngineerName}
                    onChange={(e) => setSiteEngineerName(e.target.value)}
                  />
                </div>
  
                {/* ACTIONS */}
                <div className="d-flex gap-3">
                  <Button
                    variant="contained"
                    color="success"
                    disabled={loading}
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: "#f5a623",
                      color: "#000",
                      fontWeight: 600,
                    }}
                  >
                      {loading ? t("project.creating") : t("project.create_project")}
                    </Button>
  
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#000",
                      borderColor: "#f5a623",
                      fontWeight: 600,
                    }}
                  >
                    {t("project.cancel")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <Footer />
    </>
  );
  
  
  
}
