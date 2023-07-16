# Intersections API

The Intersections API is a mapping-based API that helps identify which of the 50 randomly spread lines intersect with a given linestring. It utilizes the Turf.js library for performing the intersection calculations.

## Installation

1. Clone the repository or download the source code.
2. Install the dependencies by running the following command: npm i

The server will start running on port 3000.

2. Send a POST request to the `/intersections` endpoint with the following request body:

```json
{
  "linestring": {
    "type": "LineString",
    "coordinates": [[lon1, lat1], [lon2, lat2]]
  }
}

```
