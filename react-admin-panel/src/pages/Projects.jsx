import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EditableCard from "../components/EditableCard";
import { fetchData, saveData, deleteData } from "../utils/apiUtil";
import AddButton from "../components/AddButton";
import PopUp from "../components/PopUp";
import FormInput from "../components/FormInput";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    techStack: "",
    url: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const openPopup = (project = null) => {
    setIsEditMode(!!project);
    setFormData(
      project || {
        id: null,
        name: "",
        techStack: "",
        url: "",
      }
    );
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const fetchProjects = async () => {
    await fetchData("project", setProjects);
  };

  const saveProject = async () => {
    await saveData("project", formData, isEditMode);
    fetchProjects();
    closePopup();
  };

  const deleteProject = async (id) => {
    await deleteData("project", id);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Header text={"Project Management"} />
      <div className='container my-5'>
        <div className='mt-4'>
          {/* Display fetched projects */}
          {projects.length > 0 ? (
            projects.map((project) => (
              <EditableCard
                key={project.id}
                title={project.name}
                onEdit={() => openPopup(project)}
                onDelete={() => deleteProject(project.id)}
              >
                <p>{project.techStack}</p>
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
        </PopUp>
      )}
    </>
  );
};

export default Projects;
