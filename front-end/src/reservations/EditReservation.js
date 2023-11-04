import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

export const EditReservation = () => {
  const history = useHistory();
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [reservation, setReservation] = useState({...initialState,});
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);

    return () => abortController.abort();
  }, [reservation_id]);

  const handleReservationChange = (e) => {
    if (e.target.name === "people") {
      setReservation({
        ...reservation,
        [e.target.name]: Number(e.target.value),
      });
    } else {
      setReservation({
        ...reservation,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    try {
      await updateReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (err) {
      setError(err);
    }

    return () => abortController.abort();
  };

  return (
    <div className="container-fluid">
      <h1>Edit Reservation</h1>
      <ErrorAlert error={error} />
      <ReservationForm
        reservation={reservation}
        handleReservationChange={handleReservationChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditReservation;
