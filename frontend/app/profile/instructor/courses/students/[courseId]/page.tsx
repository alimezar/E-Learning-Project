'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Student {
  _id: string;
  name: string;
  email: string;
}

export default function StudentsPage() {
  const params = useParams();
  const courseId = params?.courseId;

  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      console.error('Course ID is missing.');
      return;
    }

    async function fetchStudents() {
      try {
        const response = await fetch(`http://localhost:3001/courses/${courseId}/students`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setStudents(data);
          setFilteredStudents(data); // Initialize the filtered students with the full list
        } else {
          setError(data.message || 'Failed to fetch students.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('An error occurred while fetching students.');
      }
    }

    fetchStudents();
  }, [courseId]);

  useEffect(() => {
    // Filter students based on the search query
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Students Enrolled in This Course</h1>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.searchContainer}>
        <label htmlFor="search" style={styles.searchLabel}>
          Search:
        </label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          style={styles.searchInput}
        />
      </div>

      <ul style={styles.studentList}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <li key={student._id} style={styles.student}>
              <h2>{student.name}</h2>
              <p>{student.email}</p>
            </li>
          ))
        ) : (
          <p>No students found.</p>
        )}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  error: { color: 'red', marginBottom: '1rem' },
  searchContainer: { marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  searchLabel: { fontSize: '1rem', fontWeight: 'bold' },
  searchInput: { padding: '0.5rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '4px', flexGrow: 1 },
  studentList: { listStyle: 'none', padding: 0 },
  student: { marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' },
};
