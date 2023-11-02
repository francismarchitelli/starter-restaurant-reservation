import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

export const NewTable = () => {
  const history = useHistory();
  const initialState = {
    table_name: "",
    capacity: 0,
  };

  const [table, setTable] = useState({...initialState,});

  const handleTableChange = (e) => {
    if (e.target.name === "capacity") {
      setTable({
        ...table,
        [e.target.name]: Number(e.target.value),
      });
    } else {
      setTable({
        ...table,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    createTable(table, abortController.signal)
      .then(history.push(`/dashboard`))

    return () => abortController.abort();
  };

  return (
    <div>
      <h1>Create a Table</h1>
      <form onSubmit={handleSubmit}>
          <div className="form-group alert alert-secondary">
            <label htmlFor="table_name" className="font-weight-bold">Table Name</label>
            <div>
            <input
              type="text"
              id="table_name"
              name="table_name"
              value={table.table_name}
              placeholder="Insert Table Name"
              onChange={handleTableChange}
              required
            />
            </div>
          </div>
          <div className="form-group alert alert-secondary">
            <label htmlFor="capacity" className="font-weight-bold">Capacity</label>
            <div>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={table.capacity}
              min={1}
              onChange={handleTableChange}
              required
            />
            </div>
          </div>
          <div>
            <button className="btn btn-secondary mx-2" onClick={() => history.goBack()}>
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

export default NewTable;
