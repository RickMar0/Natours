const Tour = require("./../models/tourModel"); //importing tour model
const APIFeatures = require("./../utils/apiFeatures"); //importing APIFeatures class
const catchAsync = require("./../utils/catchAsync"); //importing catchAsync error handling utility
const AppError = require("./../utils/appError");

exports.aliasTopTours = (req, res, nxt) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,suymmary,difficulty";
  nxt();
};

//get all tours
exports.getAllTours = catchAsync(async (req, res, nxt) => {
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
});

//get a specific tour by id
exports.getTour = catchAsync(async (req, res, nxt) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return nxt(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});

//create a new tour
exports.createTour = catchAsync(async (req, res, nxt) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: { tour: newTour },
  });
});

//update a tour
exports.updateTour = catchAsync(async (req, res, nxt) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return nxt(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});

//delete a tour
exports.deleteTour = catchAsync(async (req, res, nxt) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return nxt(new AppError("No tour found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Tour deleted successfully",
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, nxt) => {
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
});

exports.getMonthly = catchAsync(async (req, res, nxt) => {
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
});
