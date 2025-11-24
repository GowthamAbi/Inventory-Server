import mongoose from "mongoose";

const fabricBalanceSchema = new mongoose.Schema(
  {
    FABRIC_GROUP: String,
    COLOR_NAME: String,
    SET_NO: String,
    JOB_ORDER_NO: String,
    DIA_TYPE: String,
    D_DIA: String,
    TOTAL_ROLL: String,
    TOTAL_WEIGHT: String,
    BATCH_NO: String,
  },
  { timestamps: true }
);

const FabricBalance = mongoose.model("balance", fabricBalanceSchema);

export default FabricBalance;
