import {
  Component,
  ElementRef,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
// import { Socket } from 'ngx-socket-io';
// import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import { OutputType, jsPDF } from 'jspdf-invoice-template';

// import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
import { BranchService } from '../../../service/Branch/branch.service';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  @ViewChild('test', { static: false }) test!: ElementRef;

  searchText = '';
  employeeList: any = [];
  isViewEmployee = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  list: any;
  listLength: any;
  employeeID: any;

  empPopUpMsg: any;
  _branch: any;
  isSuccess: boolean = false;
  isDelete: boolean = false;
  isAuth: boolean = false;
  Spinner: boolean = true;
  isEmployeeList: boolean = false;
  pageNotFound: boolean = false;

  constructor(
    private employeeService: EmployeeServiceService,
    private Admin: AdminProductServiceService,
    private branchService: BranchService,
    private userdata: SharedServiceService,
  ) {}
  userid: any = this.userdata.loginUserData?.sno;

  ngOnInit(): void {
    this.fetchEmployeeList(this.userid);
    this.employeeService.refrechData.subscribe((res) => {
      this.fetchEmployeeList(this.userid);
    });

    //  this.socket.emit('message', 'Hello Server!');

    //   this.socket.fromEvent('reply').subscribe((data: any) => {
    //     console.log('Received message from server:', data);
    //   });
  }

  fetchEmployeeList(data: any) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.employeeService.getAllEmployeeDetails(data).subscribe(
      (res) => {
        // this.employeeList=res;
        this.isEmployeeList = true;
        this.Spinner = false;
        this.list = res;
        this.listLength = this.list.length;

        this.employeeList = this.list.slice(startIndex, endIndex);

        console.log(this.employeeList);

        this.totalpage += this.employeeList.length;

        console.log("fetching employee list:",res);
      },
      (error) => {
        if (error.status == 403) {
          console.log('hello');
          this.Spinner = false;
          this.isAuth = true;
        }
        if (error.status == 0) {
          this.pageNotFound = true;
        }
      },
    );
  }
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.fetchEmployeeList(this.userid);
  }
  viewEmployeeDetails(data: any) {
    console.log(data);
    this.isViewEmployee = true;
    this.employeeID = data;
  }
  closeViewEmployee(data: any) {
    this.isViewEmployee = data;
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }
  get startPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  get endPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.listLength);
  }
  sortbyname() {
    this.employeeList.sort((a: any, b: any) =>
      a.empFirstName.localeCompare(b.empFirstName),
    );
  }
  sortbyrole() {
    this.employeeList.sort((a: any, b: any) =>
      a.empRole.localeCompare(b.empRole),
    );
  }
  generatePdf() {
    let EmployeeList = this.list;
    const data = EmployeeList.map(Object.values);
    const head = [
      [
        'Employee Code',
        'First Name',
        'Employee Code',
        'Designation',
        'Company',
        'Branch',
        'Department',
        'Shift',
        'Status,',
        'Company',
      ],
    ];
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        // const doc = new jsPDF.default('p', 'mm', 'a4');
        const doc = new jsPDF.default('p', 'mm', 'a4');
        doc.setFont('Helvetica');
        autoTable(doc, {
          body: [
            [
              {
                content: 'Frame It',

                styles: {
                  halign: 'left',
                  fontSize: 20,
                  textColor: '#ffffff',
                },
              },
              {
                content: 'Invoice',
                styles: {
                  halign: 'right',
                  fontSize: 20,
                  textColor: '#ffffff',
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {
            fillColor: '#3366ff',
          },
        });
        autoTable(doc, {
          body: [
            [
              {
                content:
                  'Reference: #INV0001' +
                  '\nDate: 2024-01-01' +
                  '\nInvoice number:521345',
                styles: {
                  halign: 'right',
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {
            // fillColor:'#3366ff'
          },
        });

        autoTable(doc, {
          // head:[['Billed To','Shipping Address:','From:']],
          body: [
            [
              {
                content:
                  'Billed To:' +
                  '\nJagan' +
                  '\nAddress line 1' +
                  '\nAddress Line 2' +
                  '\nZip code - City' +
                  '\nCountry',
                styles: {
                  halign: 'left',
                },
              },
              {
                content:
                  'Shipping Address:' +
                  '\nJagan' +
                  '\nAddress line 1' +
                  '\nAddress Line 2' +
                  '\nZip code - City' +
                  '\nCountry',
                styles: {
                  halign: 'left',
                },
              },
              {
                content:
                  'From:' +
                  '\nFrame It' +
                  '\nAddress line 1' +
                  '\nAddress Line 2' +
                  '\nZip code - City' +
                  '\nCountry',
                styles: {
                  halign: 'right',
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {
            // fillColor:'#3366ff'
          },
        });
        autoTable(doc, {
          body: [
            [
              {
                content: 'Amount due:',
                styles: {
                  halign: 'right',
                  fontSize: 14,
                },
              },
            ],
            [
              {
                content: '$500',
                styles: {
                  halign: 'right',
                  fontSize: 20,
                  textColor: '#3366ff',
                },
              },
            ],
            [
              {
                content: 'Due date:2024-02-01',
                styles: {
                  halign: 'right',
                },
              },
            ],
          ],
          theme: 'plain',
        });
        autoTable(doc, {
          body: [
            [
              {
                content: 'Product & Service:',
                styles: {
                  halign: 'left',
                  fontSize: 14,
                },
              },
            ],
          ],
          theme: 'plain',
        });
        autoTable(doc, {
          head: [['Item', 'Category', 'Quantity', 'Price', 'Tax', 'Amount']],
          body: [
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
            [
              'Product Or service Name',
              'Category name',
              '2',
              '$450',
              '$50',
              '$1000',
            ],
          ],
          // body:data,
          theme: 'striped',
          headStyles: {
            fillColor: '#343a40',
          },
        });
        autoTable(doc, {
          body: [
            [
              {
                content: 'Subtotal:',
                styles: {
                  halign: 'right',
                },
              },
              {
                content: '$500',
                styles: {
                  halign: 'right',
                },
              },
            ],
            [
              {
                content: 'Total tax:',
                styles: {
                  halign: 'right',
                },
              },
              {
                content: '$500',
                styles: {
                  halign: 'right',
                },
              },
            ],
            [
              {
                content: 'Total amount:',
                styles: {
                  halign: 'right',
                },
              },
              {
                content: '$500',
                styles: {
                  halign: 'right',
                },
              },
            ],
          ],
          theme: 'plain',
        });
        autoTable(doc, {
          body: [
            [
              {
                content: 'Terms & note',
                styles: {
                  halign: 'left',
                  fontSize: 14,
                },
              },
            ],
            [
              {
                content:
                  'All information, software, services, and comments provided on the site are for informational and self-help purposes only and are not intended to be a substitute for professional legal advice. Use of this site is subject to our Terms of Use.',
                styles: {
                  halign: 'left',
                },
              },
            ],
          ],
          theme: 'plain',
        });
        autoTable(doc, {
          body: [
            [
              {
                content: 'This is center footer',
                styles: {
                  halign: 'center',
                },
              },
            ],
          ],
        });
        // autoTable(doc, {
        //   head: head,
        //   body: data,
        //   tableLineColor: [0, 0, 0],
        //   tableLineWidth: 0,
        //   styles: {
        //     lineColor:[164, 164, 164],
        //     lineWidth: 0.01,
        //   },
        //   theme: 'plain',
        //   headStyles: {
        //     fillColor: [62, 84, 223],
        //     lineColor: [121, 121, 121],
        //     lineWidth: 0.01,
        //     textColor: [225, 225, 225]
        //     // fontSize: 15,
        //   },
        //   bodyStyles: {
        //     textColor: 0
        //   },
        //   didDrawCell: (data) => { },
        // });
        doc.save('Employee.pdf');
      });
    });
  }

  showSuccess(data: boolean) {
    this.empPopUpMsg = 'Successfully Updated Employee.';
    this.isSuccess = data;
    this.isViewEmployee = !data;
    // this.fetchEmployeeList();
  }
  closeSucessPop(data: boolean) {
    this.isSuccess = data;
    this.fetchEmployeeList(this.userid);
  }
  viewDeleteUp(data: any) {
    this.isDelete = data;
  }
  closeDeletePop(data: any) {
    this.isViewEmployee = !this.isViewEmployee;
    this.isDelete = !this.isDelete;
    if (data == 1) {
      let empId = this.Admin.employeeCode.employeeId;
      console.log("Employee ID to delete:", empId);

      this.employeeService.deleteEmployee(empId).subscribe(
        (res) => {
          if(res !== null){
            console.log("deleting employee:",res);
          }else{
            console.log("Employee deleted successfully, no response data.");
          }
        },
        (error) => {
          if (error.status == 200) {
            this.fetchEmployeeList(this.userid);
            console.log("userid:",this.userid);
            console.log('Delete Success');
          }else{
            console.error('Delete failed:', error);
          }
        },
      );
    }
  }
}
