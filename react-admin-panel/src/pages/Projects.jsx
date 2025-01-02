import React from "react";
import Header from "../components/Header";
import EditableCard from "../components/EditableCard";
import { usePageData, usePopup } from "../utils/pageUtil";
import AddButton from "../components/AddButton";
import PopUp from "../components/PopUp";
import FormInput from "../components/FormInput";
import PageSubHeader from "../components/PageSubHeader";

const Projects = () => {
  const {
    items: projects,
    saveItem,
    deleteItem,
    toggleSort,
  } = usePageData("project");
  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const saveProject = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  return (
    <>
      <Header text={"Project Management"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <div className='mt-4'>
          {/* Display fetched projects */}
          {projects.length > 0 ? (
            projects.map((project) => (
              <EditableCard
                key={project.id}
                title={project.name}
                onEdit={() => openPopup(project)}
                onDelete={() => deleteItem(project.id)}
              >
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
              </EditableCard>
            ))
          ) : (
            <p>No projects available</p>
          )}
        </div>
      </div>

      <AddButton openPopup={openPopup} />

      {/* Popup for Add/Edit */}
      {showPopup && (
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
      )}
    </>
  );
};

export default Projects;
