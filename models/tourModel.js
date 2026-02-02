const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxLength: [40, "A tour name must have less or equal then 40 characters"],
      minLength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    minGroupSize: {
      type: Number,
      default: 1,
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium ordifficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 3,
      min: [1, "rating must be above 1.0"],
      max: [5, "rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation (not gonna work on update)
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//---------------------------------//
// VIRTUAL PROPERTIES
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//---------------------------------//
// DOCUMENT MIDDLEWARE
tourSchema.pre("save", function (nxt) {
  this.slug = slugify(this.name, { lower: true });
  nxt();
});

// tourSchema.pre("save", function (nxt) {
//   console.log("will save document...");
//   nxt();
// });

// tourSchema.post("save", function (doc, nxt) {
//   console.log(doc);
//   nxt();
// });

//---------------------------------//
// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (nxt) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  nxt();
});

tourSchema.post(/^find/, function (docs, nxt) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  nxt();
});

//---------------------------------//
// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (nxt) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  nxt();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
