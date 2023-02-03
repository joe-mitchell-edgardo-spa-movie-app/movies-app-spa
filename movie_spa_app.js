"use strict";

$(document).ready(function(){
    createAddEventListener();
    createAddModalSubmitButtonEventListener();
    createEditModalConfirmButtonEventListener();
    getAllMovieData();
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

function createEditModalConfirmButtonEventListener() {
    $("#confirm-edit-btn").click(confirmEdit);
}

function confirmEdit() {
    console.log("HI MOM");
}

function getAllMovieData() {
    $.get("https://cord-flannel-print.glitch.me/movies").done(createMovieCards);
}

const createMovieCards = (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html +=
            `<div class="card border m-1 col-4" style="width: 18rem;" data-id="${data[i].id}">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">Director: ${data[i].director}</p>
                        <p class="card-text">${data[i].rating}</p>
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

function appendMovieCards(html) {
    $("#movie-list").html(html);
    createEditClickEventListener();
    createDeleteEventListener();
}

function createEditClickEventListener() {
    $(".edit-btn").click(event => {
        let thisMovieId = event.target.getAttribute("data-id");
        getMovieByIdForAdding(thisMovieId);
    });
}

function getMovieByIdForAdding(id) {
    $.get(`https://cord-flannel-print.glitch.me/movies/${id}`).done(setMovieData);
}

const setMovieData = (data) => {
    $("#edit-movie-title-input").attr('value', data.title);
    $("#edit-director-input").attr('value', data.director);
    $("#edit-rating-input").children().first().text(data.rating);
    $("#edit-genre-input").children().first().text(data.genre);
    $("#edit-release-input").attr('value', data.release);
    $("#edit-modal").modal("show");
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
