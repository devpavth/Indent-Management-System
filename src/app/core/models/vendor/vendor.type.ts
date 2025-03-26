export type VendorAccount = {
    bankAccNo: string;
    ifsCode: string;
    vdrAccId: number;
    vdrAccStatus: number
}

export type Vendor = {
  bizDetailName: string;
  bizDetails: number;
  bizType: string;
  branchId: number;
  createdBy: string;
  createdOn: string;
  estDate: string;
  modifiedBy: string;
  modifiedOn: string;
  serviceLocation: number;
  vdrAdd1: string;
  vdrAdd2: string;
  vdrCity: string;
  vdrContactPersonName: number;
  vdrContactPersonPhone: number;
  vdrCountry: string;
  vdrEmail: string;
  vdrGstNo: string;
  vdrMsmeNo: string;
  vdrPanNo: string;
  vdrPincode: number;
  vdrState: string;
  vdrStatus: number;
  vdrTanNo: string;
  vendorId: number;
  vendorName: string;
  vendorAcccountDetails: VendorAccount[];
};
