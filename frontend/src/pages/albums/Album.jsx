import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import {
  usePageData,
  usePopup,
  useRenderPage,
} from "../../utils/album/albumPageUtil";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";

import PageSubHeader from "../../components/PageSubHeader";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import PageWrapper from "../../utils/SmoothPage";
import LoadingElement from "../misc/Loading";
import ErrorElement from "../misc/errors/Error";
import NoInfoFoundElement from "../misc/errors/NoInfoFound";
import FramedImageCard from "../../components/FramedImageCard";
import ImageFormInput from "../../components/ImageFormInput";
import FormInput from "../../components/FormInput";
import config from "../../config/ConfigVariables";
import { useGlobalAlert } from "../../context/GlobalAlertContext";

const Album = () => {
  const { id } = useParams();
  const { triggerAlert } = useGlobalAlert();

  const {
    items,
    saveItem,
    renameItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
    fetchItem,
  } = usePageData("album/" + id, true);

  const album = items && items[0];

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const saveImage = async () => {
    await saveItem(formData, isEditMode, true);
    closePopup();
  };

  const albumForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={saveImage}
    >
      <ImageFormInput
        value={formData.file}
        onChange={(files) => setFormData({ ...formData, file: files })}
        required={true}
      />
    </PopUp>
  );

  const imageForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Image" : "Add Image"}
      onSubmit={async () => {
        try {
          await renameItem(formData);
          triggerAlert(
            `Successfully changed id to ${formData.newId}`,
            "success"
          );
          closePopup();
        } catch (err) {
          triggerAlert(err.message || "An unexpected error occurred", "danger");
        } finally {
          fetchItem();
        }
      }}
    >
      {formData.id}
      <FormInput
        value={formData.newId}
        type='clearable_text'
        onChange={(e) => setFormData({ ...formData, newId: e.target.value })}
        required={true}
      />
    </PopUp>
  );

  const renderForm = () => {
    if (showPopup) {
      if (isEditMode) {
        return imageForm;
      }
      return albumForm;
    }
  };

  const albumImagesSection = (
    <PageWrapper>
      <div className='row row-cols-2 row-cols-sm-2 row-cols-md-3 g-4'>
        {album?.images?.map((image) => (
          <div key={image.id} className='col'>
            <FramedImageCard
              imageUrl={`${config.apiBase}${image?.url || ""}`}
              alt={image?.alt}
              onDelete={() => confirmDelete(image.id)}
              onEdit={() => {
                openPopup(image);
              }}
            />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
  const { renderPage } = useRenderPage(album?.images || [], showLoading, error);

  return (
    <>
      <Header text={album ? "Album " + album.title : "Album"} />

      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <br />

        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          albumImagesSection
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {renderForm()}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};
export default Album;
