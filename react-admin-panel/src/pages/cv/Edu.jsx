import React from "react";
import Header from "../../components/Header";
import EditableCard from "../../components/EditableCard";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";
import FormInput from "../../components/FormInput";
import PageSubHeader from "../../components/PageSubHeader";
import { usePageData, usePopup, useRenderPage } from "../../utils/pageUtil";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import PageWrapper from "../../utils/SmoothPage";
import LoadingElement from "../misc/Loading";
import ErrorElement from "../misc/errors/InternalServerError";
import NoInfoFoundElement from "../misc/errors/NoInfoFound";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const Edu = () => {
  const {
    items: education,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
  } = usePageData("education");

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const saveEducation = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  const { renderPage } = useRenderPage(education, showLoading, error);

  const eduForm = (
    <PageWrapper>
      <PopUp
        closePopup={closePopup}
        title={isEditMode ? "Edit Education" : "Add Education"}
        onSubmit={saveEducation}
      >
        <FormInput
          label='Institution'
          value={formData.institution}
          onChange={(e) =>
            setFormData({ ...formData, institution: e.target.value })
          }
          required={true}
        />
        <FormInput
          label='Location'
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required={true}
        />
        <FormInput
          label='Start Date'
          type='date'
          value={formatDateForInput(formData.startDate)}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          required={true}
        />
        <FormInput
          label='End Date'
          type='date'
          value={formatDateForInput(formData.endDate)}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />
        <FormInput
          label='Degree'
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          required={true}
        />
        <FormInput
          label='Thesis'
          value={formData.thesis}
          onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
        />
        <FormInput
          label='Description'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
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
    </PageWrapper>
  );

  const eduPage = (
    <PageWrapper>
      <div className='mt-4'>
        {education.map((edu) => (
          <EditableCard
            key={edu.id}
            title={edu.degree}
            onEdit={() => openPopup(edu)}
            onDelete={() => confirmDelete(edu.id)}
          >
            <p>{edu.institution}</p>
            <p>{edu.location}</p>
            <p>
              {new Date(edu.startDate).toLocaleDateString()} -{" "}
              {edu.endDate
                ? new Date(edu.endDate).toLocaleDateString()
                : "Present"}
            </p>
            {edu.thesis && <p>Thesis: {edu.thesis}</p>}
            {edu.description && <p>Description: {edu.description}</p>}
            <p>Order: {edu.displayOrder}</p>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Education"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, eduPage)}
      </div>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {!error && <AddButton openPopup={openPopup} />}

      {showPopup && eduForm}
    </>
  );
};

export default Edu;
