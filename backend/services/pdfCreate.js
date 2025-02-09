import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export const createPDFWithTable = (title, headers, rows, callback) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
    layout: "landscape", // Mengatur orientasi halaman menjadi landscape
  });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    callback(pdfBuffer);
  });

  // Menghitung lebar kolom berdasarkan teks terpanjang
  const columnWidths = headers.map((header, i) => {
    const maxCellLength = Math.max(...rows.map((row) => row[i].toString().length), header.length);
    return maxCellLength * 8; // Mengatur faktor skala berdasarkan panjang teks
  });

  // Menentukan total lebar kolom
  const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Jika total lebar kolom melebihi lebar halaman, atur ulang skala kolom
  if (totalWidth > pageWidth) {
    const scaleFactor = pageWidth / totalWidth;
    columnWidths.forEach((_, i) => {
      columnWidths[i] = columnWidths[i] * scaleFactor;
    });
  }

  // Menghitung posisi kiri tabel untuk menengahkannya
  const leftMargin = (pageWidth - totalWidth) / 2 + doc.page.margins.left;

  // Judul Laporan
  doc
    .font("Courier-Bold") // Mengatur font header
    .fontSize(16)
    .text(title, {
      align: "center",
    })
    .moveDown();

  // Membuat Tabel
  const tableTop = 150;
  const cellHeight = 30;
  let rowBottomY = tableTop;

  // Header Tabel
  doc.font("Courier-Bold").fontSize(12); // Mengatur font header tabel
  let currentX = leftMargin; // Variabel sementara untuk posisi horizontal
  headers.forEach((header, i) => {
    doc
      .text(header, currentX, tableTop + 7.5, {
        // Vertikal centering
        width: columnWidths[i],
        align: "center",
      })
      .rect(currentX, tableTop, columnWidths[i], cellHeight)
      .stroke();
    currentX += columnWidths[i];
  });

  rowBottomY += cellHeight;

  // Baris Tabel
  rows.forEach((row, rowIndex) => {
    let maxHeight = cellHeight; // Menyimpan tinggi maksimum dari semua sel di baris saat ini
    currentX = leftMargin; // Reset posisi horizontal untuk setiap baris

    // Hitung tinggi maksimum dari semua sel di baris ini
    row.forEach((text, i) => {
      const { height } = doc.heightOfString(text, {
        width: columnWidths[i],
        align: "center",
      });
      if (height + 15 > maxHeight) {
        maxHeight = height + 15; // Sesuaikan tinggi maksimum jika teks di dalam sel lebih tinggi dari cellHeight
      }
    });

    if (rowBottomY + maxHeight > doc.page.height - doc.page.margins.bottom - 50) {
      doc.addPage();
      rowBottomY = tableTop;
      currentX = leftMargin;
      headers.forEach((header, i) => {
        doc
          .text(header, currentX, tableTop + 7.5, {
            // Vertikal centering
            width: columnWidths[i],
            align: "center",
          })
          .rect(currentX, tableTop, columnWidths[i], cellHeight)
          .stroke();
        currentX += columnWidths[i];
      });
      rowBottomY += cellHeight;
    }

    // Gambar teks dan rect untuk setiap sel di baris
    row.forEach((text, i) => {
      doc
        .text(text, currentX, rowBottomY + 7.5, {
          // Vertikal centering
          width: columnWidths[i],
          align: "center",
        })
        .rect(currentX, rowBottomY, columnWidths[i], maxHeight)
        .stroke();
      currentX += columnWidths[i];
    });

    rowBottomY += maxHeight;
  });

  // Tanggal Laporan
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  // Keterangan di bawah tabel
  rowBottomY += cellHeight * 2; // Menambahkan gap sekitar dua kali enter dari tabel
  doc
    .font("Courier")
    .fontSize(12)
    .text(`Created from the Part Monitoring Sistem by Bagas Ramadhan Rusnadi`, leftMargin, rowBottomY, {
      // Sejajar dengan sisi kiri tabel
      align: "left",
    })
    .text(`${formattedDate}`, leftMargin, rowBottomY + 15, {
      // Sejajar dengan sisi kiri tabel
      align: "left",
    });

  doc.end();
};
