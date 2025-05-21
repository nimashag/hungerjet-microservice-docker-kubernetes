import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icons
const driverIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4108/4108680.png', // truck icon from Flaticon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customerIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5216/5216405.png', // person icon from Flaticon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const restaurantIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', // restaurant icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface DeliveryMapProps {
  restaurantLocation: string;
  deliveryLocation: string;
}

// Helper to geocode an address string to [lat, lng] using Nominatim
async function geocodeAddress(address: string): Promise<[number, number]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&email=your@email.com`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (e) {}
  // Default to Kadawatha if not found
  return [7.0012, 79.9535];
}

function haversineDistance([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function fetchRoute(from: [number, number], to: [number, number]): Promise<[number, number][]> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.routes && data.routes.length > 0) {
    return data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
  }
  return [];
}

const DeliveryMap = ({ restaurantLocation, deliveryLocation }: DeliveryMapProps) => {
  const [restaurantCoords, setRestaurantCoords] = useState<[number, number] | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  // SLIIT New Building coordinates (fixed driver location)
  const driverLocation: [number, number] = [6.9157, 79.9735];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      geocodeAddress(restaurantLocation || 'Malabe'),
      geocodeAddress(deliveryLocation || 'Kadawatha')
    ]).then(async ([restCoords, delCoords]) => {
      setRestaurantCoords(restCoords);
      setDeliveryCoords(delCoords);
      setLoading(false);
      // Fetch and set the route
      if (restCoords) {
        const route = await fetchRoute(driverLocation, restCoords);
        setRouteCoords(route);
      }
    });
  }, [restaurantLocation, deliveryLocation]);

  const distanceToRestaurant = restaurantCoords ? haversineDistance(driverLocation, restaurantCoords) : null;

  if (loading) return <div>Loading map...</div>;

  return (
    <>
      <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={driverLocation}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={driverLocation} icon={driverIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">Driver Location</h3>
                <p>SLIIT New Building</p>
              </div>
            </Popup>
          </Marker>
          {restaurantCoords && (
            <Marker position={restaurantCoords} icon={restaurantIcon}>
              <Popup>
                <div>
                  <h3 className="font-bold">Restaurant</h3>
                  <p>{restaurantLocation}</p>
                  {distanceToRestaurant !== null && (
                    <p className="text-blue-700 font-semibold mt-2">
                      Distance from driver: {distanceToRestaurant.toFixed(2)} km
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: 'blue', weight: 4 }}
            />
          )}
          {deliveryCoords && (
            <Marker position={deliveryCoords} icon={customerIcon}>
              <Popup>
                <div>
                  <h3 className="font-bold">Delivery Location</h3>
                  <p>{deliveryLocation}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      {distanceToRestaurant !== null && (
        <div className="mt-2 text-lg font-semibold text-blue-700">
          Distance to restaurant: {distanceToRestaurant.toFixed(2)} km
        </div>
      )}
    </>
  );
};

export default DeliveryMap; 