import { useState } from "react";
import { Image, Tooltip } from "./ui";
import { useToast } from "../hooks/useToast";
import ProjectFormInputs from "./ProjectFormInputs";
import ProjectFormButtons from "./ProjectFormButtons";
import { Info } from "lucide-react";

const AddProjectCard = ({
  onProjectSubmit,
  editingProject,
  setEditingProject,
  projects = [],
}) => {
  const [formData, setFormData] = useState(() => {
    if (editingProject) return editingProject;
    const maxOrder =
      projects.length > 0
        ? Math.max(...projects.map((proj) => proj.order || 0))
        : 0;
    return {
      projectName: "",
      collectionUrl: "",
      coverImage: "",
      fullWidth: false,
      order: maxOrder + 1,
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const showToast = useToast();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCloudinaryLinks = (collectionUrl, coverImage) => {
    const collectionRegex =
      /^https:\/\/collection\.cloudinary\.com\/[a-zA-Z0-9-]+\/[a-f0-9]{32}$/;
    const resRegex =
      /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9-]+\/image\/upload\/.+$/;

    if (!collectionRegex.test(collectionUrl)) {
      showToast(
        "Invalid Cloudinary collection URL. Please check the documentation and try again.",
        "error"
      );
      return false;
    }

    if (!resRegex.test(coverImage)) {
      showToast(
        "Invalid Cloudinary image URL. Please check the documentation and try again.",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCloudinaryLinks(formData.collectionUrl, formData.coverImage)) {
      return;
    }
    setIsLoading(true);
    setButtonLoading("submit");
    try {
      await onProjectSubmit(formData);
      setEditingProject(null);
    } catch (error) {
      console.error("Error:", error);
      showToast(
        `An error occurred while ${
          editingProject ? "updating" : "adding"
        } the project`,
        "error"
      );
    } finally {
      setIsLoading(false);
      setButtonLoading(null);
    }
  };

  const handleCancelEdit = () => {
    setButtonLoading("cancel");
    setEditingProject(null);
    setButtonLoading(null);
  };

  const tooltipContent = (
    <div className="max-w-xs p-1 text-left">
      <p className="mb-1 text-xs font-medium">
        Preview only
      </p>
      <p className="text-[11px] text-[var(--ink-soft)]">
        The published image keeps its full orientation.
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="w-full mb-6 relative">
        {formData.coverImage ? (
          <div className="group relative h-64 overflow-hidden border border-rule bg-paper-2 md:h-72">
            <Image
              src={formData.coverImage}
              alt="Cover Image Preview"
              className="h-full w-full object-cover"
            />
            <Tooltip
              content={tooltipContent}
              placement="bottom"
              isOpen={isTooltipOpen}
              onOpenChange={(open) => setIsTooltipOpen(open)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsTooltipOpen(!isTooltipOpen);
                }}
                className="absolute right-3 top-3 z-30 inline-flex h-8 w-8 items-center justify-center border border-edge bg-paper/90 text-ink transition-colors duration-150 hover:border-ink"
                aria-label="Image Preview Notice"
              >
                <Info size={14} />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center border border-dashed border-rule bg-paper-2 md:h-72">
            <p className="text-sm text-ink-soft">Paste an image URL to preview it here</p>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <ProjectFormInputs
          formData={formData}
          handleChange={handleChange}
        />
        <ProjectFormButtons
          isLoading={isLoading}
          buttonLoading={buttonLoading}
          editingProject={editingProject}
          handleCancelEdit={handleCancelEdit}
        />
      </div>
    </form>
  );
};

export default AddProjectCard;
