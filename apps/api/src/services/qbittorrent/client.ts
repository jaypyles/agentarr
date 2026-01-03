import api from "qbittorrent-api-v2";

let clientInstance: Awaited<ReturnType<typeof api.connect>> | null = null;
let connectionPromise: Promise<Awaited<ReturnType<typeof api.connect>>> | null =
  null;

const getClient = async (): Promise<
  Awaited<ReturnType<typeof api.connect>>
> => {
  if (clientInstance) {
    return clientInstance;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

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

export default getClient;
