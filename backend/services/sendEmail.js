// import nodemailer from "nodemailer";

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
const transporter = nodemailer.createTransport({
  service: "Gmail", // Atau penyedia email lain yang Anda gunakan
  auth: {
    user: "monitoringbybarra.adhan@gmail.com", // Email pengguna
    pass: "tmvi pllc ssdo ooyj", // Password pengguna
  },
});

export const sendEmailWithPDF = (to, subject, text, filename, pdfBuffer) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "monitoringbybarra.adhan@gmail.com",
      to: to.join(", "),
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

export const sendLowerLimitEmail = (to, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "monitoringbybarra.adhan@gmail.com",
      to: to.join(", "), // Menggabungkan array email dengan koma
      subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        reject(error);
      } else {
        resolve(info);
        console.log(`Email sent: ${info.response}`);
      }
    });
  });
};

export const sendBrokenPartEmail = (to, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "monitoringbybarra.adhan@gmail.com",
      to: to.join(", "), // Menggabungkan array email dengan koma
      subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error: ${error}`);
        reject(error);
      } else {
        resolve(info);
        console.log(`Email sent: ${info.response}`);
      }
    });
  });
};
