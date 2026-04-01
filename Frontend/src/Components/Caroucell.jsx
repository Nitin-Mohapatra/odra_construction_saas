import React from 'react';
import vd3 from "../assets/vd3.mp4";

export default function Caroucell() {
  return (
    <div style={{ height: "75vh", overflow: "hidden" }}>
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
    </div>
  );
}