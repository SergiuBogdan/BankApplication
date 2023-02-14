'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

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
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// const arr1 = [1, 2, 3, [4, 5, 6, [7, 8, 9]]];
// let output = '';

// function flatten(arr) {
//   for (let i = 0; i < arr.length; i++) {
//     if (Array.isArray(arr[i])) {
//       flatten(arr[i]);
//     } else {
//       output += arr[i];
//     }
//   }
//   return output;
// }

// console.log(+flatten(arr1));

// const arr = [0, 1, 2, [3, 4], [5, 6], [7, 8, [9, 10]]];

// console.log(arr.flat(2));

// const arr2 = Array.from({ length: 10 }, (_, i) =>
//   Math.floor(Math.random() * 50)
// );

// const arr3 = arr2.reduce((acc, mov) => acc + mov, 0);
// console.log(arr2);
// console.log(arr3);

const items = [
  {
    nume: 'Bike',
    pret: 50,
    vechime: 4,
  },
  {
    nume: 'Tv',
    pret: 150,
    vechime: 2,
  },
  {
    nume: 'Album',
    pret: 25,
    vechime: 7,
  },
  {
    nume: 'Book',
    pret: 40,
    vechime: 1,
  },
  {
    nume: 'Phone',
    pret: 400,
    vechime: 2,
  },
  {
    nume: 'Computer',
    pret: 1000,
    vechime: 1,
  },
  {
    nume: 'Keyboard',
    pret: 100,
    vechime: 5,
  },
];

const arrayItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const arrFilter = items.filter(products => products.vechime > 2);

const arrMap = items.map(products => {
  return products.nume;
});

const arrFind = items.find(item => {
  return item.nume === 'Computer';
});

items.forEach(products => {
  const price = products.pret * 2;
  console.log(price);
});

const arrReduce = items.reduce((acc, mov) => acc + mov.pret, 0);

const arrIncludes = arrayItems.includes(2);

console.log(arrFilter);

console.log(arrMap);

console.log(arrFind);

console.log(arrReduce);

console.log(arrIncludes);

// class Person {
//   constructor(firstName, lastName, age, maried, childrens) {
//     (this.firstName = firstName),
//       (this.lastName = lastName),
//       (this.age = age),
//       (this.maried = maried),
//       (this.childrens = childrens);
//   }
//   calculateAge() {
//     return new Date().getFullYear() - this.age.getFullYear();
//   }

//   civilStatus() {
//     return `Maried: ${this.maried} -  Childrens: ${this.childrens}`;
//   }
// }

// const personDetails = new Person('Catana', 'Sergiu', new Date('07-08-1989'));

// const civilStatusDetails = new Person('_', '_', '_', 'No', 1);

// console.log(personDetails.calculateAge());

// console.log(civilStatusDetails.civilStatus());

//Palindrome

function palin(string) {
  let left = 0;
  let right = string.length - 1;

  while (left < right) {
    if (string[left] !== string[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

console.log(palin('bogdan'));

const arr = [1, 2, 3, [4, 5, [6, 7]]];

console.log(arr.flat(2));

const arrDupl = [1, 2, 2, 3, 4, 4, 5];

console.log(new Set(arrDupl));

const arrTotal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(arrTotal.reduce((acc, mov) => acc + mov));

const arrayProgramatic = Array.from({ length: 100 }, (_, i) => i * 1);

const arrayy = arrayProgramatic.reduce((sum, mov) => sum + mov);

console.log(arrayy);

//Constructor functions

const Person = function (firstName, birthYear) {
  this.firstName = firstName;
  this.birthYear = birthYear;
};

const jonas = new Person('Jonas', 1991);
console.log(jonas);

const matilda = new Person('Matilda', 1995);

const jack = new Person('Jack', 1975);

console.log(jonas instanceof Person);

console.log(Person.prototype);

Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

jonas.calcAge();

console.log(jonas.__proto__);

//Es6 Classes

class PersonCl {
  constructor(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  }
  //Methods will be added to .prototype property
  calcAge() {
    return 2037 - this.birthYear;
  }

  greet() {
    return `Hey ${this.firstName}`;
  }
}

const jessica = new PersonCl('Jessica', 1996);

console.log(jessica.calcAge());

jessica.greet();

// 1. Classes are NOT hoisted
// 2. Classes are first class citizens
// 3. Classes are executed in strict mode.
