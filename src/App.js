// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import Navbar from "./Navbar";
// import HomePage from "./HomePage";
// import Register from "./Register";
// import Login from "./Login";

// function App() {
//   return (
//     <div className="App">
//       <Login />
//       {/* <Register /> */}
//       {/* <Navbar />
//       <HomePage /> */}
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
