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
import ExportButton from "../components/ExportButton";

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
  const [filteredStat, setFilteredStat] = useState(null);
  const [filter, setFilter] = useState(["all"]);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    if (!users || users.length === 0) return;

    const relationshipFilters = filter.includes("all")
      ? []
      : filter.filter((f) => f === "friend" || f === "not friends");

    const attendanceFilters = filter.includes("all")
      ? []
      : filter.filter((f) => ["yes", "no", "maybe"].includes(f));

    const filtered = users.filter((user) => {
      // Search logic
      const matchesSearch = user.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      // Relationship logic
      const matchesRelationship =
        relationshipFilters.length === 0 ||
        (relationshipFilters.includes("friend") && user.isFriend) ||
        (relationshipFilters.includes("not friends") && !user.isFriend);

      // Attendance logic
      const matchesAttendance =
        attendanceFilters.length === 0 ||
        attendanceFilters.includes(user.attendance?.toLowerCase());

      return matchesSearch && matchesRelationship && matchesAttendance;
    });

    const ascending = [...filtered].sort((a, b) => a.id - b.id);
    const idToNum = new Map(
      ascending.map((user, index) => [user.id, index + 1])
    );

    const withNumbers = filtered.map((user) => ({
      ...user,
      num: idToNum.get(user.id),
    }));

    setNumberedUsers(withNumbers);

    // Stats calculation
    let totalPersons = 0;
    let attendanceStats = { yes: 0, no: 0, maybe: 0 };
    let friendsComing = 0;

    filtered.forEach((user) => {
      const relativesArray =
        user.relatives && user.relatives.trim() !== "" && user.relatives !== "-"
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

    setFilteredStat({
      totalPersons,
      totalVotes: filtered.length,
      attendanceStats,
      friendsComing,
    });
  }, [users, filter, search]);

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
          <div className='row'>
            <div className='col-md-6'>
              <h6 className='fw-bold text-primary mb-2'>Total Stats:</h6>
              <ul className='list-disc list-inside mb-3'>
                <li>Total Persons: {stat.totalPersons}</li>
                <li>Total Votes: {stat.totalVotes}</li>
                <li>✅ Yes: {stat.attendanceStats.yes}</li>
                <li>⛔️ No: {stat.attendanceStats.no}</li>
                <li>❓ Maybe: {stat.attendanceStats.maybe}</li>
                <li>👥 Friends Coming: {stat.friendsComing}</li>
              </ul>
            </div>

            {!filter.includes("all") && (
              <div className='col-md-6'>
                <h6 className='fw-bold text-success mb-2'>Filtered Stats:</h6>
                <ul className='list-disc list-inside mb-3'>
                  <li>Total Persons: {filteredStat.totalPersons}</li>
                  <li>Total Votes: {filteredStat.totalVotes}</li>
                  <li>✅ Yes: {filteredStat.attendanceStats.yes}</li>
                  <li>⛔️ No: {filteredStat.attendanceStats.no}</li>
                  <li>❓ Maybe: {filteredStat.attendanceStats.maybe}</li>
                  <li>👥 Friends Coming: {filteredStat.friendsComing}</li>
                </ul>
              </div>
            )}
          </div>
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
          <ExportButton onClick={() => exportToExcel(numberedUsers)} />
        </PageSubHeader>
        <div className='row mb-3'>
          <div className='col-md-4 mb-2'>
            <label className='form-label fw-bold text-primary'>
              Filter by:
            </label>
            <div className='dropdown' data-bs-auto-close='outside'>
              <button
                className='btn btn-outline-primary dropdown-toggle w-100 text-start'
                type='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                {filter.includes("all")
                  ? "All"
                  : filter.join(", ") || "Select filters"}
              </button>
              <ul className='dropdown-menu p-2' style={{ minWidth: "100%" }}>
                {["all", "friend", "not friends", "yes", "no", "maybe"].map(
                  (option) => (
                    <li key={option} onClick={(e) => e.stopPropagation()}>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id={`filter-${option}`}
                          checked={filter.includes(option)}
                          onChange={(e) => {
                            if (option === "all") {
                              setFilter(["all"]);
                            } else {
                              let updated = filter.filter((f) => f !== "all");
                              if (e.target.checked) {
                                updated.push(option);
                              } else {
                                updated = updated.filter((f) => f !== option);
                              }
                              setFilter(
                                updated.length === 0 ? ["all"] : updated
                              );
                            }
                          }}
                        />
                        <label
                          className='form-check-label text-capitalize text-primary'
                          htmlFor={`filter-${option}`}
                        >
                          {option === "friend"
                            ? "Friends"
                            : option === "not friends"
                            ? "Not Friends"
                            : option.charAt(0).toUpperCase() + option.slice(1)}
                        </label>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className='col-md-4'>
            <label
              htmlFor='searchInput'
              className='form-label fw-bold text-primary'
            >
              Search by Name:
            </label>
            <input
              type='text'
              id='searchInput'
              className='form-control primary-input'
              placeholder='Enter name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, userPage)}
      </div>
    </>
  );
};

export default Wedding;
