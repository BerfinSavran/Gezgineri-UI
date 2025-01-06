import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HomePage from './pages/home';
import NavBar from './components/navBar';
import ProfilePage from './pages/profile';
import PlacePage from './pages/place';
import ToursPage from './pages/tours';
import MyTravelPage from './pages/myTravel';
import TravelPage from './pages/travel';
import TourPage from './pages/tour';
import { AuthProvider } from './context/authContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavPaths = ["/", "/register"];

  return (
    <div className="App">
      {!hideNavPaths.includes(location.pathname) && <NavBar />}
      
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} /> 
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/place" element={<PlacePage/>}/>
        <Route path="/tours" element={<ToursPage/>}/>
        <Route path="/tour" element={<TourPage/>}/>
        <Route path="/myTravel" element={<MyTravelPage/>}/>
        <Route path="/travel" element={<TravelPage/>}/>

      </Routes>
    </div>
  );
}

export default App;
