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
      subject: `Stock Alert: ${item.name} (${item.year}) Amount is below the lower limit`,
      text: `The Amount for ${item.name} is below the lower limit. Current Amount: ${item.amount}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Stock alert email sent");
  } catch (error) {
    console.error("Error sending stock alert email:", error);
  }
};

export const checkStockLevels = async (uuid) => {
  try {
    const items = await itemModel.findOne({ where: { uuid } });

    if (items.amount <= items.lowerLimit) {
      await sendStockAlert(items);
    }
  } catch (error) {
    console.error("Error checking stock levels:", error);
  }
};
