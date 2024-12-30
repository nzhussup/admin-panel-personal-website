import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import EditableCard from "../../components/EditableCard";
import { fetchData, saveData, deleteData } from "../../utils/apiUtil";
import AddButton from "../../components/AddButton";
import PopUp from "../../components/PopUp";
import FormInput from "../../components/FormInput";

const Certs = () => {
  const [certificates, setCertificates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    url: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const openPopup = (certificate = null) => {
    setIsEditMode(!!certificate);
    setFormData(
      certificate || {
        id: null,
        name: "",
        url: "",
      }
    );
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const fetchCertificates = async () => {
    await fetchData("certificate", setCertificates);
  };

  const saveCertificate = async () => {
    await saveData("certificate", formData, isEditMode);
    fetchCertificates();
    closePopup();
  };

  const deleteCertificate = async (id) => {
    await deleteData("certificate", id);
    fetchCertificates();
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <>
      <Header text={"Certifications"} />
      <div className='container my-5'>
        <div className='mt-4'>
          {/* Display fetched certificates */}
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <EditableCard
                key={certificate.id}
                title={certificate.name}
                onEdit={() => openPopup(certificate)}
                onDelete={() => deleteCertificate(certificate.id)}
              >
                <p>{certificate.name}</p>
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
              </EditableCard>
            ))
          ) : (
            <p>No certificates available</p>
          )}
        </div>
      </div>

      <AddButton openPopup={openPopup} />

      {/* Popup for Add/Edit */}
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
        </PopUp>
      )}
    </>
  );
};

export default Certs;
