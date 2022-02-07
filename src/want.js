import Champagne from "../modules/champagne.js";
import { triBackground, userCanColors } from "../modules/functions-want.js";

// Watching this because of iOS
let windowWidth = window.innerWidth;
// Need access to theParty
let theParty;

window.addEventListener("load", function() {
  theParty = new Champagne("champagne");
  triBackground();
  userCanColors();
  theParty.bubblesListen();
});

window.addEventListener('resize', function() {
  // Doing this because of an issue on iOS Safari
  if ( windowWidth != window.innerWidth) {
    setTimeout(function () {
      theParty.refreshSize(window.innerWidth, window.innerHeight);
      triBackground();
    }, 30)

    windowWidth = window.innerWidth;
  }
});
