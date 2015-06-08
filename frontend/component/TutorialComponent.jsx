var React = require('react');
var Constants = require('../Constants');

var TutorialComponent = React.createClass({

    /**
     * Render the page
     */
    render: function() {
        return (
            <div className="tutorial">
                <h1>Exploring Courses</h1>
                <p>Use the search boxes to enter a department, course code or instructor.  Click on each search box for a drop down list of all options or start typing to filter out only options that match.  The more search boxes you fill out, the more specific your search will be.</p>

                <img src="img/searchBoxes.png" alt="" className="tutorial-image" />

                <p>After you fill out one or more search boxes, a table summarizing the search results will appear.</p>

                <img src="img/initialTable.png" alt="" className="large-tutorial-image" />

                <h2>Sorting Table Columns/Expanding Rows</h2>
                <p>Clicking on a column name will sort by that column.  An arrow to the right of the column name indicates if the column is in ascending or descending order.  Clicking on the name toggles the sorting order.</p>

                <p>Some rows in the table may have a triangle next to them. This indicates that there have been multiple offerings of that course, and this row contains the average of the ratings of all offerings. Clicking on the triangle will expand the row to show all offerings of the class.  If multiple expanded rows have the same course code/instructor and time, they are different sections taught during the same quarter.</p>

                <img src="img/expandedTable.png" alt="" className="large-tutorial-image" />

                <p>Clicking on the triangle again will collapse the rows.</p>

                <h2>Hovering</h2>
                <p>Hovering over an entry in the "% Completed" column will show the number of students who filled out evaluations for that class as a fraction.  Hovering over all other column entries will show the average department score for that column.</p>

                <p>Depending on how many search boxes you filled out, one of three pages will load. These pages are similar, with a few important differences.</p>

                <h2>Pages</h2>
                <h3>Department Page</h3>
                <p>If you specified only the name of the department, the department page will load. It shows all courses offered by the specified department.  The top 5 courses and instructors in this department are listed at the top of the page.</p>

                <img src="img/departmentPage.png" alt="" className="taller-tutorial-image" />

                <h3>Course Page</h3>
                <p>If you specified both the department name and course number, the course page will load. The course page lists all instructors who have taught the specified course.  A line graph at the top shows the overall rating for each instructor during different quarters.  A maximum of 5 instructors are shown on the graph.</p>

                <img src="img/coursePage.png" alt="" className="extra-taller-tutorial-image" />

                <h3>Instructor Page</h3>
                <p>If you specified only the name of the instructor, the instructor page will load. The instructor page lists all courses taught by the specified instructor.   A line graph at the top shows the overall rating for each of the courses taught by the instructor.  A maximum of 5 courses are shown on the graph.</p>

                <img src="img/instructorPage.png" alt="" className="taller-tutorial-image" />

                <p>On both the course and instructor pages, the line graph displays the quarter on the X axis and the overall rating on the Y axis.  Quarters for where there is no data point are left blank.  Hovering over each dot displays its overall rating.</p>

                <p>Clicking on a course code or instructor name in the table on any page will take you to the corresponding course page or instructor page respectively.</p>

                <h1>Comparing Courses</h1>
                <p>To compare courses, click on the "Compare Courses" button at the top of the page. This will take you to a new page with two drop down boxes. The first allows you to specify a department, and the second a course code. After you specify a department and course code, a table summarizing the rating of the course will appear. Click on the + button next to the drop down boxes to see a graph of the course{"'"}s ratings.</p>

                <img src="img/barchartInitial.png" alt="Comparison page after selecting a class" className="taller-tutorial-image" />

                <p>The + and - buttons on either side of the drop down boxes can be used to increase and decrease the number of courses being compared respectively. The + button adds another set of drop down boxes, while the - button removes a set of drop down boxes. These drop down boxes can be used to specify more courses. When a new course is specified, or an existing course is removed or modified, the table and chart update automatically.</p>

                <img src="img/barchartTable.png" alt="Comparison page table after selecting multiple classes" className="taller-tutorial-image" />
                <img src="img/barchartFinal.png" alt="Comparison page chart after selecting multiple classes" className="taller-tutorial-image" />

                <p>Hovering over a bar will display the name of the course represented by the bar, as well as its value. It will also display a black horizontal bar over every bar representing that course. These bars display the average value for each rating in the department that offers the specified course. For example, in the following picture the cursor is hovering over the bar representing CSE 142. The black lines indicate the average overall, content, amount learned, teaching and grading ratings in the CSE department.</p>

                <img src="img/barchartHover.png" alt="Comparison page chart with hover" className="taller-tutorial-image" />

                <p>More information on what each bar represents can be found in the legend next to the chart.</p>
            </div>
        );
    }
});

module.exports = TutorialComponent;
