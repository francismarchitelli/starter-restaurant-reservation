import React, {useState} from "react";
import { listReservations, updateStatus } from "../utils/api";
import ListAllReservations from "./ListAllReservations";

export const SearchReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [mobileNumber, setMobileNumber] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const filterResults = false;
  
    const handleChange = (e) => {
      setMobileNumber(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const abortController = new AbortController();
  
      let res = await listReservations(
        { mobile_number: mobileNumber },
        abortController.signal
      );
      await setReservations(res);
      setSubmitted(true);
  
      return () => abortController.abort();
    };
  
    const handleCancel = async (e) => {
      const abortController = new AbortController();
  
      const result = window.confirm(
        "Are you sure you want to cancel this reservation? This cannot be undone."
      );
  
      if (result) {
        await updateStatus(e.target.value, "cancelled");
        let res = await listReservations(
          { mobile_number: mobileNumber },
          abortController.signal
        );
        await setReservations(res);
        setSubmitted(true);
      }
  
      return () => abortController.abort();
    };
  
    return (
      <div className="col-12 text-center">
        <h1 >Search Reservation</h1>
          <form onSubmit={handleSubmit}>
          <div className="form-group alert alert-secondary">
              <label htmlFor="mobile_number" className="font-weight-bold">Reservation Mobile Number</label>
              <div>
              <input
                type="text"
                id="mobile_number"
                name="mobile_number"
                placeholder="Enter the mobile number associated with your reservation"
                value={mobileNumber}
                maxLength="12"
                onChange={handleChange}
                required
              />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Find Reservation
            </button>
          </form>
        {submitted ? (
          <ListAllReservations
            reservations={reservations}
            filterResults={filterResults}
            handleCancel={handleCancel}
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  
  export default SearchReservation;
