CourseRatings
===============
Ryan Drapeau, Emily Gu, Vimala Jampala {drapeau, emilygu, vjampala}@cs.washington.edu


###Breakdown & Development Process
We did not change our team from A3 so we met very early on to discuss changes to the visualizations from A3 that should be implemented for a final project. We also discussed new features and responsibilities and here is the breakdown:
* **Ryan:**
  - Predictive Drop Down Search
  - Designed poster
  - Structured and organized paper in LaTeX
* **Emily:**
  - Tutorial Page: text for exploring courses, table, Sorting Table Columns/Expanding Rows, Hovering, Pages and Data, CSS
  - Bar Chart:  CSS, hovering for average
  - Time Series: CSS, legend, axis printing/tick marks, hovering
  - Paper: most of intro; parts of related work, methods, results
* **Vimala:**
  - Tutorial Page: text and images for the comparison page, css
  - Bar Chart:  initial base of the bar chart, css, pretty printing axes
  - Time Series: initial base of the time series chart, legend, css
  - Paper: most of abstract, discussion, future work, conclusion; parts of related work, methods, and results

We all stayed in contact throughout the entire process and kept everyone else up to date with where we stood / what we were currently working on. Every person brought new ideas and the value of the entire project is greater that the collective sum of our parts we worked on. It was a great experience and I hope that we see the incoming Freshman class use our tool to help find the classes they want to take.

![Overview](overview.png)

Students at the University of Washington have very few resources to learn about what the classes they could sign up for are like. The University of Washington does provide a course evaluation catalog that summarizes student evaluations of courses. However, the catalog is difficult to use, with users having to rely on their browser's find functionality to search for courses. Additionally, the catalog only lists data from the previous two quarters, making it difficult to observe trends over time. In order to make this data easier to view and understand, we built CourseRatings, an online tool that provides displays evaluations of courses at the University of Washington. Built using React, D3, jQuery, Python, and TaffyDB, CourseRatings allows users to search for, sort through, visualize and compare courses they're interested in. CourseRatings has two goals - to give students and instructors access to the data they need to make informed choices about the classes they take or teach, as well as to present this data in an intuitive and user-friendly way.

[Poster](https://github.com/CSE512-15S/fp-vjampala-emilygu-drapeau/blob/master/final/poster-drapeau-emilygu-vjampala.pdf),
[Final Paper](https://github.com/CSE512-15S/fp-vjampala-emilygu-drapeau/blob/master/final/paper-drapeau-emilygu-vjampala.pdf)

## Running Instructions

Access our visualization at http://students.washington.edu/drapeau/course_ratings/ or download this repository and run `npm install` then `npm run-script serve` and access this from http://localhost:8000/.
