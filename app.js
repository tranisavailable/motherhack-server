require('dotenv').config();

const { v4: uuidv4 } = require("uuid");

const express = require("express");
const app = express();
const hostname = "0.0.0.0";
const port = 3000;

const mongoose = require("mongoose");
const mealSchema = new mongoose.Schema({
  _id: String,
  meal_name: String,
  meal_type: String,
  prep_date: mongoose.Date,
});
const Meal = mongoose.model("meal", mealSchema);

mongoose.connect(process.env.DB_URI, {
  dbName: "motherhack",
});
const db = mongoose.connection;
db.on("error", () => {
  console.log("connection error");
});
db.once("open", () => {
  console.log("connection success");
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());
app.get("/meals/:prepDate", async function (req, res) {
  const { prepDate } = req.params;
  const meals = await Meal.find({ prep_date: prepDate });
  const mealPrep = ["Breakfast", "Lunch", "Dinner"].map((mealType) => {
    const meal = meals.find((meal) => meal.meal_type == mealType);
    if (meal == undefined) {
      const newMeal = {
        _id: uuidv4(),
        meal_type: mealType,
        prep_date: prepDate,
      };

      Meal.create(newMeal);

      return newMeal;
    } else {
      return meal;
    }
  });

  res.status(200).send({
    meal_prep: mealPrep,
  });
});

app.put("/meals/:id", async function (req, res) {
  const mealName = req.body.meal_name;
  const meal = await Meal.findOneAndUpdate(
    { _id: req.params.id },
    { meal_name: mealName }
  );

  meal.meal_name = mealName;

  res.status(200).send({
    meal: meal,
  });
});

app.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}/`)
);
