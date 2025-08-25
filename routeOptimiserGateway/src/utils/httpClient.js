import axios from 'axios';

export function makeHttpClient(baseURL, timeoutMs = 120000) {
  const client = axios.create({ baseURL, timeout: timeoutMs, headers: { 'Content-Type': 'application/json' } });

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const config = error.config;
      if (!config) throw error;
      const maxRetries = Number(process.env.HTTP_MAX_RETRIES || 1);
      const status = error.response && error.response.status;
      const shouldRetry = (!status || (status >= 500 && status < 600));
      config.__retryCount = config.__retryCount || 0;
      if (shouldRetry && config.__retryCount < maxRetries) {
        config.__retryCount += 1;
        const backoffMs = Math.min(1000 * Math.pow(2, config.__retryCount - 1), 8000);
        await new Promise((r) => setTimeout(r, backoffMs));
        return client(config);
      }
      throw error;
    }
  );

  return client;
}


