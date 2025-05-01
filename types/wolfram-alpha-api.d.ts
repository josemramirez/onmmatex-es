declare module 'wolfram-alpha-api' {
  interface WolframAlphaClient {
    getFull: (query: string) => Promise<any>;
    // Agrega otros métodos que uses
  }
  function WolframAlphaAPI(apiKey: string): WolframAlphaClient;
  export default WolframAlphaAPI;
}
