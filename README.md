# Periodic Tables Restaurant Reservation System

The Peridic Tables Restaurant Reservation System App is a full-stack application created to book restaurant reservations, mangage the reservations, and manage the tables.

## Technologies Used

The Application makes use of Javascript, React, Bootstrap, CSS, Express.js, PostgresSQL, and Knex.

## Installation

1. Fork and clone the repository.
2. Run npm install.
3. Run npm run start to start the application.


## Front End

The Periodic Tables Restaurant Reservation System Frontend was created using React, CSS, and Bootstrap.

### Dashboard

When you open the application you should be taken to the main dashboard. 

* Here the user has the ability to see existing reservations for the current date and check other dates by using the "Previous", "Today", and "Next" buttons at the top of the page.
* On the left there is a Menu section that allows the user to navigate to other pages.
* The list of reservations will be seen on the left. Here the user also has the option to "seat" a reservation, "cancel" a reservation, and "edit" a reservation.
* The list of tables will be seen on the right. Here the user can "finish" a reseration once it is complete.

<img width="941" alt="dashboard" src="https://github.com/francismarchitelli/starter-restaurant-reservation/assets/127345349/07913197-2521-4579-aeb2-f903d4770f0b">


### New Reservation

The New Reservation page allows the user to create a new reservation. Here the reservation can be inputed into the form and submitted or canceled.

<img width="890" alt="New Reservation" src="https://github.com/francismarchitelli/starter-restaurant-reservation/assets/127345349/4a94ae05-8b72-452c-a5e1-630440e2c57e">

### Search

On the search page the user can search for a specific reservation by inputing the reservation phone number into the search bar.

<img width="946" alt="search reservation" src="https://github.com/francismarchitelli/starter-restaurant-reservation/assets/127345349/b17b5592-0eff-4a26-861c-642d4b261ef2">

### New Table

Here the restaurant manager has the ability to create a new table that can be seated by a reservation. 

<img width="950" alt="New Table" src="https://github.com/francismarchitelli/starter-restaurant-reservation/assets/127345349/292dd5c0-6e4d-4cd7-918f-f7cfd33968cd">

### Seat Reservation

The Seat Reservation page is reach by clicking on the "seat" button under a listed reservation on the dashboard. 
Here the manager can seat the reservation by choosing the appropraite table in the drop down menu.

<img width="953" alt="Seat Reservation" src="https://github.com/francismarchitelli/starter-restaurant-reservation/assets/127345349/1976a1e1-8ce2-41e7-95c6-fad9640d8731">

### Edit Reservation

The Edit Reservation page is reached by clicking the "edit" button under a listed reservation on the dashboard.
Here the user can edit reservation info if needed.

<img width="896" alt="Edit Reservation" src="https://github.com/francismarchitelli/starter-restaurant-reservation/assets/127345349/04901db7-5b33-4f7d-8b9e-0f651592d06e">



## Backend

Below is a summary of the API used in the application

| Request Type | Path                          | Description                                                   |
| GET          | /reservations                 | Returns a list off all reservations ordered by time.          |
| POST         | /reservations                 | Creates a new reservation                                     |
| GET          | /reservations/:reservation_id | Returns a specific reservation.                               |
| PUT          | /reservations/:reservation_id | Updates a specific reservation                                |
| GET          | /reservations?date=YYYY-MM-DD | Returns all reservations for a specific date ordered by time. |
| GET          | /tables                       | Returns a list of all tables.                                 |
| POST         | /tables                       | Creates a new table.                                          |
| PUT          | /tables/:table_id/seat        | Updates a table by assigning a reservation to it.             |
| DELETE       | /tables/:table_id/seat        | Removes a reservation from a table.                           |



1. The `/dashboard` page will
   - list all reservations for one date only. (E.g. if the URL is `/dashboard?date=2035-12-30` then send a GET to `/reservations?date=2035-12-30` to list the reservations for that date). The date is defaulted to today, and the reservations are sorted by time.
   - display next, previous, and today buttons that allow the user to see reservations on other dates
   - display any error messages returned from the API
1. The `/reservations` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.
   - seed the reservations table with the data contained in `./back-end/src/db/seeds/00-reservations.json`

> **Hint** Dates and times in JavaScript and databases can be challenging.
>
> The users have confirmed that they will be using Chrome to access the site. This means you can use `<input type="date" />` and `<input type="time" />`, which are supported by Chrome but may not work in other browsers.
>
> `<input type="date" />` will store the date in `YYYY-MM-DD` format. This is a format that works well with the PostgreSQL `date` data type.
>
> `<input type="time" />` will store the time in `HH:MM:SS` format. This is a format that works well with the PostgreSQL `time` data type.
>
> **Optional** If you want to add support to other browsers such as Safari or IE, you can use the pattern and placeholder attributes along with the date and time inputs in your form. For the date input you can use `<input type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"/>`, and for the time input you can use `<input type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}"/>`. You can read more about handling browser support [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#handling_browser_support).
>
> You can assume that all dates and times will be in your local time zone.

> **Hint** In the backend code, be sure to wrap any async controller functions in an `asyncErrorBoundary` call to ensure errors in async code are property handled.

In `back-end/src/errors/asyncErrorBoundary.js`

```javascript
function asyncErrorBoundary(delegate, defaultStatus) {
  return (request, response, next) => {
    Promise.resolve()
      .then(() => delegate(request, response, next))
      .catch((error = {}) => {
        const { status = defaultStatus, message = error } = error;
        next({
          status,
          message,
        });
      });
  };
}

module.exports = asyncErrorBoundary;
```

Use in controllers as part of `module.exports`. For example:

```javascript
module.exports = {
	create: asyncErrorBoundary(create)
}
```

### US-02 Create reservation on a future, working date

As a restaurant manager<br/>
I only want to allow reservations to be created on a day when we are open<br/>
so that users do not accidentally create a reservation for days when we are closed.<br/>

#### Acceptance criteria

1. The `/reservations/new` page will display an error message with `className="alert alert-danger"` if any of the following constraints are violated:
   - The reservation date is a Tuesday as the restaurant is closed on Tuesdays.
   - The reservation date is in the past. Only future reservations are allowed.
1. The `/reservations` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.

> **Hint** There may be more than one validation error on the page at time.
>
> For example, a reservation in the past on a Tuesday violates both rules, so the page should display two errors within a single `className="alert alert-danger"`
>
> However, the API validation does not need to include multiple validation error messages.
> You can run the validation in any order and report only one validation error at a time, and the tests will pass.
>
> Also, parsing a date in YYYY-MM-DD format using the built-in Date class assumes the date is a UTC date. UTC is a time standard that is the basis for civil time and time zones worldwide, but it is NOT a timezone. As a result, keep an eye out for how your dates are interpreted by the Date class.
>
> While there is nothing preventing you from using a third party library to handle dates for your project, you are encouraged to use the built-in Date class.

### US-03 Create reservation within eligible timeframe

As a restaurant manager<br/>
I only want to allow reservations to be created during business hours, up to 60 minutes before closing<br/>
so that users do not accidentally create a reservation for a time we cannot accommodate.

#### Acceptance criteria

1. The `/reservations/new` page will display an error message with `className="alert alert-danger"`, if any of the following additional constraints are violated:
   - The reservation time is before 10:30 AM.
   - The reservation time is after 9:30 PM, because the restaurant closes at 10:30 PM and the customer needs to have time to enjoy their meal.
   - The reservation date and time combination is in the past. Only future reservations are allowed. E.g., if it is noon, only allow reservations starting _after_ noon today.
1. The `/reservations` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.

> **Hint** Parsing a Date that includes the time in JavaScript can be tricky. Again, keep an eye out for which time zone is being used for your Dates.

### US-04 Seat reservation

As a restaurant manager, <br/>
When a customer with an existing reservation arrives at the restaurant<br/>
I want to seat (assign) their reservation to a specific table<br/>
so that I know which tables are occupied and free.

#### Acceptance Criteria

1. The `/tables/new` page will
   - have the following required and not-nullable fields:
     - Table name: `<input name="table_name" />`, which must be at least 2 characters long.
     - Capacity: `<input name="capacity" />`, this is the number of people that can be seated at the table, which must be at least 1 person.
   - display a `Submit` button that, when clicked, saves the new table then displays the `/dashboard` page
   - display a `Cancel` button that, when clicked, returns the user to the previous page
1. The `/dashboard` page will:

   - display a list of all reservations in one area.
   - each reservation in the list will:
     - Display a "Seat" button on each reservation.
     - The "Seat" button must be a link with an `href` attribute that equals `/reservations/${reservation_id}/seat`, so it can be found by the tests.
   - display a list of all tables, sorted by `table_name`, in another area of the dashboard
     - Each table will display "Free" or "Occupied" depending on whether a reservation is seated at the table.
     - The "Free" or "Occupied" text must have a `data-table-id-status=${table.table_id}` attribute, so it can be found by the tests.

1. The `/reservations/:reservation_id/seat` page will
   - have the following required and not-nullable fields:
     - Table number: `<select name="table_id" />`. The text of each option must be `{table.table_name} - {table.capacity}` so the tests can find the options.
   - do not seat a reservation with more people than the capacity of the table
   - display a `Submit` button that, when clicked, assigns the table to the reservation then displays the `/dashboard` page
   - PUT to `/tables/:table_id/seat/` in order to save the table assignment. The body of the request must be `{ data: { reservation_id: x } }` where X is the reservation_id of the reservation being seated. The tests do not check the body returned by this request.
   - display a `Cancel` button that, when clicked, returns the user to the previous page
1. The `tables` table must be seeded with the following data:
   - `Bar #1` & `Bar #2`, each with a capacity of 1.
   - `#1` & `#2`, each with a capacity of 6.
1. The `/tables` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.

- if the table capacity is less than the number of people in the reservation, return 400 with an error message.
- if the table is occupied, return 400 with an error message.

> **Hint** Work through the acceptance criteria in the order listed, step-by-step. A different order may be more challenging.

> **Hint** Seed the `tables` table in a similar way as it's done with the `reservations` table.

> **Hint** Add a `reservation_id` column in the `tables` table. Use the `.references()` and `inTable()` knex functions to add the foreign key reference.

### US-05 Finish an occupied table

As a restaurant manager<br/>
I want to free up an occupied table when the guests leave<br/>
so that I can seat new guests at that table.<br/>

#### Acceptance Criteria

1. The `/dashboard` page will
   - Display a "Finish" button on each _occupied_ table.
   - the "Finish" button must have a `data-table-id-finish={table.table_id}` attribute, so it can be found by the tests.
   - Clicking the "Finish" button will display the following confirmation: "Is this table ready to seat new guests? This cannot be undone." If the user selects "Ok" the system will: - Send a `DELETE` request to `/tables/:table_id/seat` in order to remove the table assignment. The tests do not check the body returned by this request. - The server should return 400 if the table is not occupied. - Refresh the list of tables to show that the table is now available.
   - Clicking the "Cancel" makes no changes.

> **Hint** The end-to-end test waits for the tables list to be refreshed before checking the free/occupied status of the table, so be sure to send a GET request to `/tables` to refresh the tables list.

### US-06 Reservation Status

As a restaurant manager<br/>
I want a reservation to have a status of either booked, seated, or finished<br/>
so that I can see which reservation parties are seated, and finished reservations are hidden from the dashboard.

#### Acceptance Criteria

1. The `/dashboard` page will
   - display the status of the reservation. The default status is "booked"
     - the status text must have a `data-reservation-id-status={reservation.reservation_id}` attribute, so it can be found by the tests.
   - display the Seat button only when the reservation status is "booked".
   - clicking the Seat button changes the status to "seated" and hides the Seat button.
   - clicking the Finish button associated with the table changes the reservation status to "finished" and removes the reservation from the dashboard.
   - to set the status, PUT to `/reservations/:reservation_id/status` with a body of `{data: { status: "<new-status>" } }` where `<new-status>` is one of booked, seated, or finished. Please note that this is only tested in the back-end for now.

> **Hint** You can add a field to a table in a migration `up` method by defining a new column. E.g. `table.string("last_name", null).notNullable();` will create a new last_name column.  Be sure to remove the column in the `down` function using `dropColumn()`. E.g. `table.dropColumn("last_name");`

> **Hint** Use [`Knex.transaction()`](http://knexjs.org/#Transactions) to make sure the `tables` and `reservations` records are always in sync with each other.

### US-07 Search for a reservation by phone number

As a restaurant manager<br/>
I want to search for a reservation by phone number (partial or complete)<br/>
so that I can quickly access a customer's reservation when they call about their reservation.<br/>

#### Acceptance Criteria

1. The `/search` page will
   - Display a search box `<input name="mobile_number" />` that displays the placeholder text: "Enter a customer's phone number"
   - Display a "Find" button next to the search box.
   - Clicking on the "Find" button will submit a request to the server (e.g. GET `/reservations?mobile_number=800-555-1212`).
     - then the system will look for the reservation(s) in the database and display all matched records on the `/search` page using the same reservations list component as the `/dashboard` page.
     - the search page will display all reservations matching the phone number, regardless of status.
   - display `No reservations found` if there are no records found after clicking the Find button.

> **Hint** To search for a partial or complete phone number, you should ignore all formatting and search only for the digits.
> You will need to remove any non-numeric characters from the submitted mobile number and also use the PostgreSQL translate function.
>
> The following function will perform the correct search.
>
> ```javascript
> function search(mobile_number) {
>   return knex("reservations")
>     .whereRaw(
>       "translate(mobile_number, '() -', '') like ?",
>       `%${mobile_number.replace(/\D/g, "")}%`
>     )
>     .orderBy("reservation_date");
> }
> ```

### US-08 Change an existing reservation

As a restaurant manager<br/>
I want to be able to modify a reservation if a customer calls to change or cancel their reservation<br/>
so that reservations are accurate and current.

#### Acceptance Criteria

1. The `/dashboard` and the `/search` page will
   - Display an "Edit" button next to each reservation
     - Clicking the "Edit" button will navigate the user to the `/reservations/:reservation_id/edit` page
   - the "Edit" button must be a link with an `href` attribute that equals `/reservations/${reservation_id}/edit`, so it can be found by the tests.
   - Display a "Cancel" button next to each reservation
   - The Cancel button must have a `data-reservation-id-cancel={reservation.reservation_id}` attribute, so it can be found by the tests.
   - Clicking the "Cancel" button will display the following confirmation: "Do you want to cancel this reservation? This cannot be undone."
     - Clicking "Ok" on the confirmation dialog, sets the reservation status to `cancelled`, and the results on the page are refreshed.
       - set the status of the reservation to `cancelled` using a PUT to `/reservations/:reservation_id/status` with a body of `{data: { status: "cancelled" } }`.
     - Clicking "Cancel" on the confirmation dialog makes no changes.
1. The `/reservations/:reservation_id/edit` page will display the reservation form with the existing reservation data filled in
   - Only reservations with a status of "booked" can be edited.
   - Clicking the "Submit" button will save the reservation, then displays the previous page.
   - Clicking "Cancel" makes no changes, then display the previous page.

> **Hint** The same validation used for create applies to editing a reservation. The form and the API for updating a reservation must not allow the user to violate any of the rules specified when creating a reservation.
