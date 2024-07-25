import errorHandler from "./middleware/errorHandler.js";
import express from "express";
import dotenv from "dotenv";
import routerWareHouse from "./routes/warehouse.js";
import routerShipment from "./routes/shipment.js";
import routerDriver from "./routes/driver.js";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());

//errorHandler
app.use(errorHandler);

// routes
app.use("/warehouses", routerWareHouse);
app.use("/shipments", routerShipment);
app.use("/drivers", routerDriver);
//port
const PORT = process.env.PORT || 3000;
// Server

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
