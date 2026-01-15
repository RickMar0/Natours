// require modules
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const app = express();

// 1) MIDDLEWARE

app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
  console.log("hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTE HANDLERS

// all tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length,
    data: { tours },
  });
};

//get a specific tour by id
const getTour = (req, res) => {
  const id = req.params.id * 1; //setting id to number
  const tour = tours.find((el) => el.id === id); //finding tour with id

  //if id is invalid
  // previous code: if (id > tours.length) {
  if (!tour) {
    console.log(`invalid ID: ${id}`);
    return res.status(404).json({
      status: "fail",
      message: "invalid ID",
    });
  }

  //if id is valid
  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

//create a new tour
const createTour = (req, res) => {
  // console.log(req.body);

  // create new id
  const newId = tours[tours.length - 1].id + 1;

  // create new tour object by merging id and req.body
  const newTour = Object.assign({ id: newId }, req.body);

  // add new tour to tours array
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: { tour: newTour },
      });
    }
  );
};

//update a tour
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    console.log(`invalid ID: ${id}`);
    return res.status(404).json({
      status: "fail",
      message: "invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
};

//delete a tour
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// 3) ROUTES
{
  app // get all tours or post one
    .route("/api/v1/tours")
    .get(getAllTours)
    .post(createTour); // tour id is client generated
}

{
  app // get, update or delete specific tour
    .route("/api/v1/tours/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);
}

//route examples

{
  app // users management
    .route("/api/v1/users")
    .get(getAllUsers)
    .post(createUser);
}

{
  app
    .route("/api/v1/users/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)
    .post(createUser);
}

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

// http://192.168.1.100:3000
