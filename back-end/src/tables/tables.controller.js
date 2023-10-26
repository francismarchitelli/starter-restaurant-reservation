const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsController = require("../reservations/reservations.controller");


const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasReservationId = hasProperties("reservation_id");

/** 
 * Validation middleware functions
*/

//Validate that the table exists
async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ 
    status: 404, 
    message: `Table ${table_id} cannot be found.` });
}

//Validate that the name is more than 2 characters
function validateName(req, res, next) {
  const table_name = req.body.data.table_name;
 
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `Invalid table_name`,
    });
  }
  next();
}

//Validate that the table capacity is more than 1
function validateCapacity(req, res, next) {
    const { capacity } = req.body.data;
    if (typeof capacity === "number" && capacity > 0) {
      return next();
    } else {
      return next({
        status: 400,
        message: `capacity must be at least 1`,
      });
    }
  }
 
//Validate that a table has enough capacity to seat the reservation
function tableHasEnoughCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;
 
  if (capacity < people) {
    return next({
      status: 400,
      message: `Table does not have enough capacity`,
    });
  }
  next();
}

//Check to see if a table is free to be seated
function checkFreeTable(req, res, next) {
  if (res.locals.table.occupied) {
    return next({
      status: 400,
      message: `Table is occupied`,
    });
  }
  next();
}
 
//Check empty tables
function unseatedTable(req, res, next) {
  if (res.locals.reservation.status === "seated") {
    return next({
      status: 400,
      message: `Table is already seated`,
    });
  }
  next();
}

//Check seated tables
function occupiedTable(req, res, next) {
  if (!res.locals.table.occupied) {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }
  next();
}

/**
 * Handlers for the tables
 */

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}
 
async function createTable(req, res) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}
 
async function updateTable(req, res) {
  const { reservation_id } = req.body.data;
  const data = await tablesService.update(
    reservation_id,
    res.locals.table.table_id
  );
  res.status(200).json({ data });
}
 
async function finish(req, res) {
  const data = await tablesService.finish(
    res.locals.table.reservation_id,
    res.locals.table.table_id
  );
  res.status(200).json({ data });
}
 
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    validateName,
    validateCapacity,
    asyncErrorBoundary(createTable),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasReservationId,
    reservationsController.reservationExists,
    tableHasEnoughCapacity,
    unseatedTable,
    checkFreeTable,
    asyncErrorBoundary(updateTable),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    occupiedTable,
    asyncErrorBoundary(finish),
  ],
};
