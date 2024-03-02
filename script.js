const resultNav = document.getElementById('resultNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// api nasa

const count = 10;
const apiKey = 'KELl70Bx6hPxxc9ot0OjVlcdWAlWcaPltR5vXCeQ';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page) {
    window.scrollTo({top : 0  , behavior : "instant"});
    if(page === 'favourites') {
        resultNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    } else {
        resultNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
    currentArray.forEach((result) => {
        // card container
        const card= document.createElement('div');
        card.classList.add('card');

        // link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = "_blank";

        // image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = "NASA Picture Of The Day";
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        // card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        
        // image title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        // add favourite
        const cardFavouriteBtn =  document.createElement('p');
        cardFavouriteBtn.classList.add('clickable');
        if(page === 'results') {
            cardFavouriteBtn.textContent = "Add To Favourite";
            cardFavouriteBtn.setAttribute("onclick" , `saveFavourite('${result.url}')`);
        } else {
            cardFavouriteBtn.textContent = "Remove From Favourite";
            cardFavouriteBtn.setAttribute("onclick" , `removeFavourite('${result.url}')`);
        }
        // card text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;

        // date and copyright
        const info = document.createElement('small');
        info.classList.add('text-muted');
        // date
        const publishDate = document.createElement('strong');
        publishDate.textContent = result.date;
        // copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        info.append(publishDate,copyright);
        cardBody.append(cardTitle,cardFavouriteBtn,cardText,info);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card)
    });

}

// Update DOM
function updateDOM(page) {
    if(localStorage.getItem('nasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
    }
    imagesContainer.textContent ='';
    createDOMNodes(page);
    showContent(page);
}

// get nasa pictures
async function getNasaPictures() {
    loader.classList.remove('hidden');
    try {
        const responds = await fetch(apiURL);
        resultsArray = await responds.json();
        updateDOM('results');
    } catch (error) {
        console.log(error);
    }
}

// save favourite
function saveFavourite(itemURL) {
    // loop through results array to select favorites
    resultsArray.forEach((item) => {
        if(item.url.includes(itemURL) && !favourites[itemURL]){
            favourites[itemURL] = item;
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            },2000);
            // save favourite to local storage
            localStorage.setItem('nasaFavourites' , JSON.stringify(favourites));
        }
    })
}

// remove favourite
function removeFavourite(itemURL) {
    if(favourites[itemURL]) {
        delete favourites[itemURL];
        localStorage.setItem('nasaFavourites' , JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

getNasaPictures();