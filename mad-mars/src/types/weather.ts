export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    weather_code: string;
  };
}

export interface WeatherDisplayData {
  temperature: number;
  unit: string;
  weatherCode: number;
  description: string;
  icon: string;
  timestamp: string;
}
