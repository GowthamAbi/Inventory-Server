import mongoose from "mongoose";

const fabricOutSchema=new mongoose.Schema({
    DOC_NO:{
            type:String,
            required:true,
            trim:true
    },
    DATE:{
            type:Date,
            required:true,
            trim:true
    },
    FABRIC_GROUP:{
            type:String,
            required:true,
            trim:true
    },
    COLOR_NAME:{
            type:String,
            required:true,
            trim:true
    },
    SET_NO:{
            type:String,
            required:true,
            trim:true
    },
    DC_DIA:{
            type:String,
            required:true,
            trim:true
    },
  RECD_DC_WGT:{
            type:String,
            required:true,
            trim:true
    }
})

const FabricOutward=mongoose.model('fabric',fabricOutSchema)

export default FabricOutward