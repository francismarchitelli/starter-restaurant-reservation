import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation";
import SearchReservation from "../reservations/SearchReservation";
import EditReservation from "../reservations/EditReservation";
import SeatReservation from "../reservations/SeatReservation";
import NewTable from "../tables/NewTable";
import useQuery from "../utils/useQuery"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");
  
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>

      <Route path="/reservations/new">
        <NewReservation />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>

      <Route path="/reservations/:reservation_id/edit">
         <EditReservation />
      </Route>

      <Route path="/tables/new">
          <NewTable />
      </Route>

      <Route path="/search">
        <SearchReservation />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
