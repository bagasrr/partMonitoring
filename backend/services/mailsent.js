import nodemailer from "nodemailer";
import { itemModel } from "../models/index.js"; // Adjust the path as necessary

const transporter = nodemailer.createTransport({
  service: "gmail", // Example using Gmail, change as needed
  auth: {
    user: "monitoringbybarra.adhan@gmail.com",
    pass: "tmvi pllc ssdo ooyj",
  },
});

const sendStockAlert = async (item) => {
  try {
    const mailOptions = {
      from: "monitoringbybarra.adhan@gmail.com",
      to: "kuliah.bagass@gmail.com",
      subject: `Stock Alert: ${item.name}`,
      text: `The stock for ${item.name} is below the lower limit. Current stock: ${item.stok}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Stock alert email sent");
  } catch (error) {
    console.error("Error sending stock alert email:", error);
  }
};

export const checkStockLevels = async () => {
  try {
    const items = await itemModel.findAll();

    items.forEach(async (item) => {
      if (item.stok < item.lowerLimit) {
        await sendStockAlert(item);
      }
    });
  } catch (error) {
    console.error("Error checking stock levels:", error);
  }
};
