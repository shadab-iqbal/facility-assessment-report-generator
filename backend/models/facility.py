from pydantic import BaseModel
from typing import Optional


class StarRatings(BaseModel):
    overall: Optional[str]
    health_inspection: Optional[str]
    staffing: Optional[str]
    quality_care: Optional[str]


class ClaimsMetrics(BaseModel):
    short_term_hospitalization: Optional[str]
    str_national_avg_hospitalization: Optional[str]
    str_state_avg_hospitalization: Optional[str]
    str_ed_visit: Optional[str]
    str_ed_visits_national_avg: Optional[str]
    str_ed_visits_state_avg: Optional[str]
    lt_hospitalization: Optional[str]
    lt_national_avg_hospitalization: Optional[str]
    lt_state_avg_hospitalization: Optional[str]
    lt_ed_visit: Optional[str]
    lt_ed_visits_national_avg: Optional[str]
    lt_ed_visits_state_avg: Optional[str]


class FacilityResponse(BaseModel):
    name_of_facility: Optional[str]
    location: str
    state_code: str
    census_capacity: Optional[str]
    star_ratings: StarRatings
    claims_metrics: ClaimsMetrics
