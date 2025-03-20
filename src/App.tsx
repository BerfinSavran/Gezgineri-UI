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
import AddPlacePage from './pages/addPlace';
import ApprovalPlacesPage from './pages/approvalPlaces';
import AddTourPage from './pages/addTour';
import TourDetailsPage from './pages/tourDetails';


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
        <Route path="/place/:id" element={<PlacePage/>}/>
        <Route path="/tours" element={<ToursPage/>}/>
        <Route path="/tour/id/:id" element={<TourPage/>}/>
        <Route path="/myTravel" element={<MyTravelPage/>}/>
        <Route path="/travel/:id" element={<TravelPage/>}/>
        <Route path='/addPlace' element={<AddPlacePage/>}/>
        <Route path='/addTour' element={<AddTourPage/>}/>
        <Route path="/tourDetails/:id" element={<TourDetailsPage/>}/>
        <Route path='/approvalPlaces' element={<ApprovalPlacesPage/>}/>

      </Routes>
    </div>
  );
}

export default App;
