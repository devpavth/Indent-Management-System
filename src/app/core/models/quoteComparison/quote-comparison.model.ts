import { indentProductList } from "../proRequestData/pro-requestdata.model";

export interface assignedVendor {
  assgndVendorId: number;
  vendorId: number;
  vendorName: string;
  vdrAdd1: string;
  vdrAdd2: string;
  vdrCity: string;
  vdrCountry: string;
  vdrEmail: string;
  vdrGstNo: string;
  vdrPincode: number;
  vdrState: string
}

export interface quoteComparisonProducts {
  qcProductsId: number;
  quotedPrice: number;
  productDetailsDTO: indentProductList;
}


export interface quoteComparisonVendors {
  quotePath: string;
  quoteCompareVendorId: number;
  assgndVendorData: assignedVendor;
  qcProducts: quoteComparisonProducts[];
}

export interface quoteComparisonHeadOfAcc {
  headOfAccId: number;
  headOfAccName: string;
  id: number;
  leastPrice: number;
  leastQuotedVendor: number;
  leastQuotedVendorName: string;
  qcVendors: quoteComparisonVendors[];
}

export interface QuoteComparison {
  indentId: number;
  quoteCompareId: number;
  requestNo: string;
  qcHeadOfAcc: quoteComparisonHeadOfAcc[];
}
