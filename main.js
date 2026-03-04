const Api_key = "b52735b3";
const BASE_URL = "https://www.omdbapi.com/";
const movieList = document.querySelector(".movie-list");
let currentPage = 1;
let totalResults = 0;
let currentQuery = "batman";

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

const navSearchInput = document.getElementById("navSearchInput");
const genreSet = new Set();
let allMovies = [];


navSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const query = navSearchInput.value.trim();

        if (query !== "") {
            fetchMovies(query,1);
        }
    }
});

// navSearchInput.addEventListener("input", () => {
//     const query = navSearchInput.value.trim();
//     if (query.length > 2) {
//         fetchMovies(query,1);
//     }
// });
navSearchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout)

  const query = navSearchInput.value.trim()

  if(query.length > 2){
    searchTimeout = setTimeout(()=>{
      fetchMovies(query,1)
    },400)
  }
})

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        fetchMovies(currentQuery, currentPage - 1);
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(totalResults / 10);
    if (currentPage < totalPages) {
        fetchMovies(currentQuery, currentPage + 1);
    }
});
async function fetchMovies(query, page = 1) {

    genreSet.clear();
    allMovies = [];
    movieList.innerHTML = "<p>Loading...</p>";

    try {

        // const response = await fetch(
        //     `${BASE_URL}?s=${query}&apikey=${Api_key}`
        // );
        const response = await fetch(
            `${BASE_URL}?s=${query}&page=${page}&apikey=${Api_key}`
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        totalResults = Number(data.totalResults);
        currentPage = page;
        currentQuery = query;
        movieList.innerHTML = "";

        if (data.Response !== "True") {
            movieList.innerHTML = "<p>No movies found.</p>";
            return;
        }

        for (const movie of data.Search) {

            const detailResponse = await fetch(
                `${BASE_URL}?i=${movie.imdbID}&apikey=${Api_key}`
            );

            if (!detailResponse.ok) {
                continue; // skip failed movie
            }

            const detail = await detailResponse.json();
            allMovies.push(detail);

            detail.Genre.split(",").forEach(g => {
                genreSet.add(g.trim());
            });

            const poster = detail.Poster !== "N/A"
                ? detail.Poster
                : "https://placehold.co/400x600?text=No+Poster";


            const movieCard = `
                <div class="bg-gray-700 rounded-md p-4 shadow-md text-white min-h-[500px]">
                    <img 
                        src="${poster}" alt="${detail.Title}"
                        class="w-full h-56 object-cover rounded"
                        loading="lazy"
                        onerror="this.onerror=null; this.src='https://placehold.co/400x600?text=No+Poster'"
                    >
                    <h2 class="mt-3 text-lg font-bold">${detail.Title}</h2>
                    <p class="text-sm text-gray-400">
                        ⭐ ${detail.imdbRating !== "N/A" ? detail.imdbRating : "Not Found"} | ${detail.Runtime !== "N/A" ? detail.Runtime : "Not Found"}
                    </p>
                    <p class="text-sm mt-2">
                        <strong>Genre:</strong> ${detail.Genre}
                    </p>
                    <p class="text-sm mt-2">${detail.Plot}</p>
                    <p class="text-sm mt-2">
                        <strong>Actors:</strong> ${detail.Actors}
                    </p>
                </div>
            `;

            movieList.innerHTML += movieCard;
        }

        buildGenreDropdown();
        updatePagination();

    } catch (error) {
        console.error("Fetch error:", error);
        movieList.innerHTML = `
            <div class="text-center text-red-400">
                <p>Something went wrong.</p>
                <p>Please check your internet connection.</p>
            </div>
        `;
    }
}

fetchMovies(currentQuery, 1);

const genreSelect = document.getElementById("genre");

genreSelect.addEventListener("change", () => {
    const selectedGenre = genreSelect.value;

    if (selectedGenre === "") {
        renderMovies(allMovies);
    } else {
        const filtered = allMovies.filter(movie =>
            movie.Genre.includes(selectedGenre)
        );
        renderMovies(filtered);
    }
});
function renderMovies(movieArray) {

    movieList.innerHTML = "";

    movieArray.forEach(detail => {

        const poster = detail.Poster !== "N/A"
            ? detail.Poster
            : "https://via.placeholder.com/400x600";

        movieList.innerHTML += `
            <div class="bg-gray-700 rounded-md p-4 shadow-md text-white min-h-[500px]">
               <img src="${poster}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x600'"
               class="w-full h-56 object-cover rounded">
                <h2 class="mt-3 text-lg font-bold">${detail.Title}</h2>
                <p class="text-sm text-gray-400">
                    ⭐ ${detail.imdbRating} | ${detail.Runtime}
                </p>
                <p class="text-sm mt-2">
                    <strong>Genre:</strong> ${detail.Genre}
                </p>
                <p class="text-sm mt-2">${detail.Plot}</p>
                <p class="text-sm mt-2">
                    <strong>Actors:</strong> ${detail.Actors}
                </p>
            </div>
        `;
    });
}

function buildGenreDropdown() {

    const movieGenre = document.getElementById("genre");
    movieGenre.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Genre";
    movieGenre.appendChild(defaultOption);

    genreSet.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        movieGenre.appendChild(option);
    });
}
function updatePagination() {
    const totalPages = Math.ceil(totalResults / 10);

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

const togglebtn = document.querySelector(".toggle-btn");
const navContent = document.querySelector(".nav-content");
const movieIcon = document.querySelector("#movie-icon");

togglebtn.addEventListener("click", function () {
    const isHidden = navContent.classList.contains("hidden");

    if (isHidden) {
        navContent.classList.remove("hidden");
        movieIcon.classList.add("hidden");
    } else {
        navContent.classList.add("hidden");
        movieIcon.classList.remove("hidden");
    }
});