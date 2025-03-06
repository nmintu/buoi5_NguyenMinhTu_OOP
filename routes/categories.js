var express = require("express");
var router = express.Router();
let categoryModel = require("../schemas/category");

router.get("/", async function (req, res) {
  let categories = await categoryModel.find();
  res.status(200).send({ success: true, data: categories });
});

router.get("/:id", async function (req, res) {
  try {
    let category = await categoryModel.findById(req.params.id);
    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res
      .status(404)
      .send({ success: false, message: "Không tìm thấy danh mục" });
  }
});

router.post("/", async function (req, res) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name,
      description: req.body.description,
    });
    await newCategory.save();
    res.status(201).send({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.put("/:id", async function (req, res) {
  try {
    let updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ success: true, message: "Danh mục đã bị xóa" });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = router;
