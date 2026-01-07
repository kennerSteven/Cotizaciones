import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../src/Components/Table/global.css";
import Cotizaciones from "./Components/Table/Table";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Cotizaciones />
  </StrictMode>
);
