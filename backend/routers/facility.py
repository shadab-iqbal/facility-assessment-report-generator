from fastapi import APIRouter
from models.facility import FacilityResponse
from services.facility_service import get_facility_assessment

router = APIRouter(prefix="/api", tags=["facility"])


@router.get("/facility/{ccn}", response_model=FacilityResponse)
def get_facility_by_ccn(ccn: str):
    """
    Returns nursing home assessment data for a given CMS Certification Number (CCN),
    including star ratings and claims-based quality metrics.
    """
    result = get_facility_assessment(ccn.strip())
    return result
