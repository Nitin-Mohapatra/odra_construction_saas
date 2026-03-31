import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: "#A8D86D",
        main: "#83C441",
        dark: "#5FA32D",
        contrastText: "#ffffff",
      },

      secondary: {
        main: "#003023",
        contrastText: "#ffffff",
      },

      // ✅ Updated to match your green ecosystem
      info: {
        light: "#D7F0E5",
        main: "#4CAF7D",
        dark: "#2E7D5B",
        contrastText: "#ffffff",
      },

      // ✅ Slightly muted (not too bright)
      warning: {
        light: "#FFF4D6",
        main: "#F4B400",
        dark: "#C49000",
        contrastText: "#000",
      },

      // ✅ Softer red (premium UI, not harsh)
      error: {
        light: "#FFE5E5",
        main: "#E53935",
        dark: "#B71C1C",
        contrastText: "#ffffff",
      },

      // ✅ Align with your primary green
      success: {
        light: "#E8F5E9",
        main: "#83C441",
        dark: "#5FA32D",
        contrastText: "#ffffff",
      },

      grey: {
        ...gray,
      },

      background: {
        default: "#F6F6F9",
        paper: "#ffffff",
      },

      // 🚨 FIXED (VERY IMPORTANT)
      text: {
        primary: "#003023",     // your dark green ✅
        secondary: "#5f6f65",   // soft readable gray-green ✅
      },

      divider: "rgba(0, 48, 35, 0.1)",

      action: {
        hover: "rgba(131, 196, 65, 0.08)",
        selected: "rgba(131, 196, 65, 0.16)",
      },

      baseShadow:
        "0px 4px 16px rgba(0, 48, 35, 0.06), 0px 8px 20px rgba(0, 48, 35, 0.08)",
    },
  },
};