import FormField from "./FormField";

export const SectionFilter = ({ data, selectedData, handleDataChange }) => {
  return (
    <div className="p-5 flex justify-end">
      <FormField label="Ruangan" name="room" value={selectedData.id ? `${selectedData.id} - ${selectedData.name}` : ""} onChange={handleDataChange} type="select" className="flex items-center gap-2">
        <option value="">Semua</option>
        {data.map((section) => (
          <option key={section.uuid} value={`${section.uuid} - ${section.section_name}`}>
            {section.section_name}
          </option>
        ))}
      </FormField>
    </div>
  );
};
