type RequestOptions<TBody> = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: TBody;
  cache?: RequestCache;
  revalidate?: number | false;
};

/**
 * Base URL for API (market, crawler, analysis, etc.). Uses NEXT_PUBLIC_API_URL.
 * After changing .env, restart `next dev` (or rebuild) so the new value is used.
 */
export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return '';
};

/**
 * Base URL for Auth API via Gateway.
 * All auth requests go through gateway which routes to auth service.
 */
export const getAuthBaseUrl = () => {
  return getApiBaseUrl();
};

/**
 * Base URL for AI Analysis API via Gateway (port 8080 with /analysis/* routing).
 * Gateway handles VipForAnalysisGuard and proxies to AI service.
 * Uses NEXT_PUBLIC_API_URL (gateway) instead of direct service URL.
 */
export const getAnalysisBaseUrl = () => {
  return getApiBaseUrl() || 'http://localhost:8080';
};

/**
 * Base URL for Subscription API via Gateway.
 * All subscription requests go through gateway which routes to subscription service.
 */
export const getSubscriptionBaseUrl = () => {
  return getApiBaseUrl();
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//.test(url);

export async function apiRequest<TResponse, TBody = unknown>(options: RequestOptions<TBody>): Promise<TResponse> {
  const baseUrl = options.path.startsWith('/auth') ? getAuthBaseUrl() : getApiBaseUrl();
  const targetUrl = isAbsoluteUrl(options.path) ? options.path : `${baseUrl}${options.path}`;

  const response = await fetch(targetUrl, {
    method: options.method ?? 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: Send cookies with requests
    cache: options.cache ?? 'no-store',
    next: options.revalidate === false ? undefined : { revalidate: options.revalidate ?? 0 },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unexpected API error');
  }

  return response.json();
}

type SubscriptionRequestOptions<TBody> = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: TBody;
};

/**
 * Call Subscription Service via Gateway (port 8080).
 * Gateway routes /subscriptions/* to subscription service.
 * Uses credentials: 'include' so auth cookie is sent.
 */
export async function subscriptionRequest<TResponse, TBody = unknown>(
  options: SubscriptionRequestOptions<TBody>,
): Promise<TResponse> {
  const baseUrl = getSubscriptionBaseUrl();
  const url = options.path.startsWith('http') ? options.path : `${baseUrl}${options.path}`;

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? text;
    } catch {
      // use text as-is
    }
    throw new Error(message || 'Subscription API error');
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return undefined as TResponse;
}
