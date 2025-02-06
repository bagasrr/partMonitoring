export const generateHTMLLowerLimitReport = (item, newAmount) => {
  return `
  <html>
     <body>
      <p>Part ${item.name} is now hit the Lower limit.</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <td><b>Part Name</b></td>
          <td>${item.name}</td>
        </tr>
        <tr>
          <td><b>Part Year</b></td>
          <td>${item.year}</td>
        </tr>
        <tr>
          <td><b>Machine Name</b></td>
          <td>${item.machine.machine_name}</td>
        </tr>
        <tr>
          <td><b>Current Amount</b></td>
          <td>${newAmount}</td>
        </tr>
        <tr>
          <td><b>Lower Limit</b></td>
          <td>${item.lowerLimit}</td>
        </tr>
      </table>
     </body>
    </html>

    `;
};
