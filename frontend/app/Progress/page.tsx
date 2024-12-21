'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define the Progress type matching the backend schema
interface Progress {
  userId: string; // ObjectId of the user
  courseId: string; // ObjectId of the course
  completedPercentage: number; // Completion percentage
  completedCourses: string[]; // List of completed module IDs
  last_accessed: string; // ISO string for last accessed timestamp
  averageScore: number; // Average score for the course
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Hardcoded user and course IDs for demonstration (replace with dynamic values)
  const userId = '675f672582063256ad788226';
  const courseId = '674069bf8f189db69c17419d';

  // Fetch progress data from the backend
  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/progress?userId=${userId}&courseId=${courseId}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch progress data');
      }
      const data: Progress = await res.json();
      setProgressData(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  // Mark a module as complete
  const completeModule = async (moduleId: string) => {
    try {
      const res = await fetch('http://localhost:3001/progress/complete', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, courseId, moduleId }),
      });
      if (!res.ok) {
        throw new Error('Failed to complete module');
      }
      const updatedProgress: Progress = await res.json();
      setProgressData(updatedProgress);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Your Progress
        </h1>

        {/* Show loading message */}
        {loading && <p className="text-gray-600 text-center">Loading...</p>}

        {/* Show error message */}
        {error && (
          <p className="text-red-600 text-center">
            Failed to load progress. Please try again later.
          </p>
        )}

        {/* Display progress data */}
        {progressData && !loading && !error && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User ID:</span>
              <span className="font-semibold text-gray-800">{progressData.userId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Course ID:</span>
              <span className="font-semibold text-gray-800">{progressData.courseId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Percentage:</span>
              <span className="font-semibold text-gray-800">
                {progressData.completedPercentage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Modules:</span>
              <span className="font-semibold text-gray-800">
                {progressData.completedCourses.join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Accessed:</span>
              <span className="font-semibold text-gray-800">
                {new Date(progressData.last_accessed).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Score:</span>
              <span className="font-semibold text-gray-800">{progressData.averageScore}</span>
            </div>

            {/* Example: Button to complete a module */}
            <button
              onClick={() => completeModule('module123')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Complete Module "module123"
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
