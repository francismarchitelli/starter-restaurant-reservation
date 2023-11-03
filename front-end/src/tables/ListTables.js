import React from "react";

function ListTables({ tables, handleFinish }) {
  
  return (
    <div>
      {tables.map((table) => (
        <div className="table" key={table.table_id}>
          <div>
            <div className="form-group alert alert-primary text-dark">
              <div>
                <h4>Table {table.table_name}</h4>
                <div>
                  <h5>
                    {table.capacity} seats{" "}
                  </h5>
                  <p
                    data-table-id-status={table.table_id}
                  >
                     /  {table.occupied ? "occupied" : "free"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              {table.occupied ? (
                <button
                className="btn btn-primary"
                  data-table-id-finish={table.table_id}
                  onClick={() => handleFinish(table.table_id)}
                >
                  Finish
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListTables;
