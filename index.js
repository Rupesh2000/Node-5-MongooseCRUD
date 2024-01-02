const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

const Student = mongoose.model("Student", {
  firstName: String,
  lastName: String,
  rollNo: Number,
  techStack: String,
});

app.get("/", (req, res) => {
  res.json({ message: "All Good!" });
});

app.get("/students", (req, res) => {
  // return all students inside the 'students' collection in DB
  Student.find()
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      res.json({ error: "Something went wrong" });
    });
});

app.post("/students", (req, res) => {
  const { firstName, lastName, rollNo, techStack } = req.body;
  const student = new Student({
    firstName: firstName,
    lastName: lastName,
    rollNo: rollNo,
    techStack: techStack,
  });
  student
    .save()
    .then((student) => {
      res.json({ message: "Student added successfully!" });
    })
    .catch((error) => {
      res.json({ error: "Something went wrong" });
    });
});

app.put("/students/:id", (req, res) => {
  let { id } = req.params;
  const { rollNo } = req.body;
  Student.findByIdAndUpdate(id, {
    rollNo: rollNo,
  })
    .then((student) => {
      console.log(student);
      res.json({ message: "Student updated successfully!" });
    })
    .catch((error) => {
      res.json({ error: "Something went wrong" });
    });
});

app.delete("/students/:id", (req, res) => {
  let { id } = req.params;
  Student.findByIdAndDelete(id)
    .then((student) => {
      //   console.log(student);
      res.json({ message: "Student updated successfully!" });
    })
    .catch((error) => {
      res.json({ error: "Something went wrong" });
    });
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      console.log(`Server is running on http://localhost:${process.env.PORT}`)
    )
    .catch((err) => console.log(err));
});

/*
## Mongoose
    - Also known as a driver between your express Application and MongoDB
    - Object Data Modeling (ODM) Library for MongoDB
    


    ## Models in Mongoose
      Employee
      {
        name: String,
        email: String
      }

    -----------------------------------------------
    ## Mongoose CRUD Operations: Create, Read, Update, Delete
    -----------------------------------------------
    Eg: Students
    # MongoDB
    - Collection: students
    - Document: Single student information

    # Mongoose
    - Schema: Student
      - firstName: String
      - LastName: String
      - rollNo: Number
      - batchNo: Number
      - techStack: String
      - yearOfEnrollment: Number

    # Express
     - Routes
       - GET /students: Return list of all students (Read)
       - Post /students: Create a new Student (Create)
       - Post /students/:id : Update existing student (Update)
       - GET /students/:rollNo : Delete student with that ID (Delete)

    -----------------------------------
    ## REST APIS
    https://www.geeksforgeeks.org/rest-api-introduction/
    -----------------------------------

    */
