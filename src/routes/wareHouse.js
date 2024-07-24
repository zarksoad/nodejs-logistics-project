import path from "node:path";
import url, { fileURLToPath } from "node:url";
import { Router } from "express";
import {
  readFile,
  writeFile,
  getidFile,
  updateId,
} from "../helpers/helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathWareHouse = path.join(__dirname, "../data/warehouse.json");
const routerWareHouse = Router();

// Routes

// Get All wareHouse
routerWareHouse.get("/", async (req, res) => {
  try {
    const data = await readFile(pathWareHouse);
    res.json({
      warehouses: data,
    });
  } catch (error) {
    console.error("error", error);
  }
});

// Get by id

routerWareHouse.get("/:id", async (req, res) => {
  try {
    const data = await readFile(pathWareHouse);
    const wareHouse = data.find((w) => w.id === parseInt(req.params.id));
    if (!wareHouse) return res.status(404).send("warehouse not found");
    res.json({
      warehouse: wareHouse,
    });
  } catch (error) {
    console.error("error getting house by id", error);
    throw error;
  }
});

// post Route
routerWareHouse.post("/", async (req, res) => {
  try {
    const data = await readFile(pathWareHouse);
    const newidId = await getidFile("warehouseId");
    const newWareHouse = {
      id: newidId ? parseInt(newidId) + 1 : 1,
      ...req.body,
    };
    data.push(newWareHouse);
    await writeFile(pathWareHouse, data);
    await updateId(newidId, "warehouseId");
    res.status(200).json({
      message: "Warehouse created successfully",
      warehouse: newWareHouse,
    });
  } catch (error) {
    console.error("error", error);
  }
});

//Modify warehouse
routerWareHouse.put("/:id", async (req, res) => {
  try {
    const data = await readFile(pathWareHouse);
    let wareHouseIndex = data.findIndex(
      (w) => w.id === parseInt(req.params.id)
    );
    if (wareHouseIndex === -1)
      return res.status(404).send("warehouse not found");
    const updatedWareHouse = { ...data[wareHouseIndex], ...req.body };
    data[wareHouseIndex] = updatedWareHouse;
    await writeFile(pathWareHouse, data);
    res.send("warehouse updated");
  } catch (error) {
    console.error("error", error);
  }
});

// delete warehouse

routerWareHouse.delete("/:id", async (req, res) => {
  try {
    const data = await readFile(pathWareHouse);
    let index = data.findIndex((w) => w.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send("wareHouse not found");
    data.splice(index, 1);
    await writeFile(pathWareHouse, data);
    res.status(203).json({
      message: "Warehouse deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting warehouse", error);
  }
});

export default routerWareHouse;
