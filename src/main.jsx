import '~bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import React from 'react'
import { Suspense, lazy } from 'react'
import Spinner from '@/components/Spinner';
import ReactDOM from 'react-dom/client';

const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </React.StrictMode>,
)