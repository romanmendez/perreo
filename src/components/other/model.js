const { Schema, model } = require("mongoose");

const BusinessData = new Schema(
  {
    key: { type: String, required: true },
    value: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const BusinessDataModel = model("business_data", BusinessData);
module.exports = { BusinessDataModel };
