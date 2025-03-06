var express = require("express");
var router = express.Router();
let productModel = require("../schemas/product");

function buildQuery(obj) {
  let result = { isDeleted: false };
  if (obj.name) {
    result.name = new RegExp(obj.name, "i");
  }
  result.price = {};
  if (obj.price) {
    if (obj.price.$gte) {
      result.price.$gte = obj.price.$gte;
    } else {
      result.price.$gte = 0;
    }
    if (obj.price.$lte) {
      result.price.$lte = obj.price.$lte;
    } else {
      result.price.$lte = 10000;
    }
  }
  return result;
}

router.get("/", async function (req, res) {
  let products = await productModel.find(buildQuery(req.query));
  res.status(200).send({
    success: true,
    data: products,
  });
});

router.get("/:id", async function (req, res) {
  try {
    let product = await productModel.findById(req.params.id);
    if (!product || product.isDeleted) {
      return res
        .status(404)
        .send({ success: false, message: "Sản phẩm không tồn tại" });
    }
    res.status(200).send({ success: true, data: product });
  } catch (error) {
    res.status(400).send({ success: false, message: "ID không hợp lệ" });
  }
});

router.post("/", async function (req, res) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
    });
    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.put("/:id", async function (req, res) {
  try {
    let updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    let deletedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).send({ success: true, data: deletedProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = router;
