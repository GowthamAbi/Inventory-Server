import Fabric from "../../models/Fabric/Inward.js"
import FabricBalance from "../../models/Fabric/Balance.js"
import FabricOutward from "../../models/Fabric/Outward.js"

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
            console.log("inward error",error)
        }

    },

    Selection:async(req,res)=>{
        try {
            const{FABRIC_GROUP,COLOR_NAME}=req.body
            console.log(FABRIC_GROUP,COLOR_NAME)
            const fabricBalance=await Fabric.find({FABRIC_GROUP,COLOR_NAME})
            console.log(fabricBalance)
                    if (!fabricBalance.length) {
                return res.status(404).json({ message: "No matching data found" });
                }
                
                res.status(200).json(fabricBalance)

        } catch (error) {
               console.error("Error in Outward:", error);
               res.status(500).send({ message: "Server error", error });
        }
    },
Outward: async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "items must be an array" });
    }

    // Remove _id from each item
    const cleanedItems = items.map(({ _id, ...rest }) => rest);

    const savedDocs = await FabricOutward.insertMany(cleanedItems);

    console.log("Inserted outward rows:", savedDocs);

    res.status(200).json(savedDocs);
  } catch (error) {
    console.error("Error in Outward:", error);
    res.status(500).json({ message: "Server error", error });
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
    },
    List:async(req,res)=>{
        try {
            const fabricData=await Fabric.find()
            res.status(200).json(fabricData)
            console.log("Fabric Data",fabricData)
        } catch (error) {
            console.log("Error in List",error)
        }
    },
    Cutting:async(req,res)=>{
        try {
            const fabricData=await FabricOutward.find()
            res.status(200).json(fabricData)
            console.log("FabricOutward Data",fabricData)
        } catch (error) {
            console.log("Error in List",error)
        }
    },
Fabric: async (req, res) => {
  try {
    const { DOC_NO } = req.body;     // Read DOC_NO from request body

    console.log("Incoming DOC_NO:", DOC_NO);

    // Query DB: find any documents where DOC_NO matches
    const fabricData = await Fabric.find({ DOC_NO: DOC_NO });

    res.status(200).json(fabricData);

  } catch (error) {
    console.log("Error in List", error);
    res.status(500).json({ message: "Server error" });
  }
},

    CuttingList:async(req,res)=>{
        try {
            const{DOC_NO}=req.body
            const fabricData=await FabricOutward.find({ DOC_NO: DOC_NO })
            res.status(200).json(fabricData)
            console.log("FabricOutward Data",fabricData)
        } catch (error) {
            console.log("Error in List",error)
        }
    }
}

export default fabricController