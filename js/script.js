console.log("Lets start Java Script");

let currfolder;
let songs = [];
let currentsong = new Audio();

// Function to convert seconds to mm:ss format
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (minutes < 10) minutes = '0' + minutes;
    if (secs < 10) secs = '0' + secs;
    return `${minutes}:${secs}`;
}

async function getsongs(folder) {
    currfolder = folder;
    try {
        let a = await fetch(`/${currfolder}/`)
        let response = await a.text()
        let div = document.createElement("div")
        div.innerHTML = response;
        let as = div.getElementsByTagName("a")
        songs = []
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${currfolder}/`)[1])
            }
        }
        
        //Show all the songs in the playlist
        let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML + `<li> 
                                <img class="invert" src="/img/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="/img/playsong.svg" alt="">
                                </div>
                            </li>`
        }

        // Attach an event listener to each song
        Array.from(document.querySelector(".songslist").getElementsByTagName('li')).forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        // Fallback to demo songs
        songs = [
            "Alan Walker - Fade.mp3",
            "Different Heaven - Nekozilla.mp3",
            "Janji - Heroes Tonight.mp3"
        ];
        
        let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML + `<li> 
                                <img class="invert" src="/img/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="/img/playsong.svg" alt="">
                                </div>
                            </li>`
        }

        // Attach an event listener to each song
        Array.from(document.querySelector(".songslist").getElementsByTagName('li')).forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })

        return songs;
    }
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play();
        play.src = "/img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

//Display all the albums on the page
async function displayAlbums() {
    console.log("displaying albums")
    try {
        let a = await fetch(`/songs/`)
        let response = await a.text();
        let div = document.createElement("div")
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a")
        let cards = document.querySelector(".cards")
        
        let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-1)[0]
                if (folder) {
                    // Get the metadata of the folder
                    try {
                        let a = await fetch(`/songs/${folder}/info.json`)
                        let response = await a.json();
                        
                        cards.innerHTML = cards.innerHTML + ` <div data-folder="${folder}" class="card">
                                <div class="img2">
                                    <img src="/songs/${folder}/cover.jpg" alt="${response.title}">
                                </div>
                                <p>${response.title}</p>
                                <span>${response.description}</span>
                                <div class="overlay">
                                    <i class="fa-solid fa-play"></i>
                                </div>
                            </div>`
                    } catch (error) {
                        console.error(`Error loading info for ${folder}:`, error);
                        // Fallback if info.json doesn't exist
                        cards.innerHTML = cards.innerHTML + ` <div data-folder="${folder}" class="card">
                                <div class="img2">
                                    <img src="/songs/${folder}/cover.jpg" alt="${folder}">
                                </div>
                                <p>${folder}</p>
                                <span>Music Collection</span>
                                <div class="overlay">
                                    <i class="fa-solid fa-play"></i>
                                </div>
                            </div>`
                    }
                }
            }
        }
        
        //Load the Playlist Whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(songs[0]);
            })
        })
    } catch (error) {
        console.error("Error displaying albums:", error);
        // Fallback to demo albums
        let cards = document.querySelector(".cards");
        const demoAlbums = [
            {folder: "ncs", title: "No Copyright Sounds", description: "Royalty Free Music"},
            {folder: "cs", title: "Chill Stream", description: "Relaxing Music"},
            {folder: "Honey Singh", title: "Honey Singh", description: "Bollywood Hits"},
            {folder: "Pushpa Raj", title: "Pushpa Raj", description: "Movie Soundtracks"}
        ];
        
        demoAlbums.forEach(album => {
            cards.innerHTML = cards.innerHTML + ` <div data-folder="${album.folder}" class="card">
                    <div class="img2">
                        <img src="/songs/${album.folder}/cover.jpg" alt="${album.title}">
                    </div>
                    <p>${album.title}</p>
                    <span>${album.description}</span>
                    <div class="overlay">
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>`
        });
        
        //Load the Playlist Whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(songs[0]);
            })
        })
    }
}

async function main() {
    //get List of All the songs
    await getsongs("songs/ncs")
    playMusic(songs[0], true)

    //display all the albums on the page
    displayAlbums()

    //Attach an event listener to play, next, and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/img/pause.svg"
        } else {
            currentsong.pause()
            play.src = "/img/playsong.svg"
        }
    });

    //Add a Previous Event listener
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add a Next Event listener
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //listen for Time update function
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML
            = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    //Add a Event listener on seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100
    })

    //ADD a event Listner On hamburger
    document.querySelector(".hamburgur").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add Event Listner On close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //ADD a event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
    })

    //Add Event listener to mute the track
    document.querySelector(".sound>img").addEventListener("click", e => {
        if (e.target.src.includes("/img/volume.svg")) {
            e.target.src = e.target.src.replace("/img/volume.svg", "/img/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("/img/mute.svg", "/img/volume.svg")
            currentsong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}

main()                           