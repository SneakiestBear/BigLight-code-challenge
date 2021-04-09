//Scope variables
(function() {
    "use strict";

    //Banner data, to make it easier to change codes and text
    var bannerData = {
        headerText: "Get 50% off</br>all Amazon products",
        codeSuppText: "Use code:",
        discCode: "AZ50",
        TandCtext: "T&Cs Apply"
    }

    //function to check if it's mobile
    function testMobile() {
        return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    var searchResultsWait = setInterval(function() {

        //DOM elements to wait for
        var resultsContainer = document.querySelector(".s-result-list.s-search-results");
        //Array.prototype.slice.call used for browser compatability, and to also be able to configure which slot to insert the banner
        var searchResults = Array.prototype.slice.call(document.querySelectorAll("[data-component-type='s-search-result']"));

        if (resultsContainer && searchResults.length > 0 && testMobile()) {
            clearInterval(searchResultsWait);
            clearTimeout(DOMWaitCancel);

            //Function to generate the bannerHTML
            function generateBanner() {
                return '<div class="opti_discount-banner">\
                            <div class="opti_discount-inner">' +
                                (bannerData.headerText ? '<h2>'+ bannerData.headerText +'</h2>' : '') +
                                (bannerData.codeSuppText && bannerData.discCode ? '<h4>'+ bannerData.codeSuppText +'<span class="opti_discount-code">'+ bannerData.discCode +'</span></h4>' : '') +
                                (bannerData.TandCtext ? '<h5>'+ bannerData.TandCtext +'</h5>' : '') +
                            '</div>\
                        </div>'
            }
            
            //Initial code to insert into the DOM
            !document.querySelector(".opti_discount-banner") ? searchResults[0].insertAdjacentHTML('afterend', generateBanner()) : null;

            //Function to observe the DOM and check for changes
            function setObserver(target) {

                //Mutations to observe
                var mutConfig = { childList: true };

                // Callback function to execute when mutations are observed
                var mutCallback = function() {

                    //Mutation observer call fired, and then waits for results to be generated
                    var mutatedResultWait = setInterval(function() {

                        searchResults = Array.prototype.slice.call(document.querySelectorAll("[data-component-type='s-search-result']"));

                        if (searchResults.length > 0) {
                            clearInterval(mutatedResultWait);
                            !document.querySelector(".opti_discount-banner") ? searchResults[0].insertAdjacentHTML('afterend', generateBanner()) : null;
                        }
                    },300);
                };

                // Create an observer instance linked to the callback function
                var observer = new MutationObserver(mutCallback);

                // Start observing the target node for configured mutations
                observer.observe(target, mutConfig);
            }
            
            setObserver(resultsContainer);
        }
    },300);

    //Wait 3 seconds, if it can't find all DOM elements or isn't mobile, cancel interval
    var DOMWaitCancel = setTimeout(function() {
        clearInterval(searchResultsWait);
    },3000);
})();