"use client";

import { useFacility } from "../hooks/useFacility";
import { useManualInputs } from "../hooks/useManualInputs";
import { generatePDF } from "../utils/generatePDF";
import { generateWordDoc } from "../utils/generateWordDoc";
import { PageHeader } from "../components/PageHeader";
import { ManualInputsForm } from "../components/ManualInputsForm";

export default function FacilityAssessmentApp() {
  const { ccn, setCcn, data, loading, error, fetchFacility } = useFacility();
  const { inputs, handleChange } = useManualInputs();

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "40px 20px",
          maxWidth: "600px",
          margin: "0 auto",
          fontFamily: "sans-serif",
        }}
      >
        <PageHeader stateCode={data?.state_code} />

        {/* Search */}
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Enter CCN (e.g., 686123)"
            value={ccn}
            onChange={(e) => setCcn(e.target.value)}
            style={{
              padding: "8px",
              marginRight: "10px",
              width: "200px",
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={fetchFacility}
            disabled={loading}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "#ffffff",
              border: "none",
            }}
          >
            {loading ? "Searching... (First time may take a moment)" : "Fetch Facility"}
          </button>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {data && (
          <ManualInputsForm
            inputs={inputs}
            onChange={handleChange}
            facilityName={data.name_of_facility ?? ""}
            onGeneratePDF={() => generatePDF(data, inputs, ccn)}
            onGenerateWord={() => generateWordDoc(data, inputs, ccn)}
          />
        )}
      </div>
    </div>
  );
}
