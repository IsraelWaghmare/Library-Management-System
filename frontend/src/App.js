import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Borrows from "./pages/Borrows";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
<nav style={{
  width: "220px",
  padding: "20px",
  background: "#1e293b",
  color: "white",
  minHeight: "100vh"
}}>
  <h2 style={{ marginBottom: "20px" }}>📚 LibraryOS</h2>

  <ul style={{ listStyle: "none", padding: 0 }}>
    <li><Link style={linkStyle} to="/">Dashboard</Link></li>
    <li><Link style={linkStyle} to="/books">Books</Link></li>
    <li><Link style={linkStyle} to="/members">Members</Link></li>
    <li><Link style={linkStyle} to="/borrows">Borrows</Link></li>
  </ul>
</nav>
        <div style={{ padding: "20px", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/borrows" element={<Borrows />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
