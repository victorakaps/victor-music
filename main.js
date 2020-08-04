const form = document.querySelector("form")
const results_container = document.querySelector("#results")


async function getResults(query){
    let response = await fetch("http://localhost:3000/search?s=" + query);
    let data = await response.text();
    return data;
}

function handleOnSubmit(event) {
    event.preventDefault(); // stop page changing to #, which will reload the page

    const query = form.querySelector("input").value.trim()

    if(query.length > 0) {
        doSearch(query);
    }
}

form.onsubmit = handleOnSubmit;


async function doSearch(query) {

    results_container.innerHTML = `<span class="loader">Searching</span>`;

    const json = await getResults(query); 
    console.log(json);
    let results = [];

    for(let track of json) {
        results.push(`<a href="./${track.Main_URL}" class="track"><img src="${track.Pic_URL}"> <span>${track.Title}</span></a>`);
    }

    results_container.innerHTML = results.join(' ');

}
