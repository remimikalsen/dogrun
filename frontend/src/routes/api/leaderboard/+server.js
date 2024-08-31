// src/routes/api/leaderboard/+server.js
import { json } from '@sveltejs/kit';

export const GET = async () => {

    try {
        const response = await fetch('http://localhost:3000/api/leaderboard');

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }

        const leaderboard = await response.json();

        return json(leaderboard);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }

};

