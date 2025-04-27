import React from "react";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  location: string;
  image?: string;
  available: boolean;
}

interface Props {
  restaurant: Restaurant;
}

const RestaurantDetails: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      {restaurant.image && (
        <img
          src={`http://localhost:3001/uploads/${restaurant.image}`}
          alt="restaurant"
          className="rounded-2xl w-full max-w-full object-cover shadow-md"
        />
      )}

      <div className="text-center text-gray-800 space-y-4 mt-4">
        <h2 className="text-4xl font-bold text-blue-800 tracking-wide">{restaurant.name}</h2>
        <p className="text-xl font-bold text-blue-800 italic">{restaurant.address}</p>
        <p className="text-xl font-bold text-blue-800 italic">{restaurant.location}</p>

        <div className="flex flex-col items-center gap-2 mt-4">
          {restaurant.available ? (
            <span className="inline-block bg-green-100 text-green-700 font-semibold px-4 py-1 rounded-full text-lg shadow-sm animate-pulse">
              ✅ Open
            </span>
          ) : (
            <span className="inline-block bg-red-100 text-red-600 font-semibold px-4 py-1 rounded-full text-lg shadow-sm animate-pulse">
              ❌ Closed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;