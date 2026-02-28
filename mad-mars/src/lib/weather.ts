import type { OpenMeteoResponse, WeatherDisplayData } from '../types/weather';
import { getWeatherInfo } from './weather-codes';

const HAMBURG_LAT = 53.55;
const HAMBURG_LON = 9.99;
const API_BASE = 'https://api.open-meteo.com/v1/forecast';

export function buildWeatherUrl(lat = HAMBURG_LAT, lon = HAMBURG_LON): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,weather_code',
    timezone: 'Europe/Berlin',
  });
  return `${API_BASE}?${params.toString()}`;
}

export async function fetchWeather(lat = HAMBURG_LAT, lon = HAMBURG_LON): Promise<WeatherDisplayData> {
  const url = buildWeatherUrl(lat, lon);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const data: OpenMeteoResponse = await response.json();
  return mapWeatherResponse(data);
}

export function mapWeatherResponse(data: OpenMeteoResponse): WeatherDisplayData {
  const { temperature_2m, weather_code, time } = data.current;
  const { description, icon } = getWeatherInfo(weather_code);

  return {
    temperature: Math.round(temperature_2m),
    unit: data.current_units.temperature_2m,
    weatherCode: weather_code,
    description,
    icon,
    timestamp: time,
  };
}
