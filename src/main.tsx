import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
    <h1>🧠 QianPulsa Documentation Portal</h1>
    <p>Gunakan folder <code>/docs/</code> untuk membaca spesifikasi teknis lengkap.</p>
    <ul>
      <li><a href="/docs/intro.md">Pendahuluan</a></li>
      <li><a href="/docs/database-schema.md">Skema Database</a></li>
      <li><a href="/docs/roadmap-store-app.md">Roadmap Store App</a></li>
    </ul>
    <hr />
    <small>Repositori ini khusus untuk dokumentasi arsitektur.</small>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
