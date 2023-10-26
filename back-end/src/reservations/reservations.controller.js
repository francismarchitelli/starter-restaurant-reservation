const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);
 
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

/** 
 * Validation middleware functions
*/

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
 
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
 
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

//Validates that the correct date is given on the reservation
function validateDate(req, res, next) {
  const { data = {} } = req.body;
  const date = data["reservation_date"];
  const time = data["reservation_time"];
  const formattedDate = new Date(`${date}T${time}`);
  const day = new Date(date).getUTCDay();
 
  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({
      status: 400,
      message: `Invalid reservation_date`,
    });
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant is closed on Tuesdays`,
    });
  }
  if (formattedDate <= new Date()) {
    return next({
      status: 400,
      message: `Reservation must be in the future`,
    });
  }
  next();
}

//Validates that the correct time is given in the reservation. Must be between 10:30AM and 9:30PM
function validateTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data["reservation_time"];

  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  const [hours, minutes] = time.split(":").map(Number);

  if (!timeRegex.test(time)) {
    return next({
      status: 400,
      message: `Invalid reservation_time`,
    });
  }

  if (hours < 10 || (hours === 10 && minutes < 30)) {
    return next({
      status: 400,
      message: `Reservation must be after 10:30AM`,
    });
  }

  if (hours > 21 || (hours === 21 && minutes > 30)) {
    return next({
      status: 400,
      message: `Reservation must be before 9:30PM`,
    });
  }

  next();
}

//Validates that the number of people in the reservation is more than 0
function validateNumber(req, res, next) {
  const { data = {} } = req.body;
 
  if (data["people"] === 0 || !Number.isInteger(data["people"])) {
    return next({
      status: 400,
      message: `Invalid number of people`,
    });
  }
  next();
}

//Validate the correct reservation status
function validateStatus(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;
 
  if (currentStatus === "finished" || currentStatus === "cancelled") {
    return next({
      status: 400,
      message: `Reservation status is finished`,
    });
  }
  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Invalid status: ${status}`,
  });
}
 
function reservationIsBooked(req, res, next) {
  const { status } = req.body.data;
 
  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }
  next();
}


//Validate that the reservation exists
async function reservationExists(req, res, next) {
  const reservation_id =
    req.params.reservation_id || (req.body.data || {}).reservation_id;
 
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}
 
/**
 * Handlers for the reservation
 */
async function list(req, res) {
  let data;

  if (req.query.date) {
    data = await reservationsService.list(req.query.date);
  } else {
    data = await reservationsService.search(req.query.mobile_number);
  }

  res.json({ data });
}
 
async function readReservation(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}
 
async function createReservation(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}
 
async function updateReservation(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationsService.update(updatedReservation);
  res.status(200).json({ data });
}
 
async function updateReservationStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const data = await reservationsService.updateStatus(reservation_id, status);
  res.status(200).json({ data });
}
 
module.exports = {
  list: asyncErrorBoundary(list),
  read: [reservationExists, asyncErrorBoundary(readReservation)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validateDate,
    validateTime,
    validateNumber,
    reservationIsBooked,
    asyncErrorBoundary(createReservation),
  ],
  update: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validateDate,
    validateTime,
    validateNumber,
    reservationExists,
    validateStatus,
    asyncErrorBoundary(updateReservation),
  ],
  updateStatus: [
    reservationExists,
    validateStatus,
    asyncErrorBoundary(updateReservationStatus),
  ],
  reservationExists,
};

