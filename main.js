const form = document.querySelector("form")
const results_container = document.querySelector("#results")

async function getResults(query){
    let response = await fetch("/search?s=" + query);
    // let response = await fetch("http://localhost:3000/search?s=" + query);
    let data = await response.json();
    return data;
}

function handleOnSubmit(event) {
    event.preventDefault();

    const query = form.querySelector("input").value.trim()

    if(query.length > 0) {
        doSearch(query);
    }
}

form.onsubmit = handleOnSubmit;


async function doSearch(query) {

    results_container.innerHTML = `<span class="loader">Searching</span>`;

    const json = await getResults(query); 
    let results = [];

    for(let track of json) {
        results.push(`<a href="${track.url}" class="track" download="${track.title}.mp3 target="_blank"><img src=${track.pic}> <span>${track.title}</span></a>`);
    }

    results_container.innerHTML = results.join(' ');

}