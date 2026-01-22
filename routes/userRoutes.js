const fs = require("fs");
const express = require("express");
const userController = require("./../controllers/userController");

const router = express.Router();

{
  router // users management
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);
}

{
  router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
    .post(userController.createUser);
}

module.exports = router;
