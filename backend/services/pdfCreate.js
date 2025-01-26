import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export const createPDFWithTable = (title, headers, rows, callback) => {
  const doc = new PDFDocument({
    margin: 50, // Mengatur margin di sini
  });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    callback(pdfBuffer);
  });

  // Judul Laporan
  doc
    .fontSize(20)
    .text(title, {
      align: "center",
    })
    .moveDown();

  // Membuat Tabel
  const tableTop = 150;
  const itemLeft = doc.page.margins.left;
  const itemWidth = 100;

  // Garis Header
  doc.lineWidth(1);

  // Header Tabel
  headers.forEach((header, i) => {
    doc.fontSize(10).text(header, itemLeft + i * itemWidth, tableTop, {
      width: itemWidth,
      align: "center",
    });
  });

  // Garis header
  doc
    .moveTo(itemLeft, tableTop + 20)
    .lineTo(itemLeft + headers.length * itemWidth, tableTop + 20)
    .stroke();

  // Baris Tabel
  rows.forEach((row, rowIndex) => {
    const y = tableTop + 25 + rowIndex * 25;
    row.forEach((text, i) => {
      doc.fontSize(10).text(text, itemLeft + i * itemWidth, y, {
        width: itemWidth,
        align: "center",
      });
    });

    // Garis bawah untuk setiap baris
    doc
      .moveTo(itemLeft, y + 20)
      .lineTo(itemLeft + headers.length * itemWidth, y + 20)
      .stroke();
  });

  doc.end();
};
