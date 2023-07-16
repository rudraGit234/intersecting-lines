const turf = require('@turf/turf');
// import * as turf from '@turf/turf'


// Helper function to find intersections using Turf.js
function findIntersections(linestring, lines) {
    const intersectingLines = [];

    // Convert the GeoJSON linestring to a Turf.js LineString object
    const linestringObj = turf.lineString(linestring.coordinates);

    // Iterate over the set of 50 lines
    for (const line of lines) {
        // Convert the line to a Turf.js LineString object
        const lineObj = turf.lineString(line.coordinates);

        // Check for intersection between linestring and the current line
        const intersection = turf.lineIntersect(linestringObj, lineObj);

        // If there is an intersection, add the line ID and intersection point to the result
        if (intersection.features.length > 0) {
            const lineId = line.id;
            const pointOfIntersection = intersection.features[0].geometry.coordinates;
            intersectingLines.push({ lineId, pointOfIntersection });
        }
    }

    return intersectingLines;
}

module.exports = { findIntersections };
