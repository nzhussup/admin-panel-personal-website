import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import EditableCard from "../../components/EditableCard";
import {
  usePageData,
  usePopup,
  useRenderPage,
} from "../../utils/album/albumPageUtil";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";
import FormInput from "../../components/FormInput";

import PageSubHeader from "../../components/PageSubHeader";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import PageWrapper from "../../utils/SmoothPage";
import LoadingElement from "../misc/Loading";
import ErrorElement from "../misc/errors/Error";
import NoInfoFoundElement from "../misc/errors/NoInfoFound";
import FramedImageCard from "../../components/FramedImageCard";
import ImageFormInput from "../../components/ImageFormInput";
import config from "../../config/ConfigVariables";

const Album = () => {
  const { id } = useParams();

  const {
    items,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
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

  const albumImagesSection = (
    <PageWrapper>
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4'>
        {album?.images?.map((image) => (
          <div key={image.id} className='col'>
            <FramedImageCard
              imageUrl={`${config.apiBase}${image?.url || ""}`}
              alt={image?.alt}
              onDelete={() => confirmDelete(image.id)}
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

      {showPopup && albumForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};
export default Album;
