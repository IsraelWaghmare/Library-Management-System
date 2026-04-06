import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Borrows from "./pages/Borrows";
import "./App.css";

const PAGES = { dashboard: Dashboard, books: Books, members: Members, borrows: Borrows };

function App() {
  const [page, setPage] = useState("dashboard");
  const Page = PAGES[page];

  return (
    <div className="app-layout">
      <Sidebar active={page} onChange={setPage} />
      <main className="app-content">
        <Page />
      </main>
    </div>
  );
}

export default App;
