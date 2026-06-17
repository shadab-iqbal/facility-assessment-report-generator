export interface StarRatings {
  overall: string | null;
  health_inspection: string | null;
  staffing: string | null;
  quality_care: string | null;
}

export interface ClaimsMetrics {
  short_term_hospitalization: string | null;
  str_national_avg_hospitalization: string | null;
  str_state_avg_hospitalization: string | null;
  str_ed_visit: string | null;
  str_ed_visits_national_avg: string | null;
  str_ed_visits_state_avg: string | null;
  lt_hospitalization: string | null;
  lt_national_avg_hospitalization: string | null;
  lt_state_avg_hospitalization: string | null;
  lt_ed_visit: string | null;
  lt_ed_visits_national_avg: string | null;
  lt_ed_visits_state_avg: string | null;
}

export interface FacilityData {
  name_of_facility: string;
  location: string;
  state_code: string;
  census_capacity: string;
  star_ratings: StarRatings;
  claims_metrics: ClaimsMetrics;
}

export interface ManualInputs {
  nameOverride: string;
  emr: string;
  currentCensus: string;
  patientType: string;
  prevCoverage: string;
  prevPerformance: string;
  medicalCoverage: string;
}
