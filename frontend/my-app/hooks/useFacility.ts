import { useState } from "react";
import axios from "axios";
import { FacilityData } from "../types/facility";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function useFacility() {
  const [ccn, setCcn] = useState("");
  const [data, setData] = useState<FacilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFacility = async () => {
    if (!ccn.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.get<FacilityData>(`${API_BASE_URL}/api/facility/${ccn}`);
      setData(response.data);
    } catch {
      setError("Facility not found or server error. Please check the CCN.");
    } finally {
      setLoading(false);
    }
  };

  return { ccn, setCcn, data, loading, error, fetchFacility };
}
