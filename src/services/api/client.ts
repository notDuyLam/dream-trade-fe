import { getAccessToken } from '@/utils/auth';

type RequestOptions<TBody> = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: TBody;
  cache?: RequestCache;
  revalidate?: number | false;
  headers?: Record<string, string>;
};

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Default to gateway if no API URL set
  return 'http://localhost:3000';
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//.test(url);

export async function apiRequest<TResponse, TBody = unknown>(
  options: RequestOptions<TBody>,
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();
  const targetUrl = isAbsoluteUrl(options.path)
    ? options.path
    : `${baseUrl}${options.path}`;

  // Get access token for authenticated requests
  const accessToken = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(targetUrl, {
    method: options.method ?? 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers,
    cache: options.cache ?? 'no-store',
    credentials: 'include', // Include cookies for httpOnly tokens
    next: options.revalidate === false
      ? undefined
      : { revalidate: options.revalidate ?? 0 },
  });

  if (!response.ok) {
    let errorMessage = 'Unexpected API error';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
