const knex = require("../db/connection");

function listReservations(reservation_date){
    return knex("reservations")
    .select("*")
    .where({reservation_date})
    .whereNot({status: "finished"})
    .orderBy("reservation_time");
}

function createReservations(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function search(mobile_number) {
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function readReservation(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .first();
}

function updateReservation(updatedReservation) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

function updateReservationStatus(reservation_id, status) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id })
      .update({ status: status }, "*")
      .then((createdRecords) => createdRecords[0]);
  }

module.exports = {
    listReservations,
    createReservations,
    search,
    readReservation,
    updateReservation,
    updateReservationStatus,
};