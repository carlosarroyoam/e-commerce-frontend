declare global {
  interface Window {
    apiUrl: string;
  }
}

export const environment = {
  production: true,
  apiUrl: window.apiUrl,
};
