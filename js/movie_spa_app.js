"use strict";

$(document).ready(function () {
    createAddEventListener();
    createAddModalSubmitButtonEventListener();
    getAllMovieData();
    $("#search-input").toggleClass("hidden");
    $("#add-movie-btn").removeClass("disabled");
});

function createAddEventListener() {
    $("#add-movie-btn").click(function (event) {
        event.preventDefault();
        clearAddMovieInputs();
        $("#add-modal").modal("show");
    });
}

function createAddModalSubmitButtonEventListener() {
    $("#add-movie-form-btn").click(addMovie);
}

function addMovie(event) {
    event.preventDefault();
    const movieObj = {
        title: $('#movie-title-input').val(),
        director: $("#director-input").val(),
        rating: $("#rating-input").val(),
        genre: $("#genre-input").val(),
        release: $("#release-input").val()
    };
    clearAddMovieInputs();
    const url = "https://cord-flannel-print.glitch.me/movies"
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieObj)
    };

    fetch(url, options)
        .then(function (response) {
            getAllMovieData();
            checkSearch();
            $("#add-modal").modal("hide");
        }).catch(function (error) {
        alert("post failed")
    });
    // checkSearch();
}

function clearAddMovieInputs() {
    $('#movie-title-input').val("");
    $("#director-input").val("");
    $("#rating-input").val("Choose...");
    $("#genre-input").val("Choose...");
    $("#release-input").val("");
}

function getAllMovieData() {
    $.get("https://cord-flannel-print.glitch.me/movies").done(createMovieCards);
    $("#sort-by-select").val("Default");
}

const createMovieCards = (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html +=
            `<div class="card border m-1 col-4" style="width: 18rem;" data-id="${data[i].id}">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">Director: ${data[i].director}</p>
                        <p class="card-text">${createStars(data[i].rating)}</p>
                        <p class="card-text">${data[i].genre}</p>
                        <p class="card-text">${data[i].release}</p>
                        <div class="d-flex">
                            <button type="button" class="remove-btn btn m-1 btn-outline-danger" data-id="${data[i].id}">Remove</button>
                            <button type="button" class="edit-btn btn m-1 btn-outline-warning" data-id="${data[i].id}">Edit</button>
                        </div>
                </div>
            </div>`
    }
    appendMovieCards(html);
}

function createStars(rating) {
    let stars = "";
    for (let i = 0; i < rating; i++) {
        stars += `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

function appendMovieCards(html) {
    $("#movie-list").html(html);
    createEditClickEventListener();
    createDeleteEventListener();
}

let count = 0;

function createEditClickEventListener() {
    $(".edit-btn").click(event => {
        count = 0;
        let thisMovieId = event.target.getAttribute("data-id");
        getMovieByIdForEditing(thisMovieId);
    });
}

function getMovieByIdForEditing(id) {
    $.get(`https://cord-flannel-print.glitch.me/movies/${id}`).done(setMovieData);
}

const setMovieData = (data) => {
    $("#edit-movie-title-input").val(data.title);
    $("#edit-director-input").val(data.director);
    $("#edit-rating-input").val(data.rating);
    $("#edit-genre-input").val(data.genre);
    $("#edit-release-input").val(data.release);
    $("#edit-modal").modal("show");
    createEditModalConfirmButtonEventListener(data);
}

function createEditModalConfirmButtonEventListener(data) {
    let passingData = data;
    $("#confirm-edit-btn").click(function () {
        if (count === 0) {
            editMovieData(passingData);
        }
    });
}

function editMovieData(data) {
    $("#confirm-edit-btn").off();
    count++;
    let movieObjTwo = {
        title: $("#edit-movie-title-input").val(),
        director: $("#edit-director-input").val(),
        rating: $("#edit-rating-input").val(),
        genre: $("#edit-genre-input").val(),
        release: $("#edit-release-input").val()
    };
    const url = `https://cord-flannel-print.glitch.me/movies/${data.id}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieObjTwo)
    };
    fetch(url, options)
        .then(function () {
            getAllMovieData();
            checkSearch();
            $("#edit-modal").modal("hide");
        });
}

function createDeleteEventListener() {
    $(".remove-btn").click(event => {
        let thisMovieId = event.target.getAttribute("data-id");
        deleteMovie(thisMovieId);
    });
}

async function deleteMovie(id) {
    return await fetch(`https://cord-flannel-print.glitch.me/movies/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(function () {
        getAllMovieData();
        checkSearch();
    });
}

function getMoviesArray() {
    return $.get("https://cord-flannel-print.glitch.me/movies")
        .done(function (data) {
            return data;
        });
}

$("#sort-by-select").change(checkSortByValue);

function checkSortByValue() {
    clearSearchByInputs();
    if ($("#sort-by-select").val() === "Default") {
        getAllMovieData();
    } else if ($("#sort-by-select").val() === "Title (A-Z)") {
        sortByTitleAToZ();
    } else if ($("#sort-by-select").val() === "Title (Z-A)") {
        sortByTitlZToA();
    } else if ($("#sort-by-select").val() === "Rating (High to Low)") {
        sortByRatingHighToLow();
    } else if ($("#sort-by-select").val() === "Rating (Low to High)") {
        sortByRatingLowToHigh();
    } else {
        console.log("WENT HERE INSTEAD");
    }
}

function clearSearchByInputs() {
    $("#search-input").val("");
    $("#search-by-select").val("Title");
    $("#rating-select").val("Default");
    $("#genre-select").val("Default");
    $("#search-input").removeClass("hidden");
    $("#rating-select").addClass("hidden");
    $("#genre-select").addClass("hidden");

}

async function sortByTitleAToZ() {
    let moviesArray = await getMoviesArray();
    moviesArray.sort((a, b) => (a.title > b.title) ? 1 : -1);
    createMovieCards(moviesArray);
}

async function sortByTitlZToA() {
    let moviesArray = await getMoviesArray();
    moviesArray.sort((a, b) => (a.title < b.title) ? 1 : -1);
    createMovieCards(moviesArray);
}

async function sortByRatingHighToLow() {
    let moviesArray = await getMoviesArray();
    moviesArray.sort((a, b) => (a.rating < b.rating) ? 1 : -1);
    createMovieCards(moviesArray);
}

async function sortByRatingLowToHigh() {
    let moviesArray = await getMoviesArray();
    moviesArray.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
    createMovieCards(moviesArray);
}

$("#search-input").keydown(sortBySearch);
$("#rating-select").change(sortBySearch);
$("#genre-select").change(sortBySearch);
$("#search-by-select").change(function() {
    clearSortByInput();
    toggleHiddenClassForRatingSelect();
    makeSearchesDefault();
    getAllMovieData();
});

function clearSortByInput() {
    $("#sort-by-select").val("Default");
}

async function sortBySearch() {
    if ($("#search-input").val() === "" && $("#rating-select").val() === "Default" && $("#genre-select").val() === "Default") {
        getAllMovieData();
    } else {
        let moviesArray = await getMoviesArray();

        if ($("#search-by-select").val() === "Title") {
            createMovieCards(sortByTitle(moviesArray));
        } else if ($("#search-by-select").val() === "Director") {
            createMovieCards(sortByDirector(moviesArray));
        } else if ($("#search-by-select").val() === "Rating") {
            createMovieCards(sortByRating(moviesArray));
        } else if ($("#search-by-select").val() === "Genre") {
            createMovieCards(sortByGenre(moviesArray));
        } else if ($("#search-by-select").val() === "Release") {
            createMovieCards(sortByRelease(moviesArray));
        }
    }
}

function checkSearch() {
    if ($("#search-input").val() !== "" || $("#rating-select").val() !== "Default" !== $("#genre-select") !== "Default") {
        sortBySearch();
    }
}

function makeSearchesDefault() {
    $("#search-input").val("");
    $("#rating-select").val("Default");
}

function toggleHiddenClassForRatingSelect() {
    if ($("#search-by-select").val() === "Rating") {
        $("#search-input").addClass("hidden");
        $("#rating-select").removeClass("hidden");
        $("#genre-select").addClass("hidden");
    } else if ($("#search-by-select").val() === "Genre") {
        $("#search-input").addClass("hidden");
        $("#rating-select").addClass("hidden");
        $("#genre-select").removeClass("hidden");
    } else {
        $("#search-input").removeClass("hidden");
        $("#rating-select").addClass("hidden");
        $("#genre-select").addClass("hidden");
    }
}

function sortByTitle(moviesArray) {
    return moviesArray.filter(movie => {
        if (movie.title.toLowerCase().indexOf($("#search-input").val().toLowerCase()) > -1) {
            return movie;
        }
    });
}

function sortByDirector(moviesArray) {
    return moviesArray.filter(movie => {
        if (movie.director.toLowerCase().indexOf($("#search-input").val().toLowerCase()) > -1) {
            return movie;
        }
    });
}

function sortByRating(moviesArray) {
    return moviesArray.filter(movie => {
        if (movie.rating === $("#rating-select").val()) {
            return movie;
        }
    });
}

function sortByGenre(moviesArray) {
    return moviesArray.filter(movie => {
        if (movie.genre === $("#genre-select").val()) {
            return movie;
        }
    });
}

function sortByRelease(moviesArray) {
    return moviesArray.filter(movie => {
        if (movie.release.indexOf($("#search-input").val()) > -1) {
            return movie;
        }
    });
}