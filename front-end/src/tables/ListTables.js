import React from "react";

export const ListTables = ({ tables, handleFinish }) => {
  return (
    <div className="group-col">
      {tables.map((table) => (
        <div className="table" key={table.table_id}>
          <div className="group-row">
            <div>
              <div className="group-col">
                <h2 className="item">Table {table.table_name}</h2>
                <div>
                  <h4 className="item inline">{table.capacity} seats </h4>
                  <p
                    className="item"
                    data-table-id-status={table.table_id}
                  >
                    &nbsp;/ &nbsp;{table.occupied ? "occupied" : "free"}
                  </p>
                </div>
              </div>
            </div>
            <div className="item">
              {table.occupied ? (
                <button
                  className="finish"
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
};

export default ListTables;