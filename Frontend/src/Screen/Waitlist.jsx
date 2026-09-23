import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import imgBg from "../assets/img.png";

/* ── SVG Icons matching the reference image ── */
const CubeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="#ff5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const WorkforceIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="#ff5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const DatabaseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="#ff5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const GearIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="#ff5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 17a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff5500">
    <path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V6a3 3 0 0 1 3-3z" />
  </svg>
);

export default function Waitlist() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ companyName: "", ownerName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [remainingCount, setRemainingCount] = useState(4);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.ownerName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/waitlist", formData);
      toast.success(res?.data?.message || "Application submitted successfully!");
      setSubmittedData({ ...formData });
      setIsSubmitted(true);
      setRemainingCount((prev) => Math.max(1, prev - 1));
      setFormData({ companyName: "", ownerName: "", email: "", phone: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#fff" }}>
      <Navbar />

      <style>{`
        .waitlist-hero {
          flex-grow: 1;
          background-image: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.92) 32%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.1) 100%), url(${imgBg});
          background-size: contain;
          background-position: right center;
          background-repeat: no-repeat;
          min-height: calc(100vh - 64px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          overflow-x: hidden;
        }

        .waitlist-container {
          width: 100%;
          max-width: 1260px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .waitlist-left {
          flex: 1 1 500px;
          min-width: 0;
          max-width: 680px;
        }

        .waitlist-right {
          flex: 1 1 380px;
          max-width: 420px;
          width: 100%;
        }

        .waitlist-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 40px 42px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          border: 1px solid #edf2f7;
        }

        .waitlist-headline {
          font-family: 'Sora', sans-serif;
          font-weight: 900;
          font-size: clamp(2.1rem, 4.5vw, 3.55rem);
          line-height: 1.08;
          letter-spacing: -1px;
          color: #0b132a;
          margin: 0 0 22px 0;
        }

        .waitlist-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          max-width: 580px;
        }

        @media (max-width: 991px) {
          .waitlist-hero {
            padding: 40px 24px;
            background-position: center bottom;
            background-size: cover;
          }
          .waitlist-container {
            justify-content: center;
            gap: 36px;
          }
          .waitlist-left {
            max-width: 100%;
          }
          .waitlist-right {
            max-width: 100%;
          }
        }

        @media (max-width: 576px) {
          .waitlist-hero {
            padding: 24px 16px;
          }
          .waitlist-card {
            padding: 26px 20px;
            border-radius: 16px;
          }
          .waitlist-features {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>

      {/* ── HERO SECTION ── */}
      <div className="waitlist-hero">
        <div className="waitlist-container">

          {/* ──── LEFT COLUMN ──── */}
          <div className="waitlist-left">

            {/* BRAND LOGO */}
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 900, fontSize: "1.6rem", marginBottom: 18, letterSpacing: "-0.5px" }}>
              <span style={{ color: "#0b132a" }}>ODRA</span>{" "}
              <span style={{ color: "#ff5500" }}>OPS</span>
            </div>

            {/* YELLOW ACCENT LINE */}
            <div style={{ width: 34, height: 3, backgroundColor: "#f4b400", borderRadius: 2, marginBottom: 16 }} />

            {/* PRE-LAUNCH TAGLINE */}
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#5f6d7e", margin: "0 0 12px 0" }}>
              LIMITED TO 11 DEVELOPERS
            </p>

            {/* MAIN HEADLINE */}
            <h1 className="waitlist-headline">
              You Can’t Run a<br />
              <span style={{ color: "#ff5500" }}>₹100 Crore Project</span><br />
              on WhatsApp and Spreadsheets.
            </h1>

            {/* DESCRIPTION */}
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.97rem", lineHeight: 1.6, color: "#334155", margin: "0 0 20px 0", maxWidth: 580 }}>
              <strong style={{ color: "#0b132a", fontWeight: 700 }}>ODRAOPS</strong> gives developers one place to manage projects, people, materials and site operations — with AI doing the monitoring in the background.
              <br /><br />
              Get a clear view of what’s happening across your projects without constantly chasing updates. ODRAOPS also brings one of India’s smartest AI-driven site surveillance systems, with automated monitoring and real-time alerts for supervisors when something needs attention.
            </p>

            {/* EXCLUSIVITY OFFER BOX */}
            <div style={{
              backgroundColor: "#fff7ed",
              border: "1px solid #fed7aa",
              borderLeft: "4px solid #ff5500",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              maxWidth: 580,
            }}>
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#0b132a",
                marginBottom: 6,
              }}>
                11 FIRMS. <span style={{ color: "#ff5500" }}>THAT’S IT.</span>
              </div>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.93rem",
                lineHeight: 1.6,
                color: "#334155",
                margin: 0,
                fontWeight: 500,
              }}>
                We are permanently limiting ODRAOPS to 11 development firms. Every client gets a dedicated team to implement, support and continuously optimise the system. We would rather serve 11 firms properly than 500 firms poorly.
                <br />
                <strong style={{ color: "#0b132a", fontWeight: 700 }}>Once all 11 are onboarded, we stop.</strong>
              </p>
            </div>

            {/* YELLOW ACCENT LINE BOTTOM */}
            <div style={{ width: 34, height: 3, backgroundColor: "#f4b400", borderRadius: 2, marginBottom: 28 }} />

            {/* FEATURE ICONS */}
            <div className="waitlist-features">
              {[
                { icon: <CubeIcon />, text: "Know what’s happening before you have to ask." },
                { icon: <WorkforceIcon />, text: "Keep people and projects accountable." },
                { icon: <DatabaseIcon />, text: "Know where your materials are going." },
                { icon: <GearIcon />, text: "Catch site issues before they become expensive." },
              ].map(({ icon, text }, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 50, height: 50, minWidth: 50, borderRadius: 12,
                    backgroundColor: "#fff3ea",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {icon}
                  </div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.84rem", fontWeight: 700, color: "#1e293b",
                    lineHeight: 1.3,
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ──── RIGHT COLUMN: FORM CARD ──── */}
          <div className="waitlist-right">
            <div className="waitlist-card">
              {isSubmitted ? (
                <div>
                  <div style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    backgroundColor: "#ecfdf5",
                    border: "2px solid #10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px auto",
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <h2 style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.45rem",
                    color: "#0f172a",
                    textAlign: "center",
                    margin: "0 0 8px 0",
                  }}>
                    Application Received! 🎉
                  </h2>

                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.92rem",
                    color: "#475569",
                    textAlign: "center",
                    margin: "0 0 20px 0",
                    lineHeight: 1.5,
                  }}>
                    Thank you, <strong style={{ color: "#0f172a" }}>{submittedData?.ownerName}</strong>! We have received your application for <strong style={{ color: "#0f172a" }}>{submittedData?.companyName}</strong>. Our team will contact you at <strong style={{ color: "#ff5500" }}>{submittedData?.email}</strong>.
                  </p>

                  <div style={{
                    backgroundColor: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: 12,
                    padding: "16px 18px",
                    marginBottom: 24,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.86rem", fontFamily: "'Inter', sans-serif" }}>
                      <span style={{ color: "#64748b" }}>Company:</span>
                      <strong style={{ color: "#0f172a" }}>{submittedData?.companyName}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.86rem", fontFamily: "'Inter', sans-serif" }}>
                      <span style={{ color: "#64748b" }}>Owner / Director:</span>
                      <strong style={{ color: "#0f172a" }}>{submittedData?.ownerName}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.86rem", fontFamily: "'Inter', sans-serif" }}>
                      <span style={{ color: "#64748b" }}>Work Email:</span>
                      <strong style={{ color: "#0f172a" }}>{submittedData?.email}</strong>
                    </div>
                    {submittedData?.phone && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.86rem", fontFamily: "'Inter', sans-serif" }}>
                        <span style={{ color: "#64748b" }}>Phone Number:</span>
                        <strong style={{ color: "#0f172a" }}>{submittedData?.phone}</strong>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem", fontFamily: "'Inter', sans-serif" }}>
                      <span style={{ color: "#64748b" }}>Access Program:</span>
                      <span style={{ color: "#ea580c", fontWeight: 700 }}>11 Developer Priority Cohort</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Card Heading */}
                  <h2 style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800, fontSize: "1.5rem",
                    color: "#0f172a", margin: "0 0 8px 0",
                  }}>
                    APPLY FOR ODRAOPS
                  </h2>

                  {/* Card Sub-heading */}
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.92rem", color: "#475569",
                    margin: "0 0 22px 0", lineHeight: 1.5,
                  }}>
                    Private rollout strictly limited to 11 development firms across India.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Company Name */}
                    <input
                      name="companyName"
                      type="text"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#ff5500"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />

                    {/* Owner / Director */}
                    <input
                      name="ownerName"
                      type="text"
                      placeholder="Owner / Director"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#ff5500"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />

                    {/* Work Email */}
                    <input
                      name="email"
                      type="email"
                      placeholder="Work Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#ff5500"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />

                    {/* Phone Number */}
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#ff5500"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />

                    {/* APPLY FOR ACCESS Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: "100%",
                        backgroundColor: loading ? "#e04b00" : "#ff5500",
                        color: "#fff",
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: "1rem",
                        letterSpacing: "0.5px",
                        border: "none",
                        borderRadius: 10,
                        height: 52,
                        cursor: loading ? "not-allowed" : "pointer",
                        marginTop: 4,
                        marginBottom: 14,
                        boxShadow: "0 6px 20px rgba(255, 85, 0, 0.35)",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = "#e04b00"; }}
                      onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = "#ff5500"; }}
                    >
                      {loading ? "SUBMITTING..." : "APPLY FOR ACCESS"}
                    </button>

                    {/* Remaining Accounts Indicator */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      backgroundColor: "#fff7ed",
                      border: "1px solid #fed7aa",
                      borderRadius: 8,
                      padding: "8px 12px",
                      marginBottom: 14,
                    }}>
                      <span style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#ff5500",
                        boxShadow: "0 0 0 3px rgba(255, 85, 0, 0.25)",
                      }} />
                      <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.88rem",
                        fontWeight: 800,
                        color: "#c2410c",
                      }}>
                        {remainingCount} of 11 accounts remaining
                      </span>
                    </div>

                    {/* Confidentiality Note */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <LockIcon />
                      <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.87rem",
                        fontStyle: "italic",
                        color: "#64748b",
                        fontWeight: 500,
                      }}>
                        Your information stays confidential.
                      </span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Input style ── */
const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  height: 48,
  padding: "0 16px",
  marginBottom: 14,
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.95rem",
  fontWeight: "500",
  color: "#0f172a",
  backgroundColor: "#f8fafc",
  border: "1.5px solid #cbd5e1",
  borderRadius: 10,
  outline: "none",
  transition: "all 0.2s ease",
};
