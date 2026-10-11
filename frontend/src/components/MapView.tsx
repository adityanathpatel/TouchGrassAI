import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteResult } from "../types";

const startIcon = L.divIcon({
  className: "custom-pin",
  html: '<div class="pin start-pin">S</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const endIcon = L.divIcon({
  className: "custom-pin",
  html: '<div class="pin end-pin">E</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function waypointIcon(num: number) {
  return L.divIcon({
    className: "custom-pin",
    html: `<div class="pin waypoint-pin">${num}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function AutoBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      try {
        const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
        map.fitBounds(bounds, { padding: [25, 25] });
      } catch {
        /* ignore bounds calc issues */
      }
    }
  }, [map, positions]);
  return null;
}

export function MapView({ route, height = 300 }: { route: RouteResult; height?: number }) {
  const latlngs = route.geometry.map(([lng, lat]) => [lat, lng] as [number, number]);
  const center = latlngs[0] || [route.start.lat, route.start.lng];

  return (
    <div className="map-wrap" style={{ height: `${height}px` }}>
      <MapContainer center={center} zoom={14} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AutoBounds positions={latlngs} />
        <Polyline positions={latlngs} pathOptions={{ color: "#2c5a38", weight: 5, opacity: 0.9 }} />
        <Marker position={[route.start.lat, route.start.lng]} icon={startIcon}>
          <Popup>
            <strong>Start Point</strong>
            <br />
            {route.distance_km} km loop begins here.
          </Popup>
        </Marker>
        <Marker position={[route.end.lat, route.end.lng]} icon={endIcon}>
          <Popup>
            <strong>Finish Point</strong>
            <br />
            Loop completes here.
          </Popup>
        </Marker>
        {route.waypoints.map((w, i) => (
          <Marker key={i} position={[w.lat, w.lng]} icon={waypointIcon(i + 1)}>
            <Popup>
              <strong>Checkpoint {i + 1}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

