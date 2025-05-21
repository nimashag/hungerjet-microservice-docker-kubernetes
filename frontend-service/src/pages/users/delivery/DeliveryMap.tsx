import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const DeliveryMap = ({ restaurantLocation, deliveryLocation }: DeliveryMapProps) => {
  const [restaurantCoords, setRestaurantCoords] = useState<[number, number] | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  // SLIIT Malabe coordinates (fixed driver location)
  const driverLocation: [number, number] = [6.9147, 79.9723];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      geocodeAddress(restaurantLocation || 'Malabe'),
      geocodeAddress(deliveryLocation || 'Kadawatha')
    ]).then(([restCoords, delCoords]) => {
      setRestaurantCoords(restCoords);
      setDeliveryCoords(delCoords);
      setLoading(false);
    });
  }, [restaurantLocation, deliveryLocation]);

  if (loading) return <div>Loading map...</div>;

  return (
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
              <p>SLIIT Malabe</p>
            </div>
          </Popup>
        </Marker>
        {restaurantCoords && (
          <Marker position={restaurantCoords} icon={restaurantIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">Restaurant</h3>
                <p>{restaurantLocation}</p>
              </div>
            </Popup>
          </Marker>
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
  );
};

export default DeliveryMap; 