import './App.css'
import {useEffect, useState} from "react";


type HealthResponse = {
    status: string;
    env: string;
    time: string;
}

function App() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
      async function load() {
          try {
              setError(null);

              const res = await fetch(`${apiUrl}/health`, {
                  method: "GET",
                  credentials: "include",
              });

              if (!res.ok) {
                  throw new Error(`HTTP ${res.status}`);
              }

              const json = (await res.json()) as HealthResponse;
              setData(json);
          } catch (e: any) {
              setError(e.message ?? "Unknown error");
          }
      }

      load();
  }, [apiUrl]);

  return (
    <div style={{ fontFamily: "system-ui",  padding: 24 }}>
        <h1>Go-React-Rooms</h1>
        <p>Health Check</p>

        <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
            <div><strong>API URL:</strong> {apiUrl}</div>

            {error && (
                <div style={{ marginTop: 12 }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {data && (
                <pre style={{ marginTop: 12, background: "#f6f6f6", padding: 12, borderRadius: 12 }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}

            {!error && !data && <div style={{ marginTop: 12 }}>Loading...</div>}
        </div>
    </div>
  )
}

export default App
