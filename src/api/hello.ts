function isJsonResponse(contentType: string | null): boolean {
  return contentType?.includes('application/json') ?? false;
}

async function parseResponse(response: Response): Promise<string> {
  if (isJsonResponse(response.headers.get('content-type'))) {
    const json = (await response.json()) as unknown;
    return JSON.stringify(json, null, 2);
  }

  return response.text();
}

export async function getHelloWorld(): Promise<string> {
  const response = await fetch('/api/hello-world', {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
    },
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      payload || `Request failed with status ${response.status}.`,
    );
  }

  return payload;
}
