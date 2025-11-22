import Inward from "../../models/Fabric/Inward.js";
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

   Inward:async (req, res) => {
    try {
      const {
        PRCESS_NAME,
        PROCESS_DC_NO,
        COMPACT_NAME,
        COMPACT_NO,
        FABRIC_GROUP,
        COLOR_NAME,
        SET_NO,
        RECORD_TYPE,
        JOB_ORDER_NO,

        // single fields after popup
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

        // DC_DIA popup → array of rows
        dc_dia,
      } = req.body;

      // Validation Example (optional)
      if (!PRCESS_NAME || !PROCESS_DC_NO) {
        return res.status(400).json({
          message: "Required fields missing (PRCESS_NAME, PROCESS_DC_NO)",
        });
      }

      const inwardData = new Inward({
        PRCESS_NAME,
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

        dc_dia, // ⬅️ 10 rows stored cleanly
      });

      await inwardData.save();

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
      const fabricBalance = await Inward.find({ FABRIC_GROUP, COLOR_NAME });

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

      // Assign ORDER NO
       const orderNo = await getNextOrderNo();

      // Remove _id to avoid duplicate key issues
       const cleanedItems = items.map(({ _id, ...rest }) => ({
      ...rest,
      ORDER_NO: orderNo,
    }));

      const savedDocs = await FabricOutward.insertMany(cleanedItems);

      return res.status(200).json(savedDocs);

    } catch (error) {
      console.error("Error in Outward:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  Balance: async (req, res) => {
    try {
      const fabricData = await Inward.findOne();
      let newData = fabricData.toObject();

      delete newData._id;

      const balance = new FabricBalance(newData);
      await balance.save();

      return res.status(200).send("Balance was Saved");

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
      const { ORDER_NO } = req.body;
      const fabricData = await Inward.find({ ORDER_NO });

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

export default fabricController;
