import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { FC } from "react";
import DashboardLayout from "../layout/dashboard";
import PrivateRoute from "./PrivateRoutes";

const AppRoutes: FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="/home" element={<Home />} />
            </Route>
        </Routes>
    </BrowserRouter>
)

export default AppRoutes