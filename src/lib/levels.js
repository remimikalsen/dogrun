// src/lib/levels.js

export const levels = [
    {
        groundHeight: 50,
        dog: { x: 100, y: 50, width: 50, height: 50 },
        platforms: [
            { x: 200, y: 70, width: 150, height: 20 },
            { x: 600, y: 100, width: 150, height: 20 },
            { x: 1000, y: 50, width: 150, height: 20 },
            // Add more platforms as needed
        ],
        spikes: [
            { x: 250, y: 70, width: 20, height: 20 },
            { x: 650, y: 100, width: 20, height: 20  },
            // Add more spikes as needed
        ],
        bones: [
            { x: 300, y: 70, width: 20, height: 20 },
            { x: 330, y: 60, width: 20, height: 20 },
            { x: 360, y: 90, width: 20, height: 20 },
            { x: 700, y: 100, width: 20, height: 20 },
            // Add more bones as needed
        ],
        goal: { x: 1200, y: 50, width: 90, height: 90 }
    },
    {
        groundHeight: 50,
        dog: { x: 200, y: 50, width: 50, height: 50 },
        platforms: [
            { x: 200, y: 100, width: 150, height: 20 },
            { x: 800, y: 150, width: 150, height: 20 },
            { x: 1400, y: 150, width: 150, height: 20 },
            // Add more platforms as needed
        ],
        spikes: [
            { x: 350, y: 0, width: 20, height: 20 },
            { x: 850, y: 150, width: 20, height: 20 },
            // Add more spikes as needed
        ],
        bones: [
            { x: 300, y: 0, width: 20, height: 20 },
            { x: 900, y: 180, width: 20, height: 20 },
            // Add more bones as needed
        ],
        goal: { x: 1800, y: 100, width: 50, height: 50 }
    },
    {
        groundHeight: 50,
        dog: { x: 100, y: 50, width: 50, height: 50 },
        platforms: [
            { x: 200, y: 100, width: 150, height: 20 },
            { x: 1000, y: 70, width: 150, height: 20 },
            { x: 1800, y: 100, width: 150, height: 20 },
            // Add more platforms as needed
        ],
        spikes: [
            { x: 250, y: 100, width: 20, height: 20 },
            { x: 1050, y: 70, width: 20, height: 20 },
            // Add more spikes as needed
        ],
        bones: [
            { x: 300, y: 200, width: 20, height: 20 },
            { x: 1100, y: 70, width: 20, height: 20 },
            // Add more bones as needed
        ],
        goal: { x: 2000, y: 50, width: 50, height: 50 }
    }
];
