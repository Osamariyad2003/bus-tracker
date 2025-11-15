import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Bus, BusLocation } from "@/lib/supabase";

interface BusWithLocation {
  bus: Bus;
  location?: BusLocation;
}

interface BusMapProps {
  buses: BusWithLocation[];
  selectedBusId?: string;
  onBusSelect?: (busId: string) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const mapOptions = {
  zoom: 13,
  mapTypeControl: true,
  fullscreenControl: true,
  streetViewControl: false,
};

export function BusMap({ buses, selectedBusId, onBusSelect }: BusMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef<GoogleMap | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (selectedBusId && buses.length > 0) {
      const selectedBus = buses.find((b) => b.bus.id === selectedBusId);
      if (selectedBus?.location) {
        setMapCenter({
          lat: selectedBus.location.location.lat,
          lng: selectedBus.location.location.lng,
        });
      }
    }
  }, [selectedBusId, buses]);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-secondary rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      ref={mapRef}
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      options={mapOptions}
    >
      {buses.map((busData) => {
        if (!busData.location) return null;

        const isSelected = selectedBusId === busData.bus.id;

        return (
          <Marker
            key={busData.bus.id}
            position={{
              lat: busData.location.location.lat,
              lng: busData.location.location.lng,
            }}
            title={busData.bus.name}
            onClick={() => {
              setInfoWindowOpen(busData.bus.id);
              onBusSelect?.(busData.bus.id);
            }}
            icon={{
              path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z",
              scale: isSelected ? 1.5 : 1,
              fillColor: isSelected ? "#0ea5e9" : "#f59e0b",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        );
      })}

      {infoWindowOpen && (
        <InfoWindow
          position={
            buses.find((b) => b.bus.id === infoWindowOpen)?.location?.location ||
            defaultCenter
          }
          onCloseClick={() => setInfoWindowOpen(null)}
        >
          <div className="p-2 text-sm">
            {buses.find((b) => b.bus.id === infoWindowOpen) && (
              <div>
                <p className="font-semibold text-gray-900">
                  {buses.find((b) => b.bus.id === infoWindowOpen)?.bus.name}
                </p>
                <p className="text-gray-600 text-xs">
                  {buses.find((b) => b.bus.id === infoWindowOpen)?.bus.bus_number}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Speed:{" "}
                  {buses.find((b) => b.bus.id === infoWindowOpen)?.location
                    ?.speed_kmh || 0}{" "}
                  km/h
                </p>
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
