export type ServerConfig = {
  host: string;
  port: number;
};

export function readServerConfig(): ServerConfig {
  const host = process.env.HOST ?? "127.0.0.1";
  const port = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);

  return {
    host,
    port,
  };
}
