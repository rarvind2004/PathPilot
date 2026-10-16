'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

import HomePage from '@/components/HomePage';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import Dashboard from '@/components/Dashboard';
import NewTrip from '@/components/NewTrip';
import TripDetail from '@/components/TripDetail';

const TripPlanner = () => {
  const [currentView, setCurrentView] = useState('homepage');
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [newTripForm, setNewTripForm] = useState({ title: '', country: '', days: 1 });
  const [tripDetails, setTripDetails] = useState({ days: [] });

  // Auth Handlers
const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUser(data.user);
      setCurrentView('dashboard');
      fetchTrips(data.user.email);
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
  }
};

const handleSignup = async () => {
  if (!signupForm.email || !signupForm.username || !signupForm.password) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupForm)
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUser(data.user);
      setCurrentView('dashboard');
      setTrips([]);
    } else {
      alert(data.error || 'Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed');
  }
};

  const handleLogout = async () => {
    if (user && user.email) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          });
        } catch (error) {
          console.error('Failed to log logout:', error);
        }
      }
    
    setUser(null);
    setCurrentView('homepage');
  };

  // Fetch trips from database
  const fetchTrips = async (email) => {
    try {
      const response = await fetch(`/api/trips/list?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.trips) {
        setTrips(data.trips);
      }
    } catch (error) {
      console.error('Fetch trips error:', error);
    }
  };

  // Create new trip
  const handleCreateTrip = async () => {
    if (!newTripForm.title || !newTripForm.country) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/trips/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          title: newTripForm.title,
          country: newTripForm.country,
          days: parseInt(newTripForm.days)
        })
      });

      const data = await response.json();

      if (data.success) {
        // Reload trips and navigate to the new trip
        await fetchTrips(user.email);
        await handleViewTripById(data.tripId);
        setNewTripForm({ title: '', country: '', days: 1 });
      } else {
        alert(data.error || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Create trip error:', error);
      alert('Failed to create trip');
    }
  };

  // Delete trip
  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      const response = await fetch(`/api/trips/delete?tripId=${tripId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await fetchTrips(user.email);
        if (selectedTrip?.trip_id === tripId) {
          setCurrentView('dashboard');
        }
      } else {
        alert(data.error || 'Failed to delete trip');
      }
    } catch (error) {
      console.error('Delete trip error:', error);
      alert('Failed to delete trip');
    }
  };

  // View trip details
  const handleViewTrip = async (trip) => {
    try {
      const response = await fetch(`/api/trips/detail?tripId=${trip.trip_id}`);
      const data = await response.json();

      if (data.tripDetails) {
        setTripDetails(data.tripDetails);
        setSelectedTrip(trip);
        setCurrentView('tripDetail');
      } else {
        alert(data.error || 'Failed to load trip details');
      }
    } catch (error) {
      console.error('View trip error:', error);
      alert('Failed to load trip details');
    }
  };

  // Helper to view trip by ID
  const handleViewTripById = async (tripId) => {
    try {
      const response = await fetch(`/api/trips/detail?tripId=${tripId}`);
      const data = await response.json();

      if (data.tripDetails) {
        setTripDetails(data.tripDetails);
        setSelectedTrip(data.tripDetails);
        setCurrentView('tripDetail');
      }
    } catch (error) {
      console.error('View trip error:', error);
    }
  };

 const addItineraryItem = async (dayNumber, activityType = "custom", activityId = null) => {
  try {
    const response = await fetch('/api/itinerary/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId: tripDetails.trip_id,
        dayNumber: dayNumber,
        activityType: activityType,
        activityId: activityId
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.error || "Failed to add activity");
      return null;
    }

    // Refresh trip details so UI updates
    await handleViewTripById(tripDetails.trip_id);

    // RETURN THE itemId so TripDetail can use it
    return data.itemId;

  } catch (error) {
    console.error("Add item error:", error);
    alert("Failed to add activity");
    return null;
  }
};


  // Update itinerary item
  const updateItineraryItem = async (dayNumber, itemId, updates) => {
    try {
      const response = await fetch('/api/itinerary/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: itemId,
          dayNumber: dayNumber,
          tripId: tripDetails.trip_id,
          updates: updates,
          userEmail: user.email  // Add this line
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        await handleViewTripById(tripDetails.trip_id);
      } else {
        console.error('Update failed:', data.error);
      }
      
      return data.success;
    } catch (error) {
      console.error('Update item error:', error);
      return false;
    }
  };
  

  // Delete itinerary item
  const deleteItineraryItem = async (dayNumber, itemId) => {
    try {
      const response = await fetch(
        `/api/itinerary/delete?itemId=${itemId}&dayNumber=${dayNumber}&tripId=${tripDetails.trip_id}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        // Update local state
        const updatedDays = tripDetails.days.map((day) => {
          if (day.number === dayNumber) {
            return { ...day, items: day.items.filter((item) => item.item_id !== itemId) };
          }
          return day;
        });
        setTripDetails({ ...tripDetails, days: updatedDays });
      } else {
        alert(data.error || 'Failed to delete activity');
      }
    } catch (error) {
      console.error('Delete item error:', error);
      alert('Failed to delete activity');
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // View Switcher
  if (currentView === 'homepage') {
    return <HomePage setCurrentView={setCurrentView} />;
  }

  if (currentView === 'login') {
    return (
      <Login
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        setCurrentView={setCurrentView}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <Signup
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        handleSignup={handleSignup}
        setCurrentView={setCurrentView}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredTrips={filteredTrips}
        handleDeleteTrip={handleDeleteTrip}
        handleViewTrip={handleViewTrip}
        handleLogout={handleLogout}
        setCurrentView={setCurrentView}
      />
    );
  }

  if (currentView === 'newTrip') {
    return (
      <NewTrip
        newTripForm={newTripForm}
        setNewTripForm={setNewTripForm}
        handleCreateTrip={handleCreateTrip}
        setCurrentView={setCurrentView}
      />
    );
  }

  if (currentView === 'tripDetail') {
    return (
      <TripDetail
        tripDetails={tripDetails}
        addItineraryItem={addItineraryItem}
        updateItineraryItem={updateItineraryItem}
        deleteItineraryItem={deleteItineraryItem}
        setCurrentView={(view) => {
          // Refresh trip stats so the dashboard reflects itinerary changes
          if (view === 'dashboard') fetchTrips(user.email);
          setCurrentView(view);
        }}
      />
    );
  }

  return null;
};

export default TripPlanner;