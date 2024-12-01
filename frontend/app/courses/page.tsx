'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';


export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    // Fetch all courses from the backend API
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses...');
        const response = await fetch('http://localhost:3001/courses');
        const data = await response.json();

        if (response.ok) {
          console.log('Courses fetched successfully:', data);
          setCourses(data); // No filtering by availability here
          setFilteredCourses(data);
        } else {
          console.error('Error fetching courses:', data.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log('Search term:', value);

    // Filter courses by title or instructor
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(value.toLowerCase()) ||
        course.createdBy.toLowerCase().includes(value.toLowerCase())
    );

    console.log('Filtered courses:', filtered);
    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId: string) => {
    console.log('Attempting to enroll in course with ID:', courseId);

    // Extract the 'user' cookie
    const cookies = document.cookie.split('; ');
    console.log('Cookies:', cookies);

    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));
    if (!userCookie) {
      console.log('User cookie not found');
      setConfirmationMessage('Please log in to enroll in courses.');
      return;
    }

    console.log('User cookie found:', userCookie);

    try {
      // Parse the user cookie to get the user ID
      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      console.log('Parsed user data:', userData);

      const userId = userData.id;
      if (!userId) {
        console.log('Invalid user ID:', userId);
        setConfirmationMessage('Invalid user information.');
        return;
      }

      console.log('User ID:', userId);

      // Send enrollment request to the backend
      const response = await fetch(`http://localhost:3001/users/${userId}/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId })
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (response.ok) {
        setEnrolledCourses([...enrolledCourses, courseId]);
        setConfirmationMessage(result.message || 'Successfully enrolled in the course!');
      } else {
        setConfirmationMessage(result.message || 'Failed to enroll in the course.');
      }
    } catch (error) {
      console.error('Failed to parse user cookie or enroll in course:', error);
      setConfirmationMessage('An error occurred while processing your enrollment.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Available Courses</h1>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search courses by topic or instructor"
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {/* Display confirmation message */}
      {confirmationMessage && <div style={styles.confirmation}>{confirmationMessage}</div>}

      {/* Courses Grid */}
      <div style={styles.courseGrid}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} style={styles.courseCard}>
              <h3 style={styles.courseTitle}>{course.title}</h3>
              <p style={styles.courseInstructor}>Instructor: {course.createdBy}</p>
              <p style={styles.courseDescription}>{course.description}</p>
              <button
                style={styles.enrollButton}
                onClick={() => {
                  console.log('Clicked enroll button for course ID:', course._id);
                  handleEnroll(course._id);
                }}
              >
                {enrolledCourses.includes(course._id) ? 'Already Enrolled' : 'Enroll'}
              </button>
            </div>
          ))
        ) : (
          <p>No courses found</p>
        )}
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  searchContainer: {
    marginBottom: '2rem',
  },
  searchInput: {
    padding: '0.8rem',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '600px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  confirmation: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  courseCard: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  },
  courseTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  courseInstructor: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#555',
  },
  courseDescription: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1.5rem',
  },
  enrollButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4c9aff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
