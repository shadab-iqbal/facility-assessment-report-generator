import { useState, ChangeEvent } from "react";
import { ManualInputs } from "../types/facility";

const DEFAULT_INPUTS: ManualInputs = {
  nameOverride: "",
  emr: "",
  currentCensus: "",
  patientType: "",
  prevCoverage: "No",
  prevPerformance: "",
  medicalCoverage: "",
};

export function useManualInputs() {
  const [inputs, setInputs] = useState<ManualInputs>(DEFAULT_INPUTS);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return { inputs, handleChange };
}
