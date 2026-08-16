import { memo } from "react";
import { Button, Tooltip, Chip } from "./ui";
import { Pencil, Trash2, GripVertical, ExternalLink, LayoutIcon, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CarouselCard = ({
  image,
  onEdit,
  onDelete,
  deletingId,
  isDragged,
  onDragStart,
  onDragEnd,
  onDragOver,
  index,
  draggable = false
}) => {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver?.(e, index)}
      className={`
        relative border border-edge bg-paper p-5
        transition-[border-color,opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
        cursor-grab active:cursor-grabbing hover:border-ink
        ${isDragged ? "opacity-60 border-ink" : ""}
      `}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-grow group">
            <GripVertical
              size={16}
              className="text-ink-soft group-hover:text-ink transition-colors duration-200"
            />
            <h3 className="display-sm truncate text-lg">{image.info || image.title || 'Untitled'}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Tooltip content="Edit Image">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(image)}
                className="text-ink-soft hover:text-ink"
              >
                <Pencil size={16} />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Image">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onDelete(image)}
                isLoading={deletingId === image._id}
                className="text-[#8a2318]"
              >
                <Trash2 size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="group relative aspect-[16/9] w-full overflow-hidden border border-rule bg-paper-2">
          <div className="absolute top-2 right-2 z-10">
            <Chip size="sm" className="bg-paper/90">
              Order {image.order || index + 1}
            </Chip>
          </div>
          {image.url ? (
            <>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              <Image
                src={image.url}
                alt={image.info || image.title || 'Carousel Image'}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                loading="lazy"
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-paper-2">
              <span className="text-xs text-ink-soft">No image</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {image.url && (
            <Link
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Chip
                variant="flat"
                size="sm"
                startContent={<ExternalLink size={14} />}
                className="transition-colors duration-200 hover:border-ink"
              >
                View Image
              </Chip>
            </Link>
          )}
          <Chip
            variant="flat"
            color="default"
            size="sm"
            startContent={<LayoutIcon size={14} />}
            className="transition-colors duration-200"
          >
            {image.fullWidth ? "Full Width" : "Standard"}
          </Chip>
          <Chip
            variant="flat"
            color="default"
            size="sm"
            startContent={<Calendar size={14} />}
            className="transition-colors duration-200"
          >
            {new Date(image.createdAt).toLocaleDateString()}
          </Chip>
        </div>
      </div>
    </div>
  );
};

export default memo(CarouselCard); 