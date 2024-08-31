// src/routes/api/score/+server.js
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    try {
        const { initials, bones } = await request.json();

        const response = await fetch('http://localhost:3000/api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ initials, bones })
        });

        if (!response.ok) {
            throw new Error('Failed to store score');
        }

        /* const result = await response.json();*/

        return json({ message: "OK" }, { status: 200 });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
};

