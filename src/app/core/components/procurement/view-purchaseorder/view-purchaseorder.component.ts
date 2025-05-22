import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { indentProductList } from '../../../models/proRequestData/pro-requestdata.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BranchService } from '../../service/Branch/branch.service';
import { Company } from '../../../models/company/company.model';
import { ToastService } from '../../service/toast/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-purchaseorder',
  templateUrl: './view-purchaseorder.component.html',
  styleUrl: './view-purchaseorder.component.css',
})
export class ViewPurchaseorderComponent {
  @Input() reqId: number = 0;
  @Input() indentNumber: string | undefined = '';
  @Input() headOfAccountId!: number | null;
  @Output() closeView = new EventEmitter<boolean>();

  requestService = inject(RequestService);
  branchService = inject(BranchService);
  toastService = inject(ToastService);
  datePipe = inject(DatePipe);

  _requestDetails = signal<any>(null);

  pdfURL: SafeResourceUrl | null = null;

  selectedHeadOfAccId: number | null = null;
  purchaseOrderData: any;
  branchList: any;
  contactPersonList: any;
  indentList: any;
  isLoading: boolean = false;
  companyDetails: Company | undefined;

  productHeadData: indentProductList[] = [];
  uniqueProductHeadData: indentProductList[] = [];

  PONumber: string = '';
  PODate: string = '';

  headOfProduct: any[] = [];

  ngOnInit() {
    console.log('reqId:', this.reqId);
    console.log('checking headofACcound ID:', this.headOfAccountId);
    this.fetchDetails(this.reqId);
    this.fetchCompanyDetails();
    this.generatePurchaseOrder(this.headOfAccountId);
  }

  constructor(private sanitizer: DomSanitizer) {}

  fetchCompanyDetails() {
    this.branchService.fetchCompanyName().subscribe(
      (res) => {
        console.log('fetching company details in purchase order:', res);
        this.companyDetails = res;
      },
      (error) => {
        console.log('error while fetching company details:', error);
      },
    );
  }

  fetchDetails(reqId: number) {
    this.requestService.viewReq(reqId).subscribe(
      (res) => {
        console.log('fetching indent request details:', res);
        this._requestDetails.set(res);
        this.productHeadData = this._requestDetails()?.productDetails;
      },
      (error) => {
        console.log('error while fetching indent request details:', error);
      },
    );
  }

  generatePurchaseOrder(headOfAccId: number | null) {
    this.isLoading = true;
    this.requestService.viewPurchaseOrder(this.reqId, headOfAccId).subscribe(
      (res) => {
        console.log('viewing the generated purchase order:', res);
        this.purchaseOrderData = res;
        this.branchList = this.purchaseOrderData.indentBranch;
        this.contactPersonList = this.purchaseOrderData.contactPersonData;
        this.indentList = this.purchaseOrderData.indentHeaders;
        const selectElement = this.purchaseOrderData.headofAcc.find(
          (item: any) => item.headOfAccId === headOfAccId,
        );

        this.PONumber = selectElement?.poNumber;
        this.PODate = selectElement?.poCreatedOn;

        // if (headOfAccId === 0) {
        //   this.headOfProduct = this.purchaseOrderData.headofAcc.flatMap(
        //     (h: any) => h.productDetailsDTOs,
        //   );
        //   this.viewPDF(this.purchaseOrderData.headofAcc);
        //   } else {
        const selectedHead = this.purchaseOrderData.headofAcc.find(
          (h: any) => h.headOfAccId === headOfAccId,
        );

        this.headOfProduct = selectedHead
          ? selectedHead.productDetailsDTOs
          : [];
        console.log('headofacc list:', this.headOfProduct);
        this.viewPDF([selectedHead]);
        // }

        this.isLoading = false;
      },
      (error) => {
        console.log('error while viewing generated purchase order:', error);
        this.isLoading = false;

        if (error.status === 400) {
          this.toastService.showWarning(error.error.errorMessege);
        }
      },
    );
  }

  viewPDF(headOfAccList: any[]) {
    console.log('headOfAccList:', headOfAccList);
    const doc = new jsPDF();
    // let currentPage = 1;

    headOfAccList.forEach((head: any, index: any) => {
      if (index > 0) {
        // Add a new page after each Head of Account (Except first page)
        doc.addPage();
        // currentPage++;
      }

      // Set font size
      doc.setFontSize(12);

      doc.setFont('helvetica', 'bold');

      // Set text color to green (RGB format)
      doc.setTextColor(80, 205, 90); // LimeGreen (RGB: 50, 205, 50)

      // Align text to the left (x = 10 is left margin)
      // doc.text('PURCHASE ORDER', 10, 10);
      const text = 'PURCHASE ORDER';
      const startX = 10;
      const startY = 10;
      const letterSpacing = 0.7; // Adjust letter spacing as needed
      let currentX = startX;

      for (const char of text) {
        doc.text(char, currentX, startY);
        currentX += doc.getTextWidth(char) + letterSpacing;
      }

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(8);
      const pageWidth = doc.internal.pageSize.width; // Get page width
      doc.text('ORIGINAL FOR RECIPIENT', pageWidth - 10, 10, {
        align: 'right',
      });

      // Company Information
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`${this.companyDetails?.companyName.toUpperCase()}`, 10, 20);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      const gstText = `GSTIN ${this.companyDetails?.gstNumber}`;
      const gstWidth = doc.getTextWidth(gstText);

      const adjustedY = 25;

      // Left side: GSTIN
      doc.text(gstText, 10, adjustedY);

      // Right next to GSTIN: PAN (with spacing)
      const spacing = 3; // Adjust spacing as needed
      doc.text(`PAN AAGCC3235L`, 10 + gstWidth + spacing, adjustedY);

      if (this.companyDetails?.companyLogo) {
        const companyLogo = `data:image/png;base64,${this.companyDetails.companyLogo}`;
        const logoX = doc.internal.pageSize.width - 40;
        const logoY = 15;
        const logoWidth = 30;
        const logoHeight = 30;

        doc.addImage(companyLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`${this.companyDetails?.add1}`, 10, 29);
      doc.text(`${this.companyDetails?.add2}`, 10, 33);
      doc.text(
        `${this.companyDetails?.city}, ${this.companyDetails?.state}, ${this.companyDetails?.pinCode}`,
        10,
        37,
      );
      const mobileLabel = 'Mobile:';
      const mobileValue = ` ${this.contactPersonList.empPhone}`;
      const emailLabel = 'Contact Person Email:';
      const emailValue = ` ${this.contactPersonList.empEmail}`;
      const websiteLabel = 'Contact Person Name:';
      const websiteValue = ` ${this.contactPersonList.empFirstName} ${this.contactPersonList.empLastName}`;

      // Measure width for positioning
      doc.setFont('helvetica', 'bold');
      const mobileLabelWidth = doc.getTextWidth(mobileLabel);
      doc.text(mobileLabel, 10, 48);

      doc.setFont('helvetica', 'normal');
      doc.text(mobileValue, 10 + mobileLabelWidth, 48);

      // Add spacing and position Email
      const spacingBetween = 3; // Adjust space between Mobile & Email

      doc.setFont('helvetica', 'bold');
      const emailLabelWidth = doc.getTextWidth(emailLabel);
      doc.text(
        emailLabel,
        10 + mobileLabelWidth + doc.getTextWidth(mobileValue) + spacingBetween,
        48,
      );

      doc.setFont('helvetica', 'normal');
      doc.text(
        emailValue,
        10 +
          mobileLabelWidth +
          doc.getTextWidth(mobileValue) +
          spacingBetween +
          emailLabelWidth,
        48,
      );

      doc.setFont('helvetica', 'bold');
      const websiteLabelWidth = doc.getTextWidth(websiteLabel);
      doc.text(websiteLabel, 10, 44);

      doc.setFont('helvetica', 'normal');
      doc.text(websiteValue, 10 + websiteLabelWidth, 44);

      const purchaseOrderLabel = 'Purchase Order #: ';
      const purchaseOrderValue = 'CLTPUR2425-31';
      const purchaseOrderDateLabel = 'Purchase Order Date: ';
      const purchaseOrderDateValue = '18 Feb 2025';
      const paymentByLabel = 'Payment by: ';
      const paymentByValue = '18 Feb 2025';

      // Starting X position (below website)
      const startPOY = 55;
      let currentPOX = 10; // Left margin

      // Purchase Order #
      doc.setFont('helvetica', 'bold');
      doc.text(purchaseOrderLabel, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(purchaseOrderLabel) + 1; // Add spacing

      doc.setFont('helvetica', 'bold');
      doc.text(this.PONumber, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(this.PONumber) + 10; // Add spacing

      // Purchase Order Date
      doc.setFont('helvetica', 'bold');
      doc.text(purchaseOrderDateLabel, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(purchaseOrderDateLabel) + 1; // Add spacing

      doc.setFont('helvetica', 'bold');
      const formattedDate = this.datePipe.transform(this.PODate, 'dd MMM yyyy');
      doc.text(formattedDate || '', currentPOX, startPOY);
      currentPOX += doc.getTextWidth(formattedDate || '') + 10; // Add spacing

      // Payment by
      // doc.setFont('helvetica', 'bold');
      // doc.text(paymentByLabel, currentPOX, startPOY);
      // currentPOX += doc.getTextWidth(paymentByLabel) + 1;

      // doc.setFont('helvetica', 'bold');
      // doc.text(paymentByValue, currentPOX, startPOY);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Vendor Details:', 10, 62); // Heading

      // Vendor Name
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');

      // Define positions
      const leftColumnX = 10; // Left alignment for "Vendor Details"
      const rightColumnX = 73; // Aligns "Vendor Billing Address" under purchaseOrderDateLabel

      // Vendor Details Heading (Left Side)
      doc.text('Vendor Details:', leftColumnX, 62);

      // Vendor Billing Address Heading (Right Side)
      doc.text('Vendor Billing Address:', rightColumnX, 62);

      doc.text('Mode Of Payment:', rightColumnX + 66, 62);

      // Vendor Information (Left)
      doc.setFontSize(9);
      doc.text(`${head.assgndVendorData.vendorName}`, leftColumnX, 67);
      doc.text(`GSTIN: ${head.assgndVendorData.vdrGstNo}`, leftColumnX, 71);
      doc.setFont('helvetica', 'normal');
      doc.text(`${head.assgndVendorData.vdrEmail}`, leftColumnX, 75);

      // Vendor Billing Address (Right)
      doc.setFont('helvetica', 'normal');
      doc.text(`${head.assgndVendorData.vdrAdd1}`, rightColumnX, 67);
      doc.text(`${head.assgndVendorData.vdrAdd2}`, rightColumnX, 71);
      doc.text(
        `${head.assgndVendorData.vdrCity}, ${head.assgndVendorData.vdrState}, ${head.assgndVendorData.vdrPincode}`,
        rightColumnX,
        75,
      );

      doc.text(`${head.modeOfPayment}`, rightColumnX + 66, 67);
      // doc.text(`${this.vendorList[0].vdrCountry}`, rightColumnX, 77);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');

      const placeOfSupplyLabel = 'Place of Supply:';
      const placeofSupplyX = 10;
      const placeofSupplyY = 82;

      doc.text(placeOfSupplyLabel, placeofSupplyX, placeofSupplyY);

      const placeOfSupplyWidth = doc.getTextWidth(placeOfSupplyLabel);
      const placeOfSupplySpacing = 38;

      const referenceLabel = 'Reference:';
      const referenceX =
        placeofSupplyX + placeOfSupplyWidth + placeOfSupplySpacing;
      doc.text(referenceLabel, referenceX, placeofSupplyY);

      const referenceWidth = doc.getTextWidth(referenceLabel);
      const referenceSpacing = 1;

      doc.setFont('helvetica', 'normal');
      doc.text(
        `DELIVERY LOCATION: ${this.branchList.city}`,
        referenceX + referenceWidth + referenceSpacing,
        placeofSupplyY,
      );

      // need to check
      doc.setFont('helvetica', 'bold');
      doc.text(
        `${this.branchList.gstNumber.slice(0, 2)}-${this.branchList.state}`,
        10,
        86,
      );

      const indentLabel = 'Indent ID:';
      const indentX = 73;
      doc.text(indentLabel, indentX, 86);

      const indentLabelWidth = doc.getTextWidth(indentLabel);
      const indentSpacing = 1;

      doc.setFont('helvetica', 'normal');
      doc.text(
        `${this.indentList.requestNo}`,
        indentX + indentLabelWidth + indentSpacing,
        86,
      );

      doc.setFont('helvetica', 'bold');
      const deptLabel = 'Department:';
      const deptX = 135;
      doc.text(deptLabel, deptX, 86);

      const deptLabelWidth = doc.getTextWidth(deptLabel);
      const deptSpacing = 1;

      doc.setFont('helvetica', 'normal');
      doc.text(
        `${this.branchList.deptName}`,
        deptX + deptLabelWidth + deptSpacing,
        86,
      );

      // const groupedProducts = this.headOfProduct.reduce((acc, item) => {
      //   if (!acc[item.headOfAccId]) {
      //     acc[item.headOfAccId] = {
      //       name: item.headOfAccName,
      //       totalTaxable: 0,
      //       products: [],
      //     };
      //   }

      //   const taxableValue = item.unitPrice * item.qty;
      //   acc[item.headOfAccId].totalTaxable += taxableValue;
      //   acc[item.headOfAccId].products.push({
      //     id: item.id,
      //     name: `${item.prdbrndName} - ${item.prdmdlName}\n${item.prdDescription.trim()}\nHSN: ${item.prdHsnCode}`,
      //     unitPrice: item.unitPrice.toFixed(2),
      //     qty: item.qty,
      //     taxableValue: taxableValue.toFixed(2),
      //     taxAmt: `${(taxableValue * (item.prdGstPct / 100)).toFixed(2)} (${item.prdGstPct}%)`,
      //     totalAmount: (
      //       taxableValue +
      //       taxableValue * (item.prdGstPct / 100)
      //     ).toFixed(2),
      //   });
      //   return acc;
      // }, {});

      // Table
      const finalY = 89;
      let serialNumber = 1;

      let grandTotalUnitPrice = 0;
      let grandTotalQty = 0;
      let grandTotalTaxable = 0;
      let grandTotalTaxAmt = 0;
      let grandTotalAmount = 0;

      let gstGroupedBreakdown: any = {};

      // const sectionY = finalY + index * 10 + index * 50;

      // doc.setLineWidth(0.5);
      // doc.setFillColor(240, 253, 244);
      // doc.setDrawColor(80, 205, 90);
      // doc.rect(10, sectionY, doc.internal.pageSize.width - 24, 8, 'FD');

      // doc.setFont('helvetica', 'bold');
      // doc.setFontSize(10);
      // doc.text(
      //   head.headOfAccName,
      //   doc.internal.pageSize.width / 2,
      //   sectionY + 5,
      //   { align: 'center' },
      // );

      const tableBody: any[][] = [];

      head.productDetailsDTOs.forEach((item: any) => {
        const unitPrice = item.unitPrice;
        const unitQty = item.qty;
        const taxableValue = item.unitPrice * item.qty;
        const taxAmt = taxableValue * (item.prdGstPct / 100);
        const totalAmount = taxableValue + taxAmt;
        const gstPercent = item.prdGstPct;

        tableBody.push([
          serialNumber++,
          `${item.prdbrndName} - ${item.prdmdlName}\n${item.prdDescription.trim()}\nHSN: ${item.prdHsnCode}`,
          item.unitPrice.toFixed(2),
          item.qty,
          taxableValue.toFixed(2),
          `${taxAmt.toFixed(2)} (${item.prdGstPct}%)`,
          totalAmount.toFixed(2),
        ]);

        grandTotalUnitPrice += unitPrice;
        grandTotalQty += unitQty;
        grandTotalTaxable += taxableValue;
        grandTotalTaxAmt += taxAmt;
        grandTotalAmount += totalAmount;

        if (!gstGroupedBreakdown[gstPercent]) {
          gstGroupedBreakdown[gstPercent] = {
            taxAmt: 0,
          };
        }
        gstGroupedBreakdown[gstPercent].taxAmt += taxAmt;
      });

      tableBody.push([
        {
          content: 'Subtotal:',
          colSpan: 2,
          styles: { fontStyle: 'bold', halign: 'right' },
        },
        {
          content: `${grandTotalUnitPrice.toFixed(2)}`,
          styles: { fontStyle: 'bold' },
        },
        {
          content: `${grandTotalQty.toFixed(2)}`,
          styles: { fontStyle: 'bold' },
        },
        {
          content: `${grandTotalTaxable.toFixed(2)}`,
          styles: { fontStyle: 'bold' },
        },
        {
          content: `${grandTotalTaxAmt.toFixed(2)}`,
          styles: { fontStyle: 'bold' },
        },
        {
          content: `${grandTotalAmount.toFixed(2)}`,
          styles: { fontStyle: 'bold' },
        },
      ]);

      let isFirstPageForHead = true;

      const drawHeadOfAccHeader = (doc: any, head: any) => {
        if (!isFirstPageForHead) return;
        const pageWidth = doc.internal.pageSize.width;
        const sectionY = 90; // Always start at a fixed position on each page

        // Draw a Green Header Bar
        doc.setLineWidth(0.5);
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(80, 205, 90);
        doc.rect(10, sectionY, pageWidth - 24, 8, 'FD');

        // Write Head of Account Name Centered
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(head.headOfAccName, pageWidth / 2, sectionY + 5, {
          align: 'center',
        });
        isFirstPageForHead = false;
      };

      isFirstPageForHead = true;

      autoTable(doc, {
        startY: finalY + 8,
        head: [
          [
            '#',
            'Item',
            'Rate/Item',
            'Qty',
            'Taxable Value',
            'Tax Amount',
            'Amount',
          ],
        ],
        body: tableBody,
        theme: 'grid',
        margin: { left: 10 },
        headStyles: {
          fillColor: [240, 253, 244],
          textColor: [0, 0, 0],
          lineWidth: 0.5,
          lineColor: [80, 205, 90],
        },
        styles: {
          lineWidth: 0.1,
          lineColor: [80, 205, 90],
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {
            // "Item" column
            if (data.row.index >= 0) {
              // Ensure it's a valid row
              if (data.cell.text.length > 0) {
                data.cell.styles.fontStyle = 'bold'; // Make full cell bold (temporary)
              }
            }
          }
        },
        didDrawCell: (data) => {
          if (data.row.section === 'head') {
            doc.setDrawColor(80, 205, 90); // Set border color (Green)
            doc.setLineWidth(0.75); // Adjust thickness if needed
            doc.line(
              data.cell.x, // X start
              data.cell.y + data.cell.height, // Y start (bottom of cell)
              data.cell.x + data.cell.width, // X end
              data.cell.y + data.cell.height, // Y end (same as start)
            );
          }
        },
        didDrawPage: (data: any) => {
          // Always draw the Head of Account Name at the top of every page
          drawHeadOfAccHeader(doc, head);
          // isFirstPageForHead = false;
          //  const totalPages = doc.internal.pages.length;
          //  doc.setFont('helvetica', 'normal');
          //  doc.setFontSize(8);
          //  doc.text(
          //    `Page ${currentPage} of ${totalPages}`,
          //    pageWidth / 2,
          //    doc.internal.pageSize.height - 10,
          //    { align: 'center' },
          //  );
        },
      });

      // isFirstPageForHead = true;

      // if ((doc as any).lastAutoTable.finalY > 250) {
      //   doc.addPage();
      //   drawHeadOfAccHeader(doc, head);
      // }

      // Object.values(groupedProducts).forEach((group: any, index) => {
      //   if (index > 0) {
      //     doc.addPage();
      //   }

      //   const sectionY = finalY + index * 10 + index * 50;

      //   doc.setLineWidth(0.5);
      //   doc.setFillColor(240, 253, 244);
      //   doc.setDrawColor(80, 205, 90);
      //   doc.rect(10, sectionY, doc.internal.pageSize.width - 24, 8, 'FD');

      //   doc.setFont('helvetica', 'bold');
      //   doc.setFontSize(10);
      //   doc.text(
      //     head.headOfAccName,
      //     doc.internal.pageSize.width / 2,
      //     sectionY + 5,
      //     { align: 'center' },
      //   );

      //   if (!head.productDetailsDTOs || head.productDetailsDTOs.length === 0) {
      //     doc.setFontSize(10);
      //     doc.setTextColor(255, 0, 0);
      //     doc.text(`No Products Available For This Head of Account`, 10, 60);
      //     return;
      //   }

      // });

      // Correct way to get lastAutoTable position
      let summaryY = (doc as any).lastAutoTable
        ? (doc as any).lastAutoTable.finalY + 10
        : finalY + 30;
      const pagePDFWidth = doc.internal.pageSize.width;
      const marginRight = 14;

      const alignRight = (text: string, y: number) => {
        const textWidth = doc.getTextWidth(text);
        doc.text(text, pagePDFWidth - textWidth - marginRight, y);
      };

      const lineHeight = 6;
      const branchStateCode =
        this.purchaseOrderData.indentBranch.gstNumber.substring(0, 2);
      const vendorStateCode = head.assgndVendorData.vdrGstNo.substring(0, 2);

      const totalMarginTop = 5;

      alignRight(`Taxable Amount: ${grandTotalTaxable.toFixed(2)}`, summaryY);
      summaryY += lineHeight;

      Object.keys(gstGroupedBreakdown as Record<string, any>).forEach(
        (gstPercent, index) => {
          const gst = gstGroupedBreakdown[gstPercent];

          let currentY = summaryY;

          if (branchStateCode === vendorStateCode) {
            const cgst = (gst?.taxAmt / 2).toFixed(2);
            const sgst = (gst?.taxAmt / 2).toFixed(2);

            const halfGst = (parseFloat(gstPercent) / 2).toFixed(1);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);

            // Summary
            alignRight(`CGST ${halfGst}%: ${cgst}`, currentY);
            currentY += lineHeight;

            alignRight(`SGST ${halfGst}%: ${sgst}`, currentY);
            currentY += lineHeight;

            summaryY = currentY;
          } else {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);

            alignRight(
              `IGST ${parseFloat(gstPercent).toFixed(1)}%: ${gst.taxAmt.toFixed(2)}`,
              summaryY,
            );
            summaryY += lineHeight;
          }
        },
      );

      // summaryY += lineHeight;

      const totalAmountWithoutRoundOff = grandTotalAmount;
      const roundedTotalAmount = Math.round(totalAmountWithoutRoundOff);
      const roundOffValue = (
        roundedTotalAmount - totalAmountWithoutRoundOff
      ).toFixed(2);

      alignRight(`Round Off: ${roundOffValue}`, summaryY);

      const totalY = summaryY + lineHeight * 2;
      doc.setDrawColor(80, 205, 90);
      doc.setLineWidth(0.3);
      doc.line(pagePDFWidth - 60, totalY - 7, pagePDFWidth - 12, totalY - 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      alignRight(`Total: ${roundedTotalAmount.toFixed(2)}`, totalY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      const pageSignWidth = doc.internal.pageSize.width;
      const pageSignHeight = doc.internal.pageSize.height;
      const signatureBoxHeight = 30;
      const signatureY = pageSignHeight - 45;

      const columnWidth = (pageWidth - 20) / 4;

      doc.setDrawColor(80, 205, 90);
      doc.setLineWidth(0.5);

      doc.rect(10, signatureY, pageSignWidth - 20, signatureBoxHeight);
      for (let i = 1; i < 4; i++) {
        doc.line(
          10 + i * columnWidth,
          signatureY,
          10 + i * columnWidth,
          signatureY + signatureBoxHeight,
        );
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);

      const columnTitles = this.purchaseOrderData.authoritiesSignDtos.map(
        (auth: any) => auth.roleName,
      );
      console.log('columnTitles:', columnTitles);

      const columnSignatures = this.purchaseOrderData.authoritiesSignDtos.map(
        (auth: any) => auth.signature,
      );

      // const columnTitles = [
      //   'PROCUREMENT MANAGER',
      //   'CEO',
      //   'DIRECTOR FINANCE',
      //   'HEAD ADMIN',
      // ];

      const columnCenterXList = columnTitles.map(
        (_: any, index: number) => 10 + index * columnWidth + columnWidth / 2,
      );

      const textY = signatureY + signatureBoxHeight / 2 + 3; // Adjust for vertical centering
      const lineBoxHeight = 5;
      const signatureHeight = 12;

      columnSignatures.forEach((signature: string, index: number) => {
        if (signature) {
          const columnCenterX = columnCenterXList[index] - 10; // Adjusting for width
          const signatureYPos = textY - signatureHeight - 4; // Place signature above "Signature"

          try {
            doc.addImage(
              signature,
              'AUTO',
              columnCenterX,
              signatureYPos,
              20,
              signatureHeight,
            );
          } catch (error) {
            console.log('Error adding signature image:', error);
          }
        }
      });

      // First row: "Signature" text centered across all columns
      columnCenterXList.forEach((columnCenterX: number) => {
        doc.text('Signature', columnCenterX, textY, {
          align: 'center',
        });
      });

      // Second row: Role names properly wrapped and centered
      columnTitles.forEach((title: string, index: number) => {
        const columnCenterX = columnCenterXList[index];
        const wrappedText = doc.splitTextToSize(title, columnWidth - 10);
        const totalTextHeight = wrappedText.length * lineBoxHeight;
        const adjustedTextY = textY + 5; // Adjust for proper spacing

        wrappedText.forEach((line: string, i: number) => {
          const lineWidth = doc.getTextWidth(line);
          const adjustedTextX = columnCenterX - lineWidth / 2;
          doc.text(line, adjustedTextX, adjustedTextY + i * lineBoxHeight);
        });
      });

      const pageNumberY = signatureY + signatureBoxHeight + 10;

      // console.log('totalPages before loop:', totalPages);

      // for (let i = 1; i <= totalPages; i++) {
      //   doc.setPage(i); // Set focus to the correct page
      //   console.log('i before:', i);
      //   console.log('totalPages inside loop mid:', totalPages);
      //   const pageWidth = doc.internal.pageSize.width;
      //   const pageHeight = doc.internal.pageSize.height;

      //   console.log('totalPages inside loop:', totalPages);
      //   console.log('i after:', i);

      //   doc.setFontSize(8);
      //   doc.setFont('helvetica', 'normal');
      //   doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
      //     align: 'center',
      //   });
      // }

      // doc.setFontSize(8);
      // doc.text(
      //   `Page ${currentPage} of ${doc.internal.pages.length}`,
      //   pageWidth / 2,
      //   doc.internal.pageSize.height - 10,
      //   { align: 'center' },
      // );

      // currentPage++;
    });

    const totalPages = doc.getNumberOfPages();
    console.log('Final totalPages:', totalPages);

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      console.log(`Adding page number: Page ${i} of ${totalPages}`);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
        align: 'center',
      });
    }

    // Open PDF in new tab for preview
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    // window.open(pdfUrl);

    this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }
}
