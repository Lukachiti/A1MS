import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './AimTrainer/App.jsx';
import ReactionSpeed from './ReactionSpeed/ReactionSpeed.jsx';
import CpsSpeed from './CpsSpeed/CpsSpeed.jsx';
import AimTrackTrainer from './AimTrack/AimTrackTrainer.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/reaction-speed',
    element: <ReactionSpeed />,
  },
  {
    path: '/cps-speed',
    element: <CpsSpeed />,
  },
  {
    path: '/aim-track',
    element: <AimTrackTrainer />,
  },
]);

createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
  
);