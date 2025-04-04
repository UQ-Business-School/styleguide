// imageLibrary.js
// This file holds the array of local images (UQ Branded Images)
const imageLibrary = [
    { category: "Library", url: "https://uqgblaze.github.io/UQ-Swoosh/dev/img/library-students-01.jpg", alt: "Students studying in the library" },
    { category: "Library", url: "https://uqgblaze.github.io/UQ-Swoosh/dev/img/library-students-02.jpg", alt: "Another library view" },
    { category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--professional-staff-01.jpg", alt: "Professional staff in Great Court" },
    { category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--professional-staff-02.jpg", alt: "Discussion on bench" },
	{ category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--professional-staff-03.jpg", alt: "Staff Walking and talking" },
	{ category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--professional-staff-04.jpg", alt: "Staff walking through Great Court" },
	{ category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--students-01.jpg", alt: "Student reading book under tree in Great Court" },
	{ category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--students-02.jpg", alt: "Students under tree in Great Court" },
	{ category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--students-03.jpg", alt: "Students looking at notes in Great Court" },
	{ category: "Great Court", url: "https://uq-business-school.github.io/styleguide/images/great-court--students-04.jpg", alt: "Students in Great Court" },
    { category: "Jacaranda", url: "https://uq-business-school.github.io/styleguide/images/jacaranda--forgan-smith-01.jpg", alt: "Jacaranda in bloom in front of Forgan Smith" },
	{ category: "Library - Outside", url: "https://uq-business-school.github.io/styleguide/images/library--campbell-place-students-01.jpg", alt: "Students discussing outside" },
	{ category: "Library - Outside", url: "https://uq-business-school.github.io/styleguide/images/library--campbell-place-students-02.jpg", alt: "Two students walking outside library" },
	{ category: "Library - Outside", url: "https://uq-business-school.github.io/styleguide/images/library--campbell-place-students-03.jpg", alt: "Two students standing and talking outside library" },
	{ category: "Library - Outside", url: "https://uq-business-school.github.io/styleguide/images/library--campbell-place-students-04.jpg", alt: "Waiting outside library" },
	{ category: "Library - Outside", url: "https://uq-business-school.github.io/styleguide/images/library--duhig-exterior-01.jpg", alt: "Duhig Building 01" },
	{ category: "Library - Outside", url: "https://uq-business-school.github.io/styleguide/images/library--duhig-exterior-0w.jpg", alt: "Duhig Building 02" },
	{ category: "Library - Central", url: "https://uq-business-school.github.io/styleguide/images/library--central-students-01.jpg", alt: "Student working on laptop" },
	{ category: "Library - Central", url: "https://uq-business-school.github.io/styleguide/images/library--central-students-02.jpg", alt: "Students in Central study area" },
	{ category: "Library - Central", url: "https://uq-business-school.github.io/styleguide/images/library--central-students-03.jpg", alt: "Students walking in Central study area" },
	{ category: "Library - Central", url: "https://uq-business-school.github.io/styleguide/images/library--central-students-04.jpg", alt: "Student working on laptop - wide shot" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-building-01.jpg", alt: "Foyer with students below" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-building-02.jpg", alt: "Law Library with Crest 01" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-building-03.jpg", alt: "Law Library with Crest 02" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-building-04.jpg", alt: "Wall detailing at Law Library" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-building-05.jpg", alt: "Floor detailing at Law Library" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-students-01.jpg", alt: "Students collaborating in Law" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-students-02.jpg", alt: "Two students in Law Library" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-students-03.jpg", alt: "Overhead shot in Law Library" },
	{ category: "Library - Law", url: "https://uq-business-school.github.io/styleguide/images/library--law-students-04.jpg", alt: "Overhead angled shot in Law" },
	{ category: "Ocean", url: "https://uq-business-school.github.io/styleguide/images/ocean--01.jpg", alt: "Ocean with Diver 01" },
	{ category: "Ocean", url: "https://uq-business-school.github.io/styleguide/images/ocean--02.jpg", alt: "Ocean with Diver 02" },
	{ category: "Ocean", url: "https://uq-business-school.github.io/styleguide/images/ocean--animal-01.jpg", alt: "Sea Turtle 01" },
	{ category: "Ocean", url: "https://uq-business-school.github.io/styleguide/images/ocean--animal-02.jpg", alt: "Sea Turtle 02" },
    { category: "Sandstone", url: "https://uq-business-school.github.io/styleguide/images/sandstone--ian-frazer.jpg", alt: "Professor Ian Frazer" },
	{ category: "Sandstone", url: "https://uq-business-school.github.io/styleguide/images/sandstone--pillars-01.jpg", alt: "Pillars 01" },
	{ category: "Sandstone", url: "https://uq-business-school.github.io/styleguide/images/sandstone--pillars-02.jpg", alt: "Pillars 02" },
	{ category: "Sandstone", url: "https://uq-business-school.github.io/styleguide/images/sandstone--pillars-night.jpg", alt: "Pillars at night" }
	// ... add additional images as needed - note that there's no comma on last item.
  ];
