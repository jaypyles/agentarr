import api from "qbittorrent-api-v2";

let clientInstance: Awaited<ReturnType<typeof api.connect>> | null = null;
let connectionPromise: Promise<Awaited<ReturnType<typeof api.connect>>> | null =
  null;

const resetClient = () => {
  clientInstance = null;
  connectionPromise = null;
};

const isSessionExpiredError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = String(error.message || error).toLowerCase();
  const statusCode = error.statusCode || error.status || error.response?.status;
  
  // Extract status codes from error message (e.g., "HTTP request error: 403")
  const statusCodeMatch = errorMessage.match(/\b(401|403)\b/);
  const extractedStatusCode = statusCodeMatch && statusCodeMatch[1] ? parseInt(statusCodeMatch[1]) : null;
  
  // Check for common session expiration indicators
  return (
    statusCode === 401 ||
    statusCode === 403 ||
    extractedStatusCode === 401 ||
    extractedStatusCode === 403 ||
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("forbidden") ||
    errorMessage.includes("session") ||
    errorMessage.includes("authentication") ||
    errorMessage.includes("login")
  );
};

export const auth = () => {
  connectionPromise = api
    .connect(
      process.env.INTERNAL_QB_URL ?? process.env.QB_URL ?? "",
      process.env.QB_USERNAME ?? "",
      process.env.QB_PASSWORD ?? ""
    )
    .then((qbt) => {
      console.log("Connected to qBittorrent Web UI");
      clientInstance = qbt;
      return qbt;
    })
    .catch((err) => {
      console.error("Connection error:", err);
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

export const getClient = async (): Promise<
  Awaited<ReturnType<typeof api.connect>>
> => {
  if (clientInstance) {
    return clientInstance;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  return auth();
};

/**
 * Executes a qBittorrent API call with automatic session expiration handling.
 * If the session expires, it will automatically reconnect and retry the operation once.
 */
export const withClient = async <T>(
  operation: (client: Awaited<ReturnType<typeof api.connect>>) => Promise<T>
): Promise<T> => {
  try {
    const client = await getClient();
    return await operation(client);
  } catch (error) {
    // If session expired, reset client and retry once
    if (isSessionExpiredError(error)) {
      console.log("Session expired, reconnecting to qBittorrent...");
      resetClient();
      
      try {
        const client = await getClient();
        return await operation(client);
      } catch (retryError) {
        console.error("Failed to reconnect to qBittorrent:", retryError);
        throw retryError;
      }
    }
    
    throw error;
  }
};

export default getClient;
export { resetClient };
