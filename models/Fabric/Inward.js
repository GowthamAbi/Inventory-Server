import mongoose from "mongoose";

const dcDiaSchema = new mongoose.Schema({
  dia_type: String,

  d_dia: Number,
  d_roll: Number,
  d_wgt: Number,

  r_roll: Number,
  r_wgt: Number,

  df_wgt: Number,
  d_prec: Number,

  s_roll: Number,
  s_wgt: Number,

  s_roll2: Number,
  s_wgt2: Number,

  s_roll3: Number,
  s_wgt3: Number,

  s_roll4: Number,
  s_wgt4: Number,

  t_roll: Number,
  t_wgt: Number,
});

const inwardSchema = new mongoose.Schema(
  {
    
    PROCESS_NAME: String,
    PROCESS_DC_NO: String,
    COMPACT_NAME: String,
    COMPACT_NO: String,
    FABRIC_GROUP: String,
    COLOR_NAME: String,
    SET_NO: String,
    RECORD_TYPE: String,
    JOB_ORDER_NO: String,

    // DC_DIA (popup table)
    dc_dia: [dcDiaSchema],

  
    S_NO: String,
    DIA_TYPE: String,
    D_DIA: String,
    D_ROLL: String,
    D_WGT: String,
    RECD_DC_ROLL: String,
    RECD_DC_WGT: String,
    DF_WGT: String,
    DF_PERCE: String,
    SAM_ROLL_1: String,
    SAM_WGT1: String,
    SAM_ROLL_2: String,
    SAM_WGT2: String,
    SAM_ROLL_3: String,
    SAM_WGT3: String,
    TOTAL_ROLL: String, 
    TOTAL_WEIGHT: String   
  },
  { timestamps: true }
);


const Fabric= mongoose.model("Inward", inwardSchema);

export default Fabric