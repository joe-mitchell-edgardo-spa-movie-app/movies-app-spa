"use strict";

$(document).ready(function(){
    createAddEventListener();
    createAddModalSubmitButtonEventListener();
    getAllMovieData();
    $("#add-movie-btn").removeClass("disabled");
});

function createAddEventListener() {
    $("#add-movie-btn").click(function(event) {
        event.preventDefault();
        $("#add-modal").modal("show");
    });
}

function createAddModalSubmitButtonEventListener() {
    $("#add-movie-form-btn").click(addMovie);
}

function addMovie(event){
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
        .then(function(response) {
            getAllMovieData();
            $("#add-modal").modal("hide");
        }).catch(function(error) {
        alert("post failed")
    });
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
}

const createMovieCards = (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html +=
            `<div class="card border m-1 col-4" style="width: 18rem;" data-id="${data[i].id}">
<!--                <img src="moviePoster[i]" class="card-img-top" alt="movie-poster">-->
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
    $("#confirm-edit-btn").click(function() {
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
            $("#edit-modal").modal("hide");
    });
}

function createDeleteEventListener() {
    $(".remove-btn").click(event => {
        let thisMovieId = event.target.getAttribute("data-id");
        deleteMovie(thisMovieId);
    });
}

function deleteMovie(id) {
    fetch(`https://cord-flannel-print.glitch.me/movies/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(function () {
        getAllMovieData();
    });
}


// function moviePoster(movie) {
//     console.log(movie);
//     let title = "";
//     for (let i = 0; i < movie.title.length; i++) {
//         if (movie.title.charAt(i) === " ") {
//             title += movie.title.charAt(i).replace(" ", "+");
//         } else {
//             title += movie.title.charAt(i);
//         }
//     }
//     console.log(title);
//     fetch(`https://www.omdbapi.com/?t=${title}&apikey=c06f85c5`).then(function() {
//         console.log("success");
//     });
// }
