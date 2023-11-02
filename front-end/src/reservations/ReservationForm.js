import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({reservation, handleReservationChange, handleSubmit}) {
  const history = useHistory();

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
          <div className="form-group alert alert-secondary">
            <label htmlFor="first_name" className="font-weight-bold">First Name</label>
            <div>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Enter Your First Name"
              value={reservation.first_name}
              onChange={handleReservationChange}
              required
            />
          </div>
          </div>
          <div className="form-group alert alert-secondary">
            <label htmlFor="last_name" className="font-weight-bold">Last Name</label>
            <div>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Enter Your Last Name"
              value={reservation.last_name}
              onChange={handleReservationChange}
              required
            />
            </div>
          </div>
          <div className="form-group alert alert-secondary">
            <label htmlFor="mobile_number" className="font-weight-bold">Mobile Number</label>
            <div>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              placeholder="xxx-xxx-xxxx"
              max="12"
              value={reservation.mobile_number}
              onChange={handleReservationChange}
              required
            />
            </div>
          </div>
          <div className="form-group alert alert-secondary">
            <label htmlFor="reservation_date" className="font-weight-bold">Reservation Date</label>
            <div>
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
          </div>
          <div className="form-group alert alert-secondary">
            <label htmlFor="reservation_time" className="font-weight-bold">Reservation Time</label>
            <div>
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
          </div>
          <div className="form-group alert alert-secondary">
            <label htmlFor="people" className="font-weight-bold">Number of People</label>
            <div>
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
          </div>
          <div>
            <button type="button" className="btn btn-secondary mx-2" onClick={() => history.goBack()}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary mx-2">
              Submit
            </button>
          </div>
      </form>
    </div>
  );
};


export default ReservationForm;
