import React from "react";
import Header from "../../components/Header";
import EditableCard from "../../components/EditableCard";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";
import FormInput from "../../components/FormInput";
import { usePageData, usePopup } from "../../utils/pageUtil";
import PageSubHeader from "../../components/PageSubHeader";

const Skills = () => {
  const {
    items: skills,
    saveItem,
    deleteItem,
    toggleSort,
  } = usePageData("skill");

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const saveSkill = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  return (
    <>
      <Header text={"Skills"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <div className='mt-4'>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <EditableCard
                key={skill.id}
                title={skill.category}
                onEdit={() => openPopup(skill)}
                onDelete={() => deleteItem(skill.id)}
              >
                <div className='mb-3'>
                  {skill.skillNames.split(", ").map((skillName, index) => (
                    <span
                      key={index}
                      className='badge bg-primary me-2 mb-2'
                      style={{ fontSize: "14px" }}
                    >
                      {skillName}
                    </span>
                  ))}
                </div>
                <p>Order: {skill.displayOrder}</p>
              </EditableCard>
            ))
          ) : (
            <p>No skills available</p>
          )}
        </div>
      </div>

      <AddButton openPopup={openPopup} />

      {showPopup && (
        <PopUp
          closePopup={closePopup}
          title={isEditMode ? "Edit Skill" : "Add Skill"}
          onSubmit={saveSkill}
        >
          <FormInput
            label='Category'
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
      )}
    </>
  );
};

export default Skills;
