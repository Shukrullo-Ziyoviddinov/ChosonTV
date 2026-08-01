require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Triller = require("../models/triller");

const dataPath = path.join(__dirname, "data", "trillers.json");

const seedTrillers = async () => {
  try {
    await connectDB();

    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed = JSON.parse(raw);
    const trillers = Array.isArray(parsed) ? parsed : parsed.trillers || [];

    if (!trillers.length) {
      throw new Error("trillers.json bo'sh.");
    }

    await Triller.deleteMany();
    await Triller.insertMany(trillers);
    console.log(`Trillerlar seed qilindi: ${trillers.length} ta.`);
  } catch (error) {
    console.error("Triller seed xatoligi:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedTrillers();
