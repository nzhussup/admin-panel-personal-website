import React from "react";
import Header from "../../components/Header";
import EditableCard from "../../components/EditableCard";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";
import FormInput from "../../components/FormInput";
import { usePageData, usePopup, useRenderPage } from "../../utils/pageUtil";
import PageSubHeader from "../../components/PageSubHeader";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import PageWrapper from "../../utils/SmoothPage";
import LoadingElement from "../misc/Loading";
import ErrorElement from "../misc/errors/InternalServerError";
import NoInfoFoundElement from "../misc/errors/NoInfoFound";

const WorkExp = () => {
  const {
    items: workExperience,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
  } = usePageData("work-experience");

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const { renderPage } = useRenderPage(workExperience, showLoading, error);

  const saveWorkExperience = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  const wexForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Work Experience" : "Add Work Experience"}
      onSubmit={saveWorkExperience}
    >
      <FormInput
        label='Job Title'
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        required={true}
      />
      <FormInput
        label='Company'
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        required={true}
      />
      <FormInput
        label={"Location"}
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required={true}
      />
      <FormInput
        label='Start Date'
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='End Date'
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        required={false}
      />
      <FormInput
        label='Description'
        type='textarea'
        rows={10}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required={false}
      />
      <FormInput
        label='Tech Stack (comma-separated)'
        value={formData.techStack}
        onChange={(e) =>
          setFormData({ ...formData, techStack: e.target.value })
        }
        required={false}
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

  const wexPage = (
    <PageWrapper>
      <div className='mt-4'>
        {workExperience.map((experience) => (
          <EditableCard
            key={experience.id}
            title={experience.position}
            onEdit={() => openPopup(experience)}
            onDelete={() => confirmDelete(experience.id)}
          >
            <div className='mb-3'>
              <h5>Company: {experience.company}</h5>
              <p>Location: {experience.location}</p>
              <p>
                {experience.startDate} -{" "}
                {experience.endDate ? experience.endDate : "Present"}
              </p>
              <p>Description: {experience.description}</p>
              <p>
                Tech Stack:{" "}
                {
                  <div>
                    {experience.techStack &&
                      experience.techStack.split(",").map((tech, index) => (
                        <span key={index} className='badge bg-primary me-2'>
                          {tech.trim()}{" "}
                        </span>
                      ))}
                  </div>
                }
              </p>
              <p>Order: {experience.displayOrder}</p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Work Experience"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, wexPage)}
      </div>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      {showPopup && wexForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default WorkExp;
