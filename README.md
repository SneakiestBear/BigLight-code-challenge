# BigLight-code-challenge
Code challenges for Biglight

**npm install**

To run the node server on port 7000: **node index.js**

To run the sass compiler: **npm run sass**


**Structure:**
Because this is a relatively small project I felt best way to structure this was to simply have a folder for the JS files, a folder for the SASS files and a folder for the CSS files, this kept everything together neatly. If the project were bigger I'd likely have gone for a structure where I put the challenges in their own separate folders with all their associated files.


**Challenge 1:**

A brief look at the example showed me that the majority of the test was relatively simple, docking a bar to the viewport and displaying or hiding it based on an elements relative location is something I've done before, my main concern was selecting the quantity of products and actually adding those to the basket, so I had a few attempts and failures before I got to my solution of how to actually select the quantity.


**Attempt 1** - Try and change the value of the select with Javascript:

document.getElementById("mobileQuantityDropDown").value = 2

The first thing I always try is the easiest, can I simply change the value of the dropdown in the Chrome console. Trying this added the additional product to the UI, but when adding to basket it didn't add the additional selected options. I checked in the elements and saw that the select still had the option of "1" selected, so I attempted to also set the attribute of the option "2" to selected, and still no luck. My assumption after this is that because they've used a custom Select, they've bound events to the UI to be able to change the quantity.


**Attempt 2** - Can I simply just use their overlay, attach an onChange event to my own select and make it click the correct quantity from the UI (They use ID's with this structure "mobileQuantityDropDown_1")

Firstly, does the overlay exist on page load? Unfortunately not

So can I force the overlay to render, hide it temporarily, and unhide it after it has rendered? Yes but no, by forcing a click on the quantity select I could get the overlay to generate, but unfortunately this only works when the quantity DOM element is visible on the page, so if I attempted to change the quantity at the top of the page it wouldn't work. 

At this point I was stuck for a good while, going back over trying to get the overlay to generate, trying to select the quantity with JS and none were working. Then my solution hit me:


**Attempt 3** - Hijack the pre-existing select with all the events correctly bound, put it into the sticky so it's always in the viewport, and add a new select in the page as a trigger for the select in the sticky

Finally success, by moving the existing element so it was always visible, I could put a new trigger in the page which just clicked the element I moved, it kept all the Amazon styling, all their events were still bound and the experience was something I was happy with. 

The only challenge after this was getting the number to update, there was two options, a mutationObserver to look at when the amazon quantity selector was changed, or run a setInterval indefinitely that just compared the two numbers to see if one needed to be updated, because the observer only needed to be attached the one span the performance was better by just attaching that, rather than running a script indefinitely. 
In the scroll event I also added a debounce function, scrolling on a page has a tendancy to fire off hundreds of events very quickly, so by setting a limit to one event every 150ms it helps cut down excessive events and help with page performance, it does mean that the sticky disappears and appears with a 150ms delay, but the benefits outweigh the small delay the element has.
The reason for cloning the button over making my own new one was that Amazon is running a test with multiple button styles, so by cloning what's on the page it made it look consistent with what they have on the site.



**Challenge 2:**

This was something I was more familiar with, adding a banner to the UI and making sure it stays there after filters are clicked is something I've done a lot of times at TUI. My normal approach would be to see if there's any events which fire that I can hook in to, failing that the same solution as above would be the best bet, a mutationObserver or an interval. I couldn't see any events that I could bind my code to, thankfully my first attempt at attaching an observer only fires off a single event, so it made for a nice performant solution rather than running an interval.

The thought process behind the way I set this up was that with banners and promocodes, it's always something that has come from a commercial team at a business, and always something that can quickly change or be updated or reused with minor tweaks to copy or the code itself, so by adding a data object to the top, rather than digging through the code every time to make small tweaks, it's very straight forward. With this set up we've allowed our Merchandising team at TUI to update banners and make tweaks themselves without any input from a developer.

In the generateBanner function I made sure to check any of the values weren't null or undefined before adding that element to the DOM, if they are they just get skipped, and it also doesn't mess with the spacing of the banner itself.
