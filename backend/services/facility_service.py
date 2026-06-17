from models.facility import ClaimsMetrics, FacilityResponse, StarRatings
from services.cms_client import (
    fetch_facility,
    fetch_lt_str_averages,
    fetch_lt_str_by_provider,
)

# Codes for provider-level metrics rows returned by CMS_LT_STR_BY_PROVIDER_URL.
STR_HOSP_CODE = "521"
STR_ED_CODE = "522"
LT_HOSP_CODE = "551"
LT_ED_CODE = "552"


def _get_measure_value(
    rows: list[dict],
    measure_code: str,
    key: str = "adjusted_score",
) -> str:
    """Return the requested field for a given measure code."""
    for row in rows:
        if row.get("measure_code") == measure_code:
            return row.get(key, "N/A")
    return "N/A"


def _build_address(facility: dict) -> str:
    street = facility.get("provider_address", "").strip()
    city = facility.get("citytown", "").strip()
    state = facility.get("state", "").strip()
    zip_code = facility.get("zip_code", "").strip()
    return f"{street}, {city}, {state} {zip_code}".strip(", ")


def _build_star_ratings(facility: dict) -> StarRatings:
    return StarRatings(
        overall=facility.get("overall_rating"),
        health_inspection=facility.get("health_inspection_rating"),
        staffing=facility.get("staffing_rating"),
        quality_care=facility.get("qm_rating"),
    )


def _build_claims_metrics(
    provider_rows: list[dict],
    national: dict,
    state: dict,
) -> ClaimsMetrics:
    return ClaimsMetrics(
        short_term_hospitalization=_get_measure_value(provider_rows, "521"),
        str_national_avg_hospitalization=national.get(
            "percentage_of_short_stay_residents_who_were_rehospitalized__1d02", "N/A"
        ),
        str_state_avg_hospitalization=state.get(
            "percentage_of_short_stay_residents_who_were_rehospitalized__1d02", "N/A"
        ),
        str_ed_visit=_get_measure_value(provider_rows, "522"),
        str_ed_visits_national_avg=national.get(
            "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911", "N/A"
        ),
        str_ed_visits_state_avg=state.get(
            "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911", "N/A"
        ),
        lt_hospitalization=_get_measure_value(provider_rows, "551"),
        lt_national_avg_hospitalization=national.get(
            "number_of_hospitalizations_per_1000_longstay_resident_days", "N/A"
        ),
        lt_state_avg_hospitalization=state.get(
            "number_of_hospitalizations_per_1000_longstay_resident_days", "N/A"
        ),
        lt_ed_visit=_get_measure_value(provider_rows, "552"),
        lt_ed_visits_national_avg=national.get(
            "number_of_outpatient_emergency_department_visits_per_1000_l_de9d", "N/A"
        ),
        lt_ed_visits_state_avg=state.get(
            "number_of_outpatient_emergency_department_visits_per_1000_l_de9d", "N/A"
        ),
    )


def get_facility_assessment(ccn: str) -> FacilityResponse:
    """
    Orchestrate all CMS lookups and return a fully assembled FacilityResponse.
    """
    facility = fetch_facility(ccn)
    state_code = facility.get("state", "").strip()

    provider_rows = fetch_lt_str_by_provider(ccn)
    national_avgs = fetch_lt_str_averages("nation")
    state_avgs = fetch_lt_str_averages(state_code)

    return FacilityResponse(
        name_of_facility=facility.get("provider_name"),
        location=_build_address(facility),
        state_code=state_code,
        census_capacity=facility.get("number_of_certified_beds"),
        star_ratings=_build_star_ratings(facility),
        claims_metrics=_build_claims_metrics(provider_rows, national_avgs, state_avgs),
    )
