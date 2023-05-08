"use client";

import React from "react";
import { Provider } from "react-redux";
import Dashboard from "./components/Dashboard";
import store from './store/store';

export default function App() {

  return (
    <Provider store={store}>
        <Dashboard />
    </Provider>
  );
}
