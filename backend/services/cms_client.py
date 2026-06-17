import requests
from fastapi import HTTPException
from config.settings import (
    CMS_FACILITY_URL,
    CMS_LT_STR_URL,
    CMS_LT_STR_BY_PROVIDER_URL,
    REQUEST_TIMEOUT,
)


def _eq_condition(property_name: str, value: str, index: int = 0) -> dict:
    """Build a CMS datastore equality filter condition."""
    return {
        f"conditions[{index}][property]": property_name,
        f"conditions[{index}][value]": value,
        f"conditions[{index}][operator]": "=",
    }


def _fetch(url: str, params: dict) -> list[dict]:
    """
    Make a GET request to a CMS datastore endpoint and return the results list.
    Raises HTTPException on non-200 responses or connection errors.
    """
    try:
        response = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    except requests.exceptions.RequestException as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to communicate with CMS server: {exc}",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"CMS API returned status {response.status_code}",
        )

    return response.json().get("results", [])


def fetch_facility(ccn: str) -> dict:
    """Fetch core facility data by CCN. Returns the first matching row."""
    results = _fetch(CMS_FACILITY_URL, _eq_condition("cms_certification_number_ccn", ccn))
    if not results:
        raise HTTPException(status_code=404, detail=f"Facility with CCN '{ccn}' not found.")
    return results[0]


def fetch_lt_str_by_provider(ccn: str) -> list[dict]:
    """Fetch long-term / short-term rehospitalization metrics for a specific provider."""
    return _fetch(CMS_LT_STR_BY_PROVIDER_URL, _eq_condition("cms_certification_number_ccn", ccn))


def fetch_lt_str_averages(scope: str) -> dict:
    """
    Fetch national or state-level LT/STR averages.
    `scope` should be 'nation' or a two-letter state code.
    Returns the first matching row, or an empty dict if none found.
    """
    results = _fetch(CMS_LT_STR_URL, _eq_condition("state_or_nation", scope))
    return results[0] if results else {}
