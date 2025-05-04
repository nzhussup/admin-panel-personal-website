import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import { usePageData, useRenderPage } from "../utils/wedding/pageUtil";
import PageSubHeader from "../components/PageSubHeader";
import PageWrapper from "../utils/SmoothPage";
import LoadingElement from "./misc/Loading";
import ErrorElement from "./misc/errors/Error";
import NoInfoFoundElement from "./misc/errors/NoInfoFound";
import GlobalAlert from "../components/GlobalAlert";

const Wedding = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const {
    items: users,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
  } = usePageData("wedding");

  const { renderPage } = useRenderPage(users, showLoading, error);

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

  const userPage = (
    <PageWrapper>
      <div className='mt-4'>
        {users.map((user) => (
          <Card key={user.id} title={user.id + " | " + user.name}>
            <div className='mt-4'>
              <p>Attending: {user.attendance}</p>
              <p>{user.isFriend ? "Friend" : "Not Friend"}</p>
              <p>
                {user.relatives
                  ? `Relatives: ${user.relatives}`
                  : "No relatives info given"}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Wedding Management"} />
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
    </>
  );
};

export default Wedding;
