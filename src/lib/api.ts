const isDev = (import.meta as any).env?.MODE !== 'production';
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || (isDev ? '/api' : 'http://localhost:5000');

export interface ApiOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const mergedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };
  if (token) {
    (mergedHeaders as any)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: mergedHeaders,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try { const data = await res.json(); message = data?.message || message; } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

