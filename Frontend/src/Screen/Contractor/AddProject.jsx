import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ContractorNavbar from "../../Components/ContractorNavbar";
import axiosInstance from "../../utils/axiosInstance";
import projectArtwork from "../../assets/Add New Project (2).png";

export default function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [siteEngineerEmail, setSiteEngineerEmail] = useState("");
  const [siteEngineerName, setSiteEngineerName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/projects", { title, description, siteEngineerEmail, siteEngineerName });
      toast.success("Project created successfully");
      navigate("/contractor/home");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "project-title", label: t("project.project_title"), placeholder: t("project.enter_title"), value: title, setValue: setTitle, icon: DescriptionOutlinedIcon, type: "text" },
    { id: "project-description", label: t("project.project_description"), placeholder: t("project.enter_description"), value: description, setValue: setDescription, icon: TextSnippetOutlinedIcon, multiline: true },
    { id: "engineer-email", label: t("project.assign_engineer"), placeholder: t("project.enter_engineer_email"), value: siteEngineerEmail, setValue: setSiteEngineerEmail, icon: MailOutlineIcon, type: "email" },
    { id: "engineer-name", label: "SiteEngineer name", placeholder: "SiteEngineer name", value: siteEngineerName, setValue: setSiteEngineerName, icon: PersonOutlineIcon, type: "text" },
  ];

  return (
    <div className="add-project-page" style={{ "--project-art": `url("${projectArtwork}")` }}>
      <ContractorNavbar />
      <main className="add-project-main">
        <section className="add-project-card">
          <div className="add-project-form-panel">
            <header className="add-project-heading">
              <Typography component="h1" className="add-project-title">Add New <span>Project</span></Typography>
              <Typography component="p" className="add-project-subtitle">Create a new project and assign it to a site engineer.</Typography>
            </header>
            <form className="add-project-form" onSubmit={handleSubmit}>
              {fields.map(({ id, label, placeholder, value, setValue, icon: Icon, multiline, type }) => (
                <div className="add-project-field" key={id}>
                  <span className="add-project-field-icon"><Icon /></span>
                  <div className="add-project-control">
                    <label htmlFor={id}>{label}</label>
                    {multiline ? (
                      <textarea id={id} rows="4" placeholder={placeholder} required value={value} onChange={(e) => setValue(e.target.value)} />
                    ) : (
                      <input id={id} type={type} placeholder={placeholder} required value={value} onChange={(e) => setValue(e.target.value)} />
                    )}
                  </div>
                </div>
              ))}
              <div className="add-project-actions">
                <Button type="submit" variant="contained" disabled={loading}>{loading ? t("project.creating") : t("project.create_project")}</Button>
                <Button type="button" variant="outlined" onClick={() => navigate(-1)}>{t("project.cancel")}</Button>
              </div>
            </form>
          </div>
          <aside className="add-project-art" aria-label="Construction site with a tower crane" />
        </section>
      </main>
    </div>
  );
}
