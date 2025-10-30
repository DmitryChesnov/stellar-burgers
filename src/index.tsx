import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux'; // ДОБАВЛЕНО: Provider для Redux
import { store } from './services/store'; // ДОБАВЛЕНО: Импорт store
import App from './components/app/app';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    {/* ДОБАВЛЕНО: Обертка приложения в Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
