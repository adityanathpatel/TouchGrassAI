from app.schemas import Coordinate, RouteGenerateRequest
from app.services.geo import demo_route, path_distance_km
from app.services.routing import generate_route, validate_route


def test_demo_route_is_real_geometry():
    route = demo_route()
    validate_route(route)
    assert route.fallback is True
    assert len(route.geometry) > 3
    assert route.distance_km > 0


def test_invalid_geometry_rejected():
    route = demo_route()
    route.geometry = []
    try:
        validate_route(route)
        assert False, "should fail"
    except ValueError:
        pass


def test_demo_request_uses_packaged_route():
    result = generate_route(
        RouteGenerateRequest(start=Coordinate(lat=37.77, lng=-122.48), demo=True)
    )
    assert result.source == "hackathon-demo"
    assert result.distance_km == 3.8 or result.distance_km > 0


def test_path_distance_positive():
    assert path_distance_km([[0, 0], [0.01, 0.01]]) > 0
