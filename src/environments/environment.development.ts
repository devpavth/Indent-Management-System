let Url = 'http://192.168.1.13:9010/';
// let Url = 'http://192.168.212.62:9010/';
let location = 'https://www.universal-tutorial.com/api/';

let bassEmployeeApi = 'employee';
let baseProductApi = 'product';
let baseRequestApi = 'requestindent';
let baseBranchApi = 'branch';
let baseDonarApi = 'donor';
let baseVendorApi = 'vendor';

export const environment = {
  employee: Url + bassEmployeeApi,
  addEmployee: Url + bassEmployeeApi + '/addnewemp',
  countrySateCity: Url + 'api/',
  login: Url + 'employee/login',
  allCountry: location + 'countries',
  allState: location + 'states/',
  allCity: location + 'cities/',
  getUserDetail: Url + bassEmployeeApi + '/getemployee/',
  getAllEmployeeDetails: Url + bassEmployeeApi + '/getallemp',
  verifiedID: Url + bassEmployeeApi + '/verifyempid',
  updateEmployee: Url + bassEmployeeApi + '/updateemployee',
  deleteEmployee: Url + bassEmployeeApi + '/deleteemployee',
  verifyEmail: Url + bassEmployeeApi + '/emailid',
  verifyPhoneNo: Url + bassEmployeeApi + '/phonenumber',

  addProduct: Url + baseProductApi + '/addnewproducts',
  getAllProduct: Url + baseProductApi + '/getallproduct',
  getProductDetails: Url + baseProductApi + '/productbyId/',
  updateProduct: Url + baseProductApi + '/update',
  deleteProduct: Url + baseProductApi + '/deletebyid/',
  requestGetProductDetails: Url + baseRequestApi + '/productdetails',
  getDecription: Url + baseRequestApi + '/getproductdata',
  addOtherProduct: Url + baseProductApi + '/addotherproduct',
  getAllOtherProduct: Url + baseProductApi + '/getpartialproduct',
  UpdateOtherProduct: Url + baseProductApi + '/updateotherproduct',
  gstUpdate: Url + baseProductApi + '/updategst/',

  getAllBranch: Url + baseBranchApi + '/getallbranch',
  getBranch: Url + baseBranchApi + '/branchname',
  addNewBranch: Url + baseBranchApi + '/addnewbranch',
  addBranchDepartment: Url + baseBranchApi + '/adddepart/',
  getBranchDetails: Url + baseBranchApi + '/getbranchbyid',
  deleteDept: Url + baseBranchApi + '/deletedept',
  updateBranch: Url + baseBranchApi + '/updatebranch',
  getAlldepartment: Url + baseBranchApi + '/getalldepartment',

  addDonar: Url + baseDonarApi + '/addnewdonor',
  getAllDonor: Url + baseDonarApi + '/getalldonors',
  viewDonorDetails: Url + baseDonarApi + '/getdonor/',
  updateDonor: Url + baseDonarApi + '/updatedonor/',
  deleteDonor: Url + baseDonarApi + '/delete/',

  getHsnCode: Url + baseRequestApi + '/hsncode/',

  postRequestIndent: Url + baseRequestApi + '/newrequest',
  getYourReq: Url + baseRequestApi + '/getyourRequest',
  viewYourReq: Url + baseRequestApi + '/getrequestbyid/',
  reqProduct: Url + baseRequestApi + '/getproductdata/',
  branchApprovelList: Url + baseRequestApi + '/getbranchrequest/',

  branchApprovel: Url + baseRequestApi + '/acceptBauthorize/',
  branchRejected: Url + baseRequestApi + '/rejectBauthorize/',

  adminAprovalList: Url + baseRequestApi + '/getrequestsforadmin/',
  adminAprovel: Url + baseRequestApi + '/acceptAauthorize/',
  adminRejected: Url + baseRequestApi + '/rejectAauthorize/',

  commend: Url + baseRequestApi + '/getactivecommends',

  finRequestList: Url + baseRequestApi + '/requestforfinance/',
  updateRequestList: Url + baseRequestApi + '/updaterequest/',
  finSubmite: Url + baseRequestApi + '/acceptFauthorize/',
  finHolding: Url + baseRequestApi + '/holdrequest/',
  finReject: Url + baseRequestApi + '/rejectFauthorize/',

  comparisonPdf: Url + baseRequestApi + '/quote/upload/3',

  // vendor End Point Api
  addVendor: Url + baseVendorApi + '/addnewvendor',
  getAllVendorList: Url + baseVendorApi + '/getactivevendors',
  deleteVendor: Url + baseVendorApi + '/deletebyvendorid/',
};
