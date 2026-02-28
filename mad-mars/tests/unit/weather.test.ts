import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWeather, buildWeatherUrl, mapWeatherResponse } from '../../src/lib/weather';
import type { OpenMeteoResponse } from '../../src/types/weather';

const mockResponse: OpenMeteoResponse = {
  latitude: 53.55,
  longitude: 9.99,
  current: {
    time: '2026-02-27T14:00',
    interval: 900,
    temperature_2m: 8.3,
    weather_code: 2,
  },
  current_units: {
    temperature_2m: '°C',
    weather_code: 'wmo code',
  },
};

describe('buildWeatherUrl', () => {
  it('builds URL with default Hamburg coordinates', () => {
    const url = buildWeatherUrl();
    expect(url).toContain('latitude=53.55');
    expect(url).toContain('longitude=9.99');
    expect(url).toContain('current=temperature_2m%2Cweather_code');
    expect(url).toContain('timezone=Europe%2FBerlin');
  });

  it('accepts custom coordinates', () => {
    const url = buildWeatherUrl(52.52, 13.41);
    expect(url).toContain('latitude=52.52');
    expect(url).toContain('longitude=13.41');
  });
});

describe('mapWeatherResponse', () => {
  it('maps API response to display data', () => {
    const result = mapWeatherResponse(mockResponse);
    expect(result.temperature).toBe(8);
    expect(result.unit).toBe('°C');
    expect(result.weatherCode).toBe(2);
    expect(result.description).toBe('Teilweise bewölkt');
    expect(result.icon).toBe('⛅');
    expect(result.timestamp).toBe('2026-02-27T14:00');
  });

  it('rounds temperature to nearest integer', () => {
    const data = { ...mockResponse, current: { ...mockResponse.current, temperature_2m: 7.6 } };
    expect(mapWeatherResponse(data).temperature).toBe(8);
  });
});

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns mapped weather data on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }));

    const result = await fetchWeather();
    expect(result.temperature).toBe(8);
    expect(result.description).toBe('Teilweise bewölkt');
  });

  it('throws on API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }));

    await expect(fetchWeather()).rejects.toThrow('Weather API error: 500');
  });
});
