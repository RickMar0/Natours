const Tour = require("./../models/tourModel"); //importing tour model
const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopTours = (req, res, nxt) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,suymmary,difficulty";
  nxt();
};

//get all tours
exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

//get a specific tour by id
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

//create a new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//update a tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "fail", message: "invalid data" });
  }
};

//delete a tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Tour deleted successfully",
      data: null,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "invalid data",
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // { $match: { _id: { $ne: "EASY" } } },
    ]);

    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "invalid data",
    });
  }
};

exports.getMonthly = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        // unwind startDates array to deconstruct each element
        $unwind: "$startDates",
      },
      {
        // match startDates to be greater than or equal to jan 1st of the year provided
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
          },
        },
      },
      {
        // match startDates to be less than or equal to dec 31st of the year provided
        $match: {
          startDates: {
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        // group by month and sum number of tour starts
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        // add month field
        $addFields: { month: "$_id" },
      },
      {
        // to hide _id field
        $project: {
          _id: 0,
        },
      },
      {
        // sort by number of tour starts descending
        $sort: { numTourStarts: -1 },
      },
      {
        // limit to 12 results (only for testing purposes)
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { plan },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "invalid data",
    });
  }
};
