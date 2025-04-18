import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../api';

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        fetchRestaurants().then(res => setRestaurants(res.data));
    }, []);
    return (
        <div>
            <h2>Restaurants</h2>
            <ul>
                {restaurants.map((r: any) => (
                    <li key={r._id}>{r.name} - {r.available ? 'Open' : 'Closed'}</li>
                ))}
            </ul>
        </div>
    );
}