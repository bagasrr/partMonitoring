export const generateHTMLBrokenReport = (item, status, date, reason, userName) => {
  return `
  <html>
    <body>
      <h1>${item.name} is Broken.</h1>
      <table style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr style="border: 1px solid #ddd;">
            <th style="padding: 5px;">Date</th>
            <th style="padding: 5px;">Part Number</th>
            <th style="padding: 5px;">Part Name</th>
            <th style="padding: 5px;">Machine Name</th>
            <th style="padding: 5px;">Amount</th>
            <th style="padding: 5px;">Status</th>
            <th style="padding: 5px;">Reason</th>
            <th style="padding: 5px;">Changed By</th>
          </tr>
        </thead>
        <tbody style="border: 1px solid #ddd; text-align: center;">
          <tr style="border: 1px solid #ddd;">
            <td style="padding: 5px;">${date}</td>
            <td style="padding: 5px;">${item.item_number || "NA"}</td>
            <td style="padding: 5px;">${item.name}</td>
            <td style="padding: 5px;">${item.machine.machine_name}</td>
            <td style="padding: 5px;">${item.amount}</td>
            <td style="padding: 5px; color: red;">${status}</td>
            <td style="padding: 5px;">${reason}</td>
            <td style="padding: 5px;">${userName}</td>
          </tr>
          <tr style="border: 1px solid #ddd; background: #06035E;">
            <td colspan="8" style="padding: 5px; text-align: center; color: #fff;">
              <p style="margin: 0; font-style: italic;">Auto Generated Email from the Part Monitoring System by Bagas Ramadhan Rusnadi</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p style="text-align: right; font-style: italic; margin: 10px 0 0 0;">This is an auto generated email, please don't reply this email</p>
    </body>
  </html>
  `;
};
export const generateHTMLLowerLimitReport = (item, newAmount) => {
  return `
  <html>
    <body>
      <h1>${item.name} is now hit the Lower Limit.</h1>
      <table style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr style="border: 1px solid #ddd;">
            <th style="padding: 5px;">Part Name</th>
            <th style="padding: 5px;">Part Number</th>
            <th style="padding: 5px;">Machine Name</th>
            <th style="padding: 5px;">Amount</th>
            <th style="padding: 5px;">Lower Limit</th>
            <th style="padding: 5px;">Description</th>
          </tr>
        </thead>
        <tbody style="border: 1px solid #ddd; text-align: center;">
          <tr style="border: 1px solid #ddd;">
            <td style="padding: 5px;">${item.name}</td>
            <td style="padding: 5px;">${item.item_number || "NA"}</td>
            <td style="padding: 5px;">${item.machine.machine_name}</td>
            <td style="padding: 5px;">${newAmount}</td>
            <td style="padding: 5px;">${item.lowerLimit}</td>
            <td style="padding: 5px;">${item.description}</td>
          </tr>
          <tr style="border: 1px solid #ddd; background: #06035E;">
            <td colspan="6" style="padding: 5px; text-align: center; color: #fff;">
              <p style="margin: 0; font-style: italic;">Auto Generated Email from the Part Monitoring System by Bagas Ramadhan Rusnadi</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p style="text-align: right; font-style: italic; margin: 10px 0 0 0;">This is an auto generated email, please don't reply this email</p>
    </body>
  </html>
  `;
};
