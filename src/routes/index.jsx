import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { auth } from "../middlware/auth";
import Template from "../Template";
import User from "../pages/User";
import Menu from "../pages/Menu";
import Transaksi from "../pages/Transaksi";
import History from "../pages/History";
import HistoryDetail from "../pages/HistoryDetail";

export const router = createBrowserRouter([
  {
    children: [
      { path: "/", element: <App /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    element: <Template/>,
    loader: auth,
    children: [
        { path: "/dashboard", element: <Dashboard />},
        { path: "/user", element: < User /> },
        { path: "/menu", element: <Menu /> },
        { path:'/transaksi', element: <Transaksi /> },
        { path:"/history", element: <History /> },
        { path:"/history/:id", element: <HistoryDetail/> }
    ],
  },
]);
