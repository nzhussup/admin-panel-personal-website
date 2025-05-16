import { useState, useEffect } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import { usePageData, useRenderPage } from "../utils/wedding/pageUtil";
import PageSubHeader from "../components/PageSubHeader";
import PageWrapper from "../utils/SmoothPage";
import LoadingElement from "./misc/Loading";
import ErrorElement from "./misc/errors/Error";
import NoInfoFoundElement from "./misc/errors/NoInfoFound";
import GlobalAlert from "../components/GlobalAlert";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Wedding = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [numberedUsers, setNumberedUsers] = useState([]);
  const [stat, setStat] = useState({
    totalPersons: 0,
    totalVotes: 0,
    attendanceStats: {
      yes: 0,
      no: 0,
      maybe: 0,
    },
    friendsComing: 0,
  });

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
      const ascending = [...users].sort((a, b) => a.id - b.id);
      const idToNum = new Map(
        ascending.map((user, index) => [user.id, index + 1])
      );

      const withNumbers = users.map((user) => ({
        ...user,
        num: idToNum.get(user.id),
      }));

      setNumberedUsers(withNumbers);
    }
  }, [users]);

  useEffect(() => {
    if (users && users.length > 0) {
      let totalPersons = 0;
      let totalVotes = 0;
      let attendanceStats = {
        yes: 0,
        no: 0,
        maybe: 0,
      };
      let friendsComing = 0;

      users.forEach((user) => {
        const relativesArray =
          user.relatives &&
          user.relatives.trim() !== "" &&
          user.relatives !== "-"
            ? user.relatives
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean)
            : [];

        const personCount = 1 + relativesArray.length;
        totalPersons += personCount;

        const attendance = user.attendance?.toLowerCase();
        if (["yes", "no", "maybe"].includes(attendance)) {
          attendanceStats[attendance] += personCount;

          if (attendance === "yes" && user.isFriend) {
            friendsComing += 1;
          }
        }
      });
      totalVotes = users.length;

      setStat({
        totalPersons,
        totalVotes,
        attendanceStats,
        friendsComing,
      });
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

  function exportToExcel(users) {
    const keyMap = {
      id: "ID",
      name: "Имя",
      relatives: "Родственники",
      attendance: "Посещение",
      isFriend: "Друзья",
    };

    const translatedUsers = users.map((user) => {
      const translatedUser = {};
      for (const key in user) {
        if (keyMap[key]) {
          translatedUser[keyMap[key]] = user[key];
        }
      }
      return translatedUser;
    });

    const worksheet = XLSX.utils.json_to_sheet(translatedUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Гости");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "список_гостей.xlsx");
  }

  const userPage = (
    <PageWrapper>
      <div className='mt-4'>
        <Card title='📊 Wedding Stats'>
          <ul className='list-disc list-inside space-y-1'>
            <li>Total Persons: {stat.totalPersons}</li>
            <li>Total Votes: {stat.totalVotes}</li>
            <li>✅ Yes: {stat.attendanceStats.yes}</li>
            <li>⛔️ No: {stat.attendanceStats.no}</li>
            <li>❓ Maybe: {stat.attendanceStats.maybe}</li>
            <li>👥 Friends Coming: {stat.friendsComing}</li>
          </ul>
        </Card>
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
        <PageSubHeader toggleSort={toggleSort}>
          <button
            className='btn btn-primary'
            onClick={() => exportToExcel(users)}
          >
            Export to Excel
          </button>
        </PageSubHeader>

        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, userPage)}
      </div>
    </>
  );
};

export default Wedding;
