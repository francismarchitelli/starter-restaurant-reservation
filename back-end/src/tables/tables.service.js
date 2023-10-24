const knex = require("../db/connection");

function listTables() {
    return knex("tables").select("*").orderBy("table_name");
}

function readTable(table_id) {
    return knex("tables")
    .select("*")
    .where({table_id})
    .first();
}

function createTable(table) {
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecord) => createdRecord[0]);
}

function updateTable(reservation_id, table_id) {
    return knex.transaction(async (trx) => {
        await knex("reservations")
          .where({ reservation_id })
          .update({ status: "seated" })
          .transacting(trx);
    
        return knex("tables")
          .select("*")
          .where({ table_id })
          .update({ reservation_id: reservation_id }, "*")
          .update({
            occupied: knex.raw("NOT ??", ["occupied"]),
          })
          .transacting(trx)
          .then((createdRecords) => createdRecords[0]);
      });
}

function finishReservation(reservation_id, table_id) {
    return knex.transaction(async (trx) => {
      await knex("reservations")
        .where({ reservation_id })
        .update({ status: "finished" })
        .transacting(trx);
  
      return knex("tables")
        .select("*")
        .where({ table_id })
        .update({ reservation_id: null }, "*")
        .update({
          occupied: knex.raw("NOT ??", ["occupied"]),
        })
        .transacting(trx)
        .then((createdRecords) => createdRecords[0]);
    });
  }

module.exports = {
    listTables,
    readTable,
    createTable,
    updateTable,
    finishReservation,
};