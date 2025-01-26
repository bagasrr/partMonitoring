// import nodemailer from "nodemailer";
// import PDFDocument from "pdfkit";
// import fs from "fs";

// import { Buffer } from "buffer";

// const transporter = nodemailer.createTransport({
//   service: "Gmail", // Atau penyedia email lain yang Anda gunakan
//   auth: {
//     // user: process.env.EMAIL_USER, // Email pengguna
//     // pass: process.env.EMAIL_PASS, // Password pengguna
//     // user: "airmonitoringbrr@gmail.com", // Email pengguna
//     // pass: "gewe iwwi puks hgwn", // Password pengguna
//     user: "monitoringbybarra.adhan@gmail.com", // Email pengguna
//     pass: "tmvi pllc ssdo ooyj", // Password monitoringbybarra.adhan
//   },
// });
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Buffer } from "buffer"; // Pastikan Buffer diimpor dari modul buffer

const transporter = nodemailer.createTransport({
  service: "Gmail", // Atau penyedia email lain yang Anda gunakan
  auth: {
    user: "monitoringbybarra.adhan@gmail.com", // Email pengguna
    pass: "tmvi pllc ssdo ooyj", // Password pengguna
  },
});

export const sendEmail = (to, subject, text, filename, pdfBuffer) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "monitoringbybarra.adhan@gmail.com",
      to,
      subject,
      text,
      attachments: [
        {
          filename,
          content: pdfBuffer,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(info);
      }
    });
  });
};

// Fungsi untuk membuat PDF dalam memori dan mengirim buffer melalui callback
export const createPDF = (itemDescription, callback) => {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    callback(pdfBuffer);
  });

  doc.fontSize(25).text("Item Details", { align: "center" }).moveDown();
  doc.fontSize(14).text(itemDescription, {
    align: "left",
    indent: 30,
    height: 300,
    ellipsis: true,
  });

  doc.end();
};
