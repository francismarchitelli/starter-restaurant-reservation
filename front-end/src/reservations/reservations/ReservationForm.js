import React from "react";
import { useHistory } from "react-router-dom";

export const ReservationForm = ({
  reservation,
  handleReservationChange,
  handleSubmit,
}) => {
  const history = useHistory();

  return (
    <div>
      <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Please Enter Your First Name"
              value={reservation.first_name}
              onChange={handleReservationChange}
              required
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Please Enter Your Last Name"
              value={reservation.last_name}
              onChange={handleReservationChange}
              required
            />
          </div>
          <div>
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              value={reservation.mobile_number}
              onChange={handleReservationChange}
              required
            />
          </div>
          <div>
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
              type="date"
              id="reservation_date"
              name="reservation_date"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              value={reservation.reservation_date}
              onChange={handleReservationChange}
              required
            />
          </div>
          <div>
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
              type="time"
              id="reservation_time"
              name="reservation_time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              value={reservation.reservation_time}
              onChange={handleReservationChange}
              required
            />
          </div>
          <div>
            <label htmlFor="people">Number of People</label>
            <input
              type="number"
              id="people"
              name="people"
              value={reservation.people}
              min={1}
              onChange={handleReservationChange}
              required
            />
          </div>
          <div>
            <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
      </form>
    </div>
  );
};

export default ReservationForm;