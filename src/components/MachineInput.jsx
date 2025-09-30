import React from "react";

const MachineInput = ({ machine, machines, isNewMachine, setMachine, setIsNewMachine, user }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="machine">
        Machine Name
      </label>
      {user && user.role === "admin" ? (
        <>
          <select
            value={isNewMachine ? "new" : machine}
            onChange={(e) => {
              if (e.target.value === "new") {
                setIsNewMachine(true);
                setMachine("");
              } else {
                setIsNewMachine(false);
                setMachine(e.target.value);
              }
            }}
            name="Machine"
            id="machine"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select or enter new Machine
            </option>
            {machines.map((machine) => (
              <option key={machine.uuid} value={machine.machine_name}>
                {machine.machine_name}
              </option>
            ))}
            <option value="new">Enter a new Machine</option>
          </select>
          {isNewMachine && (
            <input
              type="text"
              placeholder="Enter new Machine"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
              className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          )}
        </>
      ) : (
        <select
          value={machine}
          onChange={(e) => setMachine(e.target.value)}
          name="Machine"
          id="machine"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="" disabled>
            Select Machine
          </option>
          {machines.map((machine) => (
            <option key={machine.uuid} value={machine.machine_name}>
              {machine.machine_name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default MachineInput;
