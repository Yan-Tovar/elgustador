import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CarritoProvider } from './context/CarritoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

root.render(
  <React.StrictMode>
    <CarritoProvider>
      <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
        <App />
      </PayPalScriptProvider>
    </CarritoProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
