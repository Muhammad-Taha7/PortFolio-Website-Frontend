import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Dashboard } from './Dashboard/Dashboard.jsx';
import { Signinform } from './Dashboard/Components/Signinform';
import { loginSuccess, logout } from './Dashboard/Store/Slices/authSlice.js';
import { Projects } from './Website/Pages/Projects.jsx';
import { About } from './Website/Pages/About.jsx';
import { Blogs } from './Website/Pages/Blogs.jsx';
import { Testimonials } from './Website/Pages/Testimonials.jsx';
import { Home } from './Website/Pages/Home.jsx';
import { Contact } from './Website/Pages/Contact.jsx';
import { NotFound } from './Website/Error/notFound.jsx';


import IntroAnimation from './Website/Components/IntroAnimation.jsx';
import { WebsiteNavbar } from './Website/Components/WebsiteNavbar.jsx';
import { WebsiteFooter } from './Website/Components/WebsiteFooter.jsx';
import { ProjectDetails } from './Website/Pages/ProjectDetails.jsx';

const WebsiteLayout = () => {
  return (
    <IntroAnimation>
      <div className=" ">
        <WebsiteNavbar />
        <main className="">
          <Outlet /> 
        </main>
        <WebsiteFooter />
      </div>
    </IntroAnimation>
  );
};

export const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loginSuccess(token));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Portfolio Website - Inn sab pages par Navbar/Footer show hoga */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/Testimonials" element={<Testimonials />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Route>

      {/* Sign In Route - No Navbar/Footer */}
      <Route 
        path="/signin" 
        element={isAuthenticated ? <Navigate to="/run/Dashboard" replace /> : <Signinform />} 
      />

      {/* Dashboard Protected Route - No Navbar/Footer */}
      <Route 
        path="/run/Dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />} 
      />

      {/* Catch all (404 Page) - No Navbar/Footer */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
