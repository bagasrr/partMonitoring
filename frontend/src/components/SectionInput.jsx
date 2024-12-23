import React from "react";

const SectionInput = ({ section, sections, isNewSection, setSection, setIsNewSection, user }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="section">
        Section Name
      </label>
      {user && user.role === "admin" ? (
        <>
          <select
            value={isNewSection ? "new" : section}
            onChange={(e) => {
              if (e.target.value === "new") {
                setIsNewSection(true);
                setSection("");
              } else {
                setIsNewSection(false);
                setSection(e.target.value);
              }
            }}
            name="Section"
            id="section"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select or enter new Section
            </option>
            {sections.map((section, index) => (
              <option key={index} value={section.id}>
                {section.section_name}
              </option>
            ))}
            <option value="new">Enter a new Section</option>
          </select>
          {isNewSection && (
            <input
              type="text"
              placeholder="Enter new Section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          )}
        </>
      ) : (
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          name="Section"
          id="section"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="" disabled>
            Select Section
          </option>
          {sections.map((section, index) => (
            <option key={index} value={section.id}>
              {section.section_name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SectionInput;
