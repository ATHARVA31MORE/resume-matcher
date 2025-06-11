import React, { useState } from 'react';
import axios from 'axios';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { FileText, Upload, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import your enhanced resume builder
 // Assuming you save the modal as a separate component

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [linkedinJobs, setLinkedinJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [liveJobs, setLiveJobs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [showLinkedinSection, setShowLinkedinSection] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setErrorMessage('');
    setShowLinkedinSection(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const user = getAuth().currentUser;
      const token = user ? await user.getIdToken() : null;

      const res = await axios.post('http://127.0.0.1:8000/upload-resume/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (res.data.error) {
        console.error('Backend error:', res.data.error);
        setErrorMessage(res.data.error);
        setMatches([]);
        setLinkedinJobs([]);
        setSuggestions([]);
        setExtractedSkills([]);
      } else if (Array.isArray(res.data.matches)) {
        setMatches(res.data.matches);
        setLinkedinJobs(res.data.linkedin_jobs || []);
        setSuggestions(res.data.suggestions || []);
        setExtractedSkills(res.data.skills || []);
        setShowLinkedinSection(true);
        await saveSearch(res.data);
      } else {
        console.warn('Unexpected response format:', res.data);
        setErrorMessage('Unexpected response from server.');
        setMatches([]);
        setLinkedinJobs([]);
        setSuggestions([]);
        setExtractedSkills([]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMessage('Failed to process resume.');
      setMatches([]);
      setLinkedinJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkedinJobsManually = async () => {
    if (!extractedSkills.length) {
      alert('Please upload and analyze your resume first to extract skills.');
      return;
    }

    setLinkedinLoading(true);
    try {
      const user = getAuth().currentUser;
      const token = user ? await user.getIdToken() : null;

      const res = await axios.post('http://127.0.0.1:8000/fetch-linkedin-jobs/', {
        skills: extractedSkills,
        location: 'India'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (res.data.linkedin_jobs) {
        setLinkedinJobs(res.data.linkedin_jobs);
        setShowLinkedinSection(true);
      } else if (res.data.error) {
        setErrorMessage(res.data.error);
      }
    } catch (err) {
      console.error('LinkedIn fetch error:', err);
      setErrorMessage('Failed to fetch LinkedIn jobs.');
    } finally {
      setLinkedinLoading(false);
    }
  };

  const saveSearch = async (data) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const searchData = {
      timestamp: new Date().toISOString(),
      matches: data.matches || [],
      linkedin_jobs: data.linkedin_jobs || [],
      suggestions: data.suggestions || [],
      scores: data.scores || {},
      skills: data.skills || []
    };

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        savedSearches: [searchData],
        emailAlertsEnabled: false,
        alertFrequency: 'weekly',
        alertPreference: 'top'
      });
    } else {
      await updateDoc(userRef, {
        savedSearches: arrayUnion(searchData)
      });
    }
  };

  const fetchLiveJobs = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/fetch-jobs/');
      if (Array.isArray(res.data.jobs)) {
        setLiveJobs(res.data.jobs);
      } else {
        console.warn('No jobs found or bad response format.');
        setLiveJobs([]);
      }
    } catch (err) {
      console.error('Failed to fetch live jobs:', err);
      alert('Failed to fetch live jobs.');
      setLiveJobs([]);
    }
  };

  const getSkillMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Upload className="mr-3 text-blue-600" size={28} />
        Resume Analysis
      </h2>

      {/* Enhanced Resume Builder Button */}
      <div className="mb-6">
  <Link
    to="/resume-builder"
    className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center space-x-3 inline-flex"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative flex items-center space-x-3">
      <div className="p-1 bg-white/20 rounded-lg">
        <FileText size={20} />
      </div>
      <span>✨ Create Professional Resume</span>
      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
        New
      </div>
    </div>
  </Link>
</div>

      {/* Upload Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Your Resume (PDF/DOCX)
          </label>
          <div className="flex items-center space-x-3">
            <label className="cursor-pointer flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-sm text-gray-600">
                  {fileName || 'Click to choose file or drag and drop'}
                </span>
              </div>
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFileName(e.target.files[0]?.name || '');
                }}
                className="sr-only"
                accept=".pdf,.doc,.docx"
              />
            </label>
            <button
              type="submit"
              disabled={!file || loading}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                !file || loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </div>
      </form>

      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Extracted Skills Section */}
      {extractedSkills.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Extracted Skills from Your Resume
          </h3>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-300 hover:bg-blue-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* LinkedIn Jobs Section */}
      {showLinkedinSection && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">💼</span>
              LinkedIn Jobs Matching Your Skills
            </h3>
            <button
              onClick={fetchLinkedinJobsManually}
              disabled={linkedinLoading}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-2 ${
                linkedinLoading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              <RefreshCw size={16} className={linkedinLoading ? 'animate-spin' : ''} />
              <span>{linkedinLoading ? 'Fetching...' : 'Refresh Jobs'}</span>
            </button>
          </div>

          {linkedinJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {linkedinJobs.map((job, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg leading-tight">{job.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillMatchColor(job.skill_match_score || 0)}`}>
                      {job.skill_match_score ? `${job.skill_match_score.toFixed(0)}% match` : 'New'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">{job.company}</p>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <span className="mr-1">📍</span>
                    {job.location}
                  </p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{job.posted_date}</span>
                    {job.job_link && (
                      <a
                        href={job.job_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        View Job →
                      </a>
                    )}
                  </div>
                  {job.matched_skill && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        🎯 Matched: {job.matched_skill}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <FileText size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">No LinkedIn jobs found for your skills yet.</p>
              <button
                onClick={fetchLinkedinJobsManually}
                disabled={linkedinLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {linkedinLoading ? 'Fetching...' : 'Fetch LinkedIn Jobs'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resume Improvement Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Resume Improvement Suggestions
          </h3>
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General Job Fetching Section */}
      <div className="mt-8">
        <button
          onClick={fetchLiveJobs}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          🔍 Fetch Live Jobs (Adzuna)
        </button>
      </div>

      {/* Adzuna Job Matches Section */}
      {matches.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Top Job Matches (Adzuna)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.map((match, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{match.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {(match.score * 100).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Jobs from Adzuna */}
      {liveJobs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔴</span>
            Live Jobs (Adzuna - Top 10)
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {liveJobs.slice(0, 10).map((job, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.description.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;