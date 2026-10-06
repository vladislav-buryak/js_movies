const API_KEY = "da5f9950";

const API_URL = "https://www.omdbapi.com/";

let currentSearch = "";
let currentType = "movie";
let currentPage = 1;
let totalPages = 1;


// ================================
// SEARCH FORM
// ================================

$("#searchForm").on("submit", function (event) {

    // Не перезагружаем страницу
    event.preventDefault();

    currentSearch = $("#searchInput").val().trim();
    currentType = $("#typeSelect").val();
    currentPage = 1;

    if (currentSearch === "") {
        $("#message").text("Enter movie title!");
        return;
    }

    searchMovies(currentPage);
});


// ================================
// SEARCH MOVIES
// ================================

function searchMovies(page) {

    $("#message").text("Loading...");
    $("#movies").empty();
    $("#pagination").empty();
    $("#details").empty();

    $.ajax({
        url: API_URL,

        method: "GET",

        dataType: "json",

        data: {
            apikey: API_KEY,
            s: currentSearch,
            type: currentType,
            page: page
        },

        success: function (data) {

            console.log(data);

            if (data.Response === "True") {

                displayMovies(data.Search);

                totalPages = Math.ceil(
                    parseInt(data.totalResults) / 10
                );

                displayPagination();

                $("#message").text(
                    `Found: ${data.totalResults}`
                );

            } else {

                $("#message").text("Movie not found!");
                $("#movies").empty();
                $("#pagination").empty();
            }
        },

        error: function () {

            $("#message").text(
                "Error while loading movies!"
            );
        }
    });
}


// ================================
// DISPLAY MOVIES
// ================================

function displayMovies(movies) {

    $("#movies").empty();

    movies.forEach(function (movie) {

        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/70x100?text=No+Image";

        const movieElement = $(`
            <div class="movie">

                <img
                    src="${poster}"
                    alt="${movie.Title}"
                >

                <div class="movie-info">

                    <div class="movie-title">
                        ${movie.Title}
                    </div>

                    <div class="movie-year">
                        ${movie.Year}
                    </div>

                </div>

                <button
                    class="details-button"
                    data-id="${movie.imdbID}"
                >
                    Details
                </button>

            </div>
        `);

        $("#movies").append(movieElement);
    });
}


// ================================
// PAGINATION
// ================================

function displayPagination() {

    $("#pagination").empty();

    if (totalPages <= 1) {
        return;
    }

    for (let page = 1; page <= totalPages; page++) {

        const button = $(`
            <button
                class="page-button"
                data-page="${page}"
            >
                ${page}
            </button>
        `);

        if (page === currentPage) {
            button.addClass("active");
        }

        $("#pagination").append(button);
    }
}


// ================================
// PAGE CLICK
// ================================

$(document).on(
    "click",
    ".page-button",
    function () {

        currentPage = parseInt(
            $(this).data("page")
        );

        searchMovies(currentPage);
    }
);


// ================================
// DETAILS CLICK
// ================================

$(document).on(
    "click",
    ".details-button",
    function () {

        const imdbID = $(this).data("id");

        getMovieDetails(imdbID);
    }
);


// ================================
// GET DETAILS
// ================================

function getMovieDetails(imdbID) {

    $("#details").html(
        "<p>Loading details...</p>"
    );

    $.ajax({

        url: API_URL,

        method: "GET",

        dataType: "json",

        data: {
            apikey: API_KEY,
            i: imdbID,
            plot: "full"
        },

        success: function (movie) {

            if (movie.Response === "True") {

                displayDetails(movie);

            } else {

                $("#details").html(
                    "<p>Movie details not found!</p>"
                );
            }
        },

        error: function () {

            $("#details").html(
                "<p>Error while loading details!</p>"
            );
        }
    });
}


// ================================
// DISPLAY DETAILS
// ================================

function displayDetails(movie) {

    const poster =
        movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/200x300?text=No+Image";

    const html = `
        <div class="movie-details">

            <img
                src="${poster}"
                alt="${movie.Title}"
            >

            <h2>${movie.Title}</h2>

            <p>
                <strong>Year:</strong>
                ${movie.Year}
            </p>

            <p>
                <strong>Genre:</strong>
                ${movie.Genre}
            </p>

            <p>
                <strong>Director:</strong>
                ${movie.Director}
            </p>

            <p>
                <strong>Actors:</strong>
                ${movie.Actors}
            </p>

            <p>
                <strong>Runtime:</strong>
                ${movie.Runtime}
            </p>

            <p>
                <strong>IMDb Rating:</strong>
                ${movie.imdbRating}
            </p>

            <p>
                <strong>Plot:</strong>
                ${movie.Plot}
            </p>

        </div>
    `;

    $("#details").html(html);
}