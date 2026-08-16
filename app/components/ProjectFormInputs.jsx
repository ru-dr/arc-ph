import FormField from "./FormField";

const ProjectFormInputs = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Project name"
        placeholder="Plympton"
        type="text"
        name="projectName"
        value={formData.projectName}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        required
      />
      <FormField
        label="Collection URL"
        placeholder="https://collection.cloudinary.com/..."
        type="url"
        name="collectionUrl"
        value={formData.collectionUrl}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        required
      />
      <FormField
        label="Cover image URL"
        placeholder="https://res.cloudinary.com/..."
        type="url"
        name="coverImage"
        value={formData.coverImage}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        required
      />
      <FormField
        label="Display order"
        type="number"
        min={1}
        name="order"
        value={formData.order}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value >= 1) {
            handleChange(e.target.name, e.target.value);
          }
        }}
        required
        helperText="1 shows first on the portfolio"
      />
    </div>
  );
};

export default ProjectFormInputs;