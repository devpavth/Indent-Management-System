export interface indentProductList {
  headOfAccId: number;
  headOfAccName: string;
  id: number;
  itemTotalPrice: number;
  prdCode: string;
  prdDescription: string;
  prdGstPct: number;
  prdHsnCode: number;
  prdStatus: number;
  prdUnit: number;
  prdbrndName: string;
  prdcatgName: string;
  prdgrpName: string;
  prdmdlName: string;
  productId: number;
  qty: number;
  unitPrice: number;
}

export type POProductList = indentProductList & {
  lastReceivedDate?: string;
  receivedQty?: number;
  status?: number;
  totalPieces?: number;
};

export interface ProRequestdata {
  reqId: number;
  requestNo: string;
  productDetails: indentProductList[];
}
