"use client";

import React from "react";
import { Provider } from "react-redux";
import Dashboard from "./components/Dashboard";
import store from './store/store';

import "./styles/index.scss";

export default function App() {

  return (
    <Provider store={store}>
        <Dashboard />
    </Provider>
  );
}
