import { API_BASE_URL } from '../constants/api';

export type QueryParameters = Record<string, string | number | boolean | undefined>;

// Status 0: the request did not reach the server (offline, DNS, CORS)
const NETWORK_ERROR_STATUS = 0;
const NETWORK_ERROR_MESSAGE = 'Network error. Check your connection and try again.';

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : NETWORK_ERROR_MESSAGE;
}

export function buildApiUrl(path: string, query: QueryParameters = {}): string {
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.href;
}

// The API sends errors as { "error": "message" }
async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed with status ${String(response.status)}`;

  try {
    const body: unknown = await response.json();

    return isRecord(body) && typeof body.error === 'string' ? body.error : fallback;
  } catch {
    return fallback;
  }
}

export async function request<T>(
  path: string,
  query?: QueryParameters,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path, query), { signal });
  } catch (error) {
    // A cancelled request is not an error for the user
    if (isAbortError(error)) {
      throw error;
    }

    throw new ApiError(NETWORK_ERROR_MESSAGE, NETWORK_ERROR_STATUS);
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  const body: unknown = await response.json();

  return body as T;
}
