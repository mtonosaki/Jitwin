import HttpClientCustom from 'HttpClientCustom';

describe('post()', () => {
  const cases = [
    {
      host: 'https://fuga.example.com',
      path: '/api-name-hoge',
      body: { param1: 100, param2: 'piyo' },
      expectedUrl: 'https://fuga.example.com/api-name-hoge',
    },
    {
      host: 'https://hoge.example.com',
      path: '/api-name',
      body: { param1: 'param1', param2: 'param2' },
      expectedUrl: 'https://hoge.example.com/api-name',
    },
  ];

  it.each(cases)(
    'Set parameter to fetch',
    async ({ host, path, body, expectedUrl }) => {
      // Given
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce(new Response(JSON.stringify('')));
      const httpClient = new HttpClientCustom(host);

      // When
      await httpClient.post(path, body);

      // Then
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        method: 'POST',
      });
    }
  );

  it.each(cases)('Get response', async ({ host, path, body }) => {
    // Given
    const expectedResponse = { id: 'id-9999-8888' };
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify(expectedResponse), {
        headers: { 'content-length': '8' },
      })
    );

    const httpClient = new HttpClientCustom(host);

    // When
    const response = await httpClient.post(path, body);

    // Then
    expect(response).toEqual(expectedResponse);
  });

  it.each(cases)(
    'Get undefined from no response API',
    async ({ host, path, body }) => {
      // Given
      const headers: Record<string, string> = {
        'content-length': '0',
      };
      global.fetch = jest
        .fn()
        .mockResolvedValue(new Response(null, { status: 200, headers }));

      const httpClient = new HttpClientCustom(host);

      // When
      const response = await httpClient.post(path, body);

      // Then
      expect(response).toBeUndefined();
    }
  );
});

describe('patch()', () => {
  const cases = [
    {
      host: 'https://fuga.example.com',
      path: '/api-name-hoge',
      body: { param1: 100, param2: 'piyo' },
      expectedUrl: 'https://fuga.example.com/api-name-hoge',
    },
    {
      host: 'https://hoge.example.com',
      path: '/api-name',
      body: { param1: 'param1', param2: 'param2' },
      expectedUrl: 'https://hoge.example.com/api-name',
    },
  ];

  it.each(cases)(
    'Set parameter to fetch',
    async ({ host, path, body, expectedUrl }) => {
      // Given
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce(new Response(JSON.stringify('')));
      const httpClient = new HttpClientCustom(host);

      // When
      await httpClient.patch(path, body);

      // Then
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        method: 'PATCH',
      });
    }
  );

  it.each(cases)('Get response', async ({ host, path, body }) => {
    // Given
    const expectedResponse = { id: '4444-5567' };
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify(expectedResponse), {
        headers: { 'content-length': '8' },
      })
    );

    const httpClient = new HttpClientCustom(host);

    // When
    const response = await httpClient.patch(path, body);

    // Then
    expect(response).toEqual(expectedResponse);
  });

  it.each(cases)(
    'Get undefined from no response API',
    async ({ host, path, body }) => {
      // Given
      const headers: Record<string, string> = {
        'content-length': '0',
      };
      global.fetch = jest
        .fn()
        .mockResolvedValue(new Response(null, { status: 200, headers }));

      const httpClient = new HttpClientCustom(host);

      // When
      const response = await httpClient.patch(path, body);

      // Then
      expect(response).toBeUndefined();
    }
  );
});

describe('delete()', () => {
  const cases = [
    {
      host: 'https://piyo.example.com',
      path: '/api-name-hoge',
      expectedUrl: 'https://piyo.example.com/api-name-hoge',
    },
    {
      host: 'https://fuga.example.com',
      path: '/api-name',
      expectedUrl: 'https://fuga.example.com/api-name',
    },
  ];

  it.each(cases)(
    'Set parameter to fetch',
    async ({ host, path, expectedUrl }) => {
      // Given
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce(new Response(JSON.stringify('')));
      const httpClient = new HttpClientCustom(host);

      // When
      await httpClient.delete(path);

      // Then
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
        method: 'DELETE',
      });
    }
  );

  it.each(cases)(
    'Get undefined from no response API',
    async ({ host, path }) => {
      // Given
      const headers: Record<string, string> = {
        'content-length': '0',
      };
      global.fetch = jest
        .fn()
        .mockResolvedValue(new Response(null, { status: 200, headers }));

      const httpClient = new HttpClientCustom(host);

      // When
      const response = await httpClient.delete(path);

      // Then
      expect(response).toBeUndefined();
    }
  );
});

describe('get()', () => {
  let httpClient: HttpClientCustom;

  beforeEach(() => {
    const response = new Response(
      JSON.stringify({ key1: 'value1', key2: true, key3: [1, 2, 3] }),
      { status: 200 }
    );
    global.fetch = jest.fn().mockResolvedValueOnce(response);

    httpClient = new HttpClientCustom('https://hoge.example.com');
  });

  it('Throw error when receiving http status other than 200', async () => {
    const response = new Response(
      JSON.stringify({ key1: 'value1', key2: true, key3: [1, 2, 3] }),
      {
        status: 403,
      }
    );
    global.fetch = jest.fn().mockResolvedValueOnce(response);
    await expect(async () => {
      await httpClient.get('/test-get-api');
    }).rejects.toThrow('Status is not ok');
  });

  it('Set parameter to fetch', async () => {
    await httpClient.get('/test-get-api');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://hoge.example.com/test-get-api',
      { method: 'GET' }
    );
  });

  it('Get response', async () => {
    const result = await httpClient.get('/test-get-api');

    expect(result).toEqual({ key1: 'value1', key2: true, key3: [1, 2, 3] });
  });
});
