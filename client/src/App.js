// client/src/App.js
import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import { SettingsProvider } from './context/SettingsContext';
import SettingsPage from "./Components/Settings/SettingsPage";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <SettingsProvider>
      <div>
        {currentPage === "login" && (
          <LoginPage
            goToRegister={() => setCurrentPage("register")}
            goToHome={() => setCurrentPage("home")}
          />
        )}

        {currentPage === "register" && (
          <RegisterPage
            goToLogin={() => setCurrentPage("login")}
            goToHome={() => setCurrentPage("home")}
          />
        )}

        {currentPage === "home" && (
          <HomePage setCurrentPage={setCurrentPage} />
        )}

        {/* ✅ Show settings page at bottom or create separate navigation */}
       
      </div>
    </SettingsProvider>
  );
}

export default App;
