import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { DetailsKey, DetailsProperty } from "../element/Details";
import { TableField, TData, ThData, TRow } from "../element/Table";
import { formatDate, FormatStatusColor } from "../utils/format";

const DetailsAction = ({ data, setIsOpen }) => {
  const histori = data?.itemHistories;

  console.log("histori:", histori);
  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity z-50">
      <div className="bg-white rounded-lg p-6 w- transform transition-all flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Detail Part</h2>
        <div className="flex gap-5">
          <div>
            <DetailsKey>Number</DetailsKey>
            <DetailsKey>Name</DetailsKey>
            <DetailsKey>Vendor</DetailsKey>
            <DetailsKey>Amount</DetailsKey>
            <DetailsKey>Year</DetailsKey>
            <DetailsKey>Status</DetailsKey>
            <DetailsKey>Machine</DetailsKey>
            <DetailsKey>Part Usage</DetailsKey>
          </div>
          <div>
            <DetailsProperty>:{data?.item_number || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.name || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.vendor?.vendor_name || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.amount || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.year || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.status || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.machine?.machine_name || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.dayUsed || "0"} Day</DetailsProperty>
          </div>
        </div>
        {histori.length !== 0 && (
          <div className="mt-5 overflow-auto max-h-[45vh]">
            <TableField>
              <thead>
                <tr>
                  <ThData>Time</ThData>
                  <ThData>Activities</ThData>
                  <ThData>User</ThData>
                </tr>
              </thead>
              <tbody>
                {histori.map((his) => (
                  <TRow key={his.uuid}>
                    <TData>{formatDate(his.createdAt)}</TData>

                    {/* Untuk layar besar (Tablet/Desktop) */}
                    <TData className="hidden sm:block">
                      <span className={`rounded-3xl px-3 py-2 ${FormatStatusColor(his.activities, "Parts Broken", "Part Updated", "Part Added", "Status Changed")}`}>{his.activities}</span>
                    </TData>

                    {/* Untuk layar kecil (Mobile) */}
                    <TData className={`block sm:hidden ${FormatStatusColor(his.activities, "Parts Broken", "Part Updated", "Part Added", "Status Changed")}`}>{his.activities}</TData>

                    <TData>{his.user?.name || "NA"}</TData>
                  </TRow>
                ))}
              </tbody>
            </TableField>
          </div>
        )}
        <button onClick={() => setIsOpen(false)} className="mt-4 p-2 bg-red-600 absolute top-1 right-4 text-white rounded-3xl hover:bg-rose-700 transition-colors">
          <MdClose />
        </button>
      </div>
    </div>
  );
};

export default DetailsAction;
