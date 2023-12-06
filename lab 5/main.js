"use strict";

let currentPage = 1;
let totalPages = 1;
let doc = document.querySelector('.mainBody');

let prevPageButtton = document.getElementById("prevPage"); 
let nextPageButtton = document.getElementById("nextPage");
let perPage = document.getElementById("recordPerPage");
let currentPageDisplay = document.getElementById("currentPageDisplay");
let startIndex = document.getElementById("start");
let endIndex = document.getElementById("end");
let totalCount = document.getElementById("totalCount");
let request = "";
let isStart = true;

function showReq(records) {
    for (let record of records) {
        let rec = document.createElement('div');
        rec.className = 'record';
        let recText = document.createElement('div');
        let recFio = document.createElement('div');
        recText.textContent = record['text'];
        recText.className = 'record-text';
        recFio.className = 'record-name';
        if (record['user']) {
            let name = record['user']['name'];
            recFio.textContent = `${name['first'] + ' ' + name['last']}`;
        }
        rec.append(recFio, recText);
        doc.append(rec);
    }
}


function getJson(page = 1) {
    let xhr = new XMLHttpRequest();
    let url = new URL('http://cat-facts-api.std-900.ist.mospolytech.ru/facts');

    url.searchParams.set("page",page);
    url.searchParams.set("per-page",perPage.value);
    url.searchParams.set("q",request);

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function() {
        clearBody();
        let responseObj = xhr.response;
        currentPage = responseObj['_pagination']['current_page'];
        calculateIndexes(responseObj['_pagination']);
        totalPages = responseObj['_pagination']['total_pages'];
        currentPageDisplay.textContent = currentPage;
        calculatePaginationButtons(responseObj['_pagination']);
        showReq(responseObj['records']);
        if (isStart) {
            prevNextButtonsisActive();
            isStart = false;
        }
    };
}

function clearBody() {
    while (doc.firstChild) {
        doc.removeChild(doc.firstChild);
    }
}

function calculateIndexes(pagination) {
    currentPage = pagination['current_page'];
    currentPageDisplay.textContent = currentPage;
    let perPageCount = pagination["per_page"];
    let start = 1 + ((currentPage-1) * perPageCount);
    let end = start + perPageCount - 1;
    let totalCount1 = pagination['total_count'];
    end = Math.min(end, totalCount1);

    startIndex.textContent = start;
    endIndex.textContent = end;
    totalCount.textContent = totalCount1;
}

function calculatePaginationButtons(pagination) {
    let totalPages = pagination['total_pages'];

    let start = Math.max(1, currentPage-2);
    let end = Math.min(totalPages, currentPage+2);
    if (currentPage-2 < 1) {
        end = Math.min(totalPages, end + 1-(currentPage-2));
    }
    if (currentPage+2 > totalPages) {
        start = Math.max(1,start-(currentPage+2-totalPages));
    }

    let pages = document.querySelector(".pages");
    pages.innerHTML = "";
    for (let i = start; i <= end; i++) {
        let button = document.createElement("button");
        button.textContent = i;
        if (i == currentPage) {
            button.classList.add("selected");
        }
        button.onclick = function() {
            isStart = true;
            getJson(i);
        }
        pages.append(button);
    }
}


getJson();

function prevNextButtonsisActive() {
    prevPageButtton.disabled = false;
    nextPageButtton.disabled = false;
    if (currentPage < 2) {
        prevPageButtton.disabled = true;
    }
    if (currentPage > totalPages-1) {
        nextPageButtton.disabled = true;
    }
}

perPage.onchange = function() {
    getJson();
}


prevPageButtton.onclick = function() {
    if (currentPage == 2) {
        prevPageButtton.disabled = true;
    }
    if (currentPage > 2) {
        prevPageButtton.disabled = false;
    }
    if (currentPage == totalPages) {
        nextPageButtton.disabled = false;
    }
    clearBody();
    getJson(currentPage-1);
};

nextPageButtton.onclick = function() {
    if (currentPage == totalPages-1) {
        nextPageButtton.disabled = true;
    }
    if (currentPage < totalPages-1) {
        nextPageButtton.disabled = false;
    }
    if (currentPage == 1) {
        prevPageButtton.disabled = false;
    }
    getJson(currentPage+1);
};


function myautocomplete() {
    let xhr = new XMLHttpRequest();
    let url = new URL('http://cat-facts-api.std-900.ist.mospolytech.ru/autocomplete');
    let searchInputValue = document.getElementById("searchInput").value;

    url.searchParams.set("q", searchInputValue);

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = function() {
        let responseObj = xhr.response;
        var suggestions = responseObj;
        var suggestionsList = document.getElementById("suggestionsList");

        suggestionsList.innerHTML = '';


        for (var i = 0; i < suggestions.length; i++) {
            var listItem = document.createElement('li');
            listItem.textContent = suggestions[i];
            listItem.onclick = function() {
                request = this.textContent;
                isStart = true;
                getJson();
                hideSuggestions();
            }
            suggestionsList.appendChild(listItem);
        }
    };
}

let suggestionsContainer = document.getElementById("suggestionsList");

function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
}

document.addEventListener('click', function(event) {
    var isClickInside = suggestionsContainer.contains(event.target) || document.getElementById("searchInput").contains(event.target);

    if (!isClickInside) {
        hideSuggestions();
    }
});

document.getElementById("searchInput").addEventListener('click', function() {
    suggestionsContainer.style.display = 'block';
});

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        isStart = true;
        request = document.getElementById("searchInput").value;
        hideSuggestions();
        getJson();
    }
});