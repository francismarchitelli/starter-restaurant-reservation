import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export const NewReservation = () => {
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

  const handleReservationChange = (e) => {
    if (e.target.name === "people") {
      setReservation({...reservation, [e.target.name]: Number(e.target.value),
      });
    } else {
      setReservation({...reservation, [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    try {
      await createReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
        return error;
    }

    return () => abortController.abort();
  };

  return (
    <div className="container-fluid">
      <h1>Create A New Reservation</h1>
      <div className="row">
        <div className="col-md-9">
      <ReservationForm
        reservation={reservation}
        handleReservationChange={handleReservationChange}
        handleSubmit={handleSubmit}
      />
      </div>
      </div>
    </div>
  );
};

export default NewReservation;
