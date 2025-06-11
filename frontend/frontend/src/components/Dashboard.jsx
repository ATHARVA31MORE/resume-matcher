import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const API_BASE_URL = "http://localhost:8000";

function Dashboard() {
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertUpdated, setAlertUpdated] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    preference: 'top'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [testingStatus, setTestingStatus] = useState({
    isLoading: false,
    message: '',
    isError: false,
    isSuccess: false
  });

  useEffect(() => {
  const loadUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("⚠️ No user logged in");
      return setLoading(false);
    }

    // 🔍 Debug log to trace what's being sent
    console.log("📦 Logged-in user UID:", user.uid);
    console.log("📦 Logged-in user Email:", user.email);

    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setSavedSearches(userData.savedSearches || []);
      setAlertSettings({
        enabled: userData.emailAlertsEnabled || false,
        frequency: userData.alertFrequency || 'weekly',
        preference: userData.alertPreference || 'top'
      });
    } else {
      console.warn("⚠️ No user document found in Firestore");
    }

    setLoading(false);
  };

  loadUserData();
}, []);

  const handleToggleAlerts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("No user logged in");
      const newSettings = { ...alertSettings, enabled: !alertSettings.enabled };
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        emailAlertsEnabled: newSettings.enabled,
        alertFrequency: newSettings.frequency,
        alertPreference: newSettings.preference
      });
      setAlertSettings(newSettings);
      setAlertUpdated(true);
      setTimeout(() => setAlertUpdated(false), 3000);
    } catch (err) {
      console.error("Error updating alert preferences:", err);
      alert("Failed to update alert preferences.");
    }
  };

  const handleUpdateAlertSettings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("No user logged in");
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        emailAlertsEnabled: alertSettings.enabled,
        alertFrequency: alertSettings.frequency,
        alertPreference: alertSettings.preference
      });
      setAlertUpdated(true);
      setShowSettings(false);
      setTimeout(() => setAlertUpdated(false), 3000);
    } catch (err) {
      console.error("Error updating alert preferences:", err);
      alert("Failed to update alert preferences.");
    }
  };

  const handleTestJobAlert = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("No user logged in");
    return;
  }

  try {
    setTestingStatus({
      isLoading: true,
      message: 'Sending test job alert email...',
      isError: false,
      isSuccess: false
    });

    // Get Firebase ID token for authentication
    const idToken = await user.getIdToken();

    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, { email: user.email });  // initialize doc with email
    } else if (!docSnap.data().email) {
      await updateDoc(userRef, { email: user.email });  // ensure email field exists
    }

    const response = await fetch(`${API_BASE_URL}/test-send-job-alert/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}` // Add the Firebase auth token
      },
      body: JSON.stringify({
        user_id: user.uid,
        email: user.email
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'Unknown backend error');
    }

    setTestingStatus({
      isLoading: false,
      message: `✅ Test email sent! (${data.matches_count || 0} matches)`,
      isError: false,
      isSuccess: true
    });

  } catch (err) {
    console.error("Test email error:", err);
    
    // Handle specific authentication errors
    let errorMessage = err.message;
    if (err.message.includes("Missing Authorization header") || 
        err.message.includes("Invalid or expired")) {
      errorMessage = "Authentication failed. Please refresh the page and try again.";
    }
    
    setTestingStatus({
      isLoading: false,
      message: `❌ Failed: ${errorMessage}`,
      isError: true,
      isSuccess: false
    });
  }

  setTimeout(() => {
    setTestingStatus({
      isLoading: false,
      message: '',
      isError: false,
      isSuccess: false
    });
  }, 5000);
};
  
  const renderSavedSearches = () => {
  return savedSearches
  .slice(-5) // Get the last 5
  .reverse() // Show newest first
  .map((search, index) => {
    const sortedMatches = [...(search.matches || [])].sort((a, b) => b.score - a.score);

    return (
      <div key={index} className="border rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">
            Search #{savedSearches.length - index}
            <span className="text-sm text-gray-500 ml-2">
              {new Date(search.timestamp).toLocaleDateString()}
            </span>
          </h3>
        </div>

        {/* Job Matches */}
        {sortedMatches.length > 0 ? (
          <div>
            <h4 className="font-medium mb-2">Top Job Matches:</h4>
            <div className="space-y-3">
              {sortedMatches.slice(0, 3).map((job, jobIndex) => (
                <div key={jobIndex} className="bg-white p-3 rounded border">
                  <div className="flex justify-between">
                    <h5 className="font-medium">{job.title}</h5>
                    <span className="text-green-600 font-medium">
                      {(job.score * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
            {sortedMatches.length > 3 && (
              <p className="text-sm text-gray-500 mt-2">
                + {sortedMatches.length - 3} more matches
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No job matches for this search.</p>
        )}

        {/* Skills */}
        {search.skills && search.skills.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Detected Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {search.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume Scores */}
        {search.scores && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Resume Section Scores:</h4>
            <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
              {Object.entries(search.scores).map(([section, value], i) => (
                <li key={i}>
                  <strong className="capitalize">{section}</strong>: {value}/5
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {search.suggestions && search.suggestions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2 text-red-600">Improvement Suggestions:</h4>
            <ul className="list-disc text-sm ml-5 text-gray-800 space-y-1">
              {search.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  });
};


  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Job Alert Settings Card */}
          <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Job Alert Emails</h2>
                <p className="text-gray-600 mt-1">
                  {alertSettings.enabled 
                    ? `You'll receive ${alertSettings.frequency} emails with ${alertSettings.preference === 'top' ? 'your top' : 'all'} job matches.` 
                    : 'Job alert emails are currently disabled.'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertSettings.enabled}
                    onChange={handleToggleAlerts}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            {alertUpdated && (
              <div className="mt-3 text-sm text-green-600">
                Alert settings updated successfully!
              </div>
            )}
            
            {showSettings && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={alertSettings.frequency}
                      onChange={(e) => setAlertSettings({...alertSettings, frequency: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Matches
                    </label>
                    <select
                      value={alertSettings.preference}
                      onChange={(e) => setAlertSettings({...alertSettings, preference: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="top">Send only top match</option>
                      <option value="all">Send all matches</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={handleUpdateAlertSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                  
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Test Alert Button */}
            {alertSettings.enabled && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Test Email Alerts</h3>
                    <p className="text-xs text-gray-500">
                      Send yourself a test email with job matches
                    </p>
                  </div>
                  
                  <button
                    onClick={handleTestJobAlert}
                    disabled={testingStatus.isLoading}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    {testingStatus.isLoading ? 'Sending...' : 'Send Test Email'}
                  </button>
                </div>
                
                {testingStatus.message && (
                  <div className={`mt-2 text-sm ${testingStatus.isError ? 'text-red-600' : testingStatus.isSuccess ? 'text-green-600' : 'text-gray-600'}`}>
                    {testingStatus.message}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Saved Searches Section */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Resume Searches</h2>
            
            <div className="space-y-4">
              {renderSavedSearches()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;