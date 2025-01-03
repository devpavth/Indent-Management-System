let Url = 'http://192.168.1.2:9010/';

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
  deleteEmployee: Url + bassEmployeeApi + '/deleteemployee/',
  verifyEmail: Url + bassEmployeeApi + '/emailid',
  verifyPhoneNo: Url + bassEmployeeApi + '/phonenumber',
  getDesignation: Url + bassEmployeeApi + '/empDesignation',
  searchPincode: Url + 'api/searchPincode/',
  //Product Api
  addGroup: Url + baseProductApi + '/addgroup',
  groupList: Url + baseProductApi + '/getactivegroup',
  addCat: Url + baseProductApi + '/addcategory/',
  catList: Url + baseProductApi + '/getactivecatg/',
  addBrand: Url + baseProductApi + '/addbrand/',
  brandList: Url + baseProductApi + '/getactivebrand/',
  postProduct: Url + baseProductApi + '/addproductdetails/',
  getAllProduct: Url + baseProductApi + '/getallactivedetails',
  deleteProduct: Url + baseProductApi + '/deletetprd/',
  getStockDetails: Url + baseProductApi + '/getstockdetails/',
  otherProduct: Url + baseProductApi + '/addotherprd',
  modelList: Url + baseProductApi + '/getmodelname/',
  desList: Url + baseProductApi + '/getprddetails/',
  addHeadOfAcc: Url + baseProductApi + '/addheadofaccount',
  //inward
  getProductByCode: Url + baseProductApi + '/getprdbycode/',
  inward: Url + baseProductApi + '/addprdinward',
  fetchLiveProductDetails: Url + baseProductApi + '/getallactivedetails',
  fetchLiveVendorDetails: Url + baseVendorApi + '/getactivevendors',
  fetchOtherProductDetails: Url + baseProductApi + '/getotherprd',
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
  getProjOrProg: Url + baseBranchApi + '/getallprg',
  getActiveProg: Url + baseBranchApi + '/getactiveprg/',

  //departmentd
  addNewDepartment: Url + baseBranchApi + '/adddepartment',
  addNewProject: Url + baseBranchApi + '/addprogram',
  deletProj: Url + baseBranchApi + '/deleteprogram/',
  updateDepartment: Url + baseBranchApi + '/getdeptidname/',
  deleteDepart: Url + baseBranchApi + '/deletedept/',
  updateProj: Url + baseBranchApi + '/updateprogram/',
  editProj: Url + baseBranchApi + '/getById/',
  updateDepart: Url + baseBranchApi + '/addprgusedepartid/',

  //requestIndent
  programlist: Url + baseRequestApi + '/getallprogram',
  headofaccountlist: Url + baseProductApi + '/getallhoacc',
  postIndent: Url + baseRequestApi + '/newrequest',
  branchApprovelList: Url + baseRequestApi + '/branchrequest',
  adminAprovalList: Url + baseRequestApi + '/requestsforadmin',
  getYourReq: Url + baseRequestApi + '/yourRequest',
  //old request api

  postRequestIndent: Url + baseRequestApi + '/newrequest',

  viewYourReq: Url + baseRequestApi + '/getrequestbyid/',
  reqProduct: Url + baseRequestApi + '/getproductdata/',

  branchApprovel: Url + baseRequestApi + '/acceptBauthorize/',
  branchRejected: Url + baseRequestApi + '/rejectBauthorize/',

  adminAprovel: Url + baseRequestApi + '/acceptAauthorize/',
  adminRejected: Url + baseRequestApi + '/rejectAauthorize/',

  commend: Url + baseRequestApi + '/getactivecommends',

  finRequestList: Url + baseRequestApi + '/requestforfinance',
  updateRequestList: Url + baseRequestApi + '/updaterequest/',
  finSubmite: Url + baseRequestApi + '/acceptFauthorize/',
  finHolding: Url + baseRequestApi + '/holdrequest/',
  finReject: Url + baseRequestApi + '/rejectFauthorize/',

  comparisonPdf: Url + baseRequestApi + '/quote/upload/3',

  confirmBranchDetails: Url + baseRequestApi + '/urgent/getbranch',
  confirmOtp: Url + baseRequestApi + '/urgent/getbranch/sendotp',
  // http://localhost:9010/requestindent/urgent/getbranch/sendotp

  //old request end

  // vendor End Point Api

  addVendor: Url + baseVendorApi + '/addnewvendor',
  getAllVendorList: Url + baseVendorApi + '/getactivevendors',
  deleteVendor: Url + baseVendorApi + '/deletebyvendorid/',
  updateVendor: Url + baseVendorApi + '/updatevendor/',
  getVendorName: Url + baseVendorApi + '/getactivevendors',
  updateAccount: Url + baseVendorApi + '/updateBankDetails/',
  deleteAccount: Url + baseVendorApi + '/deletebank/',

  //Funder api
  addFunder: Url + baseFunderApi + '/addnewfunder',
  getAllFunderList: Url + baseFunderApi + '/getactivefunders',
  deleteFunder: Url + baseFunderApi + '/delete/',
  assignFunder: Url + baseFunderApi + '/assignfunder/',
  AssignedBranch: Url + baseFunderApi + '/getinhandfund/',
  addFund: Url + baseFunderApi + '/addfund/',
  branchFunder: Url + baseFunderApi + '/branchfunder/',

  //transaction  api

  productTransaction: Url + baseProductApi + '/gettransbycode/',

  //report

  productReport: Url + baseProductApi + '/stockreport',
};
