

// INPUTS

const email = document.getElementById("email");

const password = document.getElementById("password");


// BUTTONS

const loginBtn = document.getElementById("loginBtn");

const signupBtn = document.getElementById("signupBtn");


// SECTIONS

const authBox = document.querySelector(".container");

const movieApp = document.getElementById("movieApp");

// Search Suggestions
const suggestions = document.getElementById("suggestions");



/* =========================
   CREATE ACCOUNT
========================= */

signupBtn.addEventListener("click", () => {

    const userEmail = email.value;

    const userPassword = password.value;
    // VALIDATION

    if(userEmail === "" || userPassword === ""){

    showToast("Please fill all fields");

        return;
    }
    // USER OBJECT

    const user = {

        email: userEmail,

        password: userPassword
    };
    // SAVE TO LOCAL STORAGE

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    showToast("Account Created Successfully ✨");

});



/* =========================
   LOGIN
========================= */

loginBtn.addEventListener("click", () => {

    // GET SAVED USER

    const savedUser = JSON.parse(
        localStorage.getItem("user")
    );


    const userEmail = email.value;

    const userPassword = password.value;


    // CHECK LOGIN

    if(
    savedUser.email === userEmail &&
    savedUser.password === userPassword
){

    showToast("Login Successful 🎬");

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

    authBox.classList.add("hidden");

    movieApp.classList.remove("hidden");
    

    // loadTrendingMovies();
     displayFavorites();


}
const logoutBtn = document.getElementById("logoutBtn");


logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("isLoggedIn");

    movieApp.classList.add("hidden");

    authBox.classList.remove("hidden");

});
});


// SEARCH ELEMENTS

const searchBtn = document.getElementById("searchBtn");

const searchInput = document.getElementById("searchInput");

const movieContainer = document.getElementById("movieContainer");

const loader = document.getElementById("loader");



/* =========================
   SEARCH MOVIES
========================= */

searchBtn.addEventListener("click", () => {

    searchMovies();

});

async function searchMovies(){

    const movieName = searchInput.value;


    // EMPTY INPUT

    if(movieName === ""){

        alert("Please enter movie name");

        return;
    }


    // SHOW LOADER

    loader.classList.remove("hidden");

    movieContainer.innerHTML = "";


    try{

        const response = await fetch(

            `https://www.omdbapi.com/?s=${movieName}&apikey=f933747f`

        );


        const data = await response.json();


        // HIDE LOADER

        loader.classList.add("hidden");


        // DISPLAY MOVIES

        displayMovies(data.Search);

    }

    catch(error){

        loader.classList.add("hidden");

        alert("Something went wrong");

        console.log(error);

    }
}

    async function showMovieDetails(imdbID){

    const modal = document.getElementById("movieModal");

    const modalDetails = document.getElementById(
        "modalDetails"
    );


    try{

        const response = await fetch(

            `https://www.omdbapi.com/?i=${imdbID}&apikey=f933747f`

        );


        const movie = await response.json();


        modalDetails.innerHTML = `

            <img src="${movie.Poster}">

            <div class="modal-info">

                <h2>${movie.Title}</h2>

                <p><b>Year:</b> ${movie.Year}</p>

                <p><b>Genre:</b> ${movie.Genre}</p>

                <p><b>Actors:</b> ${movie.Actors}</p>

                <p><b>IMDb Rating:</b> ⭐ ${movie.imdbRating}</p>
                
                <p><b>Plot:</b> ${movie.Plot}</p>
            <a 
             href="https://www.youtube.com/results?search_query=${movie.Title}+trailer"
            target="_blank"
            class="trailer-btn"
           >
           ▶ Watch Trailer
           </a>
            </div>

         `;   //added trailer button5


        modal.classList.add("show");

    }

    catch(error){

        console.log(error);

    }

}

function displayMovies(movies){

    movieContainer.innerHTML = "";


    movies.forEach((movie) => {

        const card = document.createElement("div");

        card.classList.add("movie-card");


        card.innerHTML = `

    <img src="${
    movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/220x300?text=No+Image'
}">

    <h3>${movie.Title}</h3>

    <p>${movie.Year}</p>

    <button class="details-btn">
        View Details
    </button>

    <button class="fav-btn">
        ❤️ Add to Favorites
    </button>

`;

        // FAVORITE BUTTON

        const favBtn = card.querySelector(".fav-btn");


        favBtn.addEventListener("click", () => {

            addToFavorites(movie);

        });

        const detailsBtn = card.querySelector(".details-btn");


detailsBtn.addEventListener("click", () => {

    showMovieDetails(movie.imdbID);

});
        

        movieContainer.appendChild(card);

    });

}
function addToFavorites(movie){

    let favorites = JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


    // CHECK DUPLICATE

    const alreadyAdded = favorites.find((fav) => {

        return fav.imdbID === movie.imdbID;

    });


    if(alreadyAdded){

        showToast("Movie already in favorites ❤️");

        return;
    }


    // PUSH MOVIE

    favorites.push(movie);


    // SAVE

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    // SHOW AGAIN

    displayFavorites();


    showToast("Added to Favorites ❤️");

}

 function displayFavorites(){

    const favoriteContainer = document.getElementById(
        "favoriteContainer"
    );

    favoriteContainer.innerHTML = "";


    let favorites = JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


    favorites.forEach((movie, index) => {

        const card = document.createElement("div");

        card.classList.add("favorite-card");


        card.innerHTML = `

            <div class="fav-top">

                <button class="menu-btn">
                    ⋮
                </button>

                <div class="dropdown hidden">

                    <p class="remove-btn">
                        Remove
                    </p>

                </div>

            </div>

            <img src="${movie.Poster}">

            <h3>${movie.Title}</h3>

            <p>${movie.Year}</p>

        `;


        // MENU BUTTON

        const menuBtn = card.querySelector(".menu-btn");

        const dropdown = card.querySelector(".dropdown");


        menuBtn.addEventListener("click", () => {

            dropdown.classList.toggle("hidden");

        });


        // REMOVE BUTTON

        const removeBtn = card.querySelector(".remove-btn");


        removeBtn.addEventListener("click", () => {

            removeFavorite(index);

        });


        favoriteContainer.appendChild(card);

    });

}

function removeFavorite(index){

    let favorites = JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


    favorites.splice(index, 1);


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    displayFavorites();
    showToast("Removed from Favorites 🗑");

}


const closeModal = document.getElementById(
    "closeModal"
);

const movieModal = document.getElementById(
    "movieModal"
);


closeModal.addEventListener("click", () => {

    movieModal.classList.remove("hidden");

});
    
// search suggestions

searchInput.addEventListener("input", async () => {

    const query = searchInput.value;


    // EMPTY

    if(query.length < 2){

        suggestionsBox.innerHTML = "";

        return;
    }


    try{

        const response = await fetch(

            `https://www.omdbapi.com/?s=${query}&apikey=f933747f`

        );


        const data = await response.json();


        suggestionsBox.innerHTML = "";


        if(data.Search){

            data.Search.slice(0,5).forEach((movie) => {

                const div = document.createElement("div");

                div.classList.add("suggestion-item");


                div.innerText = movie.Title;


                // CLICK SUGGESTION

                div.addEventListener("click", () => {

                    searchInput.value = movie.Title;

                    suggestionsBox.innerHTML = "";

                    searchMovies();

                });


                suggestionsBox.appendChild(div);

            });

        }

    }

    catch(error){

        console.log(error);

    }

});
// Toast Notification
function showToast(message){

    const toast = document.getElementById("toast");


    toast.innerText = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}

async function loadTrendingMovies(){

    try{

        const response = await fetch(

            `https://www.omdbapi.com/?s=avengers&apikey=f933747f`

        );

        const data = await response.json();


        const trendingContainer = document.getElementById(
            "trendingContainer"
        );

        trendingContainer.innerHTML = "";


        data.Search.forEach((movie) => {

            const card = document.createElement("div");

            card.classList.add("movie-card");


            card.innerHTML = `

                <img src="${
                    movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/220x300?text=No+Image"
                }">

                <h3>${movie.Title}</h3>

                <p>${movie.Year}</p>

            `;


            trendingContainer.appendChild(card);

        });

    }

    catch(error){

        console.log(error);

    }

}




/* =========================
   SEARCH SUGGESTIONS
========================= */

const suggestionsBox = document.getElementById(
    "suggestionsBox"
);


searchInput.addEventListener("input", async () => {

    const query = searchInput.value;


    if(query.length < 2){

        suggestionsBox.innerHTML = "";

        return;
    }


    try{

        const response = await fetch(

            `https://www.omdbapi.com/?s=${query}&apikey=f933747f`

        );


        const data = await response.json();


        suggestionsBox.innerHTML = "";


        if(data.Search){

            data.Search.slice(0,5).forEach((movie) => {

                const div = document.createElement("div");

                div.classList.add("suggestion-item");

                div.innerText = movie.Title;


                div.addEventListener("click", () => {

                    searchInput.value = movie.Title;

                    suggestionsBox.innerHTML = "";

                    searchMovies();

                });


                suggestionsBox.appendChild(div);

            });

        }

    }

    catch(error){

        console.log(error);

    }

});



/* =========================
   TOAST
========================= */

function showToast(message){

    const toast = document.getElementById("toast");


    toast.innerText = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}



/* =========================
   TRENDING MOVIES
========================= */

async function loadTrendingMovies(){

    try{

        const response = await fetch(

            `https://www.omdbapi.com/?s=avengers&apikey=f933747f`

        );

        const data = await response.json();


        const trendingContainer = document.getElementById(
            "trendingContainer"
        );

        trendingContainer.innerHTML = "";


        data.Search.forEach((movie) => {

            const card = document.createElement("div");

            card.classList.add("movie-card");


            card.innerHTML = `

                <img src="${
                    movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/220x300?text=No+Image"
                }">

                <h3>${movie.Title}</h3>

                <p>${movie.Year}</p>

            `;


            trendingContainer.appendChild(card);

        });

    }

    catch(error){

        console.log(error);

    }

}



/* =========================
   NAVBAR BUTTONS
========================= */



// HOME



document.getElementById("homeBtn")
.addEventListener("click", () => {

    document.querySelector(".container")
    .scrollIntoView({

        behavior: "smooth"
    });

});


// TRENDING

document.getElementById("trendingBtn")
.addEventListener("click", () => {

    loadTrendingMovies();

    setTimeout(() => {

        document.getElementById("trending")
        .scrollIntoView({

            behavior: "smooth"
        });

    }, 100);

});



// FAVORITES

document.getElementById("favoritesBtn")
.addEventListener("click", () => {

    displayFavorites();

    setTimeout(() => {

        document.getElementById("favoritesSection")
        .scrollIntoView({

            behavior: "smooth"
        });

    }, 100);

});



// CONTACT

document.getElementById("contactBtn")
.addEventListener("click", () => {

    document.getElementById("contact")
    .scrollIntoView({

        behavior: "smooth"
    });

});