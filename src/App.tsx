import { useState, useEffect } from 'react';
import { WeatherData } from './types/Weather';
import './App.css';

function App() {
  const [city, setCity] = useState('Palermo');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "d40dcc8061a3f1251840e46149de8c2d";

  useEffect(() => {
    fetchWeatherByGeolocationOnLoad();
  }, []);

  // Generalized fetch function for weather data
  const fetchWeatherData = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      setWeather(null);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch weather data.');
      }

      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city
  const fetchWeather = () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    fetchWeatherData(url);
  };

  // Fetch weather by geolocation
  const fetchWeatherByGeolocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${API_KEY}`;
        fetchWeatherData(url);
      },
      (err) => {
        const errorMessages: Record<number, string> = {
          1: 'Permission to access location was denied.',
          2: 'Location information is unavailable.',
          3: 'The request to get location timed out.',
        };
        setError(errorMessages[err.code] || 'An unknown error occurred.');
      }
    );
  };

  // Fetch weather on initial load without overwriting city search
  const fetchWeatherByGeolocationOnLoad = () => {
    if (!navigator.geolocation) {
      return; // No error set to avoid overwriting potential city errors
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${API_KEY}`;
        fetchWeatherData(url);
      }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  const handleGeolocationSearch = () => {
    fetchWeatherByGeolocation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-400 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-6">Weather Dashboard</h1>

      <div className="mb-6 flex">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="px-4 py-2 rounded-l outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleGeolocationSearch}
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Use My Location
        </button>
      </div>

      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-700 font-bold">{error}</p>}

      {weather && (
        <div className=" bg-gray-800  rounded shadow p-6 w-80 text-center">
          <h2 className="text-2xl font-bold mb-2">{weather.name}</h2>
          <p className="text-xl">{weather.main.temp}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            className="mx-auto"
          />
        </div>
      )}

    </div>
  );
}

export default App;