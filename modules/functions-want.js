const trianglify = require('trianglify');

const updateColors = () => {
  const inputs = colorInputs();
  let newCols = [];
  // Get colors from color inputs
  // and put them in our newCols array
  for (const input of inputs) {
    newCols.push(input.value);
  }

  colorDivs(newCols);
  // Don't include col1 in the Trianglify background
  // Use white instead
  // This is for aesthetic
  newCols = newCols.slice(2, 4);
  newCols = ["#ffffff", ...newCols];
  // Redo the Trianglify background
  triBackground(newCols);
}

// Update the relevant divs when a user adjusts the site's colours
// Expects to recieve all the new colors as an array
const colorDivs = (newCols) => {
  // Their are five CSS color classes used to color elements on the website
  // col1, col2, col3, col4, col5
  const colRefs = ["1", "2", "3", "4", "5"];
  // Loop through all the elements based on their class and update them
  colRefs.forEach((v, i) => {
    const elements = document.getElementsByClassName(`col${v}`);
    // Loop though the class elements
    for (const el of elements) {
      el.style.backgroundColor = newCols[i];
      el.style.fill = newCols[i];
      // If the element has text
      // ensure the text legible on the updated color
      if ( el.classList.contains("txt") ) {
        el.style.color = textContraster(newCols[i]);
      }
      // If child elements (of the element) have text
      // ensure their text legible on the updated color
      const txts = el.getElementsByClassName("txt");
      if ( txts.length > 0 ) {
       for (const txt of txts) {
         txt.style.color = textContraster(newCols[i]);
         // The Poshcock logo is an SVG
         // letters in the logo are paths
         txt.style.fill = textContraster(newCols[i]);
       }
      }
    }
  });
}

// Function to get the color inputs
// These inputs enable the user to play with the site's colors
const colorInputs = () => {
  // Get the inputs
  const serviceContent = document.getElementById("services"),
        servicePlay = document.getElementsByClassName("intermission")[0], //We kow they're in the first intermission
        colorInputs = servicePlay.getElementsByTagName("input");

  return colorInputs;
}

// Babylon.js has it's own color refrences
const hexToBabylon = (hex) => {
  // Convert HEX to rgb
  const rgbCol = hexToRGB(hex);
  // Convert RGB color object to Babylon.js color object
  const babCol = rgbCol
                 ? {
                    r: (rgbCol.r / 255).toFixed(1), // number should have a single decimal
                    g: (rgbCol.g / 255).toFixed(1),
                    b: (rgbCol.b / 255).toFixed(1),
                   }
                 : false;
  // Conver RGB to Babylon colors
  return babCol;
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRGB = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  // Convert HEX to rgb
  const rgbCol = result
              ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
                }
              : false;

  return rgbCol;
}

// As the user can change the site's Colors
// We need a function to ensure the text is legible
// ... so we don't get black text on a black background for example
// Returns a color for text based on the color passed as a parameter
const textContraster  = (hexCol) => {
  // Conver the hex color to RGB so we can compare it
  const rgbCol = hexToRGB(hexCol);
  // Get YIQ ratio
  // https://en.wikipedia.org/wiki/YIQ
	const yiq = ((rgbCol.r * 299) + (rgbCol.g * 587) + (rgbCol.b * 114)) / 1000;
  // Returns black or white
  return (yiq >= 128)
         ? '#000'
         : '#fff';
}

const triBackground = (colors = [ "#ffffff", "#ffb7b2", "#ffdac1", "#ffffff" ]) => {
  /*
   * We had to bring Trianglify back into the mix. Used as a background for services section. See https://github.com/qrohlf/trianglify
   * Trianglify start
   */
    let pattern;

    pattern = trianglify({
      width: window.innerWidth,
      height: window.innerHeight * 2, // Don't want to see seams on landscape orientated screens
      cellSize: 1000,
      xColors: colors,
      yColors: 'match',
      });
    // Convert pattern to SVG and prepare SVG for insertion via JavaScript
    const svg = pattern.toSVG();
    // XMLSerializer interface provides the serializeToString() method to construct an XML string representing a DOM tree.
    const s = new XMLSerializer();
    const str = s.serializeToString(svg);
    //The btoa() method encodes a string in base-64
    const encoded = window.btoa(svg);

    document.getElementById("services").style.backgroundImage = "url('data:image/svg+xml;base-64,"+str+"')";
}
// Let user change site colors
const userCanColors = (bubObj) => {
  // Get color  inputs
  const inputs = colorInputs();

  for (const input of inputs) {
    // Update colors when user changes the color
    input.addEventListener("input", updateColors, {passive: true});
  }
}

export {
  colorInputs,
  hexToBabylon,
  triBackground,
  userCanColors
}
