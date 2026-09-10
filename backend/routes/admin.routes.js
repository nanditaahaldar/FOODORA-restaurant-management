const express = require("express");

const {
    createAdmin
} = require("../controller/admin.controller");

const router = express.Router();

router.post("/create", createAdmin);

module.exports = router;