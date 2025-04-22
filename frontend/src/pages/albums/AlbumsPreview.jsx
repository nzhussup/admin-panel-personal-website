import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import EditableAlbumCard from "../../components/EditableAlbumCard";
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
import ErrorElement from "../misc/errors/InternalServerError";
import NoInfoFoundElement from "../misc/errors/NoInfoFound";

const AlbumsPreview = () => {
  const navigate = useNavigate();

  const {
    items: albums,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
  } = usePageData("album");
  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const saveAlbum = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  const { renderPage } = useRenderPage(albums, showLoading, error);

  const albumForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Album" : "Add Album"}
      onSubmit={saveAlbum}
    >
      <FormInput
        label='Album Title'
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required={true}
      />
      <FormInput
        label='Album Description'
        type='textarea'
        value={formData.desc}
        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
        required={false}
      />
      <FormInput
        label='Date'
        type='date'
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required={false}
      />
      <FormInput
        label='Type'
        type='select'
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        options={["private", "semi-public", "public"]}
        required={false}
      />
      <FormInput
        label='Image Preview URL'
        type='clearable_text'
        value={formData.preview_image}
        onChange={(e) =>
          setFormData({ ...formData, preview_image: e.target.value })
        }
        required={false}
      />
    </PopUp>
  );

  const albumsPreviewPage = (
    <PageWrapper>
      <div className='row row-cols-1 row-cols-md-2 g-4'>
        {albums.map((album) => (
          <div key={album.id} className='col'>
            <EditableAlbumCard
              album={album}
              onEdit={() => openPopup(album)}
              onDelete={() => confirmDelete(album.id)}
            />
          </div>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Album Management"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        <br />
        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          albumsPreviewPage
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
export default AlbumsPreview;
