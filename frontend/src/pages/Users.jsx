import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EditableCard from "../components/EditableCard";
import { usePageData, usePopup, useRenderPage } from "../utils/base/pageUtil";
import AddButton from "../components/AddButton";
import PopUp from "../components/PopUp";
import FormInput from "../components/FormInput";
import PageSubHeader from "../components/PageSubHeader";
import DeleteConfirmation from "../components/DeleteConfirmation";
import PageWrapper from "../utils/SmoothPage";
import LoadingElement from "./misc/Loading";
import ErrorElement from "./misc/errors/Error";
import NoInfoFoundElement from "./misc/errors/NoInfoFound";
import GlobalAlert from "../components/GlobalAlert";

const Users = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const {
    items: users,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
  } = usePageData("user/admin");
  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup();

  const { renderPage } = useRenderPage(users, showLoading, error);

  const saveUser = async () => {
    await saveItem(formData, isEditMode);
    closePopup();
  };

  useEffect(() => {
    if (response) {
      if (response.status === 403) {
        setAlertMessage("Can't delete last admin");
        setAlertVisible(true);
      } else if (response.status === 404) {
        setAlertMessage("User not found");
        setAlertVisible(true);
      }
      setResponse(null);
    }
  }, [response, setResponse]);

  const userForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit User" : "Add User"}
      onSubmit={saveUser}
    >
      <FormInput
        label='Username'
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required={true}
      />
      <FormInput
        label='Password'
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required={true}
      />
      <FormInput
        label='Role'
        type='select'
        options={["ROLE_USER", "ROLE_ADMIN"]}
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        required={true}
      />
    </PopUp>
  );

  const userPage = (
    <PageWrapper>
      <div className='mt-4'>
        {users.map((user) => (
          <EditableCard
            key={user.id}
            title={user.username}
            onEdit={() => openPopup(user)}
            onDelete={() => confirmDelete(user.id)}
          >
            <div className='mt-4'>
              <p>Password: {user.password}</p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"User Management"} />
      <GlobalAlert
        message={alertMessage}
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
        type='alert-danger'
      />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, userPage)}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && userForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default Users;
