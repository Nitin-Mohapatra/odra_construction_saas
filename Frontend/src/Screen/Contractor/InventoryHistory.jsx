import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import ContractorNavbar from "../../Components/ContractorNavbar";
import Footer from "../../Components/Footer";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function InventoryHistory() {
  const { t } = useTranslation();
  const { id: projectId } = useParams();
  const [history, setHistory] = useState([]);

  // ✅ UI-only filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterItem, setFilterItem] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(`/inventory/history/${projectId}`);
      setHistory(res.data.history || []);
    };
    fetchHistory();
  }, [projectId]);

  // ✅ Derived filtered data (NO mutation)
  const filteredHistory = history.filter((h) => {
    const matchDate = filterDate
      ? new Date(h.date).toISOString().split("T")[0] === filterDate
      : true;

    const matchItem = filterItem
      ? h.inventoryItemId.name === filterItem
      : true;

    return matchDate && matchItem;
  });

  // ✅ Unique material list for dropdown
  const materialOptions = [
    ...new Set(history.map(h => h.inventoryItemId.name))
  ];

  return (
    <>
      <ContractorNavbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          py: { xs: 3, md: 5 }
        }}
      >
        <Box className="container">
          {/* HEADER */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1"  gutterBottom>
              {t("inventory.usage_history")}
            </Typography>
            <Typography variant="body1">
              {t("inventory.usage_history_desc")}
            </Typography>
          </Box>

          {/* FILTERS */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: "14px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              display: "flex",
              gap: 2,
              flexWrap: "wrap"
            }}
          >
            <TextField
              type="date"
              label={t("inventory.filter_by_date")}
              value={filterDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setFilterDate(e.target.value)}
              sx={{ minWidth: 220 }}
            />

            <TextField
              select
              label={t("inventory.filter_by_material")}
              value={filterItem}
              onChange={(e) => setFilterItem(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="">{t("inventory.all_materials")}</MenuItem>
              {materialOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* HISTORY LIST */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: "16px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
            }}
          >
            {filteredHistory.length === 0 && (
              <Typography variant="body1">
                {t("inventory.no_usage_records")}
              </Typography>
            )}

            {filteredHistory.map((h) => (
              <Box
                key={h._id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  gap: 2,
                  py: 2,
                  borderBottom: "1px solid #eee"
                }}
              >
                {/* LEFT */}
                <Box>
                  <Typography fontWeight={600}>
                    {h.inventoryItemId.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {t("inventory.used_quantity")}: {h.usedQty} {h.inventoryItemId.unit}
                  </Typography>
                </Box>

                {/* RIGHT */}
                <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                  <Typography variant="body2">
                    {t("inventory.used_by")}:{" "}
                    <strong>{h.usedBy?.name || "Site Engineer"}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(h.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
