document.addEventListener('DOMContentLoaded', bindButton);

function bindButton(){
    // when user clicks on back button, will take to main index.html page
    document.getElementById('errorBackButton').addEventListener('click', function(event){
        window.location = "http://web.engr.oregonstate.edu/~leeju2/public/index.html"
    });
}