import React from "react";
import Header from "../../components/Header";
import EditableCard from "../../components/EditableCard";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";
import FormInput from "../../components/FormInput";
import {
  usePageData,
  usePopup,
  useRenderPage,
} from "../../utils/base/pageUtil";
import PageSubHeader from "../../components/PageSubHeader";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import PageWrapper from "../../utils/SmoothPage";
import LoadingElement from "../misc/Loading";
import ErrorElement from "../misc/errors/Error";
import NoInfoFoundElement from "../misc/errors/NoInfoFound";

const Skills = () => {
  const {
    items: skills,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
  } = usePageData("base/skill");

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const { renderPage } = useRenderPage(skills, showLoading, error);

  const saveSkill = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  const skillForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Skill" : "Add Skill"}
      onSubmit={saveSkill}
    >
      <FormInput
        label='Category'
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required={true}
      />
      <FormInput
        label='Skill Names (comma-separated)'
        value={formData.skillNames}
        onChange={(e) =>
          setFormData({ ...formData, skillNames: e.target.value })
        }
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

  const skillPage = (
    <PageWrapper>
      <div className='mt-4'>
        {skills.map((skill) => (
          <EditableCard
            key={skill.id}
            title={skill.category}
            onEdit={() => openPopup(skill)}
            onDelete={() => confirmDelete(skill.id)}
          >
            <div className='mt-4'>
              {skill.skillNames.split(", ").map((skillName, index) => (
                <span
                  key={index}
                  className='badge bg-primary me-2 mb-2'
                  style={{ fontSize: "14px" }}
                >
                  {skillName}
                </span>
              ))}
              <p>Order: {skill.displayOrder}</p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Skills"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          skillPage
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && skillForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default Skills;
