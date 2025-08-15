import * as L from "leaflet";

declare module "leaflet" {
  namespace Symbol {
    function arrowHead(options?: any): any;
    function dash(options?: any): any;
  }

  namespace polylineDecorator {
    interface Pattern {
      offset: number | string;
      repeat: number | string;
      symbol: any;
    }
  }

  function polylineDecorator(
    polyline: L.Polyline | L.LatLng[] | L.LatLng[][],
    options: { patterns: polylineDecorator.Pattern[] }
  ): L.Layer;
}