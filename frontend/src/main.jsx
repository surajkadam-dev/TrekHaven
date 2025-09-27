import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import LoadingSpinner from "./Components/Home/LoadingSpinner.jsx";

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <App
        // onMount={() => {
        //   // Signal that React has mounted
        //   document.dispatchEvent(new Event("reactMounted"));
        // }}
        />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
