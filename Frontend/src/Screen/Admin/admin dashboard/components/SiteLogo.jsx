import logo from "../../../../assets/Logo/lg-1.png";
import {
  Box
} from "@mui/material";

export default function SiteLogo() {

  return (
    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      <img
        src={logo}
        alt="logo"
        style={{ width: 48, cursor: "pointer" }}
      />
    </Box>
  );
}
