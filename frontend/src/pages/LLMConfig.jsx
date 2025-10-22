import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PageWrapper from "../utils/SmoothPage";

const LLMConfig = () => {
  const navigate = useNavigate();
  const [modelName, setModelName] = useState("");
  const [enableBackgroundGen, setEnableBackgroundGen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Model Name:", modelName);
    console.log("Enable Background Generation:", enableBackgroundGen);
  };

  return (
    <>
      <Header text={"LLM Configuration"} />

      <PageWrapper>
        <div className='container my-5'>
          <form
            className='p-4 rounded shadow-sm border'
            onSubmit={handleSubmit}
            style={{
              backgroundColor: document.body.classList.contains("dark-mode")
                ? "#000"
                : "#fff",
              color: document.body.classList.contains("dark-mode")
                ? "#fff"
                : "#000",
            }}
          >
            <div className='mb-3'>
              <label htmlFor='modelName' className='form-label'>
                Model Name
              </label>
              <input
                type='text'
                id='modelName'
                className='form-control'
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder='Enter model name'
                style={{
                  backgroundColor: document.body.classList.contains("dark-mode")
                    ? "#000"
                    : "#fff",
                  color: document.body.classList.contains("dark-mode")
                    ? "#fff"
                    : "#000",
                  borderColor: document.body.classList.contains("dark-mode")
                    ? "#444"
                    : "#ccc",
                }}
              />
            </div>

            <div className='form-check mb-3'>
              <input
                type='checkbox'
                id='enableBackgroundGen'
                className='form-check-input'
                checked={enableBackgroundGen}
                onChange={(e) => setEnableBackgroundGen(e.target.checked)}
              />
              <label
                htmlFor='enableBackgroundGen'
                className='form-check-label'
                style={{
                  color: document.body.classList.contains("dark-mode")
                    ? "#fff"
                    : "#000",
                }}
              >
                Enable Background Generation
              </label>
            </div>

            <button type='submit' className='btn btn-primary'>
              Save Configuration
            </button>
          </form>
        </div>
      </PageWrapper>
    </>
  );
};

export default LLMConfig;
