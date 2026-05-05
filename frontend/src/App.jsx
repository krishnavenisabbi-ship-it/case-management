import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
// temporary pages (if not created yet)
const Features = () => <h1>Features Page</h1>;
const Contact = () => <h1>Contact Page</h1>;

function App() {
  return (
   <Header />  
    <Routes>
      <Route path="/" element={<Home />} /> 
	   <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;