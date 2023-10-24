const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

const hasRequiredProperties = hasProperties(
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
);

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

//Create validation to ensure that the phone number is in the correct format.
/*function validatePhoneNumber(req, res, next) {
  const { data = {} } = req.body;
  const phoneNumber = data["phone_number"];
  
  // Regular expression for (XXX) XXX-XXXX format
  const phoneRegex = /^\\d{3}\-\d{3}-\d{4}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return next({
      status: 400,
      message: "Invalid phone number format. Please use the format (XXX) XXX-XXXX.",
    });
  }

  next();
}
*/

//Create validation to ensure the reservation date is correct and not on a Tuesday.
function validateDate(req, res, next) {
  const { data = {} } = req.body;
  const date = data["reservation_date"];
  const day = new Date(date).getUTCDay();

  //Reservation cannot be on a Tuesday.
  if (day === 2) {
    return next({
      status: 400,
      message: "Invalid reservation date. The restaurant is closed on Tuesdays.",
    });
  }

  //Reservation must be in the future.
  if (new Date(date) <= new Date()) {
    return next({
      status: 400,
      message: "Invalid reservation date. Reservation date must be in the future.",
    });
  }

  next();
}


//Create validation to ensure the reservation time is between 10:30am and 9:30pm.
function validateTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data["reservation_time"];
  const reservationDateTime = new Date(`1970-01-01T${time}`);
  const currentTime = new Date();

  //Reservation must be at a future time.
  if (reservationDateTime <= currentTime) {
    return next({
      status: 400,
      message: "Invalid reservation time. Reservation time must be in the future.",
    });
  }

  const reservationTime = new Date(`1970-01-01T${time}`).getHours() * 60 + new Date(`1970-01-01T${time}`).getMinutes();

  //Reservation must after 10:30am.
  if (reservationTime < 630) {
    return next({
      status: 400,
      message: "Invalid reservation time. Reservation time is too early (before 10:30 AM).",
    });
  }

  //Reservation must be before 9:30pm.
  if (reservationTime > 1170) {
    return next({
      status: 400,
      message: "Invalid reservation time. Reservation time is too late (after 9:30 PM).",
    });
  }

  next();
}

function validNumberOfPeople(req, res, next) {
  const { data = {}} = req.body;
  if (data["people"] === 0 || !Number.isInteger(data["people"])) {
    return next({
      status: 400,
      message: "Invalid number of people.",
    });
  }
  next();
}

function validateReservationStatus(req, res, next) {
  const {status} = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if(currentStatus === "finished" || currentStatus === "cancelled") {
    return next ({
      status: 400,
      message: "Reservation is finished",
    });
  }

  if(status === "seated" || status === "booked" || status ==="finished" || status === "cancelled") {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Invalid reservation status: ${status}.`
  });
}

function reservationStatus(req, res, next) {
  const {status} = req.body.data;
  if(!status || status === "booked") {
    return next();
  }
  next({
    status: 400,
    message: "Status must be booked",
  })
}

async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id || (req.body.data || {}).reservation_id;

  const reservation = await reservationsService.readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}



async function list(req, res) {
  const {reservation_date} = req.query;
  const {mobile_number} = req.query;
  if(reservation_date) {
    const data = await reservationsService.listReservations(reservation_date);
    res.status(200).json({data: data});
  } else {
    if(mobile_number) {
      const data = await reservationsService.search(mobile_number);
      res.status(200).json({data: data})
    }
  }
}

async function createReservation(req, res) {
  const data = await reservationsService.createReservations(req.body.data);
  res.status(201).json({data});
}

async function readReservation(req, res) {
  const data = res.locals.reservation;
  res.json({data});
}

async function updateReservation(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationsService.updateReservation(updatedReservation);
  res.status(200).json({data});
}

async function updateReservationStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const data = await reservationsService.updateReservationStatus(reservation_id, status);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [reservationExists, asyncErrorBoundary(readReservation)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    //validatePhoneNumber,
    validateDate,
    validateTime,
    validNumberOfPeople,
    reservationStatus,
    asyncErrorBoundary(createReservation),
  ],
  update: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validateDate,
    validateTime,
    validNumberOfPeople,
    reservationExists,
    validateReservationStatus,
    asyncErrorBoundary(updateReservation),
  ],
  updateReservationStatus: [
    reservationExists,
    validateReservationStatus,
    asyncErrorBoundary(updateReservationStatus),
  ],
  reservationExists,
};
