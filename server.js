const express = require('express');
const bodyParser = require('body-parser');
const turf = require('@turf/turf');
const { findIntersections } = require('./intersections');
const geoJSONValidate = require('geojson-validation');
const winston = require('winston');

const app = express();
const PORT = 3000;

// Configure the logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' }),
    ],
});

// Middleware
app.use(bodyParser.json());

// Sample set of 50 lines (replace with your actual data)
const lines =
    [
        {
            line: {
                type: "LineString",
                coordinates: [
                    [-74.0386542, 40.7302174],
                    [-74.038756, 40.7295611],
                ],
            },
        },
        {
            line: {
                type: "LineString",
                coordinates: [
                    [-74.061602, 40.705933],
                    [-74.06214, 40.706563],
                ],
            },
        },
        {
            line: {
                type: "LineString",
                coordinates: [
                    [-74.156101, 40.709045],
                    [-74.156801, 40.707801],
                ],
            },
        },
        {
            line: {
                type: "LineString",
                coordinates: [
                    [-99.311072, 19.488246],
                    [-99.311002, 19.488132],
                ],
            },
        },
        {
            line: {
                type: "LineString",
                coordinates: [
                    [-99.311072, 19.488246],
                    [-99.311002, 19.488132],
                ],
            },
        },
    ];


// Routes
app.post('/intersections', (req, res) => {
    const linestring = req.body.linestring;

    // Log the incoming request
    logger.info('Received request:', { linestring });

    // Validate the linestring
    const isValid = geoJSONValidate.valid(linestring);
    if (!isValid) {
        logger.error('Invalid GeoJSON linestring:', { linestring });
        return res.status(400).json({ error: 'Invalid GeoJSON linestring.' });
    }

    try {
        // Find intersecting lines using Turf.js and the findIntersections function
        const intersections = findIntersections(linestring, lines);

        if (intersections.length === 0) {
            // No intersections found
            logger.info('No intersections found.');
            return res.json([]);
        }

        // Intersections found
        const result = intersections.map((intersection) => {
            return {
                lineId: intersection.lineId,
                pointOfIntersection: intersection.pointOfIntersection,
            };
        });

        logger.info('Intersections found:', { result });
        res.json(result);
    } catch (error) {
        // Log the error
        logger.error('Error finding intersections:', { error });

        // Handle errors
        console.error('Error finding intersections:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
