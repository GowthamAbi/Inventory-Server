import Fabric from "../../models/Fabric/Inward.js"
import FabricBalance from "../../models/Fabric/Balance.js"

const fabricController={
    Inward:async(req,res)=>{
        try {
            const {DOC_NO,DATE,JOB_ORDER_NO,RECORD_TYPE,FABRIC_GROUP,COLOR_NAME,SET_NO,DC_DIA,DIA_TYPE,
                PRCESS_NAME,PROCESS_DC_NO,COMPACT_NO,RECD_DC_NO,RECD_DC_DATE,RECD_DC_ROLL,RECD_DC_WGT}=req.body

                const fabric=new Fabric({DOC_NO,DATE,JOB_ORDER_NO,RECORD_TYPE,FABRIC_GROUP,COLOR_NAME,SET_NO,DC_DIA,DIA_TYPE,
                PRCESS_NAME,PROCESS_DC_NO,COMPACT_NO,RECD_DC_NO,RECD_DC_DATE,RECD_DC_ROLL,RECD_DC_WGT})

                fabric.save().then(res.status(200).send("Data is Saved"))
                console.log({fabric})
        } catch (error) {
            console.log("inward error")
        }

    },

    Outward:async(req,res)=>{
        try {
            const{FABRIC_GROUP,COLOR_NAME,ROLL,WGT}=req.body
            let fabricBalance=await FabricBalance.findOne({FABRIC_GROUP,COLOR_NAME})
            .select('DOC_NO FABRIC_GROUP COLOR_NAME SET_NO DC_DIA RECD_DC_ROLL RECD_DC_WGT _id');
               fabricBalance.RECD_DC_ROLL = Number(fabricBalance.RECD_DC_ROLL) - Number(ROLL);
               fabricBalance.RECD_DC_WGT = Number(fabricBalance.RECD_DC_WGT) - Number(WGT);
                await fabricBalance.save();
                res.status(200).send(fabricBalance)

        } catch (error) {
               console.error("Error in Outward:", error);
               res.status(500).send({ message: "Server error", error });
        }
    },

    Balance:async(req,res)=>{
        try {
            
            const fabricData=await Fabric.findOne()
            let newData=fabricData.toObject()
            delete newData._id
            let balance=await FabricBalance(newData)
            balance.save().then(res.status(200).send("Balance was Saved"))
  
            console.log(fabricData)
        } catch (error) {
               console.error("Error in Balance:", error);
               res.status(500).send({ message: "Server error", error });
        }
    }
}

export default fabricController