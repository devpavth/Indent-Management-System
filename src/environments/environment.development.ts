let Url = 'http://localhost:9010/';

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
  fetchLevelForDesignation: Url + bassEmployeeApi + '/level/getactive',
  postNewDesignation: Url + bassEmployeeApi + '/desig/addnew/',
  fetchNewLevel: Url + bassEmployeeApi + '/level/getnew',
  confirmNewLevel: Url + bassEmployeeApi + '/level/addnew',
  updateLevelForDesgination: Url + bassEmployeeApi + '/alter/level/desig',
  removeRoleFromDesignation: Url + bassEmployeeApi + '/desig/role/remove',
  fetchDesignationFromLevel: Url + bassEmployeeApi + '/level/get/',
  getDesignation: Url + bassEmployeeApi + '/empDesignation',
  getDesignationRoleMapping: Url + bassEmployeeApi + '/desig/getactive',
  getDesignationRole: Url + bassEmployeeApi + '/role/getactive',
  fetchDesignationAssignedRole: Url + bassEmployeeApi + '/desig/get/',
  assigningRoleToDesignation: Url + bassEmployeeApi + '/desig/role/addnew',
  searchPincode: Url + 'api/searchPincode/',
  postSignature: Url + bassEmployeeApi + '/add-signature',
  fetchUploadedSignature: Url + bassEmployeeApi + '/get-signature',
  fetchEmployeeProfileDetails: Url + bassEmployeeApi + '/get-profiledata',
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
  updateProductDetails: Url + baseProductApi + '/updateprd/',
  updateOtherProductDetails: Url + baseProductApi + '/updateotherprd/',
  fetchStockReportForBranch: Url + baseProductApi + '/stockreportforbranch/',
  //inward
  getProductByCode: Url + baseProductApi + '/getprdbycode/',
  inward: Url + baseProductApi + '/addprdinward',
  fetchLiveProductDetails: Url + baseProductApi + '/getallactivedetails',
  fetchLiveVendorDetails: Url + baseVendorApi + '/getactivevendors',
  fetchOtherProductDetails: Url + baseProductApi + '/getotherprd',
  saveOutward: Url + baseProductApi + '/addprdoutward',
  fetchInwardForBranch: Url + baseProductApi + '/getinwardforbranch/',
  fetchAllStockReport: Url + baseProductApi + '/stockreport',
  //Branch Api
  getAllBranch: Url + baseBranchApi + '/getallbranch',
  getBranch: Url + baseBranchApi + '/branchname',
  addNewBranch: Url + baseBranchApi + '/addnewbranch',
  addBranchDepartment: Url + baseBranchApi + '/adddepart/',
  getBranchDetails: Url + baseBranchApi + '/getbranchbyid',
  deleteDept: Url + baseBranchApi + '/removeDepartFromBranch/',
  updateBranch: Url + baseBranchApi + '/updatebranch',
  getAlldepartment: Url + baseBranchApi + '/getalldepartment',
  getHsnCode: Url + baseRequestApi + '/hsncode/',
  getProjOrProg: Url + baseBranchApi + '/getallprg',
  getActiveProg: Url + baseBranchApi + '/getactiveprg/',
  deleteDepartmentProgram: Url + baseBranchApi + '/deleteprg/',

  //departmentd
  addNewDepartment: Url + baseBranchApi + '/adddepartment',
  addNewProject: Url + baseBranchApi + '/addprogram',
  deletProj: Url + baseBranchApi + '/deleteprogram/',
  updateDepartment: Url + baseBranchApi + '/getdeptidname/',
  deleteDepart: Url + baseBranchApi + '/deletedept/',
  updateProj: Url + baseBranchApi + '/updateprogram/',
  editProj: Url + baseBranchApi + '/getById/',
  updateDepart: Url + baseBranchApi + '/addprgusedepartid/',
  fetchCompany: Url + baseBranchApi + '/get/company',
  uploadCompanyLogo: Url + baseBranchApi + '/update/company-logo',
  updateCompanyName: Url + baseBranchApi + '/update/company',

  //requestIndent
  programlist: Url + baseRequestApi + '/getallprogram',
  headofaccountlist: Url + baseProductApi + '/getallhoacc',
  postIndent: Url + baseRequestApi + '/newrequest',
  branchApprovelList: Url + baseRequestApi + '/branchrequest/',
  adminAprovalList: Url + baseRequestApi + '/requestsforadmin/',
  getYourReq: Url + baseRequestApi + '/getyourrequest',
  fetchProgramManagerRequest: Url + baseRequestApi + '/prgmanagerRequst/',
  //old request api

  postRequestIndent: Url + baseRequestApi + '/newrequest',

  viewYourReq: Url + baseRequestApi + '/getrequestbyid/',
  reqProduct: Url + baseRequestApi + '/getproductdata/',

  programManagerApproval: Url + baseRequestApi + '/acceptprgmanager/',
  programManagerRejected: Url + baseRequestApi + '/rejectedbyprgmanager/',

  branchApprovel: Url + baseRequestApi + '/acceptBauthorize/',
  branchRejected: Url + baseRequestApi + '/rejectBauthorize/',

  adminAprovel: Url + baseRequestApi + '/acceptAauthorize/',
  adminRejected: Url + baseRequestApi + '/rejectAauthorize/',

  commend: Url + baseRequestApi + '/getactivecomments',

  finRequestList: Url + baseRequestApi + '/requestforfinance/',
  updateRequestList: Url + baseRequestApi + '/updaterequest/',
  finSubmite: Url + baseRequestApi + '/acceptFauthorize/',
  finHolding: Url + baseRequestApi + '/holdrequest/',
  finReject: Url + baseRequestApi + '/rejectFauthorize/',

  fetchProcurementList: Url + baseRequestApi + '/requestforprct/',
  prctHolding: Url + baseRequestApi + '/holdrequestbyprct/',
  prcReject: Url + baseRequestApi + '/rejectprctauth/',

  comparisonPdf: Url + baseRequestApi + '/addquotecomparison',
  quoteHeadOfAccVerification:
    Url + baseRequestApi + '/quotecomparisonverification/',

  confirmBranchDetails: Url + baseRequestApi + '/urgent/getbranch',
  confirmOtp: Url + baseRequestApi + '/urgent/getbranch/sendotp',

  fetchQuoteComparison: Url + baseRequestApi + '/getquotecomparison',
  fetchQuoteComparisonPDF: Url + baseRequestApi + '/quote/generate-report',
  fetchNormalRequest: Url + baseRequestApi + '/getnormalrequest',
  fetchConsolidatedQuotePDF:
    Url + baseRequestApi + '/quote/consolidate/generate-report/',

  fetchSpecialRolesRequestIsProcess:
    Url + baseRequestApi + '/requestforspecialroles/',
  fetchSpecialRolesRequestIsAccept:
    Url + baseRequestApi + '/requestforspecialroles/',

  acceptSpecialRoleRequest: Url + baseRequestApi + '/acceptspecialroleauth',
  fetchDateWiseAllIndentReport: Url + baseRequestApi + '/getdatewiserequest',
  fetchUrgentIndentReport: Url + baseRequestApi + '/geturgentrequest',
  fetchNormalIndentReport: Url + baseRequestApi + '/getnormalrequest',
  fetchCompletedIndentReport: Url + baseRequestApi + '/getcompletedindent',
  fetchRejectedIndentReport: Url + baseRequestApi + '/getrejectedindent',
  fetchHeadOfAccByIndent: Url + baseRequestApi + '/gethoaccdetailsforindent',

  generatePurchaseOrder: Url + baseRequestApi + '/generate/purchaseorder/',

  fetchRequestByIndentCode:
    Url + baseRequestApi + '/getrequestbyindentcode/',
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
  fetchFunderDetails: Url + baseFunderApi + '/getinhandfund/',

  //transaction  api
  // fetchTransactionInfo: Url + baseProductApi + '/gettransbycode/',

  productTransaction: Url + baseProductApi + '/gettransbycode/',
  confirmInward: Url + baseProductApi + '/confirminward/',

  //report

  productReport: Url + baseProductApi + '/stockreport',
};
