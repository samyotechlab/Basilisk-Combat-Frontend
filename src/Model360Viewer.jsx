// src/components/Model360Viewer.jsx
import "@google/model-viewer";

export default function Model360Viewer({ src }) {
  return (
    <model-viewer
      src={src}
      alt="3D model"
      camera-controls
      disable-zoom
      shadow-intensity="1"
      style={{
        width: "100%",
        height: "500px",
        backgroundColor: "#f5f5f5",
      }}
    ></model-viewer>
  );
}
