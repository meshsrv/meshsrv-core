declare module 'bun' {
  interface Env {
    DB_FILE_NAME: string;
    API_SERVER_PORT: string;

    CA_CERT_FILE: string;
    CA_KEY_FILE: string;
    CERT_FILE: string;
    KEY_FILE: string;
  }
}
