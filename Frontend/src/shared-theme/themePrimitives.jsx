import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();


export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 6%)',
  900: 'hsl(220, 35%, 3%)',
};


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
        default: "#fff",
        paper: "#ffffff",
      },

      // 🚨 FIXED (VERY IMPORTANT)
      text: {
        primary: "#000",     
        secondary: "#fff",   
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

export const typography = {
  fontFamily: 'Inter, sans-serif',
  h1: {
    fontFamily: "Sora, sans-serif",
    fontSize: defaultTheme.typography.pxToRem(30),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: "Sora, sans-serif",
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontFamily: "Sora, sans-serif",
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontFamily: "Sora, sans-serif",
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontFamily: "Sora, sans-serif",
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontFamily: "Sora, sans-serif",
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

