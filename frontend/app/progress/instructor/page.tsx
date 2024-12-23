'use client';

import React, { useState, useEffect } from 'react';

interface Course {
  _id: string;
  title: string;
  description: string;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  progress: number; // progress as percentage
}

export default function InstructorProgressPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is authenticated
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

    if (!userCookie) {
      setError('User is not authenticated. Please log in.');
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      if (userData.role !== 'instructor') {
        setError('Access restricted to instructors only.');
        return;
      }

      setUserId(userData.id);
    } catch (err) {
      console.error('Failed to parse user cookie:', err);
      setError('An error occurred while validating user authentication.');
    }
  }, []);

  useEffect(() => {
    // Fetch all courses
    async function fetchCourses() {
      try {
        const response = await fetch('http://localhost:3001/courses', {
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setCourses(data);
        } else {
          setError(data.message || 'Failed to fetch courses.');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('An error occurred while fetching courses.');
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    // Fetch all progress and filter by selected course, then fetch user names
    async function fetchStudentProgress() {
      if (!selectedCourseId) return;

      try {
        const response = await fetch(`http://localhost:3001/progress/all`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student progress.');
        }

        const data = await response.json();

        // Filter progress for the selected course
        const filteredProgress = data.filter(
          (progress: any) => progress.courseId === selectedCourseId
        );

        // Fetch user names for each student
        const progressWithNames = await Promise.all(
          filteredProgress.map(async (progress: any) => {
            try {
              const userResponse = await fetch(
                `http://localhost:3001/users/${progress.userId}`,
                {
                  method: 'GET',
                  credentials: 'include',
                }
              );

              if (!userResponse.ok) {
                throw new Error('Failed to fetch user data.');
              }

              const userData = await userResponse.json();

              return {
                studentId: progress.userId,
                studentName: userData.name || 'Unknown',
                progress: progress.completedPercentage || 0,
              };
            } catch (err) {
              console.error('Error fetching user data:', err);
              return {
                studentId: progress.userId,
                studentName: 'Unknown',
                progress: progress.completedPercentage || 0,
              };
            }
          })
        );

        setStudentProgress(progressWithNames);
      } catch (err) {
        console.error('Error fetching student progress:', err);
        setError('An error occurred while fetching student progress.');
      }
    }

    fetchStudentProgress();
  }, [selectedCourseId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Instructor Progress Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="course-select" style={{ marginRight: '10px' }}>
          Select a course:
        </label>
        <select
          id="course-select"
          value={selectedCourseId || ''}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="" disabled>
            -- Select a Course --
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourseId && studentProgress.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Student Name
              </th>
              <th
                style={{
                  borderBottom: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Progress (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {studentProgress.map((progress) => (
              <tr key={progress.studentId}>
                <td
                  style={{
                    borderBottom: '1px solid #ddd',
                    padding: '8px',
                  }}
                >
                  {progress.studentName}
                </td>
                <td
                  style={{
                    borderBottom: '1px solid #ddd',
                    padding: '8px',
                  }}
                >
                  {progress.progress}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedCourseId && studentProgress.length === 0 && (
        <p>No student progress data available for this course.</p>
      )}
    </div>
  );
}
