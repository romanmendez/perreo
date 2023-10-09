const { Schema, model } = require("mongoose");

const Price = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const PriceModel = model("price", Price);
module.exports = { PriceModel };
