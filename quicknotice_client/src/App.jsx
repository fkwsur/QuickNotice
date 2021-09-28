import React from "react";
import { Route, withRouter } from "react-router-dom";
import Router from "./views";
import './App.css';

const App = () => {
  return (
    <>
      <Route exact path="/" component={Router.Login} />
      <Route path="/signup" component={Router.SignUp} />
      <Route path="/findid" component={Router.FindId} />
      <Route path="/found_id" component={Router.FoundId} />
      <Route path="/findpw" component={Router.FindPw} />
      <Route path="/password_reset" component={Router.ResetPw} />
      <Route path="/main" component={Router.Main} />
    </>
  );
};

export default withRouter(App);
