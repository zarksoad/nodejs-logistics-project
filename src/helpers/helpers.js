import { read } from "node:fs";
import { url } from "node:inspector";
import path from "node:path";
import { fileURLToPath } from "node:url";
import picocolors from "picocolors";
import fs from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const Pathid = path.join(__dirname, "../data/Ids/id.json");

// function read File
export async function readFile(path) {
  try {
    const file = await fs.readFile(path, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    console.error(picocolors.bgMagenta("Error reading the file"));
    throw error;
  }
}

// writeFile
export async function writeFile(path, data) {
  try {
    const fileContent = JSON.stringify(data, null, 2);
    await fs.writeFile(path, fileContent, "utf-8");
  } catch (error) {
    console.error("Error writing the file:", error);
    throw error;
  }
}

//increment Id and update
export async function getidFile(key) {
  try {
    const dataId = await readFile(Pathid);
    const idFound = dataId.find((data) => data[key] !== undefined);
    if (idFound) {
      return idFound[key];
    } else {
      console.log("Id not found");
    }
  } catch (error) {
    console.error("Error reading id File ", error);
    throw error;
  }
}

export async function updateId(id, name) {
  try {
    const dataId = await readFile(Pathid);
    id++;
    const idObject = dataId.find((data) => data[name] !== undefined);
    if (idObject) {
      idObject[name] = id;
      await writeFile(Pathid, dataId);
    } else {
      console.log("ID object not found");
    }
  } catch (error) {
    console.error("Error", error);
  }
}
