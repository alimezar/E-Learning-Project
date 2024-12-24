'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  _id: string;
  title: string;
  description: string;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  progress: number; // progress as percentage
  averageScore: number; // average score
}

export default function InstructorProgressPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [completedStudents, setCompletedStudents] = useState<number>(0);
  const [averageCompletedPercentage, setAverageCompletedPercentage] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    // Fetch courses
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
    // Fetch student progress
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

        // Calculate total and completed student counts
        setTotalStudents(filteredProgress.length);
        setCompletedStudents(
          filteredProgress.filter((progress: any) => progress.completedPercentage === 100).length
        );

        // Calculate average completion percentage
        const totalPercentage = filteredProgress.reduce(
          (sum: number, progress: any) => sum + progress.completedPercentage,
          0
        );
        const averagePercentage = filteredProgress.length > 0
          ? totalPercentage / filteredProgress.length
          : 0;
        setAverageCompletedPercentage(averagePercentage);

        // Fetch user names and attach them to the progress data
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
                averageScore: progress.averageScore || 0,
              };
            } catch (err) {
              console.error('Error fetching user data:', err);
              return {
                studentId: progress.userId,
                studentName: 'Unknown',
                progress: progress.completedPercentage || 0,
                averageScore: progress.averageScore || 0,
              };
            }
          })
        );

        setStudentProgress(progressWithNames);

        // Set the title of the selected course
        const selectedCourse = courses.find((course) => course._id === selectedCourseId);
        setSelectedCourseTitle(selectedCourse?.title || null);
      } catch (err) {
        console.error('Error fetching student progress:', err);
        setError('An error occurred while fetching student progress.');
      }
    }

    fetchStudentProgress();
  }, [selectedCourseId, courses]);

  const handleViewCourseDetails = () => {
    if (selectedCourseId) {
      router.push(`/progress/instructor/courses?courseId=${selectedCourseId}`);
    } else {
      alert('Please select a course first.');
    }
  };

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

      {selectedCourseId && (
        <button
          onClick={handleViewCourseDetails}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#FFF',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View Course Details
        </button>
      )}

      {selectedCourseId && (
        <div style={{ marginBottom: '20px' }}>
          <p>Total Students: {totalStudents}</p>
          <p>Completed Students: {completedStudents}</p>
          <p>Average Completion Percentage: {averageCompletedPercentage.toFixed(2)}%</p>
        </div>
      )}

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
              <th
                style={{
                  borderBottom: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Average Score
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
                <td
                  style={{
                    borderBottom: '1px solid #ddd',
                    padding: '8px',
                  }}
                >
                  {progress.averageScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedCourseId && studentProgress.length === 0 && (
        <p>No student progress data available for this course.</p>
      )}
      <button
  onClick={() => window.print()}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  }}
>
  Download Analytics
</button>
    </div>
  );
}
