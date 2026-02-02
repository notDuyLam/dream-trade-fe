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
 * Base URL for Auth API (login, register, profile). Uses NEXT_PUBLIC_AUTH_API_URL, fallback to getApiBaseUrl().
 */
export const getAuthBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_AUTH_API_URL) {
    return process.env.NEXT_PUBLIC_AUTH_API_URL;
  }
  return getApiBaseUrl();
};

/**
 * Base URL for AI Analysis API (runs on port 3003 by default). Uses NEXT_PUBLIC_ANALYSIS_API_URL.
 */
export const getAnalysisBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_ANALYSIS_API_URL
    || 'http://localhost:3003'
  );
};

/**
 * Base URL for Subscription API (plans, upgrade, billing – runs on port 3006). Uses NEXT_PUBLIC_SUBSCRIPTION_API_URL.
 */
export const getSubscriptionBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_SUBSCRIPTION_API_URL
    || 'http://localhost:3006'
  );
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
 * Call Subscription Service API (port 3006). Uses credentials: 'include' so auth cookie is sent.
 * Requires user to be logged in (same auth cookie as Auth API).
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
