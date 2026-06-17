import { ChangeEvent } from "react";
import { ManualInputs } from "../types/facility";

interface Props {
  inputs: ManualInputs;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onGeneratePDF: () => void;
  onGenerateWord: () => void;
  facilityName: string;
}

const inputStyle = { padding: "8px" };

const btnStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export function ManualInputsForm({
  inputs,
  onChange,
  onGeneratePDF,
  onGenerateWord,
  facilityName,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        borderTop: "1px solid #ccc",
        paddingTop: "20px",
      }}
    >
      <p>
        <strong>Facility Found:</strong> {facilityName}
      </p>

      <input
        type="text"
        name="nameOverride"
        placeholder="Override Facility Name (Optional)"
        onChange={onChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="emr"
        placeholder="EMR (e.g., PCC, MatrixCare)"
        onChange={onChange}
        style={inputStyle}
      />
      <input
        type="number"
        name="currentCensus"
        placeholder="Current Census (e.g., 112)"
        onChange={onChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="patientType"
        placeholder="Patient Type (e.g., Long-term & Short-term)"
        onChange={onChange}
        style={inputStyle}
      />

      <select name="prevCoverage" onChange={onChange} style={inputStyle}>
        <option value="No">Previous Medelite Coverage: No</option>
        <option value="Yes">Previous Medelite Coverage: Yes</option>
      </select>

      <input
        type="text"
        name="prevPerformance"
        placeholder="Previous Performance (e.g., About 30 patients/day)"
        onChange={onChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="medicalCoverage"
        placeholder="Medical Coverage (e.g., Optometry, PCP, Podiatry)"
        onChange={onChange}
        style={inputStyle}
      />

      <button onClick={onGeneratePDF} style={{ ...btnStyle, marginTop: "10px" }}>
        Download PDF Report
      </button>

      <button onClick={onGenerateWord} style={{ ...btnStyle, flex: 1 }}>
        Download Word (.docx)
      </button>
    </div>
  );
}
