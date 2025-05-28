import React from "react";
import ReactDOM from "react-dom/client";
import "@jetbrains/ring-ui-built/components/style.css";
import {
  ControlsHeightContext,
  ControlsHeight,
} from "@jetbrains/ring-ui-built/components/global/controls-height";
import { Provider } from "react-redux";
import store from "./store";

import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ControlsHeightContext.Provider value={ControlsHeight.S}>
        <App/>
      </ControlsHeightContext.Provider>
    </Provider>
  </React.StrictMode>
);
