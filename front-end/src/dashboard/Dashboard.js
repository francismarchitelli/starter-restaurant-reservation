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

  async function handleFinish(table_id) {
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
          <div className="container-fluid col-12 text-center">
            <div>
              <div>
                <h1>
                  Reservations for {moment(date).format("dddd MMM DD YYYY")}
                </h1>
              </div>
              <div className="centered">
                <div>
                  <button
                    className="black mx-1"
                    onClick={() =>
                      history.push(`/dashboard?date=${previous(date)}`)
                    }
                  >
                    Previous
                  </button>
                  <button
                    className="black mx-1"
                    onClick={() => history.push(`/dashboard?date=${today()}`)}
                  >
                    Today
                  </button>
                  <button
                    className="black mx-1"
                    onClick={() => history.push(`/dashboard?date=${next(date)}`)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr />
        <div className="container">
          <div className="row">
          <div id="reservations" className="col text-center">
            <h1><u>Reservations</u></h1>
            <ListAllReservations
              reservations={reservations}
              filterResults={filterResults}
              handleCancel={handleCancel}
            />
          </div>
        <div id="tables" className="col text-center">
          <h1><u>Tables</u></h1>
          <ListTables tables={tables} handleFinish={handleFinish} />
        </div>
        </div>
        </div>
    </main>
);
}

export default Dashboard;


