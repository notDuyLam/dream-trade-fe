type RequestOptions<TBody> = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: TBody;
  cache?: RequestCache;
  revalidate?: number | false;
};

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return '';
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//.test(url);

export async function apiRequest<TResponse, TBody = unknown>(
  options: RequestOptions<TBody>,
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();
  const targetUrl = isAbsoluteUrl(options.path)
    ? options.path
    : `${baseUrl}${options.path}`;

  const response = await fetch(targetUrl, {
    method: options.method ?? 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
    cache: options.cache ?? 'no-store',
    next: options.revalidate === false
      ? undefined
      : { revalidate: options.revalidate ?? 0 },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unexpected API error');
  }

  return response.json();
}
