import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getPathLength } from "geolib";

export const DefaultIcon1 = L.icon({
  iconRetinaUrl: markerIcon2x?.src ?? markerIcon2x,
  iconUrl: markerIcon?.src ?? markerIcon,
  shadowUrl: markerShadow?.src ?? markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const ColoredMarker = (
  color: "red" | "green" | "blue" | "black" | "purple"
) => {
  // رنگ دلخواه را انتخاب می‌کنیم
  const fillColor =
    color === "red" ? "#FF4136" : color === "green" ? "#2ECC40" : "#0074D9"; // blue پیش‌فرض

  return L.divIcon({
    html: `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <!-- سایه زمین -->
        <ellipse cx="12.5" cy="39" rx="8" ry="3" fill="rgba(0,0,0,0.4)" />

        <!-- قطره اصلی -->
        <path d="M12.5 0 C19 0 25 6 25 13 C25 24 12.5 41 12.5 41 C12.5 41 0 24 0 13 C0 6 6 0 12.5 0 Z"
              fill="${fillColor}" stroke="#660000" stroke-width="1" />

        <!-- هایلایت براق سه‌بعدی -->
        <path d="M12.5 0 C19 0 25 6 25 13 C25 24 12.5 41 12.5 41 C12.5 41 0 24 0 13 C0 6 6 0 12.5 0 Z"
              fill="white" fill-opacity="0.15" />

        <!-- دایره سفید کوچک داخل برای عمق -->
        <circle cx="12.5" cy="13" r="4" fill="white" fill-opacity="0.4" />
      </svg>
    `,
    className: "",
    iconSize: [25, 41], // اندازه آیکون مشابه Leaflet
    iconAnchor: [12, 41], // نوک پایین آیکون روی مختصات
    popupAnchor: [1, -34], // popup درست در بالا
  });
};

export function buildPathKilometr(path: any) {
  const convertPath = path.map((item: any) => ({ lat: item[0], lng: item[1] }));
  const distanceInMeters = getPathLength(convertPath);
  const distanceInKm = (distanceInMeters / 1000).toFixed(2);
  return `${distanceInKm} کیلومتر`;
}
