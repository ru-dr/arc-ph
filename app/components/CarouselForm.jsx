import { useState } from "react";
import { Input, Button, Image, Tooltip } from "./ui";
import { Plus, Info } from "lucide-react";
import { useToast } from "../hooks/useToast";

const nextAvailableOrder = (images) =>
  images.length > 0 ? Math.max(...images.map((img) => img.order || 0)) + 1 : 1;

const CarouselForm = ({ onImageAdded, images = [], editingImage = null, setEditingImage }) => {
  const [formData, setFormData] = useState(() => {
    if (editingImage) return editingImage;
    const order = nextAvailableOrder(images);
    return { url: "", info: "", number: String(order).padStart(3, "0"), order };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const showToast = useToast();

  const displayNumber = String(formData.order || 1).padStart(3, "0");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newOrder = parseInt(formData.order);
      const oldOrder = editingImage?.order;

      const otherImages = images.filter(img => img._id !== editingImage?._id);

      const reorderedImages = otherImages.map(img => {
        if (editingImage) {
          if (newOrder > oldOrder) {
            if (img.order > oldOrder && img.order <= newOrder) {
              return { ...img, order: img.order - 1 };
            }
          } else if (newOrder < oldOrder) {
            if (img.order >= newOrder && img.order < oldOrder) {
              return { ...img, order: img.order + 1 };
            }
          }
        } else {
          if (img.order >= newOrder) {
            return { ...img, order: img.order + 1 };
          }
        }
        return img;
      });

      if (reorderedImages.some(img => img.order !== images.find(i => i._id === img._id)?.order)) {
        const reorderResponse = await fetch("/api/carousel/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: reorderedImages }),
        });

        if (!reorderResponse.ok) {
          throw new Error("Failed to reorder images");
        }
      }

      const submitData = {
        ...formData,
        order: newOrder,
        number: String(newOrder).padStart(3, "0"),
      };

      const url = editingImage ? `/api/carousel/${editingImage._id}` : "/api/carousel";
      const method = editingImage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${editingImage ? 'update' : 'add'} image`);
      }

      showToast(`Image ${editingImage ? 'updated' : 'added'} successfully`, "success");
      const resetOrder = nextAvailableOrder(images);
      setFormData({
        url: "",
        info: "",
        number: String(resetOrder).padStart(3, "0"),
        order: resetOrder,
      });
      setEditingImage(null);
      onImageAdded();
    } catch (error) {
      console.error("Error with image:", error);
      showToast(error.message || `Failed to ${editingImage ? 'update' : 'add'} image`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingImage(null);
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
        {formData.url ? (
          <div className="group relative h-64 overflow-hidden border border-rule bg-paper-2 md:h-72">
            <Image
              src={formData.url}
              alt="Image Preview"
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

      <div className="space-y-4">
        <Input
          label="Image URL"
          placeholder="https://res.cloudinary.com/..."
                    value={formData.url}
          onChange={(e) =>
            setFormData({ ...formData, url: e.target.value })
          }
          required
          variant="bordered"
        />
        <Input
          type="number"
          label="Display Order"
          placeholder="1"
          value={formData.order}
          min={1}
          max={images.length + 1}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= images.length + 1) {
              setFormData({ ...formData, order: value });
            }
          }}
          required
          variant="bordered"
          helperText={`1 to ${images.length + 1}`}
        />
        <Input
          label="Number"
          value={displayNumber}
          disabled
          variant="bordered"
          helperText="Generated from the display order"
        />
        <Input
          label="Info"
          placeholder="Living room, Plympton"
          value={formData.info}
          onChange={(e) =>
            setFormData({ ...formData, info: e.target.value })
          }
          required
          variant="bordered"
        />
      </div>

      <div className="flex gap-4">
        <Button
          color="primary"
          type="submit"
          isLoading={isLoading}
          className="flex-1"
          startContent={!editingImage && <Plus size={20} />}
        >
          {editingImage ? "Update image" : "Add image"}
        </Button>
        {editingImage && (
          <Button
            color="default"
            variant="light"
            onPress={handleCancelEdit}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default CarouselForm; 