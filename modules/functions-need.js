import { elementScrollIntoView } from "seamless-scroll-polyfill";

// Close project presentation modal
const closePresentation = () => {
  // Get the parent element
  const parentElement = event.srcElement.parentNode;
  // Remove the active class which turns it into a modal
  parentElement.classList.remove("active");
  // Let the body scroll again
  document.body.classList.remove("modal");
  // Empty the content
  return parentElement.innerHTML = "";
}

// Function to present the relevant Google Slide presentation when a project links is clicked
const portfolioPresent = (e) => {
  e.preventDefault();
  // Google Slide key is stored as a data attribute
  const element = document.getElementById("presentation"),
        key = e.target.dataset.presentationKey;
  // Create an empty string so we can fill it with HTML content and insert into the relevant HTML element
  let content = "";
  // Add HTML markup as a strings
  content += "<span class='how-to'/>Swipe or click to view slides</span>";
  content += "<img src='images/circleClose.svg' alt='Close icon' class='close ready'/>";
  content += `<iframe src="https://docs.google.com/presentation/d/e/2PACX-${key}/embed?start=true&loop=true&delayms=4000&rm=minimal" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`;
  // Insert the content
  element.innerHTML = content;
  // Activate the modal
  element.classList.add("active");
  // Disable body scroll via a CSS class
  document.body.classList.add("modal");
  // Get the close link so we can attach a close function
  const closeLinks = document.getElementsByClassName("close");
  // Attach the close function via a listener
  closeLinks[0].addEventListener('click', closePresentation);
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

// Add a listener to the project links in the portfolio section
const portfolioListen = () => {
  // Get the links
  const projects = document.getElementById("projects");
  const projectLinks = projects.getElementsByTagName("img");
  // Add a linstener to each link
  for (const link of projectLinks) {
    link.addEventListener('click', portfolioPresent);
  }
}

// Add a listener for nav elements so they scroll to the selected area
const scrollNav = () => {
  // Get the nav links
  const navLinks = document.getElementsByClassName("nav-link");
  // Add a listener to each link
  for (const link of navLinks) {
    link.addEventListener('click', scrollToId);
    // We're not showing the links until the site is ready
    // If scrollNav is called, the document is ready and we'll show the links
    link.classList.add("ready");
  }
}

// Scroll to element function
const scrollToId = (e) => {
  e.preventDefault();
  // Get the elements to scroll to
  const id = e.target.getAttribute("href");
  const el = document.querySelector(id);
  // Adjust scroll position based on portrait or landscape
  // excluding services
  if( window.innerHeight < window.innerWidth ) {
    if ( id !== "#services") {
      // Using seamless as ScrollIntoView options aren't supported on iOS
      return elementScrollIntoView(el, { behavior: 'smooth', block: "end" });
    }
  }

  return elementScrollIntoView(el, { behavior: 'smooth' });
}

export {
  portfolioListen,
  scrollNav
}
