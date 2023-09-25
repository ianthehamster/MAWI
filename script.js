'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Tabbed components
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault(); // prevents page from jumping to the top due to default html link 'a' to "#"
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal); // node list as it is the result of querySelectorAll and thus, it has the forEach method that can be used on

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  //getBoundingClientRect changes with the scrolling of the browser (viewport)
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect()); //target refers to btnScrollTo
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // y coordinate is the distance between viewport at the current position and the top of the page

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // gives the height and width of the viewport of the page (which is the visible page to the user)

  // // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); // current position + current scroll

  // Old version of scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Tabbed component

// Event delegation (attach the event handler on common parent element of all the elements we are interested in (i.e., tab containers))
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // closest() method finds the closest parent with the class name '.operations__tab' which is the button itself so no matter where we click, we will always get the button element, not the span or div element

  // Guard Clause (if statement returns early if there is nothing clicked -> return null (falsy), !falsy will become true and none of the code after this will be executed)
  if (!clicked) return;

  // alternate guard clause
  // if (clicked) {
  //   clicked.classList.add('operations__tab--active');
  // }

  // Remove active classes
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // Activate tab

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');

  // Recap
  // Building componenets is simply adding and removing classes as necessary to manipulate the content we want to see
});

// Menu fade animation (event delegation)
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // this keyword is same as currentTarget (element in which eventListener is attached to). We can also set this keyword manually

    const link = e.target;
    // selecting sibling elements (through parent element)
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img'); // searching for any img sibling events of nav__link

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      // making all the elements that are not target element translucent!
    });
    logo.style.opacity = this;
  }
};

// Passing "arguemnt" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
/**
 * the bind method is used to bind a specific value to the this keyword within the handleHover function
 * By using bind, you can pass an argument (i.e., 0.5 and 1) to set the value of 'this' when the handleHover function is called
 */

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
// avoid scroll events as it has performance issues and fires all the time, no matter how small the scroll is

// Intersection Observer API

// const obsCallback = function (entries, observer) {
//   // obsCallback function will get called each time observed element (section 1) is intersecting the root element at the threshold of 10%
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   // target that element (section1) is intersecting
//   threshold: [0, 0.2],
//   // 0% threshold means our obsCallback will be called each time the target element moves completely out of view or as soon as it enters the view
//   // the 20% threshold calls obsCallback once target element is 20% in view of the window (since root is null)
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
// // whenever section1 is intersecting the viewport (null) at 10%, we call obsCallback function, no matter if we are scrolling up or down

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // interested in entire viewport
  threshold: 0, // when 0% of the header is visible, we want to call our callback function, stickyNav
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; // guard clause: isIntersecting is false, return and end the function, otherwise, proceed below

  entry.target.classList.remove('section--hidden');

  // We need to unobserve the elements to improve performance, otherwise browser will keep observing
  observer.unobserve(entry.target); // since we are targeting the entry target
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src as data-src is the true clear image
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // exactly 200 pixels before any image is loaded, it should already start loading
});

imgTargets.forEach(img => {
  imgObserver.observe(img); // loop the imgTarget node list to call imgObserver to observe each lazy image
});

//Slider
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // -100%, 0%, 100%, 200%
  /**
   * e.g. curSlide = 1
   * As we loop over the slide, in the first iteration, i will be 0 and 0-1 will be -1 * 100% = 100%
   * So on and so forth for subsequent iterations
   */

  // Functions
  const createDots = function () {
    slides.forEach(function (s, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
      // creating HTML elements using insertAdjacentHTML
    });
  };

  // to change dot color when clicked on current slide
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // if statement version
    if (e.key === 'ArrowLeft') prevSlide();

    // Short Circuiting version
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // Destructuring using {}
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

sliders();

// we use parent container (class=nav) to bubble up from their target
/////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); // prevents page from scrolling in the browser
//     const id = this.getAttribute('href'); // this refers to current element and we only want the href attribute
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event Delegation
/**
 * 1. add event listener to the common parent element of all the elements we are interested in
 * 2. Determine what element originated the event
 */
// Parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target); // where the element originated from
  e.preventDefault();

  // Matching strategy (ignore clicks that did not happen on one of the three links)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); // this refers to current element and we only want the href attribute
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/** DOM is interface between all Javascript code and the HTML documents that are rendered in and by the browser
 * we can create, modify, delete html elements
 * DOM tree is generated from any html document, which we can then interact with
 * DOM API contains methods and properties (addEventListener, createElement, textContent etc.) that we can use to interact with the DOM tree
 * Some nodes are HTML elements while some can be text
 */

/** How the DOM API is organized behind the scenes
 * Every node in the DOM tree is of type, node, and is represented in JS by an object
 * This object gets access to special node methods nad properties like textContent, childNodes, parentNodes etc.
 * The node has child types (element, text, comment, document type) so whenever there is text inside an element, it gets its own node of type text
 *
 */

// // Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header'); // return first element that matches the class 'header'

// // Node list
// const allSections = document.querySelectorAll('.section'); // selects all elements that contains the class 'section'
// console.log(allSections); //Node list of all section classes elements. Note that even if one section is deleted, the number of sections remain at the original 4 as allSections variable was created before any sections were deleted

// // HTML collection (live-collection)
// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button'); // variable allButtons stores all the button elements in it

// console.log(allButtons); // HTML collection (live-collection) as if the DOM changes, the collection is updated automatically. E.g. if button 7 was removed, the number of buttons logged to the console changes from 9 to 8.

// console.log(document.getElementsByClassName('btn')); // HTML collection too of all elements with class name 'btn'

// // Creating and inserting elements
// /** we can create elements using the insertAdjacentHTML function*/
// const elementTest = document.getElementById('section--1');
// const htmlToInsert = `<div>Testing the insertAdjacentHTML function</div>`;

// elementTest.insertAdjacentHTML('beforeend', htmlToInsert);

// // Build an element that displays accept cookies message at bottom of the screen
// const message = document.createElement('div'); // returns a DOM element div, saved in message variable but not yet on the DOM

// message.classList.add('message'); // adding css class 'cookie-message' to the new div element
// // message.textContent =
// //   'We use cookies for improved functionality and analytics.'; // inserts text
// // message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>`;
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// // header.prepend(message); //prepend adds as first child of the header element
// header.append(message);
// /** we can use prepend and append to move elements as each DOM element is unique and can only exist at one place at a time*/

// header.before(message); // insert before header element as a sibling
// header.after(message); // insert after header element as a sibling

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height); // empty output as console.log only works for inline styles that we set ourselves
// console.log(message.style.width); // 120%

// // how do we console.log external stylesheets?
// console.log(getComputedStyle(message).height); // 171px

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// /** we use Number.parseFloat to convert the computed height of an element to a numerical value
//  * 1. getComputedStyle function returns the computed style of an element, including its height. However, it is returned as a string with a unit, such as 200px or 50%
//  * 2. Number.parseFloat function parses the string representation of the computed height and extract the numerical value (i.e., it converts the string "200px" to the number 200)
//  * 3. After parsing the height value as a number, it is incremented by 40 using the + operator
//  * 4. Number data type result is then concatenated with the string 'px' to return a valid CSS value
//  */

// // changing --color-primary to orangered using setProperty() method
// document.documentElement.style.setProperty('--color-primary', 'orangered'); //:root refers to the document body of the html

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt); // Bankist logo
// console.log(logo.src); // http://127.0.0.1:5500/img/logo.png and it is the absolute URL while the url in html is relative URL , as in relative to the folder in which the index.html file is located
// console.log(logo.getAttribute('src')); // img/logo.png (relative URL)
// console.log(logo.className); // nav__logo

// logo.alt = 'Beautiful minimalist logo';

// // Non-standard
// console.log(logo.designer); // undefined
// console.log(logo.getAttribute('designer')); // Jonas
// logo.setAttribute('company', 'Bankist'); // logo now has a new attribute, company, with a value of 'Bankist'

// /** on img element, it has the src and alt attributes on them and Javascript creates these properties
//  * if we add a different attribute, say, designer, it will return undefined as designer is not standard attribute for img element
//  */

// // links
// const link = document.querySelector('.twitter-link');
// console.log(link.href); // https://twitter.com/jonasschmedtman
// console.log(link.getAttribute('href')); // https://twitter.com/jonasschmedtman as both these links are absolute

// const linkBtn = document.querySelector('.nav__link--btn');
// console.log(linkBtn.href); // http://127.0.0.1:5500/# (absolute URL)
// console.log(linkBtn.getAttribute('href')); /// #

// // Data Attributes (used to store data in user interface (html code))
// console.log(logo.dataset.versionNumber); // 3.0 as they are stored in the dataset object. The html attribute reads as data-version-number="3.0"

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// Don't use as it will override existing class since we can only put one class on each element
// logo.className = 'jonas'

/** event is a signal that is generated by a certain DOM node and a signal means something has happened (e.g, mouse click, full screen mode) */

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // removing event listener after 3 seconds

// alternative way of attaching event listener to element
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };

// // Random Color Exercise
// // rgb(255, 255, 255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // this keyword points to element that the event handler is attached (i.e., .nav__link)
//   console.log('LINK', e.target, e.currentTarget); /// target is where the event originated, not the element where the event is attached
//   // currentTarget is element where the event is attached
//   console.log(e.currentTarget === this); // true as this keyword is the currentTarget (this keyword points to element where event is attached)

//   // Stop event propagation
//   // e.stopPropagation(); // stops propagation (bubbling) up to the parent elements so colors will not change in parent elements
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // console.log('LINK');
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
//   console.log(e.currentTarget === this); // true
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     // console.log('LINK');
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   false
// );

// Capturing phase is not as useful while bubbling phase is good for event delegation

// Capturing phase
// document.addEventListener(
//   'click',
//   function (event) {
//     console.log('Capture phase: Document');
//   },
//   true
// );

// document.getElementById('logo').addEventListener(
//   'click',
//   function (event) {
//     console.log('Capture phase: Element');
//   },
//   true
// );

// Bubbling phase
// document
//   .getElementById('section--1')
//   .addEventListener('click', function (event) {
//     console.log('Bubbling phase: Element');
//   });

// document.addEventListener('click', function (event) {
//   console.log('Bubbling phase: Document');
// });

//

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// selected closest parent element with header class and applied background style to that parent element

// h1.closest('h1').style.background = 'var(--gradient-primary)';
// selected closest h1 parent element with h1 element and applied background style to that parent element

/** closest() is opposite of querySelector()
 * both receive a query string as input but querySelector() finds children no matter how deep in the DOM tree they are
 * closest() finds parents no matter how far up the DOM tree they are
 */

// Going sideways: selecting direct siblings
// console.log(h1.previousElementSibling); // null as there h1 is the first child of the parent element
// console.log(h1.nextElementSibling); // h4 element

// console.log(h1.previousSibling); // #text
// console.log(h1.nextSibling); // #text

// console.log(h1.parentElement.children); // returns an HTML collection (iterable that can be spread into an array) all of the children of the parent element!

// [...h1.parentElement.children].forEach(function (el) {
//   // using spread operator to create array out of HTML collection and use forEach method on said array
//   if (el !== h1) {
//     // if element is different from h1 (original element), we reduce size of the elements by 50%
//     el.style.transform = 'scale(0.5)';
//   }
// })

// Lifecycle Dom Events

/** DOM content loaded
 * fired by the document as soon as the html is completely parsed/completely converted to the DOM tree
 * we want our code to execute only after the DOM is ready, which is what the script tag at the end of the body in the HTML is for.
 * The script is fired only after the rest of the html is parsed
 */
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// Load event (fired by the window as soon as the HTML and all images/external resources files are loaded)

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// beforeunload event (created immediately before user leaves the page)

// window.addEventListener('beforeunload', function (e) {
//   // we can ask users if they are 100% sure if they want to leave the page
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

// Efficient script loading: defer and async

/** 1. Regular script in the head
 * As user loads page and received HTML, HTML is parsed by browser and parsing HTML is building DOM tree from elements
 * Once it reaches script tag, it fetches and executes it. HTML parsing stops in the meantime. It parses again and the DOMContentLoaded event fires after HTML is parsed
 * This is not ideal as performance drops if HTML parsing is stopped when script is in head
 * script can be executed before HTML is completely parsed
 */

/** 2. Regulat script in body
 * HTML is parsed first, script is then fetched and executed
 * not ideal too as script could have been downloaded before while HTML is being parsed
 */

/** 3. Async script in head
 * script is loaded same time as HTML is being parsed
 * HTML parsing is still halted by script execution
 * scirpt is downloade asynchronously but is executed in a synchronous way
 * page loading time is still faster than regular script
 */

/** 4. defer script in head
 * script is still loaded asynchronously but execution of script is deferred until the end of HTML parsing
 * loading time is similar to async but HTML parsing is never interrupted
 * most ideal situation
 */

//** Note that async and defer should not be in the body as in the body, fetching and executing the script always happen after parsing the HTML anyway so async and defer will make no difference between being in the head and body */
