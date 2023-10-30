import React from "react";
import { Link } from "react-router-dom";

export const ListAllReservations = ({
  reservations,
  handleCancel,
  filterResults,
}) => {
  function checkReservationStatus(reservation) {
    return (
      reservation.status === "finished" || reservation.status === "cancelled"
    );
  }
  function formatTime(time) {
    let hours = Number(time.split(":")[0]);
    let minutes = Number(time.split(":")[1]);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTime = hours + ":" + minutes + " " + ampm;
    return formattedTime;
  }

  function renderReservations(reservations) {
    if (reservations.length) {
      return reservations.map((reservation) => {
        return filterResults && checkReservationStatus(reservation) ? (
          ""
        ) : (
          <div className="reservation" key={reservation.reservation_id}>
            <div className="group">
              <div className="item">
                <div className="group-col">
                  <div>
                    <h4>
                      {reservation.first_name} {reservation.last_name}{" "}
                    </h4>
                    <p>Party size of {reservation.people}</p>
                  </div>
                  <div>
                    <h5>
                      {formatTime(reservation.reservation_time)}
                    </h5>
                    <p>
                      &nbsp; / &nbsp;mobile : {reservation.mobile_number}
                    </p>
                    <p
                      data-reservation-id-status={reservation.reservation_id}
                    >
                      &nbsp; / &nbsp;<i>{reservation.status}</i>
                    </p>
                  </div>
                </div>
              </div>
              <div className="item">
                {reservation.status === "booked" ? (
                  <div className="group-reverse">
                    <Link
                      className="item button-link"
                      to={`/reservations/${reservation.reservation_id}/seat`}
                    >
                      Seat
                    </Link>
                    <Link
                      className="item button-link"
                      to={`/reservations/${reservation.reservation_id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="item black"
                      data-reservation-id-cancel={reservation.reservation_id}
                      value={reservation.reservation_id}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="group">
          <h4>No reservations found</h4>
        </div>
      );
    }
  }

  return <div>{renderReservations(reservations)}</div>;
};

export default ListAllReservations;