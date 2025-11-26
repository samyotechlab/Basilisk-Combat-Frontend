import React, { useEffect, useRef } from "react";

const TangibleeWidget = ({ productId }) => {
  const containerRef = useRef(null);

  // Function to dynamically load external script
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const initWidget = async () => {
      // ✅ Load Tangiblee SDK (replace with real URL when you get it)
      await loadScript("https://cdn.tangiblee.com/sdk.js");

      if (window.Tangiblee && window.Tangiblee.initAdjustableSilhouette) {
        window.Tangiblee.initAdjustableSilhouette({
          container: containerRef.current,
          productId: productId,
          options: {
            backgroundColor: "#fff",
            modelHeight: 170,
          },
        });
      } else {
        console.error("Tangiblee SDK not found or init function missing.");
      }
    };

    initWidget();

    // optional cleanup
    return () => {
      if (window.Tangiblee && window.Tangiblee.destroyWidget) {
        window.Tangiblee.destroyWidget(containerRef.current);
      }
    };
  }, [productId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <p style={{ textAlign: "center", marginTop: "40%" }}>
        Loading Tangiblee Widget...
      </p>
    </div>
  );
};

export default TangibleeWidget;
