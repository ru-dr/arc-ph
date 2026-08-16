"use client";

import { useState, useEffect, useCallback } from "react";
import { Spinner, Button, Tooltip, Tabs, Tab } from "../components/ui";
import AddProjectCard from "../components/AddProjectCard";
import LoginForm from "../components/LoginForm";
import Link from "next/link";
import { HelpCircle, ExternalLink, LogOut, RefreshCw } from "lucide-react";
import { useToast } from "../hooks/useToast";
import dynamic from 'next/dynamic';
import ProjectList from "../components/ProjectList";
import CarouselManager from "../components/CarouselManager";
import CarouselForm from "../components/CarouselForm";

const URL_EXAMPLES = [
  {
    label: "Collection URL",
    url: "https://collection.cloudinary.com/your-cloud-name/[hash]",
  },
  {
    label: "Image URL",
    url: "https://res.cloudinary.com/your-cloud-name/image/upload/[version]/[file]",
  },
];

const UrlFormatHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip
      placement="bottom"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className="max-w-sm"
      content={
        <div className="p-1 text-left">
          <p className="mb-2 text-xs font-medium">Accepted URL formats</p>
          <dl className="space-y-2">
            {URL_EXAMPLES.map(({ label, url }) => (
              <div key={label}>
                <dt className="text-[11px] text-[var(--ink-soft)]">{label}</dt>
                <dd className="break-all text-[11px]">{url}</dd>
              </div>
            ))}
          </dl>
        </div>
      }
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-9 items-center gap-1.5 border border-edge px-3 text-sm transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-ink"
      >
        <HelpCircle size={14} />
        URL formats
      </button>
    </Tooltip>
  );
};

const CloudinaryDocs = () => (
  <Link
    href="https://cloudinary.com/documentation/dam_folders_collections_sharing"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex h-9 items-center gap-1.5 border border-edge px-3 text-sm transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-ink"
  >
    <ExternalLink size={14} />
    Cloudinary docs
  </Link>
);

const Panel = ({ title, action, children }) => (
  <section className="flex h-full flex-col border border-rule bg-paper">
    <header className="flex items-baseline justify-between gap-4 border-b border-rule px-5 py-4">
      <h2 className="display-sm text-lg sm:text-xl">{title}</h2>
      {action}
    </header>
    <div className="flex-grow overflow-auto p-5">{children}</div>
  </section>
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [isFixingNumbers, setIsFixingNumbers] = useState(false);

  const showToast = useToast();

  const fetchProjects = useCallback(async () => {
    setIsProjectsLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
        showToast("Failed to fetch projects", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error fetching projects", "error");
    } finally {
      setIsProjectsLoading(false);
    }
  }, [showToast]);

  const fetchImages = useCallback(async () => {
    setIsImagesLoading(true);
    try {
      const response = await fetch("/api/carousel");
      if (response.ok) {
        const data = await response.json();
        const sortedData = (Array.isArray(data) ? data : []).sort(
          (a, b) => a.order - b.order
        );
        setImages(sortedData);
      } else {
        console.error("Failed to fetch images");
        showToast("Failed to fetch images", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error fetching images", "error");
    } finally {
      setIsImagesLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
      if (storedIsLoggedIn === "true") {
        setIsAuthenticated(true);
        fetchProjects();
        fetchImages();
      } else {
        try {
          const response = await fetch("/api/check-auth");
          if (response.ok) {
            setIsAuthenticated(true);
            localStorage.setItem("isLoggedIn", "true");
            fetchProjects();
            fetchImages();
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          showToast("An error occurred while checking authentication", "error");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [fetchProjects, fetchImages, showToast]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchProjects();
    fetchImages();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
    showToast("Logged out successfully", "success");
  };

  const handleProjectSubmit = useCallback(async (projectData) => {
    setIsProjectsLoading(true);
    try {
      const newOrder = parseInt(projectData.order);
      const oldOrder = editingProject?.order;

      const otherProjects = projects.filter(proj => proj._id !== editingProject?._id);

      const reorderedProjects = otherProjects.map(proj => {
        if (editingProject) {
          if (newOrder > oldOrder) {
            if (proj.order > oldOrder && proj.order <= newOrder) {
              return { ...proj, order: proj.order - 1 };
            }
          } else if (newOrder < oldOrder) {
            if (proj.order >= newOrder && proj.order < oldOrder) {
              return { ...proj, order: proj.order + 1 };
            }
          }
        } else {
          if (proj.order >= newOrder) {
            return { ...proj, order: proj.order + 1 };
          }
        }
        return proj;
      });

      if (reorderedProjects.some(proj => proj.order !== projects.find(p => p._id === proj._id)?.order)) {
        const reorderResponse = await fetch("/api/projects/reorder", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projects: reorderedProjects }),
        });

        if (!reorderResponse.ok) {
          throw new Error("Failed to reorder projects");
        }
      }

      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        showToast(
          editingProject
            ? "Project updated successfully"
            : "Project added successfully",
          "success"
        );
        await fetchProjects();
        setEditingProject(null);
      } else {
        const errorData = await response.json();
        showToast(
          `Failed to ${editingProject ? "update" : "add"} project: ${
            errorData.error
          }`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(
        `An error occurred while ${
          editingProject ? "updating" : "adding"
        } the project`,
        "error"
      );
    } finally {
      setIsProjectsLoading(false);
    }
  }, [fetchProjects, editingProject, projects, showToast]);

  const handleFixNumbers = async () => {
    if (process.env.NODE_ENV !== 'development') {
      showToast('This feature is only available in development', 'error');
      return;
    }

    setIsFixingNumbers(true);
    try {
      const response = await fetch('/api/carousel/fix-numbers', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to fix numbers');
      }

      const data = await response.json();
      showToast(`Fixed ${data.images.length} image numbers`, 'success');
      fetchImages();
    } catch (error) {
      console.error('Error fixing numbers:', error);
      showToast('Failed to fix image numbers', 'error');
    } finally {
      setIsFixingNumbers(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper p-5 text-ink">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="text-sm font-medium uppercase tracking-[0.24em]"
          >
            Archi
          </Link>
          <h1 className="display mt-6 text-4xl">Dashboard</h1>
          <p className="mt-2 mb-8 text-sm text-ink-soft">
            Sign in to manage projects and carousel images.
          </p>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-rule bg-paper">
        <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-sm font-medium uppercase tracking-[0.24em]"
            >
              Archi
            </Link>
            <span className="text-sm text-ink-soft">Dashboard</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="light"
            size="sm"
            startContent={<LogOut size={14} />}
          >
            Log out
          </Button>
        </div>
      </header>

      <div className="shell py-8 md:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
          <div>
            <h1 className="display text-4xl md:text-6xl">Content</h1>
            <p className="mt-2 text-sm text-ink-soft">
              {projects.length} projects · {images.length} carousel images
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <UrlFormatHelp />
            <CloudinaryDocs />
            {process.env.NODE_ENV === "development" && (
              <Button
                size="sm"
                onPress={handleFixNumbers}
                isLoading={isFixingNumbers}
                startContent={<RefreshCw size={14} />}
              >
                Fix carousel numbers
              </Button>
            )}
          </div>
        </div>

        <Tabs aria-label="Dashboard sections">
          <Tab key="projects" title="Projects">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <Panel title={editingProject ? "Edit project" : "Add project"}>
                <AddProjectCard
                  onProjectSubmit={handleProjectSubmit}
                  editingProject={editingProject}
                  setEditingProject={setEditingProject}
                  projects={projects}
                />
              </Panel>
              <Panel
                title="Current projects"
                action={
                  <span className="text-xs text-ink-soft tabular-nums">
                    {projects.length}
                  </span>
                }
              >
                {isProjectsLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Spinner size="lg" label="Loading projects" />
                  </div>
                ) : projects.length === 0 ? (
                  <p className="py-10 text-center text-sm text-ink-soft">
                    No projects yet. Add one on the left and it appears on the
                    portfolio.
                  </p>
                ) : (
                  <ProjectList
                    projects={projects}
                    onProjectUpdated={fetchProjects}
                    setEditingProject={setEditingProject}
                  />
                )}
              </Panel>
            </div>
          </Tab>
          <Tab key="carousel" title="Carousel">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <Panel title={editingImage ? "Edit image" : "Add image"}>
                <CarouselForm
                  onImageAdded={fetchImages}
                  images={images}
                  editingImage={editingImage}
                  setEditingImage={setEditingImage}
                />
              </Panel>
              <Panel
                title="Current images"
                action={
                  <span className="text-xs text-ink-soft tabular-nums">
                    {images.length}
                  </span>
                }
              >
                {isImagesLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Spinner size="lg" label="Loading images" />
                  </div>
                ) : images.length === 0 ? (
                  <p className="py-10 text-center text-sm text-ink-soft">
                    No carousel images yet. Add one on the left and it appears
                    on the home page.
                  </p>
                ) : (
                  <CarouselManager
                    images={images}
                    onImagesUpdated={fetchImages}
                    onEdit={setEditingImage}
                  />
                )}
              </Panel>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
