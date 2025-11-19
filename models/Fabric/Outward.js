import mongoose from "mongoose";

const fabricOutSchema = new mongoose.Schema({
  DOC_NO: { type: String,  trim: true },
  DATE: { type: Date,  trim: true },
  FABRIC_GROUP: { type: String,  trim: true },
  COLOR_NAME: { type: String,  trim: true },
  SET_NO: { type: String,  trim: true },
  DC_DIA: { type: String,  trim: true },
  RECD_DC_WGT: { type: String,  trim: true },
  RECD_DC_ROLL: { type: String,  trim: true },
  ROLL: { type: String,  trim: true },
  WGT: { type: String,  trim: true },
  ITEM_CODE: { type: String,  trim: true },
  ITEM_NAME: { type: String,  trim: true },
  STYLE: { type: String,  trim: true },
  SET_NO: { type: String,  trim: true },
  SIZE: { type: String,  trim: true },
  DATE: {
  type: Date,
  default: Date.now,   
}
});

// IMPORTANT FIX — prevent recompile
const FabricOutward =
  mongoose.models.FabricOutward ||
  mongoose.model("FabricOutward", fabricOutSchema);

export default FabricOutward;
