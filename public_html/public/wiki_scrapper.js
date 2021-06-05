// reference for how to call API: https://stackoverflow.com/questions/24806962/get-an-article-summary-from-the-mediawiki-api

baseURL = "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro=&explaintext=&titles="
document.addEventListener('DOMContentLoaded', bindButton);
document.addEventListener('DOMContentLoaded', bindText);

function bindButton(){
    // when user clicks on "submit" button on front-end, will trigger a POST request to the backend node.js server
    // node.js server will call on Wikipedia API and return scrapped data
    document.getElementById('userSubmit').addEventListener('click', function(event){
    console.log("clicked submit button");

    var req = new XMLHttpRequest();

    let data = {};
    data.wiki = document.getElementById("wikiLink").value;
    console.log("sent data:", data);

    req.open("POST", 'http://flip3.engr.oregonstate.edu:2526' + '/web_api', true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            let requestedData = JSON.parse(req.responseText);
            let summaryText = requestedData.summary
            console.log("Receive Data from Server:")
            console.log("-------------------------------------------------")
            console.log(requestedData);

            if (summaryText == undefined || summaryText.length == 0){
                noResult();
            }
            else{
                showResult(requestedData);
            }
        }
        else{
            console.log("Error in network request:" + req.statusText)
        }
    });
        req.send(JSON.stringify(data));
        event.preventDefault();
    });
}

function showResult(returned_data){
    // send Wikipedia Summary data + overall connotation to client-side

    let resultsParagraph = document.getElementById("resultsHeader");
    resultsParagraph.innerText = returned_data.summary;
    let connotation = document.getElementById("resultsConnotation");
    connotation.innerText = returned_data.sentiment;

    changeVisibility("change");
    retryButton();
}

function retryButton(){
    let retryButton = document.getElementById('retryButton');
    retryButton.style.visibility = "visible";

    retryButton.addEventListener('click', function(event){
        changeVisibility("reset");
        location.reload(true);
    });
}

function changeVisibility(status){
    // changes visibility of Wikipedia summary data, connotation, form, save button

    let summaryDiv = document.getElementById("wikiSummary");
    let connotationDiv = document.getElementById("overallConnotation");
    let formDiv = document.getElementById("userForm");
    let saveButton = document.getElementById("saveButton");

    if(status == "change"){
        summaryDiv.style.visibility = "visible";
        connotationDiv.style.visibility = "visible";
        saveButton.style.visibility = "visible";
        formDiv.style.visibility = "hidden";
    }
    else{
        summaryDiv.style.visibility = "hidden";
        connotationDiv.style.visibility = "hidden";
        saveButton.style.visibility = "hidden";
        formDiv.style.visibility = "visible";
    }
}

function bindText(){
    // when user clicks on "click HERE" for additional information
    // shows the the additional information about the API/website
    document.getElementById("addText").addEventListener('click', function(event){
        let infoButton = document.getElementById('addInfo');
        if(infoButton.style.visibility == "hidden"){
            document.getElementById('addInfo').style.visibility = "visible";
        }
        else{
            document.getElementById('addInfo').style.visibility = "hidden";
        }
    })
}

function noResult(){
    // triggered when the user searches for a non-existing term or messes up the search item
    // send user to error.html
    window.location = "http://web.engr.oregonstate.edu/~leeju2/public/error.html"
}