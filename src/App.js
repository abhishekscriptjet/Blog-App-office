import "./App.css";
import Navebar from "./components/Navebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import Userdetails from "./components/Userdetails";
import OtherProfile from "./components/OtherProfile";
import ContextBlog from "./contextAPI/ContextBlog";

function App() {
  return (
    <div>
      <Router>
        <ContextBlog>
          <div className="fixed-top">
            <Navebar />
            <Alert />
          </div>
          <div className="" style={{ marginTop: "65px", marginBottom: "0px" }}>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/userdetails" element={<Userdetails />} />
              <Route exact path="/clickuser" element={<OtherProfile />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </div>
          <div className="" style={{}}>
            <Footer />
          </div>
        </ContextBlog>
      </Router>
    </div>
  );
}

export default App;
