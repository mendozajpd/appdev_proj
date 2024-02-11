
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

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;