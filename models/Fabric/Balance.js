
import mongoose from "mongoose";
const dcDiaSchema = new mongoose.Schema({

  r_dia: Number,
  r_roll: Number,
  r_wgt: Number,

  s_roll: Number,
  s_wgt: Number,

  s_roll2: Number,
  s_wgt2: Number,

  s_roll3: Number,
  s_wgt3: Number,

  s_roll4: Number,
  s_wgt4: Number,
});

const fabricBalanceSchema=new mongoose.Schema({
    FABRIC_GROUP: String,
    COLOR_NAME: String,
    SET_NO: String,
    JOB_ORDER_NO: String,

    // DC_DIA (popup table)
    dc_dia: [dcDiaSchema], // 💡 10 rows stored as an array

    // Remaining single fields after index 10
    D_DIA: String,
    RECD_DC_ROLL: String,
    RECD_DC_WGT: String,
    SAM_ROLL_1: String,
    SAM_WGT1: String,
    SAM_ROLL_2: String,
    SAM_WGT2: String,
    SAM_ROLL_3: String,
    SAM_WGT3: String,
  },
  { timestamps: true }
);

const FabricBalance=mongoose.model('balance',fabricBalanceSchema)

export default FabricBalance

