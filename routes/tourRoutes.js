const express = require("express");
const tourController = require("./../controllers/tourController");
const router = express.Router();

// router.param("id", tourController.checkID);
// router.param("body", tourController.checkBody);

{
  // ⚠⚠ BUSINESS/ADMIN ROUTE ⚠⚠
  // tour statistics
  router.route("/tour-stats").get(tourController.getTourStats);
}

{
  // ⚠⚠ PUBLIC ROUTE ⚠⚠
  // alias route for top 5 cheap tours
  router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours);
}

{
  // ⚠⚠ BUSINESS/ADMIN ROUTE ⚠⚠
  // see which months have the most tours so we can plan accordingly
  router.route("/monthly-plan/:year").get(tourController.getMonthly);
}

{
  // ⚠⚠ PUBLIC ROUTE ⚠⚠
  // get all tours or post one
  router
    .route("/")
    .get(tourController.getAllTours)
    .post(tourController.createTour); // tour id is client generated
}

{
  // ⚠⚠ PUBLIC ROUTE ⚠⚠
  // get, update or delete specific tour
  router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);
}
module.exports = router;
