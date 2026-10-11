import httpx

from app.config import get_settings
from app.schemas import Coordinate, RouteGenerateRequest, RouteResult
from app.services.geo import DEMO_START, demo_route, haversine_km, offset_loop, path_distance_km, walking_minutes


PROFILE_MAP = {
    "walking": "foot",
    "hiking": "foot",
    "running": "foot",
    "nature": "foot",
    "photography": "foot",
    "bird watching": "foot",
    "cycling": "bike",
}


def destination_from_duration(start: Coordinate, minutes: int, difficulty: str) -> Coordinate:
    speed = 4.5
    if difficulty == "beginner":
        speed = 3.8
    elif difficulty == "challenging":
        speed = 5.2
    km = speed * (minutes / 60) * 0.45
    delta = km / 111.0
    return Coordinate(lat=start.lat + delta * 0.35, lng=start.lng + delta)


def validate_route(route: RouteResult) -> RouteResult:
    if len(route.geometry) < 2:
        raise ValueError("Route geometry is too short.")
    for lng, lat in route.geometry:
        if not (-90 <= lat <= 90 and -180 <= lng <= 180):
            raise ValueError("Route contains invalid coordinates.")
    if route.distance_km <= 0:
        raise ValueError("Route distance must be positive.")
    return route


def generate_route(request: RouteGenerateRequest) -> RouteResult:
    settings = get_settings()
    if request.demo:
        return validate_route(demo_route("hackathon-demo"))

    start = request.start
    end = request.end or destination_from_duration(start, request.duration_minutes, request.difficulty)
    profile = PROFILE_MAP.get(request.activity, "foot")

    if settings.routing_provider == "osrm":
        try:
            return validate_route(_osrm_route(start, end, profile))
        except Exception:
            loop = offset_loop(start)
            distance = path_distance_km(loop)
            fallback = RouteResult(
                provider="local-fallback",
                fallback=True,
                distance_km=distance,
                duration_minutes=walking_minutes(distance),
                start=start,
                end=Coordinate(lat=loop[-1][1], lng=loop[-1][0]),
                waypoints=[Coordinate(lat=p[1], lng=p[0]) for p in loop[1:-1:2]],
                geometry=loop,
                source="cached-loop",
            )
            return validate_route(fallback)

    return validate_route(demo_route("provider-disabled"))


def _osrm_route(start: Coordinate, end: Coordinate, profile: str) -> RouteResult:
    settings = get_settings()
    coords = f"{start.lng},{start.lat};{end.lng},{end.lat}"
    url = f"{settings.osrm_base_url.rstrip('/')}/route/v1/{profile}/{coords}"
    params = {"overview": "full", "geometries": "geojson", "steps": "false"}
    response = httpx.get(url, params=params, timeout=12.0, headers={"User-Agent": "TouchGrassAI/1.0"})
    response.raise_for_status()
    payload = response.json()
    if payload.get("code") != "Ok" or not payload.get("routes"):
        raise RuntimeError("OSRM returned no route.")
    route = payload["routes"][0]
    geometry = route["geometry"]["coordinates"]
    meters = float(route.get("distance") or 0)
    seconds = float(route.get("duration") or 0)
    waypoints = [
        Coordinate(lat=start.lat, lng=start.lng),
        Coordinate(lat=end.lat, lng=end.lng),
    ]
    return RouteResult(
        provider="osrm",
        fallback=False,
        distance_km=round(meters / 1000, 2),
        duration_minutes=round(seconds / 60, 1),
        start=start,
        end=end,
        waypoints=waypoints,
        geometry=geometry,
        source="openstreetmap-osrm",
    )


def search_location(query: str) -> list[dict]:
    if not query.strip():
        return []
    settings = get_settings()
    try:
        response = httpx.get(
            f"{settings.nominatim_base_url.rstrip('/')}/search",
            params={"q": query, "format": "json", "limit": 5},
            timeout=8.0,
            headers={"User-Agent": "TouchGrassAI/1.0 (offline outdoor companion)"},
        )
        response.raise_for_status()
    except httpx.HTTPError:
        return [
            {
                "label": "Golden Gate Park, San Francisco (demo)",
                "lat": DEMO_START.lat,
                "lng": DEMO_START.lng,
                "demo": True,
            }
        ]
    results = []
    for item in response.json():
        results.append(
            {
                "label": item.get("display_name"),
                "lat": float(item["lat"]),
                "lng": float(item["lon"]),
                "demo": False,
            }
        )
    if not results:
        return [
            {
                "label": "No matches. Try demo location: Golden Gate Park",
                "lat": DEMO_START.lat,
                "lng": DEMO_START.lng,
                "demo": True,
            }
        ]
    return results
