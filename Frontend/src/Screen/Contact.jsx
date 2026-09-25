import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Box, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import axiosInstance from "../utils/axiosInstance";
import contactArt from "../assets/Contect Us.png";

const contactDetails = [
  { title: "Our Location", text: "Bhubaneswar, India", icon: LocationOnOutlinedIcon },
  { title: "Phone Number", text: "+91 6370627088", icon: PhoneOutlinedIcon },
  { title: "Email Address", text: "odraops@gmail.com", icon: EmailOutlinedIcon },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", service: "", details: "" });
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
      setValidated(true);
      return;
    }

    try {
      const { name, email, details } = formData;
      const response = await axiosInstance.post("/contact-us", { name, message: details, email });
      if (response.status === 200) {
        setFormData({ name: "", company: "", email: "", phone: "", service: "", details: "" });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
    setValidated(true);
  }

  return (
    <div className="contact-page">
      <Navbar />
      <Box component="main" className="contact-main" style={{ "--contact-art": `url("${contactArt}")` }}>
        <Box className="contact-layout">
          <Box className="contact-copy">
            <Typography component="p" className="contact-kicker">CONTACT US</Typography>
            <Typography component="h1" className="contact-title">GET IN TOUCH WITH US</Typography>
            <Typography className="contact-description">
              Have questions about <strong>ODRAOPS</strong> or ready to transform your construction operations? Our team is here to help you streamline <strong>project management</strong>, workforce tracking, inventory control, and site operations.
            </Typography>

            <Box className="contact-details">
              {contactDetails.map(({ title, text, icon: Icon }) => (
                <Box className="contact-detail" key={title}>
                  <Box className="contact-detail-icon"><Icon /></Box>
                  <Box>
                    <Typography component="h2">{title}</Typography>
                    <Typography>{text}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="section" className="contact-card-wrap">
            <Box className="contact-card">
              <Typography component="h2" className="contact-card-title">Get In Touch</Typography>
              <span className="contact-title-rule" />
              <form noValidate className={validated ? "was-validated" : ""} onSubmit={handleSubmit}>
                <Box className="contact-name-row">
                  <input name="name" type="text" className="form-control" placeholder="Full Name" aria-label="Full Name" value={formData.name} onChange={handleChange} required minLength={2} />
                  <input name="company" type="text" className="form-control" placeholder="Company Name" aria-label="Company Name" value={formData.company} onChange={handleChange} />
                </Box>
                <input name="email" type="email" className="form-control" placeholder="Email Address" aria-label="Email Address" value={formData.email} onChange={handleChange} required />
                <input name="phone" type="tel" className="form-control" placeholder="Phone Number" aria-label="Phone Number" value={formData.phone} onChange={handleChange} />
                <select name="service" className="form-select" aria-label="Select Service" value={formData.service} onChange={handleChange} required>
                  <option value="" disabled>Select Service</option>
                  <option value="project-management">Project Management</option>
                  <option value="workforce-management">Workforce Management</option>
                  <option value="inventory-management">Inventory Management</option>
                  <option value="other">Other</option>
                </select>
                <textarea name="details" rows="4" className="form-control contact-message" placeholder="Your Message" aria-label="Your Message" value={formData.details} onChange={handleChange} required minLength={10} />
                <button className="contact-submit" type="submit">Send Message <SendOutlinedIcon /></button>
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </div>
  );
}
