import { describe, it, expect } from 'vitest';
import { getWeatherInfo } from '../../src/lib/weather-codes';

describe('getWeatherInfo', () => {
  it('returns correct info for clear sky (code 0)', () => {
    const info = getWeatherInfo(0);
    expect(info.description).toBe('Klarer Himmel');
    expect(info.icon).toBe('☀️');
  });

  it('returns correct info for partly cloudy (code 2)', () => {
    const info = getWeatherInfo(2);
    expect(info.description).toBe('Teilweise bewölkt');
    expect(info.icon).toBe('⛅');
  });

  it('returns correct info for thunderstorm (code 95)', () => {
    const info = getWeatherInfo(95);
    expect(info.description).toBe('Gewitter');
    expect(info.icon).toBe('⛈️');
  });

  it('returns fallback for unknown code', () => {
    const info = getWeatherInfo(999);
    expect(info.description).toBe('Unbekannt');
    expect(info.icon).toBe('🌡️');
  });

  it('returns fallback for negative code', () => {
    const info = getWeatherInfo(-1);
    expect(info.description).toBe('Unbekannt');
  });
});
