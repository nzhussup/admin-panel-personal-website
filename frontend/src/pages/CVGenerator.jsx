import Header from "../components/Header";
import GlobalAlert from "../components/GlobalAlert";
import PageSubHeader from "../components/PageSubHeader";
import ExportButton from "../components/ExportButton";
import ErrorElement from "./misc/errors/Error";
import LoadingElement from "./misc/Loading";
import NoInfoFoundElement from "./misc/errors/NoInfoFound";
import { useEffect, useState } from "react";
import { usePageData, useRenderPage } from "../utils/cv-generator/pageUtil";
import Card from "../components/Card";
import config from "../config/ConfigVariables";
import { generateCV } from "../utils/cv-generator/Generator";

const CVGenerator = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [basicInfo, setBasicInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return (
          parsed.basicInfo || {
            name: "Nurzhanat Zhussup",
            address: "123 Main St, Vienna, Austria",
            email: "john.doe@example.com",
            phone: "+7 777 777 7777",
            linkedin: "https://www.linkedin.com/in/nurzhanat-zhussup/",
            github: "https://github.com/nzhussup",
            about:
              "A passionate software engineer with a focus on cloud and ML.",
          }
        );
      }
    } catch (e) {
      console.error("Failed to parse basic info from localStorage", e);
    }
    return {
      name: "Nurzhanat Zhussup",
      address: "123 Main St, Vienna, Austria",
      email: "john.doe@example.com",
      phone: "+7 777 777 7777",
      linkedin: "https://www.linkedin.com/in/nurzhanat-zhussup/",
      github: "https://github.com/nzhussup",
      about:
        "A passionate software engineer with a focus on backend and infrastructure.",
    };
  });

  const {
    items: data,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
  } = usePageData();

  const { renderPage } = useRenderPage(data, showLoading, error);

  const [selectedItems, setSelectedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const withSets = {};
        for (const section in parsed.selectedItems || {}) {
          withSets[section] = new Set(parsed.selectedItems[section]);
        }
        return withSets;
      }
    } catch (e) {
      console.error("Failed to parse selected items from localStorage", e);
    }
    return {};
  });

  useEffect(() => {
    const serializableSelected = {};
    for (const section in selectedItems) {
      serializableSelected[section] = Array.from(selectedItems[section]);
    }

    const fullState = {
      basicInfo,
      selectedItems: serializableSelected,
    };

    localStorage.setItem(
      config.cvGeneratorLocalStorageKey,
      JSON.stringify(fullState)
    );
  }, [selectedItems, basicInfo]);

  const toggleSelect = (sectionName, itemIndex) => {
    setSelectedItems((prev) => {
      const sectionSet = new Set(prev[sectionName] || []);
      if (sectionSet.has(itemIndex)) {
        sectionSet.delete(itemIndex);
      } else {
        sectionSet.add(itemIndex);
      }
      return { ...prev, [sectionName]: sectionSet };
    });
  };

  const handleGenerateCV = (output) => {
    const selectedData = { basic_info: basicInfo };
    for (const sectionObj of data) {
      const sectionName = Object.keys(sectionObj)[0];
      const items = sectionObj[sectionName];
      const selectedIndices = selectedItems[sectionName];
      if (selectedIndices && selectedIndices.size > 0) {
        selectedData[sectionName] = items.filter((_, idx) =>
          selectedIndices.has(idx)
        );
      }
    }
    if (Object.keys(selectedData).length === 0) {
      setAlertMessage("Please select at least one item to generate CV.");
      setAlertVisible(true);
    } else {
      setAlertMessage("CV generated successfully (mock)!");
      setAlertVisible(true);
      console.log("Selected data for CV:", selectedData);
    }
    generateCV(selectedData, output);
  };
  const generatorPage = (
    <div>
      <Card
        key={"basic-info"}
        title={"Basic Information"}
        style={{ marginTop: "20px", padding: "16px" }}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {Object.entries(basicInfo).map(([key, value]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor={`basic-info-${key}`}
                style={{ fontWeight: "600", marginBottom: "4px" }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {key === "about" ? (
                <textarea
                  id={`basic-info-${key}`}
                  value={value}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  rows={3}
                  style={{ resize: "vertical", padding: "8px" }}
                />
              ) : (
                <input
                  id={`basic-info-${key}`}
                  type='text'
                  value={value}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  style={{ padding: "8px" }}
                />
              )}
            </div>
          ))}
        </form>
      </Card>

      {data.map((sectionObj, index) => {
        const sectionName = Object.keys(sectionObj)[0];
        const items = sectionObj[sectionName];

        return (
          <Card
            key={index}
            title={sectionName.replace(/_/g, " ")}
            style={{ marginTop: "20px" }}
          >
            {Array.isArray(items) && items.length > 0 ? (
              items.map((item, idx) => {
                const isChecked = selectedItems[sectionName]?.has(idx) || false;
                return (
                  <label
                    key={idx}
                    style={{
                      display: "block",
                      userSelect: "none",
                      cursor: "pointer",
                      padding: "8px",
                      backgroundColor: isChecked ? "#d0ebff" : "#f9f9f9",
                      borderRadius: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={isChecked}
                      onChange={() => toggleSelect(sectionName, idx)}
                      style={{ marginRight: "8px" }}
                    />
                    <pre
                      style={{
                        display: "inline",
                        userSelect: "text",
                        cursor: "text",
                        margin: 0,
                      }}
                    >
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </label>
                );
              })
            ) : (
              <p>No items</p>
            )}
          </Card>
        );
      })}
    </div>
  );

  return (
    <>
      <Header text={"CV Generator"} />
      <GlobalAlert
        message={alertMessage}
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
        type='alert-danger'
      />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort}>
          <ExportButton
            text={"Export to PDF"}
            onClick={() => handleGenerateCV("pdf")}
          />
          <ExportButton
            text={"Export to Word"}
            onClick={() => handleGenerateCV("word")}
          />
        </PageSubHeader>

        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          generatorPage
        )}
      </div>
    </>
  );
};

export default CVGenerator;
