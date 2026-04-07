import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import ContractorNavbar from "../../Components/ContractorNavbar";
import InventoryHistory from "./InventoryHistory";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button
} from "@mui/material";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import InventoryBreakdownModal from "../../Components/InventoryBreakdownModal";


export default function ProjectInventory() {
  const { id: projectId } = useParams();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [summary, setSummary] = useState({
    totalPurchasedValue: 0,
    totalUsedCost: 0,
    remainingStockValue: 0
  });

  const fetchInventory = async () => {
    const res = await axios.get(`/inventory/${projectId}`);
    setItems(res.data.items);
  };

  // Refresh summary after any inventory change
  const refreshSummary = async () => {
    try {
      const res = await axios.get(`/inventory/summary/${projectId}`);
      setSummary({
        totalPurchasedValue: res.data.totalPurchasedValue || 0,
        totalUsedCost: res.data.totalUsedCost || 0,
        remainingStockValue: res.data.remainingStockValue || 0
      });
    } catch (err) {
      console.error("Failed to refresh summary", err);
    }
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"]
    });

    socket.emit("join", { projectId });

    socket.on("inventory:updated", (data) => {
      setItems((prev) =>
        prev.map((item) =>
          item._id === data.inventoryItemId
            ? { ...item, availableQuantity: data.availableQuantity, isLowStock: data.isLowStock }
            : item
        )
      );

      refreshSummary();

    });

    return () => socket.disconnect();
  }, [projectId]);


  useEffect(() => {
    fetchInventory();
  }, []);


  // fetch summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`/inventory/summary/${projectId}`);
        setSummary({
          totalPurchasedValue: res.data.totalPurchasedValue || 0,
          totalUsedCost: res.data.totalUsedCost || 0,
          remainingStockValue: res.data.remainingStockValue || 0
        });
      } catch (err) {
        console.error("Failed to fetch summary", err);
      }
    };

    fetchSummary();
  }, [projectId]);


  const addItem = async () => {
    try {
      await axios.post(`/inventory/${projectId}`, {
        name,
        unit,
        supplierName,
        companyName,
        quantity: Number(quantity),
        pricePerUnit: Number(pricePerUnit)
      });

      toast.success("Material added");
      setName("");
      setUnit("");
      setQuantity("");
      setPricePerUnit("");
      fetchInventory();
      refreshSummary();
      setSupplierName("");
      setCompanyName("");

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <>
      <ContractorNavbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          py: { xs: 3, md: 5 },
        }}
      >
        <Box className="container">

          {/* HEADER */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" gutterBottom>
              {t("inventory.project_inventory")}
            </Typography>
            <Typography variant="body1">
              {t("inventory.manage_inventory")}
            </Typography>
          </Box>

          {/* ===================== COST SUMMARY ===================== */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 3,
              mb: 5,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "white",
                border:"1px solid black",
                boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="body1" >
                {t("inventory.total_purchased_value")}
              </Typography>
              <Typography variant="h5"  sx={{ mt: 1 }}>
                ₹ {summary.totalPurchasedValue}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "white",
                border:"1px solid black",
                boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="body1" >
                {t("inventory.total_used_cost")}
              </Typography>
              <Typography variant="h5"  sx={{ mt: 1 }}>
                ₹ {summary.totalUsedCost}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "white",
                border:"1px solid black",
                boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="body1" >
                {t("inventory.remaining_stock_value")}
              </Typography>
              <Typography variant="h5"  sx={{ mt: 1 }}>
                ₹ {summary.remainingStockValue}
              </Typography>
            </Paper>

            <Button
              variant="outlined"
              disabled={items.length === 0}
              sx={{
                borderColor: "#f5a623",
                color: "#000",
                fontWeight: 600,
                mb: 3
              }}
              onClick={() => setBreakdownOpen(true)}
            >
              {t("inventory.view_cost_breakdown")}
            </Button>

          </Box>

          {/* ===================== GRID ===================== */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1.2fr",
              },
              gap: 4,
            }}
          >
            {/* ADD MATERIAL */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                height: "fit-content",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
              {t("inventory.add_material")}
              </Typography>

              <TextField
                label={t("inventory.material_name")}
                fullWidth
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label={t("inventory.unit")}
                fullWidth
                sx={{ mb: 2 }}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />

              <TextField
                label="Supplier Name"
                fullWidth
                sx={{ mb: 2 }}
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />

              <TextField
                label="Company Name"
                fullWidth
                sx={{ mb: 2 }}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <TextField
                label={t("inventory.quantity")}
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <TextField
                label={t("inventory.price_per_unit")}
                type="number"
                fullWidth
                inputProps={{ min: 0 }}
                sx={{ mb: 3 }}
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                    color: "#000",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "text.secondary",
                      border:"1px solid #5FA32D"
                    },
                }}
                onClick={addItem}
              >
                {t("inventory.add_material")}
              </Button>
            </Paper>

            {/* INVENTORY LIST */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" >
                  {t("inventory.current_inventory")}
                </Typography>

                <Button
                  variant="outlined"
                  component={Link}
                  to={`/contractor/projects/${projectId}/inventory-history`}
                  sx={{
                    color: "primary.main",
                    borderColor: "primary.main",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "primary.main",
                      color: "primary.main",
                    },
                  }}
                >
                  {t("inventory.view_history")}
                </Button>
              </Box>

              {items.length === 0 && (
                <Typography color="text.secondary">
                 {t("inventory.no_materials")}
                </Typography>
              )}

              {items.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.unit}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography fontWeight={600}>
                      {item.availableQuantity} / {item.totalQuantity}
                    </Typography>

                    {item.isLowStock && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        ⚠ {t("inventory.low_stock")}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>

      <InventoryBreakdownModal
        open={breakdownOpen}
        handleClose={() => setBreakdownOpen(false)}
        items={items}
      />

      <Footer />
    </>
  );


}
