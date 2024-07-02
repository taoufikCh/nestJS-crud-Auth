
import { Injectable } from '@nestjs/common';
//import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
//import path, { join } from 'path';
import * as path from 'path';
import { PassThrough } from 'stream';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class PdfService {

 /* generateStudentListPDF(students: any[], filePath: string): void {
    const pdfDoc = new PDFDocument();
    const fileStream = fs.createWriteStream(filePath);

    pdfDoc.pipe(fileStream);
    pdfDoc.fontSize(12);
    pdfDoc.text('Student List', { underline: true });
    pdfDoc.moveDown();

    students.forEach(student => {
      pdfDoc.text(`Name: ${student.name}, Age: ${student.age}`);
      pdfDoc.moveDown();
    });

    pdfDoc.end();

    fileStream.on('finish', () => {
      console.log('PDF file generated successfully!');
    });
  }*/

  /*generateStudentListPDF(students: any[]): Buffer {
    const pdfBuffer = [];
    const pdfDoc = new PDFDocument();

    pdfDoc.on('data', (chunk) => pdfBuffer.push(chunk));
    pdfDoc.on('end', () => {
      console.log('PDF buffer generated successfully!');
    });

    pdfDoc.fontSize(12);
    pdfDoc.text('Student List', { underline: true });
    pdfDoc.moveDown();

    students.forEach(student => {
      pdfDoc.text(`Name: ${student.name}, Age: ${student.age}`);
      pdfDoc.moveDown();
    });

    pdfDoc.end();
    console.log('PDF file generated successfully!');
    return Buffer.concat(pdfBuffer);
  }

  async generatePdf(students: any[]): Promise<string> {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '..', 'students.pdf');
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    doc.fontSize(20).text('Student List', { align: 'center' });
    doc.moveDown();
    
    students.forEach(student => {
        doc.fontSize(12).text(`ID: ${student.id}, Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}`);
        doc.moveDown();
    });
    
    doc.end();
    
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            resolve(filePath);
        });
        writeStream.on('error', reject);
    });
}

generatePdfStream(users: any[]): PassThrough {
  //const doc = new PDFDocument();
  //let doc = new PDFDocument({ margin: 50 });
  let doc = new PDFDocument({ margin: 30, size: 'A4' });
  const stream = new PassThrough();
  let pageNumber = 1; // Initialize page number
  doc.pipe(stream);
  this.generateHeader(doc);
  doc.moveDown();

  
  //const titleFontPath = path.join(__dirname, '..', 'assets', 'fonts', 'Rosario-Bold.ttf');
  const titleFontPath = path.join( 'src/assets/fonts', 'Rosario-Bold.ttf');
 



  doc.font(titleFontPath).fontSize(20).fillColor('black');
  doc.fillColor('#003399')
  .fontSize(20)
  .text("Liste des utilisateurs", { align: 'center' })
  .moveDown();
  

 

// Table configuration
const tableHeaders = ['ID', 'Nom Prénom', 'Email', 'Role', 'Actif'];
const tableRowHeight = 25;
const tableColumnWidths = [50, 100, 200, 70, 70];
const tableStartX = 50;
let tableStartY = doc.y;
const cellPadding = 6; // Padding inside the cells
let y=0;

// Set bold font for headers
//const boldFontPath = path.join(__dirname, '..', 'fonts', 'Helvetica-Bold.ttf');
const boldFontPath = path.join('src/assets/fonts', 'Helvetica-Bold.ttf');

doc.font(boldFontPath).fontSize(12).fillColor('black');

// Draw table headers
let currentX = tableStartX;
tableHeaders.forEach((header, i) => {
  doc.text(header, currentX + cellPadding, tableStartY + cellPadding, {
    width: tableColumnWidths[i] - 2 * cellPadding,
    align: 'center',
  }).fillColor('black');
  currentX += tableColumnWidths[i];
});

// Draw table header borders
doc.moveTo(tableStartX, tableStartY)
   .lineTo(tableStartX + tableColumnWidths.reduce((a, b) => a + b), tableStartY)
   .stroke();
doc.moveTo(tableStartX, tableStartY + tableRowHeight)
   .lineTo(tableStartX + tableColumnWidths.reduce((a, b) => a + b), tableStartY + tableRowHeight)
   .stroke();
currentX = tableStartX;
tableColumnWidths.forEach(width => {
  doc.moveTo(currentX, tableStartY)
     .lineTo(currentX, tableStartY + tableRowHeight)
     .stroke();
  currentX += width;
});
doc.moveTo(currentX, tableStartY)
   .lineTo(currentX, tableStartY + tableRowHeight)
   .stroke();

doc.moveDown(0.5); // Add some space after headers

// Reset to regular font for rows
//const regularFontPath = path.join(__dirname, '..', 'fonts', 'Helvetica.ttf');
const regularFontPath = path.join('src/assets','fonts', 'Helvetica.ttf');

doc.font(regularFontPath).fontSize(12);

// Draw table rows
users.forEach((student, rowIndex) => {
  y = tableStartY + (rowIndex + 1) * tableRowHeight;
  currentX = tableStartX;
  const columns = [
    student.id.toString(),
    student.name,
    student.email, // Assuming you have email in your student entity
    student.roles, // Assuming you have roles in your student entity
    student.isActive.toString() // Assuming isActive is boolean, convert to string
  ];

  columns.forEach((text, i) => {
    doc.text(text, currentX + cellPadding, y + cellPadding, { width: tableColumnWidths[i] - 2 * cellPadding, align: 'center' });
    currentX += tableColumnWidths[i];
  });

  // Draw table row borders
  doc.moveTo(tableStartX, y)
     .lineTo(tableStartX + tableColumnWidths.reduce((a, b) => a + b), y)
     .stroke();
  doc.moveTo(tableStartX, y + tableRowHeight)
     .lineTo(tableStartX + tableColumnWidths.reduce((a, b) => a + b), y + tableRowHeight)
     .stroke();
  currentX = tableStartX;
  tableColumnWidths.forEach(width => {
    doc.moveTo(currentX, y)
       .lineTo(currentX, y + tableRowHeight)
       .stroke();
    currentX += width;
  });
  doc.moveTo(currentX, y)
     .lineTo(currentX, y + tableRowHeight)
     .stroke();

     
});

// Draw bottom border for the last row
const lastRowY = tableStartY + (users.length + 1) * tableRowHeight;
doc.moveTo(tableStartX, lastRowY)
   .lineTo(tableStartX + tableColumnWidths.reduce((a, b) => a + b), lastRowY)
   .stroke();
  
   tableStartY = y;
     if (y + tableRowHeight > doc.page.height - 50) {
         // Check if there's space for another row, if not, add a new page
         doc.addPage();
         pageNumber++; // Increment page number
         this.generateFooter(doc, pageNumber); // Add date and page number on new page
         tableStartY = doc.y; // Reset table Y position for new page
     }
  // addFooter(); // Add date and page number on last page
 

 
   this.generateFooter(doc, pageNumber);


  doc.end();
  
  return stream;
}

generateHeader(doc) {
	doc.fillColor('#003399')
		.fontSize(10)
		.text(new Date().toLocaleDateString(), 100, 50, { align: 'right' })
		.moveDown();
}

generateFooter(doc, pageNumber) {
	doc.fontSize(10,).text(`Page ${pageNumber}`,50,700,
		{ align: 'center', width: 500 },
	);
  //doc.fontSize(10).text(`Page ${pageNumber}`, { align: 'center' });
   // doc.fontSize(10).text(new Date().toLocaleDateString(), { align: 'right' });

}
*/

async getUsersListPdf(users: any[]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  //const page = pdfDoc.addPage([600, 400]);
  const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;
    let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const titleSize = 18;
  const pageNumberSize = 12;
    const dateSize = 12;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
 const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
 // Get current date
 const currentDate = new Date().toLocaleDateString();

  page.setFont(boldFont);
  page.setFontSize(fontSize);
  const title = 'Liste des utilisateurs';
  const textWidth = boldFont.widthOfTextAtSize(title, titleSize);

  page.drawText(title, {
    x: (width - textWidth) / 2,
    y: height - 70,
    size: titleSize,
    color: rgb(0 / 255, 38 / 255, 153 / 255),
  });
  
  page.setFont(font);
  //let yPosition = height - 80;
  const tableTopY = height - 100;
  const tableLeftX = 50;
  const rowHeight = 25;
  const colWidths = [50, 100, 200, 100, 50]; // ID, Amount, Date
 
   // Draw table header
   this.drawTableRow(page, tableLeftX, tableTopY, rowHeight, colWidths, ['ID', 'Nom Prénom', 'Email', 'Role', 'Actif'], true);

   // Draw table rows
   let yPosition = tableTopY - rowHeight;
   users.forEach((user) => {
     this.drawTableRow(page, tableLeftX, yPosition, rowHeight, colWidths, [user.id.toString(), user.name.toString(), user.email.toString(), user.roles.toString(), user.isActive.toString() ], false);
     yPosition -= rowHeight;
     if (yPosition < 50) {
      // Add new page when space runs out
      //const newPage = pdfDoc.addPage([600, 400]);
       yPosition = tableTopY;
       pdfDoc.addPage([600, 400]);
     }
   });
    // Add page numbers and date
    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      const pageNumber = `Page ${index + 1}`;
      const pageNumberWidth = font.widthOfTextAtSize(pageNumber, pageNumberSize);

      page.drawText(pageNumber, {
        x: (width - pageNumberWidth) / 2,
        y: 20,
        size: pageNumberSize,
        color: rgb(0, 0, 0),
      });

      const dateWidth = font.widthOfTextAtSize(currentDate, dateSize);

      page.drawText(currentDate, {
        x: width - dateWidth - 20,
        y: height - 30,
        size: dateSize,
        color: rgb(0, 0, 0),
      });
    });
   

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

drawTableRow(page, startX, startY, rowHeight, colWidths, rowData, isHeader) {
  const fontSize = isHeader ? 14 : 12;
  const fontColor = rgb(0, 0, 0);
  const bgColor = isHeader ? rgb(0.75, 0.75, 0.75) : rgb(1, 1, 1);

  // Draw background
  page.drawRectangle({
    x: startX,
    y: startY - rowHeight,
    width: colWidths.reduce((a, b) => a + b, 0),
    height: rowHeight,
    color: bgColor,
  });

  // Draw text and cell lines
  let x = startX;
  rowData.forEach((text, index) => {
    // Ensure text is a string
    const textStr = String(text);

    page.drawText(textStr, {
      x: x + 5,
      y: startY - rowHeight + 5,
      size: fontSize,
      color: fontColor,
    });

    // Draw cell border lines
    page.drawLine({
      start: { x, y: startY },
      end: { x, y: startY - rowHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x, y: startY - rowHeight },
      end: { x: x + colWidths[index], y: startY - rowHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + colWidths[index], y: startY - rowHeight },
      end: { x: x + colWidths[index], y: startY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    x += colWidths[index];
  });

  // Draw top line for the first cell
  if (isHeader) {
    page.drawLine({
      start: { x: startX, y: startY },
      end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: startY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  }

  // Draw bottom line
  page.drawLine({
    start: { x: startX, y: startY - rowHeight },
    end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: startY - rowHeight },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
}

  

  
}
