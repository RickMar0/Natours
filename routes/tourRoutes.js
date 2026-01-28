const express = require("express");
const tourController = require("./../controllers/tourController");
const router = express.Router();

// router.param("id", tourController.checkID);
// router.param("body", tourController.checkBody);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

{
  router // get all tours or post one
    .route("/")
    .get(tourController.getAllTours)
    .post(tourController.createTour); // tour id is client generated
}

{
  router // get, update or delete specific tour
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);
}

module.exports = router;
