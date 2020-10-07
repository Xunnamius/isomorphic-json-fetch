export type FetchConfig = Omit<RequestInit, 'body'> & { rejects?: boolean, body?: Record<string, unknown> };
