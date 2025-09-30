import React from "react";

const TestingPage = () => {
  return (
    <>
      <p>testing</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>No</th>
            <th>Part Name</th>
            <th>Amount</th>
            <th>Part Number</th>
            <th>Machine Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Part Name</td>
            <td>Amount</td>
            <td>Part Number</td>
            <td>Machine Name</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TestingPage;
