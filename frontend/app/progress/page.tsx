'use client';

import { useState, useEffect } from 'react';

type CourseProgress = {
    courseId: { title: string }; // Assuming `courseId` is populated with the course data
    completedPercentage: number;
};

const UserProgressPage = () => {
    const [progressData, setProgressData] = useState<CourseProgress[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgress = async () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user || !user._id) {
                setError('User not logged in.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/progress/user`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // Assuming JWT
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch progress data');
                const data = await response.json();
                setProgressData(data);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching progress data.');
            }
        };

        fetchProgress();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1>Your Progress</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {progressData.length === 0 ? (
                <p>No progress data found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Course</th>
                            <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Completion</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserProgressPage;
