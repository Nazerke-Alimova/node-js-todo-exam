const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dburl =
  "mongodb+srv://Nazerke:21111999@cluster0.jpdegfv.mongodb.net/todobd";
mongoose
  .connect(dburl, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (request, response) => {
  //   response.render("index");
  Todo.find().then((result) => {
    response.render("index", { data: result });
    console.log(result);
  });
});

app.post("/:id", (request, response) => {
  Todo.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log("Задача удалена:", result);
      response.redirect("/");
    })
    .catch((error) => {
      console.error("Ошибка при удалении задачи:", error);
      response.status(500).send("Ошибка при удалении задачи");
    });
});

app.post("/", (request, response) => {
  const todo = new Todo({
    todo: request.body.todoValue,
  });

  todo
    .save()
    .then((result) => {
      console.log("Todo saved:", result); // Добавить эту строку
      response.redirect("/");
    })
    .catch((error) => {
      console.error("Error saving todo:", error);
      response.status(500).send("Error saving todo");
    });
});

// app.delete("/:id", (request, response) => {
//   Todo.findByIdAndDelete(request.params.id).then((result) => {
//     console.log(result);
//   });
// });

app.listen(port, () => {
  console.log("server is running on port" + port);
});
