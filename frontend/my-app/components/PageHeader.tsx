interface Props {
  stateCode?: string;
}

export function PageHeader({ stateCode }: Props) {
  return (
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <img
        src="/logo.png"
        alt="Infinite Logo"
        style={{ width: "180px", height: "auto", marginBottom: "15px", display: "inline-block" }}
      />
      <h3
        style={{
          margin: "0 0 5px 0",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333333",
          letterSpacing: "0.5px",
        }}
      >
        INFINITE — Managed by MEDELITE
      </h3>
      <h2
        style={{
          margin: "0 0 5px 0",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#000000",
        }}
      >
        FACILITY ASSESSMENT SNAPSHOT
      </h2>
      {stateCode && (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#555555" }}>
          {stateCode}
        </div>
      )}
    </div>
  );
}
