'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // For extracting courseId from query params

interface Module {
  _id: string;
  title: string;
  description: string;
  resources: string[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  modules: string[]; // Array of module IDs
}

interface Progress {
  userId: string;
  courseId: string;
  completedPercentage: number;
  completedCourses: string[];
  last_accessed: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other user fields if needed
}

export default function CourseModulesPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [progressRecords, setProgressRecords] = useState<Progress[]>([]);
  const [studentsCompleted, setStudentsCompleted] = useState<User[]>([]);
  const [studentsNotCompleted, setStudentsNotCompleted] = useState<User[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [notCompletedCount, setNotCompletedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Extract courseId from query parameters
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  useEffect(() => {
    // Fetch course details including module IDs
    async function fetchCourse() {
      try {
        const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course details.');
        }

        const courseData = await response.json();
        setCourse(courseData);

        // Fetch module details for each module ID
        const fetchedModules = await Promise.all(
          courseData.modules.map(async (moduleId: string) => {
            const moduleResponse = await fetch(`http://localhost:3001/modules/${moduleId}`, {
              method: 'GET',
              credentials: 'include',
            });

            if (!moduleResponse.ok) {
              throw new Error(`Failed to fetch module with ID ${moduleId}.`);
            }

            return await moduleResponse.json();
          })
        );

        setModules(fetchedModules);
      } catch (err) {
        console.error('Error fetching course or modules:', err);
        setError('An error occurred while fetching data.');
      }
    }

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Fetch all progress records
  useEffect(() => {
    async function fetchProgressRecords() {
      try {
        const response = await fetch(`http://localhost:3001/progress/all`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch progress records.');
        }

        const progressData = await response.json();
        setProgressRecords(progressData);
      } catch (err) {
        console.error('Error fetching progress records:', err);
        setError('An error occurred while fetching progress data.');
      }
    }

    fetchProgressRecords();
  }, []);

  // Fetch user details by ID
  async function fetchUserDetails(userId: string): Promise<User> {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user details for ID ${userId}.`);
      }

      return await response.json();
    } catch (err) {
      console.error(`Error fetching user details for ID ${userId}:`, err);
      throw err;
    }
  }

  // Handle module selection and filter students
  const handleModuleSelection = async (moduleId: string) => {
    const selected = modules.find((module) => module._id === moduleId) || null;
    setSelectedModule(selected);

    if (selected) {
      // Filter progress records by courseId
      const filteredProgress = progressRecords.filter(
        (progress) => progress.courseId === courseId
      );

      // Separate students into completed and not completed
      const completed = filteredProgress.filter((progress) =>
        progress.completedCourses.includes(selected._id)
      );
      const notCompleted = filteredProgress.filter(
        (progress) => !progress.completedCourses.includes(selected._id)
      );

      // Fetch user details for completed and not completed students
      const completedUsers = await Promise.all(
        completed.map((progress) => fetchUserDetails(progress.userId))
      );
      const notCompletedUsers = await Promise.all(
        notCompleted.map((progress) => fetchUserDetails(progress.userId))
      );

      setStudentsCompleted(completedUsers);
      setStudentsNotCompleted(notCompletedUsers);

      // Update counts
      setTotalStudents(filteredProgress.length); // Total students who took the course
      setNotCompletedCount(notCompleted.length); // Students who didn't complete the module
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Display Course Title */}
      {course ? (
        <h1>Course: {course.title}</h1>
      ) : (
        <p>Loading course details...</p>
      )}

      {/* Module Dropdown */}
      {modules.length > 0 ? (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="module-select" style={{ marginRight: '10px' }}>
            Select a Module:
          </label>
          <select
            id="module-select"
            value={selectedModuleId || ''}
            onChange={(e) => {
              const moduleId = e.target.value;
              setSelectedModuleId(moduleId);
              handleModuleSelection(moduleId);
            }}
          >
            <option value="" disabled>
              -- Select a Module --
            </option>
            {modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>Loading modules...</p>
      )}

      {/* Selected Module Details */}
      {selectedModule && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h3>Selected Module: {selectedModule.title}</h3>
          <p>{selectedModule.description}</p>
          <p>Total Students: {totalStudents}</p>
          <p>Students Who Didn't Finish This Module: {notCompletedCount}</p>
        </div>
      )}

      {/* Students Who Completed the Module */}
      {studentsCompleted.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h3>Students Who Completed This Module</h3>
          <ul>
            {studentsCompleted.map((user) => (
              <li key={user._id}>Name: {user.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Students Who Haven't Completed the Module */}
      {studentsNotCompleted.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h3>Students Who Haven't Completed This Module</h3>
          <ul>
            {studentsNotCompleted.map((user) => (
              <li key={user._id}>Name: {user.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
