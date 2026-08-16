import { useState, useRef, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import { Pagination } from "./ui";

const DraggableProjectList = ({
  projects,
  onReorder,
  onEdit,
  onDelete,
  deletingId
}) => {
  const [localProjects, setLocalProjects] = useState(projects);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const dragNodeRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleDragStart = useCallback((e, index) => {
    dragNodeRef.current = e.target;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragEnd = useCallback(async () => {
    setDraggedIndex(null);

    try {
      await onReorder(localProjects);
    } catch (error) {
      console.error('Error updating order:', error);
      setLocalProjects(projects);
    }
  }, [localProjects, onReorder, projects]);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const items = Array.from(localProjects);
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setLocalProjects(updatedItems);
    setDraggedIndex(index);
  }, [draggedIndex, localProjects]);

  const totalPages = Math.ceil(localProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = localProjects.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {currentProjects.map((project, index) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            deletingId={deletingId}
            isDragged={index === draggedIndex}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            index={startIndex + index}
            draggable={true}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            variant="light"
          />
        </div>
      )}
    </div>
  );
};

export default DraggableProjectList; 