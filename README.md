Movie Explorer
Project Name: MoviesWithGuvies
Live Demo: https://guvimovies.netlify.app/

Project Overview:
Movie Explorer is a responsive web application that allows users to search for movies and view detailed information such as posters, ratings, runtime, genre, actors, and plot summaries.

Initial Movie Data:
Added a default "Batman" search query so that movies are displayed when the application first loads.
To ensure the interface is not empty on load, the application performs a default search for **"Batman"** and displays those movies initially.

API Key Usage:
This project uses the OMDB API to fetch movie data.
I requested a free API key from the official OMDB website and added it inside main.js
The API key is used in fetch requests to:
Search movies using ?s=
Get detailed movie data using ?i=
Pagination has been implemented using the OMDb API's `page` parameter.
Each page returns 10 movies, and the application includes Previous and Next buttons for navigation.

Image Handling:
Movie posters use lazy loading to improve performance.
A placeholder image is displayed if the poster is unavailable (N/A) or fails to load.
This prevents broken images and maintains layout consistency.

Features:
Search movies dynamically
Display movie posters, titles, ratings, runtime, and overview
Genre-based filtering
Responsive layout for mobile, tablet, and desktop
Handles empty search results
Handles API errors using try/catch
Pagination for navigating movie results

Tech Stack:
HTML
Tailwind CSS
JavaScript (Vanilla JS)
OMDB API


How to Run Locally:
Download or clone the project.
Add your OMDB API key in main.js.
Open index.html in a browser.
Start searching for movies.


