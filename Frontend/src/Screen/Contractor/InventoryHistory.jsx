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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function InventoryHistory() {
  const { t } = useTranslation();
  const { id: projectId } = useParams();
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  // ✅ UI-only filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterItem, setFilterItem] = useState("");

  //fetch purchase history and usage history
  useEffect(() => {

    const fetchHistory = async () => {
      try {
        const [usageRes, purchaseRes] = await Promise.all([
          axios.get(`/inventory/history/${projectId}`),
          axios.get(`/inventory/purchase-history/${projectId}`)
        ]);
        setHistory(usageRes.data.history || []);
        setPurchaseHistory(purchaseRes.data.history || []);
      } catch (err) {
        console.log(err);
      }
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

  const filteredPurchaseHistory = purchaseHistory.filter((item) => {

    const matchDate = filterDate
      ? new Date(item.purchaseDate)
        .toISOString()
        .split("T")[0] === filterDate
      : true;

    const matchItem = filterItem
      ? item.inventoryItemId.name === filterItem
      : true;

    return matchDate && matchItem;
  });

  // ✅ Unique material list for dropdown
  const materialOptions = [
    ...new Set([
      ...history.map(h => h.inventoryItemId.name),
      ...purchaseHistory.map(p => p.inventoryItemId.name)
    ])

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
            <Typography variant="h1" gutterBottom>
              {t("inventory.usage_history")}
            </Typography>
            <Typography variant="body1">
              {t("inventory.usage_history_desc")}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
            >
              <Tab label="Usage History" />
              <Tab label="Purchase History" />
            </Tabs>

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
          {tab === 0 && (

            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
              }}
            >

              {filteredHistory.length === 0 && (
                <Typography>
                  {t("inventory.no_usage_records")}
                </Typography>
              )}

              {filteredHistory.map((h) => (

                <Box
                  key={h._id}
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      md: "row"
                    },
                    justifyContent: "space-between",
                    gap: 2,
                    py: 2,
                    borderBottom: "1px solid #eee"
                  }}
                >

                  <Box>

                    <Typography fontWeight={600}>
                      {h.inventoryItemId.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {t("inventory.used_quantity")} :
                      {" "}
                      {h.usedQty}
                      {" "}
                      {h.inventoryItemId.unit}
                    </Typography>

                  </Box>

                  <Box
                    sx={{
                      textAlign: {
                        xs: "left",
                        md: "right"
                      }
                    }}
                  >

                    <Typography>

                      {t("inventory.used_by")} :

                      <strong>
                        {" "}
                        {h.usedBy?.name || "Site Engineer"}
                      </strong>

                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(h.date).toLocaleDateString()}
                    </Typography>

                  </Box>

                </Box>

              ))}

            </Paper>

          )}

          {tab === 1 && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
              }}
            >
              {filteredPurchaseHistory.length === 0 && (

                <Typography>
                  No purchase records found.
                </Typography>

              )}
              {filteredPurchaseHistory.map((purchase) => (

                <Box
                  key={purchase._id}
                  sx={{
                    py: 2,
                    borderBottom: "1px solid #eee"
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    {purchase.inventoryItemId.name}
                  </Typography>

                  <Typography>
                    Quantity :
                    {" "}
                    {purchase.quantity}
                    {" "}
                    {purchase.inventoryItemId.unit}
                  </Typography>

                  <Typography>
                    Price Per Unit :
                    {" "}
                    ₹{purchase.pricePerUnit}
                  </Typography>

                  <Typography>
                    Supplier :
                    {" "}
                    {purchase.supplierName}
                  </Typography>

                  <Typography>
                    Company :
                    {" "}
                    {purchase.companyName}
                  </Typography>

                  <Typography>
                    Purchased By :
                    {" "}
                    {purchase.createdBy?.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Purchase Date :
                    {" "}
                    {new Date(
                      purchase.purchaseDate
                    ).toLocaleDateString()}
                  </Typography>

                </Box>

              ))}

            </Paper>

          )}
        </Box>
      </Box>

      <Footer />
    </>
  );
}
