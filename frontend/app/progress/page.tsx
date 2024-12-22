'use client';

import { useState, useEffect } from 'react';

type CourseProgress = {
  courseId: { title: string }; // Assuming `courseId` is populated with the course data
  completedPercentage: number;
  completedCourses: string[];
  averageScore: number;
  last_accessed: string;
};

const UserProgressPage = () => {
  const [progressData, setProgressData] = useState<CourseProgress[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const cookies = document.cookie;
      const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));

      if (!userCookie) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUsername(userData.name);
      
        // Print the userData object for debugging
        console.log('User Data:', userData);
      
        const response = await fetch(`http://localhost:3001/progress/user/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json',
          },
        });
      
        if (!response.ok) {
            throw new Error(`Failed to fetch progress data. User Data: ${JSON.stringify(userData)}`)
        }

        const data = await response.json();
        setProgressData(data);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to fetch progress data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <h1>Loading your progress...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Your Progress</h1>
      {username && <h2>Welcome, {username}</h2>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && progressData.length === 0 ? (
        <p>No progress data found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Course</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Completion</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Modules Completed</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Average Score</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Last Accessed</th>
            </tr>
          </thead>
          <tbody>
            {progressData.map((progress, index) => (
              <tr key={index}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                  {progress.courseId.title}
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                  {progress.completedPercentage}%
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                  {progress.completedCourses.length}
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                  {progress.averageScore}
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                  {new Date(progress.last_accessed).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserProgressPage;
