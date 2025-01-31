import React from "react";
import { MdClose } from "react-icons/md";
import { DetailsKey, DetailsProperty } from "../element/Details";

const DetailsAction = ({ data, setIsOpen }) => {
  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity z-30">
      <div className="bg-white rounded-lg p-6 w- transform transition-all flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Detail Part</h2>
        <div className="flex gap-5">
          <div>
            <DetailsKey>ID</DetailsKey>
            <DetailsKey>Part Name</DetailsKey>
            <DetailsKey>Vendor</DetailsKey>
            <DetailsKey>Amount</DetailsKey>
            <DetailsKey>Year</DetailsKey>
            <DetailsKey>Status</DetailsKey>
            <DetailsKey>Machine</DetailsKey>
            <DetailsKey>Part Usage</DetailsKey>
          </div>
          <div>
            <DetailsProperty>:{data?.uuid || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.name || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.vendor?.vendor_name || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.amount || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.year || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.status || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.machine?.machine_name || "NA"}</DetailsProperty>
            <DetailsProperty>:{data?.part_usage || "0"} Day</DetailsProperty>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="mt-4 p-2 bg-red-600 absolute top-1 right-4 text-white rounded-3xl hover:bg-rose-700 transition-colors">
          <MdClose />
        </button>
      </div>
    </div>
  );
};

export default DetailsAction;
