import { useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Button,
} from "./ui";
import { Search } from "lucide-react";
import { useToast } from "../hooks/useToast";
import DraggableCarouselList from "./DraggableCarouselList";

const CarouselManager = ({ images, onImagesUpdated, onEdit }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");

  const showToast = useToast();

  const currentFilteredImages = useMemo(() => {
    if (!images) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return images;
    return images.filter(
      (image) =>
        image.info?.toLowerCase().includes(term) ||
        image.title?.toLowerCase().includes(term)
    );
  }, [images, searchTerm]);

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    onOpen();
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    setDeletingId(imageToDelete._id);
    onOpenChange(false);

    try {
      const response = await fetch(`/api/carousel/${imageToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onImagesUpdated();
        showToast("Image deleted successfully", "success");
      } else {
        const errorData = await response.json();
        showToast(`Failed to delete image: ${errorData.error}`, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred while deleting the image", "error");
    } finally {
      setDeletingId(null);
      setImageToDelete(null);
    }
  };

  const handleReorder = async (reorderedImages) => {
    try {
      const response = await fetch("/api/carousel/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: reorderedImages }),
      });

      if (!response.ok) {
        throw new Error("Failed to update image order");
      }

      onImagesUpdated();
    } catch (error) {
      console.error("Error reordering images:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="sticky top-0 bg-paper z-10">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              clearable
              contentLeft={<Search size={16} />}
              placeholder="Search images"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="bordered"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <DraggableCarouselList
          images={currentFilteredImages}
          onReorder={handleReorder}
          onDelete={handleDeleteClick}
          onEdit={onEdit}
          deletingId={deletingId}
        />
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="inter">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete image?
              </ModalHeader>
              <ModalBody>
                <p>
                  This image will be removed from the home page carousel. This
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Delete image
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CarouselManager;