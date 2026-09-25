export const API_URL = "http://localhost:3000/api/v1";

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Error ${response.status}: ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
