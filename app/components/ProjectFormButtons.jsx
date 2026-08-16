import { Button } from "./ui";

const ProjectFormButtons = ({ isLoading, buttonLoading, editingProject, handleCancelEdit }) => {
  return (
    <div className="mt-6 flex gap-3">
      <Button
        type="submit"
        color="primary"
        className="flex-1"
        isLoading={buttonLoading === "submit"}
        disabled={isLoading || buttonLoading !== null}
      >
        {editingProject ? "Update project" : "Add project"}
      </Button>
      {editingProject && (
        <Button
          variant="light"
          className="flex-1"
          onPress={handleCancelEdit}
          isLoading={buttonLoading === "cancel"}
          disabled={isLoading || buttonLoading !== null}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default ProjectFormButtons;