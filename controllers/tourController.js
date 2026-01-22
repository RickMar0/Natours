const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, nxt, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    console.log(`invalid ID: ${val}`);
    return res.status(404).json({
      status: "fail",
      message: "invalid ID",
    });
  }
  nxt();
};

exports.checkBody = (req, res, nxt) => {
  console.log(req.body, "\n");
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "invalid name or price",
    });
  }
  nxt();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length,
    data: { tours },
  });
};

//get a specific tour by id
exports.getTour = (req, res) => {
  const id = req.params.id * 1; //setting id to number
  const tour = tours.find((el) => el.id === id); //finding tour with id

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

//create a new tour
exports.createTour = (req, res) => {
  // create new id
  const newId = tours[tours.length - 1].id + 1;

  // create new tour object by merging id and req.body
  const newTour = Object.assign({ id: newId }, req.body);

  // add new tour to tours array
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: { tour: newTour },
      });
    },
  );
};

//update a tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
};

//delete a tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
