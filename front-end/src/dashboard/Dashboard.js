import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ListTables from "../tables/ListTables";
import ListAllReservations from "../reservations/ListAllReservations";
import moment from "moment";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const filterResults = true;
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    
    listTables().then(setTables);
    return () => abortController.abort();
  }

  async function hanldeFinish(table_id) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Are you sure this table is ready to seat new guests? This cannot be undone."
    );

    if (result) {
      await finishTable(table_id, abortController.signal);
      loadDashboard();
    }

    return () => abortController.abort();
  }

  const handleCancel = async (e) => {
    const result = window.confirm(
      "Are you sure you want to cancel this reservation? This cannot be undone."
    );

    if (result) {
      await updateStatus(e.target.value, "cancelled");
      loadDashboard();
    }
  };

  return (
      <main>
        <ErrorAlert error={reservationsError} />
        <div className="group">
          <div className="item-double">
            <div className="group">
              <div className="item-double">
                <h2>
                  Reservations for {moment(date).format("dddd MMM DD YYYY")}
                </h2>
              </div>
              <div className="item centered">
                <div className="group-row">
                  <button
                    className="item black"
                    onClick={() =>
                      history.push(`/dashboard?date=${previous(date)}`)
                    }
                  >
                    Previous
                  </button>
                  <button
                    className="item black"
                    onClick={() => history.push(`/dashboard?date=${today()}`)}
                  >
                    Today
                  </button>
                  <button
                    className="item black"
                    onClick={() => history.push(`/dashboard?date=${next(date)}`)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div id="reservations" className="group-col">
            <ListAllReservations
              reservations={reservations}
              filterResults={filterResults}
              handleCancel={handleCancel}
            />
          </div>
        </div>
        <div id="tables" className="item">
          <h2>Tables</h2>
          <hr></hr>
          <ListTables tables={tables} hanldeFinish={hanldeFinish} />
        </div>
    </main>
);
}

export default Dashboard;

