import React from "react";
import Header from "../../components/Header";
import EditableCard from "../../components/EditableCard";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";
import FormInput from "../../components/FormInput";
import PageSubHeader from "../../components/PageSubHeader";
import { usePageData, usePopup } from "../../utils/pageUtil";

const Certs = () => {
  const {
    items: certificates,
    saveItem,
    deleteItem,
    toggleSort,
  } = usePageData("certificate");

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const saveCertificate = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  return (
    <>
      <Header text={"Certifications"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <div className='mt-4'>
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <EditableCard
                key={certificate.id}
                title={certificate.name}
                onEdit={() => openPopup(certificate)}
                onDelete={() => deleteItem(certificate.id)}
              >
                <div className='mb-3'>
                  {certificate.url && (
                    <a
                      href={certificate.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='btn btn-link'
                    >
                      View Certificate
                    </a>
                  )}
                  <p>Order: {certificate.displayOrder}</p>
                </div>
              </EditableCard>
            ))
          ) : (
            <p>No certificates available</p>
          )}
        </div>
      </div>

      <AddButton openPopup={openPopup} />

      {showPopup && (
        <PopUp
          closePopup={closePopup}
          title={isEditMode ? "Edit Certificate" : "Add Certificate"}
          onSubmit={saveCertificate}
        >
          <FormInput
            label='Certificate Name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required={true}
          />
          <FormInput
            label='Certificate URL'
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

export default Certs;
