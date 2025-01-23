import React from "react";
import Header from "../components/Header";
import EditableCard from "../components/EditableCard";
import { usePageData, usePopup, useRenderPage } from "../utils/pageUtil";
import AddButton from "../components/AddButton";
import PopUp from "../components/PopUp";
import FormInput from "../components/FormInput";
import PageSubHeader from "../components/PageSubHeader";
import DeleteConfirmation from "../components/DeleteConfirmation";
import PageWrapper from "../utils/SmoothPage";
import LoadingElement from "./misc/Loading";
import ErrorElement from "./misc/errors/InternalServerError";
import NoInfoFoundElement from "./misc/errors/NoInfoFound";

const Projects = () => {
  const {
    items: projects,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
  } = usePageData("project");
  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const { renderPage } = useRenderPage(projects, showLoading, error);

  const saveProject = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  const projectForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Project" : "Add Project"}
      onSubmit={saveProject}
    >
      <FormInput
        label='Project Name'
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required={true}
      />
      <FormInput
        label='Tech Stack'
        type='textarea'
        value={formData.techStack}
        onChange={(e) =>
          setFormData({ ...formData, techStack: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='URL'
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        required={true}
      />
      <FormInput
        label='Order Display'
        type='number'
        value={formData.displayOrder}
        onChange={(e) =>
          setFormData({ ...formData, displayOrder: e.target.value })
        }
        required={true}
      />
    </PopUp>
  );

  const projectPage = (
    <PageWrapper>
      <div className='mt-4'>
        {projects.map((project) => (
          <EditableCard
            key={project.id}
            title={project.name}
            onEdit={() => openPopup(project)}
            onDelete={() => confirmDelete(project.id)}
          >
            <div className='mt-4'>
              <div>
                {project.techStack &&
                  project.techStack.split(",").map((tech, index) => (
                    <span key={index} className='badge bg-primary me-2'>
                      {tech.trim()}{" "}
                    </span>
                  ))}
              </div>
              {project.url && (
                <a
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-link'
                >
                  View Project
                </a>
              )}
              <p>Order: {project.displayOrder}</p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Project Management"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          projectPage
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && projectForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default Projects;
