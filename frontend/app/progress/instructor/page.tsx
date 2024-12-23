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

const InstructorProgressPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  const instructorId = "YOUR_INSTRUCTOR_ID"; // Replace this with dynamic logic to fetch the instructor ID from the user's session or cookies.

  useEffect(() => {
    // Fetch courses taught by the instructor
    async function fetchCourses() {
      try {
        const response = await fetch(`http://localhost:3001/courses/taught?instructorId=${instructorId}`, {
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
  }, [instructorId]);

  useEffect(() => {
    // Fetch student progress for the selected course
    if (!selectedCourseId) return;

    async function fetchStudentProgress() {
      try {
        const response = await fetch(
          `http://localhost:3001/courses/${selectedCourseId}/students`,
          { credentials: 'include' }
        );
        const data = await response.json();

        if (response.ok) {
          setStudentProgress(data.map((student: any) => ({
            studentId: student._id,
            studentName: student.name,
            progress: Math.floor(Math.random() * 101), // Replace this with actual progress when available
          })));
        } else {
          setError(data.message || 'Failed to fetch student progress.');
        }
      } catch (err) {
        console.error('Error fetching student progress:', err);
        setError('An error occurred while fetching student progress.');
      }
    }

    fetchStudentProgress();
  }, [selectedCourseId]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Instructor Dashboard - Student Progress</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                Student Name
              </th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                Progress (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {studentProgress.map((progress) => (
              <tr key={progress.studentId}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{progress.studentName}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{progress.progress}%</td>
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
};

export default InstructorProgressPage;
