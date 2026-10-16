import React from 'react';
import { Calendar, ListChecks, MapPin, Plus, Search, Trash2, User, LogOut } from 'lucide-react';

const Dashboard = ({
  user,
  searchQuery,
  setSearchQuery,
  filteredTrips,
  handleDeleteTrip,
  handleViewTrip,
  handleLogout,
  setCurrentView,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Travel.io</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('newTrip')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Trips</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div key={trip.trip_id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{trip.title}</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{trip.country_name}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTrip(trip.trip_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {trip.day_count} {Number(trip.day_count) === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div className="flex items-center">
                  <ListChecks className="w-4 h-4 mr-1" />
                  <span>
                    {trip.activity_count} {Number(trip.activity_count) === 1 ? 'activity' : 'activities'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleViewTrip(trip)}
                className="w-full mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No trips found. Create your first trip!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;