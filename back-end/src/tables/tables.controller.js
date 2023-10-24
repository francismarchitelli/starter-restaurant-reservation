const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsController = require("../reservations/reservations.controller");


const hasRequiredProperties = hasProperties("table_name", "capacity");
const tableHasReservationId = hasProperties("reservation_id");

  async function tableExists(req, res, next) {
    const tableId = req.params.table_id;
    const table = await tablesService.readTable(tableId);

    if(table) {
        res.locals.table = table;
        return next();
    }
    next({
        status: 404,
        message: `Table ${tableId} not found.`,
    });
  }

  function validateTableName(req, res, next) {
    const table_name = req.body.data.table_name;

    if(table_name.length < 2) {
        return next({
            status: 400,
            message: "invalid table_name.",
        })
    }

    next();
  }

  function validateTableCapacity(req, res, next) {
    const capacity = req.body.data.capacity;

    if(capacity < 1 || isNaN(capacity)) {
        return next({
            status: 400,
            message: "Invalid capacity number.",
        });
    }

    next();
  }

  function hasEnoughCapacity(req, res, next) {
    const capacity = res.locals.table.capacity;
    const numberOfPeople = res.locals.reservation.people;

    if(capacity < numberOfPeople) {
        return next({
            status: 400,
            message: "This table does not have enough seating capacity.",
        });
    }

    next();
  }

  function isTableOccupied(req, res, next) {
    if(res.locals.table.occupied) {
        return next({
            status: 400,
            message: "This table is currently occupied",
        });
    }
    next();
  }

  function tableNotSeated(req, res, next) {
    if(res.locals.reservation.status === "seated") {
        return next({
            status: 400,
            message: "This table is currently seated",
        });
    }
    next();
  }

  

  function TableStillOccupied(req, res, next) {
    if(!res.locals.table.occupied) {
        return next({
            status: 400,
            message: "This table is not currently occupied",
        });
    }
    next();
  }

async function listTables(req, res) {
    const data = await tablesService.listTables();
    res.json({data});
}

async function createTable(req, res) {
    const data = await tablesService.createTable(req.body.data);
    res.status(201).json({data});
}

async function updateTable(req, res) {
    const {reservatio_id} = req.body.data;
    const data = await tablesService.updateTable(
        reservatio_id,
        res.locals.table.table_id
    );
    res.json({data});
}

async function finishReservation(req, res) {
    const data = await tablesService.finishReservation(
        res.locals.table.reservation_id,
        res.locals.table.table_id
    );
    res.json({data});
}

module.exports = {
    list: asyncErrorBoundary(listTables),
    create: [
        hasRequiredProperties,
        validateTableName,
        validateTableCapacity,
        asyncErrorBoundary(createTable),
    ],
    update: [
        asyncErrorBoundary(tableExists),
        tableHasReservationId,
        reservationsController.reservationExists,
        hasEnoughCapacity,
        tableNotSeated,
        isTableOccupied,
        asyncErrorBoundary(updateTable),
    ],
    finish: [
        asyncErrorBoundary(tableExists),
        TableStillOccupied,
        asyncErrorBoundary(finishReservation),
    ],
};