interface WeatherCodeInfo {
  description: string;
  icon: string;
}

const weatherCodes: Record<number, WeatherCodeInfo> = {
  0:  { description: 'Klarer Himmel',          icon: '☀️' },
  1:  { description: 'Überwiegend klar',       icon: '🌤️' },
  2:  { description: 'Teilweise bewölkt',      icon: '⛅' },
  3:  { description: 'Bewölkt',                icon: '☁️' },
  45: { description: 'Nebel',                  icon: '🌫️' },
  48: { description: 'Reifnebel',              icon: '🌫️' },
  51: { description: 'Leichter Nieselregen',   icon: '🌦️' },
  53: { description: 'Mäßiger Nieselregen',    icon: '🌦️' },
  55: { description: 'Starker Nieselregen',    icon: '🌧️' },
  56: { description: 'Gefrierender Nieselregen', icon: '🌧️' },
  57: { description: 'Starker gefrierender Nieselregen', icon: '🌧️' },
  61: { description: 'Leichter Regen',         icon: '🌧️' },
  63: { description: 'Mäßiger Regen',          icon: '🌧️' },
  65: { description: 'Starker Regen',          icon: '🌧️' },
  66: { description: 'Gefrierender Regen',     icon: '🌧️' },
  67: { description: 'Starker gefrierender Regen', icon: '🌧️' },
  71: { description: 'Leichter Schneefall',    icon: '🌨️' },
  73: { description: 'Mäßiger Schneefall',     icon: '🌨️' },
  75: { description: 'Starker Schneefall',     icon: '❄️' },
  77: { description: 'Schneegriesel',          icon: '🌨️' },
  80: { description: 'Leichte Regenschauer',   icon: '🌦️' },
  81: { description: 'Mäßige Regenschauer',    icon: '🌧️' },
  82: { description: 'Starke Regenschauer',    icon: '🌧️' },
  85: { description: 'Leichte Schneeschauer',  icon: '🌨️' },
  86: { description: 'Starke Schneeschauer',   icon: '🌨️' },
  95: { description: 'Gewitter',               icon: '⛈️' },
  96: { description: 'Gewitter mit leichtem Hagel', icon: '⛈️' },
  99: { description: 'Gewitter mit starkem Hagel',  icon: '⛈️' },
};

const fallback: WeatherCodeInfo = {
  description: 'Unbekannt',
  icon: '🌡️',
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return weatherCodes[code] ?? fallback;
}
