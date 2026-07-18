import { renderToString } from 'react-dom/server';
import App from './App';

export function prerender() {
  const html = renderToString(<App />);
  return { html };
}
