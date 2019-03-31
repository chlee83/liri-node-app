require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs");
var axios = require("axios");

//grab input text
var command = process.argv[2];
var nameOfItem = process.argv.slice(3).join(" ");

//function to choose which command to run
function chooseType() {

    if(command === "concert-this") {
        concertFunc();
    }
    else if (command === "spotify-this-song") {
        spotifyFunc();
    }
    else if (command === "movie-this") {
        movieFunc();
    }
    else if (command === "do-what-it-says") {
        doWhatItSaysFunc();
    }
    else {
        console.log("I do not understand the command you put in. Please try again.");
    }

}

chooseType();


/*******************concert-this code*********************/
function concertFunc() {
   
    //bandsAPI link
    var bandsAPI = "https://rest.bandsintown.com/artists/" + nameOfItem + "/events?app_id=codingbootcamp";

    //request info
    axios.get(bandsAPI).then(function(response) {

        //load up to three venues 
        for (var i = 0; i < 3; i++) {

            console.log("\nName of Venue: " + response.data[i].venue.name + 
            "\nVenue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country + 
            "\nDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                        
        }

    }).catch(function(err) {
        console.log(err);
    });
}


/*******************spotify-this-song code **********************/
function spotifyFunc(nameOfItem) {

    if (!nameOfItem) {
        nameOfItem = "Banana Pancakes"
    }
    spotify.search({
        type: "track",
        query: nameOfItem
    }).then(function(response) {

        //load up to three venues 
        for (var i = 0; i < 3; i++) {

            console.log("\nArtist(s): " + response.tracks.items[i].artists[0].name + 
            "\nSong: " + response.tracks.items[i].name + 
            "\nPreview Link: " + response.tracks.items[i].external_urls.spotify + 
            "\nAlbum: " + response.tracks.items[i].album.name);
                    
        }
    }).catch(function(err) {
        console.log(err);
    });

}


/************movie-this code*******************/
function movieFunc() {

    //Once movie name is set, grab api link
    var moviesAPI = "http://www.omdbapi.com/?t=" + nameOfItem + "&y=&plot=short&apikey=trilogy";

    //console log full api link with name to check
    console.log(moviesAPI);

    //request info from omdb
    axios.get(moviesAPI).then(function(response) {

        console.log("\nTitle: " + response.data.Title + 
        "\nYear: " + response.data.Year + 
        "\nIMDB Rating: " + response.data.imdbRating + 
        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + 
        "\nCountry: " + response.data.Country + 
        "\nLanguage: " + response.data.Language + 
        "\nPlot: " + response.data.Plot + 
        "\nActors: " + response.data.Actors);

    }).catch(function(err) {
        console.log(err);
    });

}


/**************** do-what-it-says code *************************/
function doWhatItSaysFunc() {
    fs.readFile("random.txt", "utf8", function(err, data) {

        if(err) {
            return console.log(err);
        }

        var dataArr = data.split(",");

        spotifyFunc(dataArr[1].trim().slice(1,-1));
    });
}

function logText() {

    if (nameOfItem !== "") {
        fs.appendFile("log.txt", nameOfItem + ", ", function(err) {
            if(err) {
                console.log(err);
            }
        });
    }
}

logText();
