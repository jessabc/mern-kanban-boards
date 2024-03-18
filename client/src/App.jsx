import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useAuthContext from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();

  return (
    //sticky header credit to https://dev.to/cryptic022/sticky-header-and-footer-with-tailwind-2oik
    <div className="flex flex-col h-screen ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={user ? <Home /> : <Navigate to="login" />} />
            <Route
              path="login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
