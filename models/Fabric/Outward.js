import mongoose from "mongoose";

const fabricOutSchema = new mongoose.Schema({
  DOC_NO: { type: String,  trim: true },
  DATE: { type: Date,  trim: true },
  FABRIC_GROUP: { type: String,  trim: true },
  COLOR_NAME: {
  first_color: { type: String, trim: true },
  second_color: { type: String, trim: true },
  third_color: { type: String, trim: true },
  fourth_color: { type: String, trim: true },
  fifth_color: { type: String, trim: true },
  sixth_color: { type: String, trim: true },
  seventh_color: { type: String, trim: true },
  eighth_color: { type: String, trim: true },
  ninth_color: { type: String, trim: true },
  tenth_color: { type: String, trim: true },
  eleventh_color: { type: String, trim: true },
  twelfth_color: { type: String, trim: true },
  thirteenth_color: { type: String, trim: true }
},
  SET_NO: { type: String,  trim: true },
  DC_DIA: { type: String,  trim: true },
  RECD_DC_ROLL: { 
  first_roll: { type: String, trim: true },
  second_roll: { type: String, trim: true },
  third_roll: { type: String, trim: true },
  fourth_roll: { type: String, trim: true },
  fifth_roll: { type: String, trim: true },
  sixth_roll: { type: String, trim: true },
  seventh_roll: { type: String, trim: true },
  eighth_roll: { type: String, trim: true },
  ninth_roll: { type: String, trim: true },
  tenth_roll: { type: String, trim: true },
  eleventh_roll: { type: String, trim: true },
  twelfth_roll: { type: String, trim: true },
  thirteenth_roll: { type: String, trim: true }
   },
  RECD_DC_WGT: { 
      first_wgt: { type: String, trim: true },
  second_wgt: { type: String, trim: true },
  third_wgt: { type: String, trim: true },
  fourth_wgt: { type: String, trim: true },
  fifth_wgt: { type: String, trim: true },
  sixth_wgt: { type: String, trim: true },
  seventh_wgt: { type: String, trim: true },
  eighth_wgt: { type: String, trim: true },
  ninth_wgt: { type: String, trim: true },
  tenth_wgt: { type: String, trim: true },
  eleventh_wgt: { type: String, trim: true },
  twelfth_wgt: { type: String, trim: true },
  thirteenth_wgt: { type: String, trim: true }
   },
  ROLL: { 
      first_roll: { type: String, trim: true },
  second_roll: { type: String, trim: true },
  third_roll: { type: String, trim: true },
  fourth_roll: { type: String, trim: true },
  fifth_roll: { type: String, trim: true },
  sixth_roll: { type: String, trim: true },
  seventh_roll: { type: String, trim: true },
  eighth_roll: { type: String, trim: true },
  ninth_roll: { type: String, trim: true },
  tenth_roll: { type: String, trim: true },
  eleventh_roll: { type: String, trim: true },
  twelfth_roll: { type: String, trim: true },
  thirteenth_roll: { type: String, trim: true }
   },
  WGT: { 
   first_wgt: { type: String, trim: true },
  second_wgt: { type: String, trim: true },
  third_wgt: { type: String, trim: true },
  fourth_wgt: { type: String, trim: true },
  fifth_wgt: { type: String, trim: true },
  sixth_wgt: { type: String, trim: true },
  seventh_wgt: { type: String, trim: true },
  eighth_wgt: { type: String, trim: true },
  ninth_wgt: { type: String, trim: true },
  tenth_wgt: { type: String, trim: true },
  eleventh_wgt: { type: String, trim: true },
  twelfth_wgt: { type: String, trim: true },
  thirteenth_wgt: { type: String, trim: true }
   },
  ITEM_CODE: { type: String,  trim: true },
  ITEM_NAME: { type: String,  trim: true },
  ORDER_NO: { type: Number,  default:0 },
  STYLE: { type: String,  trim: true },
   SIZE: {
  first_size: { type: String },
  first_size_pcs_wt: { type: String },
  first_size_fab_wt: { type: String },

  second_size: { type: String },
  second_size_pcs_wt: { type: String },
  second_size_fab_wt: { type: String },

  third_size: { type: String },
  third_size_pcs_wt: { type: String },
  third_size_fab_wt: { type: String },

  fourth_size: { type: String },
  fourth_size_pcs_wt: { type: String },
  fourth_size_fab_wt: { type: String },

  fifth_size: { type: String },
  fifth_size_pcs_wt: { type: String },
  fifth_size_fab_wt: { type: String },

  sixth_size: { type: String },
  sixth_size_pcs_wt: { type: String },
  sixth_size_fab_wt: { type: String },

  seventh_size: { type: String },
  seventh_size_pcs_wt: { type: String },
  seventh_size_fab_wt: { type: String },

  eighth_size: { type: String },
  eighth_size_pcs_wt: { type: String },
  eighth_size_fab_wt: { type: String },

  ninth_size: { type: String },
  ninth_size_pcs_wt: { type: String },
  ninth_size_fab_wt: { type: String },

  tenth_size: { type: String },
  tenth_size_pcs_wt: { type: String },
  tenth_size_fab_wt: { type: String },

  eleventh_size: { type: String },
  eleventh_size_pcs_wt: { type: String },
  eleventh_size_fab_wt: { type: String },

  twelfth_size: { type: String },
  twelfth_size_pcs_wt: { type: String },
  twelfth_size_fab_wt: { type: String }
},
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
