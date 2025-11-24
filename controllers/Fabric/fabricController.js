/*import Inward from "../../models/Fabric/Inward.js";
import FabricBalance from "../../models/Fabric/Balance.js";
import FabricOutward from "../../models/Fabric/Outward.js";
import Counter from "../../models/Fabric/counter.model.js";

// ----------------------------------------------------
// AUTO-INCREMENT ORDER NO (BEST PRACTICE)
// ----------------------------------------------------
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

      dc_dia,
    } = req.body;

    if (!PROCESS_NAME || !PROCESS_DC_NO) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // CLEAN POPUP
    const cleanDcDia = Array.isArray(dc_dia)
      ? dc_dia.filter(x => Object.values(x).some(v => v))
      : [];

    // CLEAN MAIN FIELDS
    const cleanedFields = {};
    const allFields = {
      PROCESS_NAME, PROCESS_DC_NO, COMPACT_NAME, COMPACT_NO,
      FABRIC_GROUP, COLOR_NAME, SET_NO, RECORD_TYPE, JOB_ORDER_NO,
      S_NO, DIA_TYPE, D_DIA, D_ROLL, D_WGT, RECD_DC_ROLL,
      RECD_DC_WGT, DF_WGT, DF_PERCE, SAM_ROLL_1, SAM_WGT1,
      SAM_ROLL_2, SAM_WGT2, SAM_ROLL_3, SAM_WGT3,
    };

    Object.entries(allFields).forEach(([k, v]) => {
      if (v !== null && v !== "" && v !== 0) cleanedFields[k] = v;
    });

    cleanedFields.dc_dia = cleanDcDia;

    // SAVE INWARD ENTRY
    const inwardData = new Inward(cleanedFields);
    await inwardData.save();


        // Fabric Balances

        // CLEAN MAIN FIELDS
    const cleanFields = {};
    const Field = {
      FABRIC_GROUP, COLOR_NAME, SET_NO, JOB_ORDER_NO,
       D_DIA, RECD_DC_ROLL,RECD_DC_WGT,  SAM_ROLL_1, SAM_WGT1,
      SAM_ROLL_2, SAM_WGT2, SAM_ROLL_3, SAM_WGT3,
    };

    Object.entries(Field).forEach(([k, v]) => {
      if (v !== null && v !== "" && v !== 0) cleanFields[k] = v;
    });

    cleanFields.dc_dia = cleanDcDia;


 const fabricBalance = new FabricBalance(cleanFields);
    await fabricBalance.save();

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



  Selection: async (req, res) => {
    try {
      const { FABRIC_GROUP, COLOR_NAME } = req.body;
      const fabricBalance = await FabricBalance.find({ FABRIC_GROUP, COLOR_NAME });

      if (!fabricBalance.length) {
        return res.status(404).json({ message: "No matching data found" });
      }

      return res.status(200).json(fabricBalance);

    } catch (error) {
      console.error("Error in Selection:", error);
      return res.status(500).send({ message: "Server error", error });
    }
  },

  Outward: async (req, res) => {
    try {
      const { items } = req.body;

      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "items must be an array" });
      }

      console.log(items)

      // Assign ORDER NO
       const orderNo = await getNextOrderNo();

      // Remove _id to avoid duplicate key issues
       const cleanedItems = items.map(({ _id, ...rest }) => ({
      ...rest,
      ORDER_NO: orderNo,
    }));

      const savedDocs = await FabricOutward.insertMany(cleanedItems);

      //Get details from req.body
      const[]=req.body

      const getData=await FabricBalance.findOne()

      return res.status(200).json(savedDocs);

    } catch (error) {
      console.error("Error in Outward:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  Balance: async (req, res) => {
  try {
    // 1. Get all inward data
    const inwardData = await Inward.find();

    // 2. Get all outward data
    const outwardData = await FabricOutward.find();

    // 3. Sum inward qty
    const totalInward = inwardData.reduce((sum, item) => sum + (item.qty || 0), 0);

    // 4. Sum outward qty
    const totalOutward = outwardData.reduce((sum, item) => sum + (item.qty || 0), 0);

    // 5. Balance calculation
    const balanceValue = totalInward - totalOutward;

    // 6. Prepare rows (for frontend table)
    const rows = inwardData.map(item => ({
      fabric_group: item.fabric_group,
      dia: item.dia,
      roll: item.roll,
      wgt: item.qty  // if weight is qty
    }));

    // 7. Save in DB
    const balance = new FabricBalance({
  totalInward,
  totalOutward,
  balance: balanceValue,
  createdAt: new Date()
});
await balance.save();


    await balance.save();

    // 8. Final response for frontend
    return res.status(200).send({
      totalInward,
      totalOutward,
      balance: balanceValue,
      rows  // sending table rows here
    });

  } catch (error) {
    console.error("Error in Balance:", error);
    return res.status(500).send({ message: "Server error", error });
  }
},


  List: async (req, res) => {
    try {
      const fabricData = await Inward.find();
      return res.status(200).json(fabricData);

    } catch (error) {
      console.log("Error in List:", error);
    }
  },

  Cutting: async (req, res) => {
    try {
      const fabricData = await FabricOutward.find();
      return res.status(200).json(fabricData);

    } catch (error) {
      console.log("Error in Cutting:", error);
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
    }
  }
};

export default fabricController;*/








// controllers/fabric/fabric.controller.js
import Inward from "../../models/Fabric/Inward.js";
import FabricBalance from "../../models/Fabric/Balance.js";
import FabricOutward from "../../models/Fabric/Outward.js";
import Counter from "../../models/Fabric/counter.model.js"

// --------------------- Helpers --------------------- //
function sumNested(obj) {
  if (!obj || typeof obj !== "object") return 0;
  return Object.values(obj).reduce((sum, v) => sum + (Number(v) || 0), 0);
}

function getOutwardColor(out) {
  if (!out.COLOR_NAME || typeof out.COLOR_NAME !== "object") return "";
  return out.COLOR_NAME.first_color || "";
}

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
console.log(data)
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

      // (Optional) After saving Outward, you might want to recalc balances:
      // await fabricController.BalanceInternal();  // define as internal helper if you want auto-update

      return res.status(200).json(savedDocs);
    } catch (error) {
      console.error("Error in Outward:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  // ---------------- BALANCE (Inward - Outward) ---------------- //
  // Based on JOB_ORDER_NO, FABRIC_GROUP, COLOR, DIA
  Balance: async (req, res) => {
    try {
      const inwardData = await Inward.find();
      const outwardData = await FabricOutward.find();

      // Map keyed by JOB_ORDER_NO|FABRIC_GROUP|COLOR_NAME|DIA
      const map = new Map();

      // 1️⃣ Process INWARD
      inwardData.forEach((inv) => {
        const job = inv.JOB_ORDER_NO || "";
        const fabricGroup = inv.FABRIC_GROUP || "";
        const color = inv.COLOR_NAME || "";

        // We'll use r_dia, r_roll, r_wgt from dc_dia rows as inward
        (inv.dc_dia || []).forEach((row) => {
          const dia = Number(row.r_dia || 0);
          const key = `${job}|${fabricGroup}|${color}|${dia}`;

          if (!map.has(key)) {
            map.set(key, {
              JOB_ORDER_NO: job,
              FABRIC_GROUP: fabricGroup,
              COLOR_NAME: color,
              DIA: dia,
              inwardRoll: 0,
              inwardWgt: 0,
              outwardRoll: 0,
              outwardWgt: 0,
            });
          }

          const rec = map.get(key);
          rec.inwardRoll += Number(row.r_roll || 0);
          rec.inwardWgt += Number(row.r_wgt || 0);
        });
      });

      // 2️⃣ Process OUTWARD
      outwardData.forEach((out) => {
        const job = out.JOB_ORDER_NO || ""; // make sure Outward has JOB_ORDER_NO in schema & data
        const fabricGroup = out.FABRIC_GROUP || "";
        const color = getOutwardColor(out); // COLOR_NAME.first_color
        const dia = Number(out.DC_DIA || 0);
        const key = `${job}|${fabricGroup}|${color}|${dia}`;

        if (!map.has(key)) {
          map.set(key, {
            JOB_ORDER_NO: job,
            FABRIC_GROUP: fabricGroup,
            COLOR_NAME: color,
            DIA: dia,
            inwardRoll: 0,
            inwardWgt: 0,
            outwardRoll: 0,
            outwardWgt: 0,
          });
        }

        const rec = map.get(key);

        // Sum all roll & wgt in nested objects
        rec.outwardRoll += sumNested(out.ROLL);
        rec.outwardWgt += sumNested(out.WGT);
      });

      // 3️⃣ Build rows + save to FabricBalance
      const rows = [];
      const bulkOps = [];

      for (const rec of map.values()) {
        const balanceRoll = rec.inwardRoll - rec.outwardRoll;
        const balanceWgt = rec.inwardWgt - rec.outwardWgt;

        const row = {
          JOB_ORDER_NO: rec.JOB_ORDER_NO,
          FABRIC_GROUP: rec.FABRIC_GROUP,
          COLOR_NAME: rec.COLOR_NAME,
          DIA: rec.DIA,
          inwardRoll: rec.inwardRoll,
          inwardWgt: rec.inwardWgt,
          outwardRoll: rec.outwardRoll,
          outwardWgt: rec.outwardWgt,
          balanceRoll,
          balanceWgt,
        };

        rows.push(row);

        // Upsert per job+group+color+dia
        bulkOps.push({
          updateOne: {
            filter: {
              JOB_ORDER_NO: rec.JOB_ORDER_NO,
              FABRIC_GROUP: rec.FABRIC_GROUP,
              COLOR_NAME: rec.COLOR_NAME,
              DIA: rec.DIA,
            },
            update: { $set: row },
            upsert: true,
          },
        });
      }

      if (bulkOps.length > 0) {
        await FabricBalance.bulkWrite(bulkOps);
      }

      // 4️⃣ Totals (if you want summary)
      const totalInward = rows.reduce((s, r) => s + r.inwardWgt, 0);
      const totalOutward = rows.reduce((s, r) => s + r.outwardWgt, 0);
      const balanceValue = totalInward - totalOutward;

      return res.status(200).json({
        totalInward,
        totalOutward,
        balance: balanceValue,
        rows,
      });
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

