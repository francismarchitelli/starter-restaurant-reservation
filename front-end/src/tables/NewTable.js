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
    <section>
      <h1>Create a Table</h1>
      <form onSubmit={handleSubmit}>
          <div className="form-group alert alert-secondary">
            <label htmlFor="table_name">Table Name</label>
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
          <div className="form-group alert alert-secondary">
            <label htmlFor="capacity">Capacity</label>
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
          <div>
            <button className="btn btn-secondary" onClick={() => history.goBack()}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
      </form>
    </section>
  );
};

export default NewTable;