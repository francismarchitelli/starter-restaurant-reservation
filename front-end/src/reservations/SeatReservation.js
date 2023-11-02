import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable, readReservation } from "../utils/api";

export const SeatReservation = () => {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [reservation, setReservation] = useState({});

  useEffect(() => {
    listTables().then(setTables);
  }, []);

  useEffect(() => {
    readReservation(reservation_id).then(setReservation);
  }, [reservation_id]);

  const handleReservationChange = (e) => {
    setTableId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateTable(reservation.reservation_id, tableId);
    history.push("/dashboard");
  };

  return (
    <section>
      <h1>Seat Reservation</h1>
      <form onSubmit={handleSubmit}>
          <div className="form-group alert alert-secondary">
            <select
              id="table_id"
              name="table_id"
              value={tableId}
              onChange={handleReservationChange}
              required
            >
              <option>Choose a table</option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={table.table_id}
                  disabled={
                    table.capacity < reservation.people || table.occupied
                  }
                >
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary mx-2">
              Submit
            </button>
          </div>
      </form>
    </section>
  );
};

export default SeatReservation;
