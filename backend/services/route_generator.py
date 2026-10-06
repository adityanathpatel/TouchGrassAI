import httpx
import math
import random
from typing import Tuple, List, Dict, Any

async def generate_route(lat: float, lng: float, distance_km: float) -> Dict[str, Any]:
    # For a real implementation, we could call OSRM or OpenRouteService API
    # Since we are mocking the route calculation for simplicity if no provider is setup:
    
    # Generate a circular-ish route based on the requested distance
    # Very rough approximation: 1 degree latitude is ~111km
    radius_deg = (distance_km / 2 / math.pi) / 111.0
    
    num_points = 10
    route_geometry = []
    
    for i in range(num_points):
        angle = (i / num_points) * 2 * math.pi
        dlat = radius_deg * math.cos(angle)
        dlng = radius_deg * math.sin(angle)
        # add some noise
        dlat += (random.random() - 0.5) * radius_deg * 0.2
        dlng += (random.random() - 0.5) * radius_deg * 0.2
        route_geometry.append([lat + dlat, lng + dlng])
    
    route_geometry.append([lat + radius_deg, lng]) # Close loop back
    
    return {
        "start_lat": lat,
        "start_lng": lng,
        "end_lat": lat,
        "end_lng": lng,
        "distance_km": distance_km,
        "route_geometry": route_geometry
    }
