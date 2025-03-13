import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Auth from './farmer/pages/Auth';
import { AuthContext } from './shared/context/AuthContext';
import { useAuth } from './shared/hooks/auth-hook';
import Home from './shared/components/UIElements/Home';
import ApplicationDetails from './farmer/pages/ApplicationDetails';
import Applications from './farmer/pages/Applications';
import ApplicationsRecieved from './inspector/pages/ApplicationsRecieved';
import NewApplication from './farmer/pages/NewApplication';
import ViewApplicationDetails from './inspector/pages/ViewApplicationDetails';
import AcceptedApplicationsRecieved from './certifier/pages/AcceptedApplicationsRecieved';
import ViewApplicationDetailsCertifer from './certifier/pages/ViewApplicationDetailsCertifer';
import Certificate from './farmer/pages/Certificate';


function App() {
  const {role,token, login, logout, userId} = useAuth();
 

  let routes;

  if (token) {
    routes = (
      
              <Routes>
                <Route
          path="/"
          element={
            role?.trim().toLowerCase() === "inspector" ? (
              <ApplicationsRecieved />
            ) : role?.trim().toLowerCase() === "user" ? (
              <Applications />
            ) : (
              <AcceptedApplicationsRecieved />
            )
          }
          
        />
                
        <Route path="/:appId/applications" element={<ApplicationDetails/>} />
        <Route path="/places/apply" element={<NewApplication/>} />
        <Route path="/inspector/:ApplicationId/applicationDetails" element={<ViewApplicationDetails/>} />
        <Route path="/certifier/:ApplicationId/AcceptedapplicationsList" element={<ViewApplicationDetailsCertifer/>} />
        <Route path="/certificate/:id" element={<Certificate/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, role, token: token ,userId , login, logout }}>
      <Router>
        { token && <MainNavigation />}
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
