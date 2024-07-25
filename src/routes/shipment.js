import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import {
  getidFile,
  readFile,
  updateId,
  writeFile,
} from "../helpers/helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathShipment = path.join(__dirname, "../data/shipment.json");

// Router
const routerShipment = Router();

// Post
routerShipment.post("/", async (req, res) => {
  try {
    const data = await readFile(pathShipment);
    const newId = await getidFile("shipmentID");
    const newShipment = {
      id: newId ? parseInt(newId) + 1 : 1,
      ...req.body,
    };
    data.push(newShipment);
    await writeFile(pathShipment, data);
    await updateId(newId, "shipmentID");
    res.status(201).json({
      newShipment: newShipment,
    });
  } catch (error) {
    console.error("error posting the new shipment", error);
    throw error;
  }
});

//Get all shipments

routerShipment.get("/", async (req, res) => {
  try {
    const data = await readFile(pathShipment);
    res.json({
      shipments: data,
    });
  } catch (error) {
    console.error("error getting the data", error);
  }
});

// get shipment by id

routerShipment.get("/:id", async (req, res) => {
  try {
    const data = await readFile(pathShipment);
    const shipment = data.find((s) => s.id === parseInt(req.params.id));
    if (!shipment) return res.status(404).send("The shipment not found");
    res.json({
      shipment: shipment,
    });
  } catch (error) {
    console.error("error getting the shipmnet", error);
  }
});

// Update shipment
routerShipment.put("/:id", async (req, res) => {
  try {
    const data = await readFile(pathShipment);
    const shipmentIndex = data.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );
    if (shipmentIndex === -1) return res.status(404).send("shipment not found");
    const existingShipment = data[shipmentIndex];
    const upShipment = { ...existingShipment, ...req.body };
    data[shipmentIndex] = upShipment;
    await writeFile(pathShipment, data);
    res.json({
      message: "shipment has been updated",
      upShipment,
    });
  } catch (error) {
    console.error("Error updating shipment", error);
    throw error;
  }
});

// Delete shipment

routerShipment.delete("/:id", async (req, res) => {
  try {
    const data = await readFile(pathShipment);
    const index = data.findIndex((i) => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send("shipment not found");
    data.splice(index, 1);
    await writeFile(pathShipment, data);
    res.json({
      message: "Shipment deleted successfully",
    });
  } catch (error) {
    console.error("Error", error);
  }
});

export default routerShipment;
