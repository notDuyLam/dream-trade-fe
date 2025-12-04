import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { getBaseUrl, isServer } from './Helpers';

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Helpers', () => {
  describe('getBaseUrl', () => {
    it('returns NEXT_PUBLIC_APP_URL when defined', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://app.dreamtrade.dev';

      expect(getBaseUrl()).toBe('https://app.dreamtrade.dev');
    });

    it('falls back to VERCEL project URL', () => {
      process.env.NEXT_PUBLIC_APP_URL = '';
      process.env.VERCEL_ENV = 'production';
      process.env.VERCEL_PROJECT_PRODUCTION_URL = 'dreamtrade.vercel.app';

      expect(getBaseUrl()).toBe('https://dreamtrade.vercel.app');
    });

    it('uses VERCEL_URL when available', () => {
      process.env.NEXT_PUBLIC_APP_URL = '';
      process.env.VERCEL_ENV = '';
      process.env.VERCEL_PROJECT_PRODUCTION_URL = '';
      process.env.VERCEL_URL = 'preview.vercel.app';

      expect(getBaseUrl()).toBe('https://preview.vercel.app');
    });

    it('defaults to localhost when nothing else is set', () => {
      process.env.NEXT_PUBLIC_APP_URL = '';
      process.env.VERCEL_ENV = '';
      process.env.VERCEL_PROJECT_PRODUCTION_URL = '';
      process.env.VERCEL_URL = '';

      expect(getBaseUrl()).toBe('http://localhost:3000');
    });
  });

  describe('isServer', () => {
    it('returns true in Vitest Node runtime', () => {
      expect(isServer()).toBe(true);
    });
  });
});
