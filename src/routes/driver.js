import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import {
  readFile,
  writeFile,
  updateId,
  getidFile,
} from "../helpers/helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathDriver = path.join(__dirname, "../data/drivers.json");

// router
const routerDriver = Router();

routerDriver.post("/", async (req, res) => {
  try {
    const data = await readFile(pathDriver);
    const newId = await getidFile("DriverID");
    const newDriver = {
      id: newId ? parseInt(newId) + 1 : 1,
      ...req.body,
    };
    data.push(newDriver);
    await writeFile(pathDriver, data);
    await updateId(newId, "DriverID");
    res.status(201).json({
      newDriver: newDriver,
    });
  } catch (error) {
    console.error("Error creating the driver", error);
  }
});

// Get all Drivers

routerDriver.get("/", async (req, res) => {
  try {
    const data = await readFile(pathDriver);
    console.log(data);
    res.json({
      drivers: data,
    });
  } catch (error) {
    console.error("Error getting the data", error);
  }
});
// get by id
export default routerDriver;
