import Inward from "../../models/Fabric/Inward.js";
import FabricBalance from "../../models/Fabric/Balance.js";
import FabricOutward from "../../models/Fabric/Outward.js";
import Counter from "../../models/Fabric/counter.model.js"


// To generate ORDER_NO
async function getNextOrderNo() {
  const counter = await Counter.findOneAndUpdate(
    { name: "order_no" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// ----------------------------------------------------
// FABRIC CONTROLLER
// ----------------------------------------------------
const fabricController = {
  // ---------------- INWARD ---------------- //
  Inward: async (req, res) => {
    try {
      const {
        PROCESS_NAME,
        PROCESS_DC_NO,
        COMPACT_NAME,
        COMPACT_NO,
        FABRIC_GROUP,
        COLOR_NAME,
        SET_NO,
        RECORD_TYPE,
        JOB_ORDER_NO,

        S_NO,
        DIA_TYPE,
        D_DIA,
        D_ROLL,
        D_WGT,
        RECD_DC_ROLL,
        RECD_DC_WGT,
        DF_WGT,
        DF_PERCE,
        SAM_ROLL_1,
        SAM_WGT1,
        SAM_ROLL_2,
        SAM_WGT2,
        SAM_ROLL_3,
        SAM_WGT3,
        TOTAL_ROLL,
        TOTAL_WEIGHT,

        dc_dia,
      } = req.body;

   


      if (!PROCESS_NAME || !PROCESS_DC_NO) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      // CLEAN POPUP (dc_dia)
      const cleanDcDia = Array.isArray(dc_dia)
        ? dc_dia.filter((x) => Object.values(x || {}).some((v) => v !== null && v !== "" && v !== 0))
        : [];
          let balanceEntry={}

           for (const row of cleanDcDia) {
         balanceEntry = {
          FABRIC_GROUP,
          COLOR_NAME,
          SET_NO,
          JOB_ORDER_NO,
          DIA_TYPE: row.dia_type,
          D_DIA: row.d_dia,
          TOTAL_ROLL: row.t_roll,
          TOTAL_WEIGHT: row.t_wgt,
          BATCH_NO: row.batch_no,
        };}
      // CLEAN MAIN FIELDS
      const cleanedFields = {};
      
      const allFields = {
        PROCESS_NAME,
        PROCESS_DC_NO,
        COMPACT_NAME,
        COMPACT_NO,
        FABRIC_GROUP,
        COLOR_NAME,
        SET_NO,
        RECORD_TYPE,
        JOB_ORDER_NO,
        S_NO,
        DIA_TYPE,
        D_DIA,
        D_ROLL,
        D_WGT,
        RECD_DC_ROLL,
        RECD_DC_WGT,
        DF_WGT,
        DF_PERCE,
        SAM_ROLL_1,
        SAM_WGT1,
        SAM_ROLL_2,
        SAM_WGT2,
        SAM_ROLL_3,
        SAM_WGT3,
        TOTAL_ROLL,
        TOTAL_WEIGHT,
      };

      Object.entries(allFields).forEach(([k, v]) => {
        if (v !== null && v !== "" && v !== 0 && v !== undefined) {
          cleanedFields[k] = v;
        }
      });

         const filtered = Object.fromEntries(
    Object.entries(balanceEntry).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );

      cleanedFields.dc_dia = cleanDcDia;

      // SAVE INWARD ENTRY
      const inwardData = new Inward(cleanedFields);
      await inwardData.save();


   
      const balance=new FabricBalance(filtered)
      await balance.save()

      return res.status(200).json({
        message: "Inward Saved Successfully",
        data: inwardData,
      });
    } catch (error) {
      console.log("Inward error:", error);
      return res.status(500).json({
        message: "Server error while saving Inward",
        error: error.message,
      });
    }
  },

  // ---------------- SELECTION (based on FABRIC_GROUP + COLOR_NAME) ---------------- //
  Selection: async (req, res) => {
  try {
    const { FABRIC_GROUP, COLOR_NAME } = req.body;

    if (!FABRIC_GROUP || !COLOR_NAME) {
      return res.status(400).json({ message: "FABRIC_GROUP and COLOR_NAME required" });
    }

    const data = await FabricBalance.find({
      FABRIC_GROUP: FABRIC_GROUP,
      COLOR_NAME: COLOR_NAME
    }).lean();

    if (data.length === 0) {
      return res.status(404).json({
        message: "No matching balance found",
        FABRIC_GROUP,
        COLOR_NAME
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Selection Error:", err);
    return res.status(500).json({
      message: "Server Error in Selection",
      error: err.message
    });
  }
},


  // ---------------- OUTWARD ---------------- //
  Outward: async (req, res) => {
    try {
      const { items } = req.body;
      console.log(items)
     
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "items must be an array" });
      }

      // Generate ORDER_NO one time for this outward batch
      const orderNo = await getNextOrderNo();

      // Remove _id from received items and add ORDER_NO
      const cleanedItems = items.map(({ _id, ...rest }) => ({
        ...rest,
        ORDER_NO: orderNo,
      }));

      const savedDocs = await FabricOutward.insertMany(cleanedItems);
const labels = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth"
];

for (const item of cleanedItems) {

  for (const label of labels) {

    const batchNo =
      item.BATCH_NO?.[`${label}_batchno`] ||
      (label === "first" ? item.BATCH_NO : null);

    if (!batchNo) continue;

    const outRoll =
      Number(item.ROLL?.[`${label}_roll`]) ||
      (label === "first" ? Number(item.ROLL) : 0);

    const outWgt =
      Number(item.WGT?.[`${label}_wgt`]) ||
      (label === "first" ? Number(item.WGT) : 0);

    if (!outRoll && !outWgt) continue;

    const balance = await FabricBalance.findOne({ BATCH_NO: batchNo });
    if (!balance) continue;

    const oldRoll = Number(balance.TOTAL_ROLL) || 0;
    const oldWgt  = Number(balance.TOTAL_WEIGHT) || 0;

    const newRoll = oldRoll - outRoll;
    const newWgt  = oldWgt - outWgt;

    balance.TOTAL_ROLL = newRoll < 0 ? 0 : newRoll;
    balance.TOTAL_WEIGHT = newWgt < 0 ? 0 : newWgt;

    // AUTO DELETE WHEN ZERO
    if (balance.TOTAL_ROLL <= 0 && balance.TOTAL_WEIGHT <= 0) {
      await FabricBalance.deleteOne({ _id: balance._id });
      continue;
    }

    await balance.save();
  }
}



      return res.status(200).json(savedDocs);
    } catch (error) {
      console.error("Error in Outward:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  // ---------------- BALANCE (Inward - Outward) ---------------- //
  // Based on JOB_ORDER_NO, FABRIC_GROUP, COLOR, DIA
  Balance: async (req, res) => {
    try{
      console.log("Enter Balnces")
        const data=await FabricBalance.find()
        console.log(data)
        res.status(200).json(data)
    } catch (error) {
      console.error("Error in Balance:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  // ---------------- SIMPLE LISTS ---------------- //
  List: async (req, res) => {
    try {
      const fabricData = await Inward.find();
      return res.status(200).json(fabricData);
    } catch (error) {
      console.log("Error in List:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  Cutting: async (req, res) => {
    try {
      const fabricData = await FabricOutward.find();
      return res.status(200).json(fabricData);
    } catch (error) {
      console.log("Error in Cutting:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  Fabric: async (req, res) => {
    try {
      const { JOB_ORDER_NO } = req.body;
      const fabricData = await Inward.find({ JOB_ORDER_NO });
      return res.status(200).json(fabricData);
    } catch (error) {
      console.log("Error in Fabric:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  CuttingList: async (req, res) => {
    try {
      const { ORDER_NO } = req.body;
      const fabricData = await FabricOutward.find({ ORDER_NO });
      return res.status(200).json(fabricData);
    } catch (error) {
      console.log("Error in CuttingList:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

export default fabricController;

