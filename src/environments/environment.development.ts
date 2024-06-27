let Url = 'http://192.168.1.13:9010/';


let location = 'https://www.universal-tutorial.com/api/';

let bassEmployeeApi = 'employee';
let baseProductApi = 'product';
let baseRequestApi = 'requestindent';
let baseBranchApi = 'branch';
let baseFunderApi = 'funder';
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

  //Product Api
  addGroup: Url + baseProductApi + '/addgroup',
  groupList: Url + baseProductApi + '/getactivegroup',
  addCat: Url + baseProductApi + '/addcategory/',
  catList: Url + baseProductApi + '/getactivecatg/',
  addBrand: Url + baseProductApi + '/addbrand/',
  brandList: Url + baseProductApi + '/getactivebrand/',
  postProduct: Url + baseProductApi + '/addproductdetails/',
  getAllProduct: Url + baseProductApi + '/getallactivedetails',
  deleteProduct: Url + baseProductApi + '/deletedetailfromproductid/',
  getStockDetails: Url + baseProductApi + '/getstockdetails/',

  modelList: Url + baseProductApi + '/getmodelname/',
  desList: Url + baseProductApi + '/getprddetails/',
  //inward
  getProductByCode: Url + baseProductApi + '/getprdbycode/',
  inward: Url + baseProductApi + '/addprdtrans',
  //Branch Api
  getAllBranch: Url + baseBranchApi + '/getallbranch',
  getBranch: Url + baseBranchApi + '/branchname',
  addNewBranch: Url + baseBranchApi + '/addnewbranch',
  addBranchDepartment: Url + baseBranchApi + '/adddepart/',
  getBranchDetails: Url + baseBranchApi + '/getbranchbyid',
  deleteDept: Url + baseBranchApi + '/deletedept',
  updateBranch: Url + baseBranchApi + '/updatebranch',
  getAlldepartment: Url + baseBranchApi + '/getalldepartment',
  getHsnCode: Url + baseRequestApi + '/hsncode/',

  //requestIndent
  programlist: Url + baseRequestApi + '/getallprogram',
  headofaccountlist: Url + baseRequestApi + '/getallhoacc',

  //old request api

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

  //old request end

  // vendor End Point Api

  addVendor: Url1 + baseVendorApi + '/addnewvendor',
  getAllVendorList: Url1 + baseVendorApi + '/getactivevendors',
  deleteVendor: Url1 + baseVendorApi + '/deletebyvendorid/',
  updateVendor: Url1 + baseVendorApi + '/updatevendor/',
  getBranchName: Url + baseBranchApi + '/branchname',
  updateAccount: Url1 + baseVendorApi + '/updateBankDetails/',
  deleteAccount: Url1 + baseVendorApi + '/deletebank/',


  //Funder api
  addFunder: Url + baseFunderApi + '/addnewfunder',
  getAllFunderList: Url + baseFunderApi + '/getactivefunders',
  deleteFunder: Url + baseFunderApi + '/delete/',
  assignFunder: Url + baseFunderApi + '/assignfunder/',
  AssignedBranch: Url + baseFunderApi + '/getinhandfund/',
  addFund: Url + baseFunderApi + '/addfund/',

  //transaction  api

  productTransaction: Url + baseProductApi + '/gettransbycode/',
};
