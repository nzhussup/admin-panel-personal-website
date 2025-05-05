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
  const [numberedUsers, setNumberedUsers] = useState([]);

  const {
    items: users,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
  } = usePageData("wedding");

  const { renderPage } = useRenderPage(users, showLoading, error);

  const handleAttendance = (attendance) => {
    switch (attendance) {
      case "yes":
        return "✅";
      case "no":
        return "⛔️";
      case "maybe":
        return "❓";
      default:
        return "➖";
    }
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

  useEffect(() => {
    if (users && users.length > 0) {
      // Step 1: Build ascending list to assign num
      const ascending = [...users].sort((a, b) => a.id - b.id);
      const idToNum = new Map(
        ascending.map((user, index) => [user.id, index + 1])
      );

      // Step 2: Add num to original (descending) users
      const withNumbers = users.map((user) => ({
        ...user,
        num: idToNum.get(user.id),
      }));

      setNumberedUsers(withNumbers);
    }
  }, [users]);

  const handleTitle = (user) => {
    let title = `${user.num} | `;

    if (user.isFriend) {
      title += "👥 | ";
    }

    title += user.name || "Unknown Name";
    title += " | ";

    title += handleAttendance(user.attendance) || "➖ No Attendance Info";

    return title;
  };

  const userPage = (
    <PageWrapper>
      <div className='mt-4'>
        {numberedUsers.map((user) => (
          <Card key={user.id} title={handleTitle(user)}>
            <p>
              {user.relatives
                ? `Relatives: ${user.relatives}`
                : "No relatives info given"}
            </p>
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
