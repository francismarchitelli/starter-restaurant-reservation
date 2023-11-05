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
| ------------ | ----------------------------- | ------------------------------------------------------------- |
| GET          | /reservations                 | Returns a list off all reservations ordered by time.          |
| POST         | /reservations                 | Creates a new reservation                                     |
| GET          | /reservations/:reservation_id | Returns a specific reservation.                               |
| PUT          | /reservations/:reservation_id | Updates a specific reservation                                |
| GET          | /reservations?date=YYYY-MM-DD | Returns all reservations for a specific date ordered by time. |
| GET          | /tables                       | Returns a list of all tables.                                 |
| POST         | /tables                       | Creates a new table.                                          |
| PUT          | /tables/:table_id/seat        | Updates a table by assigning a reservation to it.             |
| DELETE       | /tables/:table_id/seat        | Removes a reservation from a table.                           |


## Deployed Application

The application was deployed by using Render. 
The backend was deployed as a web service and the frontend as a static site.

**Backend:** https://starter-restaurant-reservation-backend-uluf.onrender.com

**Frontend:** https://starter-restaurant-reservation-frontend-7c0g.onrender.com/dashboard
