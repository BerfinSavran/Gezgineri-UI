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
import { AuthProvider, useAuth } from './context/authContext';
import AddPlacePage from './pages/addPlace';
import ApprovalPlacesPage from './pages/approvalPlaces';
import ApprovalToursPage from './pages/approvalTours';
import AddTourPage from './pages/addTour';
import TourDetailsPage from './pages/tourDetails';
import Sidebar from './components/sideBar';
import AdminDashboard from './pages/adminDashboard';
import { Box } from '@mui/material';
import Categories from './pages/categories';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ToastContainer /> 
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const hideNavPaths = ["/", "/register"];

  return (
    <div className="App">
      {user?.role === 0 && !hideNavPaths.includes(location.pathname) && <Sidebar />}

      <Box sx={{ marginLeft: user?.role === 0 && !hideNavPaths.includes(location.pathname) ? '150px' : '0px', width: '100%' }}>
        {(user?.role !== 0 && !hideNavPaths.includes(location.pathname)) && <NavBar />}

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tour/id/:id" element={<TourPage />} />
          <Route path="/myTravel" element={<MyTravelPage />} />
          <Route path="/travel/:id" element={<TravelPage />} />
          <Route path='/addPlace' element={<AddPlacePage />} />
          <Route path='/addTour' element={<AddTourPage />} />
          <Route path="/tourDetails/:id" element={<TourDetailsPage />} />
          <Route path='/approvalPlaces' element={<ApprovalPlacesPage />} />
          <Route path='/approvalTours' element={<ApprovalToursPage />} />
          <Route path='/adminDashboard' element={<AdminDashboard />} />
          <Route path='/categories' element={<Categories />} />

        </Routes>
      </Box>
    </div>
  );
}

export default App;
