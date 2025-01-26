import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export const createPDFWithTable = (title, headers, rows, callback) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4", // Mengatur ukuran kertas menjadi A4
  });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    callback(pdfBuffer);
  });

  // Judul Laporan
  doc
    .font("Helvetica-Bold") // Mengatur font header
    .fontSize(16)
    .text(title, {
      align: "center",
    })
    .moveDown();

  // Membuat Tabel
  const tableTop = 150;
  const itemLeft = doc.page.margins.left;
  const itemWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / headers.length;
  const cellHeight = 30;
  let rowBottomY = tableTop;

  // Header Tabel
  doc.font("Courier-Bold").fontSize(12); // Mengatur font header tabel
  headers.forEach((header, i) => {
    doc
      .text(header, itemLeft + i * itemWidth, tableTop + 7.5, {
        // Vertikal centering
        width: itemWidth,
        align: "center",
      })
      .rect(itemLeft + i * itemWidth, tableTop, itemWidth, cellHeight)
      .stroke();
  });

  rowBottomY += cellHeight;

  // Baris Tabel
  doc.font("Courier").fontSize(12); // Mengatur font body tabel
  rows.forEach((row, rowIndex) => {
    const y = tableTop + cellHeight + rowIndex * cellHeight;

    if (y + cellHeight > doc.page.height - doc.page.margins.bottom - 100) {
      doc.addPage();
      rowBottomY = tableTop;
      headers.forEach((header, i) => {
        doc
          .text(header, itemLeft + i * itemWidth, tableTop + 7.5, {
            // Vertikal centering
            width: itemWidth,
            align: "center",
          })
          .rect(itemLeft + i * itemWidth, tableTop, itemWidth, cellHeight)
          .stroke();
      });
      rowBottomY += cellHeight;
    }

    row.forEach((text, i) => {
      doc
        .text(text, itemLeft + i * itemWidth, rowBottomY + 7.5, {
          // Vertikal centering
          width: itemWidth,
          align: "center",
        })
        .rect(itemLeft + i * itemWidth, rowBottomY, itemWidth, cellHeight)
        .stroke();
    });
    rowBottomY += cellHeight;
  });

  // Tanggal Laporan
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  // Keterangan di bawah tabel
  rowBottomY += cellHeight * 3; // Menambahkan gap sekitar tiga kali enter dari tabel
  doc
    .font("Times-Roman")
    .fontSize(12)
    .text(`Created by Part Monitoring Sistem by barra.adhan`, itemLeft, rowBottomY, {
      // Sejajar dengan sisi kiri tabel
      align: "left",
      continued: true,
    })
    .text(`\n${formattedDate} `, itemLeft, rowBottomY + 15, {
      // Sejajar dengan sisi kiri tabel
      align: "left",
    });

  doc.end();
};
