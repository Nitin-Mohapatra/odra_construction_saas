import React from 'react';
import vd3 from "../assets/vd3.mp4";
import {Box} from "@mui/material"

export default function Caroucell({customStyles}) {
  console.log(customStyles)
  return (
    <Box sx={{ height: "75vh", overflow: "hidden",...customStyles }}>
      <video
        src={vd3}
        style={{
          width: "100%",
          height: "75vh",
          objectFit: "cover",
        }}
        autoPlay
        loop
        muted
        playsInline
      />
    </Box>
  );
}