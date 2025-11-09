{
    "DOC_NO":"1",
    "DATE":"2",
    "JOB_ORDER_NO":"3",
    "RECORD_TYPE":"4",
    "FABRIC_GROUP":"5",
    "COLOR_NAME":"6",
    "SET_NO":"7",
    "DC_DIA":"9",
    "DIA_TYPE":"10",
    "PRCESS_NAME":"11",
    "PROCESS_DC_NO":"12",
    "COMPACT_NO":"13",
    "RECD_DC_NO":"14",
    "RECD_DC_DATE":"15",
    "RECD_DC_ROLL":"16",
    "RECD_DC_WGT":"17"
}


            ,ROLL,WGT
               fabricBalance.RECD_DC_ROLL = Number(fabricBalance.RECD_DC_ROLL) - Number(ROLL);
               fabricBalance.RECD_DC_WGT = Number(fabricBalance.RECD_DC_WGT) - Number(WGT);