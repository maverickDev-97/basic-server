import express from "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";
import cors from "cors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = `${__dirname}/db.json`;
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/cars", (req, res) => {
  const { cars } = db.data;
  res.send(cars);
});

app.get("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const carData = cars.find((car) => car.id === +id);
  if (carData) {
    res.send(carData);
  } else {
    res.status(404).end();
  }
});

app.post("/api/cars", async (req, res) => {
  const id = nanoid();
  console.log(req.body);
  if (!req.body) {
    res.status(400).end();
  }
  const newCar = {
    ...req.body,
    id: id,
  };
  res.send(newCar);
  const addCar = await db.data.cars.push(newCar);
  if (addCar) {
    await db.write();
    res.send(newCar);
  } else {
    res.status(500).end();
  }
});

const startApp = () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
};

startApp();
