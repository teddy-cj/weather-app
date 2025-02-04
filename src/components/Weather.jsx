import React, { useEffect, useState } from 'react';
import './Weather.css';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import search_icon from '../assets/search.png';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    
    const [city, setCity] = useState("London"); // Default city

    const API_KEY = process.env.REACT_APP_API_KEY; // Load API key from .env

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon
    };

    const search = async (cityName) => {
        if (!API_KEY) {
            console.error("API key is missing!");
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    icon: allIcons[data.weather[0].icon] || clear_icon
                });
            } else {
                console.error("Error:", data.message);
                setWeatherData(null);
            }
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    };

    useEffect(() => {
        search(city);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search(city);
        }
    };


    return (
        <div className='weather'>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder='Search city...'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <img 
                    src={search_icon} 
                    alt="Search" 
                    onClick={() => search(city)} 
                    style={{ cursor: "pointer" }}
                />
            </div>

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}&deg;C</p>
                    <p className='location'>{weatherData.location}</p>

                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity icon" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind icon" />
                            <div>
                                <p>{weatherData.windSpeed} Km/hr</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p className="error-message">City not found. Try another search.</p>
            )}
        </div>
    );
};

export default Weather;
