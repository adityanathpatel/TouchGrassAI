from math import atan2, cos, radians, sin, sqrt

from app.schemas import Coordinate, RouteResult


# Golden Gate Park meadow loop — published demo geometry, not LLM-invented.
DEMO_GEOMETRY = [
    [-122.4862, 37.7694],
    [-122.4839, 37.7699],
    [-122.4815, 37.7711],
    [-122.4798, 37.7724],
    [-122.4781, 37.7710],
    [-122.4796, 37.7692],
    [-122.4824, 37.7684],
    [-122.4851, 37.7688],
    [-122.4862, 37.7694],
]

DEMO_START = Coordinate(lat=37.7694, lng=-122.4862)


def haversine_km(a: Coordinate, b: Coordinate) -> float:
    r = 6371.0
    dlat = radians(b.lat - a.lat)
    dlng = radians(b.lng - a.lng)
    x = sin(dlat / 2) ** 2 + cos(radians(a.lat)) * cos(radians(b.lat)) * sin(dlng / 2) ** 2
    return 2 * r * atan2(sqrt(x), sqrt(1 - x))


def path_distance_km(geometry: list[list[float]]) -> float:
    total = 0.0
    for i in range(1, len(geometry)):
        a = Coordinate(lat=geometry[i - 1][1], lng=geometry[i - 1][0])
        b = Coordinate(lat=geometry[i][1], lng=geometry[i][0])
        total += haversine_km(a, b)
    return round(total, 2)


def walking_minutes(distance_km: float) -> float:
    return round((distance_km / 4.5) * 60, 1)


def demo_route(label: str = "demo") -> RouteResult:
    start = DEMO_START
    end = Coordinate(lat=DEMO_GEOMETRY[-1][1], lng=DEMO_GEOMETRY[-1][0])
    waypoints = [
        Coordinate(lat=37.7711, lng=-122.4815),
        Coordinate(lat=37.7724, lng=-122.4798),
        Coordinate(lat=37.7692, lng=-122.4796),
    ]
    distance = path_distance_km(DEMO_GEOMETRY)
    return RouteResult(
        provider="local-demo",
        fallback=True,
        distance_km=distance or 3.8,
        duration_minutes=walking_minutes(distance or 3.8),
        start=start,
        end=end,
        waypoints=waypoints,
        geometry=DEMO_GEOMETRY,
        source=label,
    )


def offset_loop(start: Coordinate, radius_deg: float = 0.008) -> list[list[float]]:
    points = [
        [start.lng, start.lat],
        [start.lng + radius_deg * 0.6, start.lat + radius_deg * 0.2],
        [start.lng + radius_deg, start.lat + radius_deg * 0.7],
        [start.lng + radius_deg * 0.2, start.lat + radius_deg],
        [start.lng - radius_deg * 0.5, start.lat + radius_deg * 0.4],
        [start.lng - radius_deg * 0.3, start.lat - radius_deg * 0.2],
        [start.lng, start.lat],
    ]
    return points
