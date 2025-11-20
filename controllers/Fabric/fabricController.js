import Fabric from "../../models/Fabric/Inward.js";
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
        DOC_NO, DATE, JOB_ORDER_NO, RECORD_TYPE, FABRIC_GROUP, COLOR_NAME,
        SET_NO, DC_DIA, DIA_TYPE, PRCESS_NAME, PROCESS_DC_NO,
        COMPACT_NO, RECD_DC_NO, RECD_DC_DATE, RECD_DC_ROLL, RECD_DC_WGT
      } = req.body;

      const fabric = new Fabric({
        DOC_NO, DATE, JOB_ORDER_NO, RECORD_TYPE, FABRIC_GROUP, COLOR_NAME, SET_NO,
        DC_DIA, DIA_TYPE, PRCESS_NAME, PROCESS_DC_NO, COMPACT_NO,
        RECD_DC_NO, RECD_DC_DATE, RECD_DC_ROLL, RECD_DC_WGT
      });

      await fabric.save();
      return res.status(200).send("Data is Saved");

    } catch (error) {
      console.log("Inward error:", error);
      return res.status(500).send("Server error");
    }
  },

  Selection: async (req, res) => {
    try {
      const { FABRIC_GROUP, COLOR_NAME } = req.body;
      const fabricBalance = await Fabric.find({ FABRIC_GROUP, COLOR_NAME });

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
      const fabricData = await Fabric.findOne();
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
      const fabricData = await Fabric.find();
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
      const fabricData = await Fabric.find({ ORDER_NO });

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
