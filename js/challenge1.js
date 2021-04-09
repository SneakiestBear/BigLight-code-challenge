//Scope variables
(function() {
    "use strict";
    
    //function to check if it's mobile
    function testMobile() {
        return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    var DOMWait = setInterval(function() {

        //DOM elements to wait for
        var overlayTrigger = document.getElementById("mobileQuantityDropDown");
        var basketButton = document.getElementById("add-to-cart-button");
        var pageContainer = document.getElementById("a-page");
        var quantityContainer = document.getElementById("mobileQuantity_feature_div");
        var buttonContainer = document.getElementById("buybox.addToCart");

        if (overlayTrigger && basketButton && pageContainer && quantityContainer && buttonContainer && testMobile()) {
            clearInterval(DOMWait);
            clearTimeout(DOMWaitCancel);

            //Clone the existing dropdown
            var selectClone = quantityContainer.querySelector("[name='quantity'] + span").cloneNode(true);

            //Clone the existing button 
            var buttonClone = buttonContainer.cloneNode(true);
            buttonClone.id = "opti_button-clone";

            //Add a click event to the cloned button to click the basket button
            buttonClone.addEventListener("click", function() {
                basketButton.click();
            });

            //Add a click event to the select clone to trigger the overlay
            selectClone.addEventListener("click", function() {
                document.getElementById("mobileQuantityDropDown").click();
            });
            selectClone.id = "opti_trigger";

            quantityContainer.parentNode.insertBefore(selectClone, quantityContainer)

            //Insert sticky component to DOM
            !document.querySelector(".opti_mobile-sticky") ? pageContainer.insertAdjacentHTML('beforeend', '<div class="opti_mobile-sticky"></div>') : null;
            
            //Append the existing quanitity button to the Sticky
            document.querySelector(".opti_mobile-sticky").prepend(quantityContainer);

            document.querySelector(".opti_mobile-sticky").appendChild(buttonClone);

            //Function to observe the DOM and check for changes
            function setObserver(target) {

                //Mutations to observe
                var mutConfig = { childList: true };

                // Callback function to execute when mutations are observed
                var mutCallback = function() {
                    document.querySelector("#opti_trigger .a-dropdown-prompt").textContent = target.textContent;
                };

                // Create an observer instance linked to the callback function
                var observer = new MutationObserver(mutCallback);

                // Start observing the target node for configured mutations
                observer.observe(target, mutConfig);
            }
            
            setObserver(document.querySelector(".opti_mobile-sticky .a-dropdown-prompt"));


            //Function to check if an element is in the viewport
            function isElementInViewport(element) {

                //DOMRect object which says the size and location of an element relative to the viewport
                var rect = element.getBoundingClientRect();

                return (
                    rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }

            //Debounce function to stop too many function calls on scroll for page performance (Taken from StackOverflow)
            function debounce(func, wait, immediate) {
              var timeout;

              return function executedFunction() {
                var context = this;
                var args = arguments;

                var later = function() {
                  timeout = null;
                  if (!immediate) func.apply(context, args);
                };

                var callNow = immediate && !timeout;

                clearTimeout(timeout);

                timeout = setTimeout(later, wait);

                if (callNow) func.apply(context, args);
              }
            }

            //Function on scroll to check if the button is visible in the viewport
            var scrollFunction = debounce(function() {

                var stickyEl = document.querySelector(".opti_mobile-sticky");

                //If the element is in the viewport, change the bottom styling to minus the amount of the sticky element height
                if (isElementInViewport(buttonContainer)) {
                    stickyEl.style.bottom = "-" + stickyEl.offsetHeight + "px";
                } else {
                    stickyEl.style.bottom = 0;
                }
            }, 150);

            //Bind the callback function to the window scroll event
            window.addEventListener('scroll', scrollFunction);

        }
    },300);

    //Wait 3 seconds, if it can't find all DOM elements or isn't mobile, cancel interval
    var DOMWaitCancel = setTimeout(function() {
        clearInterval(DOMWait);
    },3000);

})();