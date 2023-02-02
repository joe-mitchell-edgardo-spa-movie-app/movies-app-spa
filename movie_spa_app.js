"use strict";
// var loadModal = new bootstrap.Modal($("#page-load-modal"));

$(document).ready(function(){
    // loadModal.toggle();
    $.get("https://cord-flannel-print.glitch.me/movies").done(function(data) {
        console.log(data);
        data.forEach((movie) => console.log(movie));
        data.forEach((movie) => {
            $("#movie-list").append(
                `<div class="card border m-1 col-4" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">Director: ${movie.director}</p>
                        <p class="card-text">${movie.rating}</p>
                        <p class="card-text">${movie.genre}</p>
                        <p class="card-text">${movie.release}</p>
                        <div class="d-flex">
                        <button id="remove-btn" type="button" class="btn m-1 btn-outline-danger">Remove</button>
                        <button id="edit-btn" type="button" class="btn m-1 btn-outline-warning">Edit</button>
                    </div>
            </div>`
            )
        });
    });
});


$("#add-movie-btn").click(function(event) {
    event.preventDefault();
    $("#add-modal").modal("show");
});

//movies