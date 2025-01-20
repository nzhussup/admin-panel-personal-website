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

const Certs = () => {
  const {
    items: certificates,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
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

  const { renderPage } = useRenderPage(certificates, showLoading, error);

  const certForm = (
    <PageWrapper>
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
    </PageWrapper>
  );

  const certPage = (
    <PageWrapper>
      <div className='mt-4'>
        {certificates.map((certificate) => (
          <EditableCard
            key={certificate.id}
            title={certificate.name}
            onEdit={() => openPopup(certificate)}
            onDelete={() => confirmDelete(certificate.id)}
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
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Certifications"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <PageWrapper>
          {renderPage(
            ErrorElement,
            LoadingElement,
            NoInfoFoundElement,
            certPage
          )}
        </PageWrapper>
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {!error && <AddButton openPopup={openPopup} />}

      {showPopup && certForm}
    </>
  );
};

export default Certs;
