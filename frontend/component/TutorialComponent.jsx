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
                <p>
                    Use the search boxes to enter a department, course code or instructor.  Click on each search 
                    box for a drop down list of all options or start typing to filter out only options that match.
                      The more search boxes you fill out, the more specific your search will be.
                </p>

                <img src="img/searchBoxes.png" alt="search boxes" className="tutorial-image" />

                <p>
                    To search for all courses at a specific level, for example all 100 level courses, a department
                    or instructor must be specified.  A search for 1XX will return all 100 level courses, 2XX all 
                    200 level courses and so on.
                </p>

                <img src="img/searchMultiple.png" alt="" className="search-multiple-style" />

                <p>
                    After you fill out one or more search boxes, a table summarizing the search results will appear.
                </p>

                <img src="img/initialTable.png" alt="" className="initial-table-style" />

                <h2>Sorting Table Columns/Expanding Rows</h2>
                <p>
                    Clicking on a column name will sort by that column.  An arrow to the right of the column name 
                    indicates if the column is in ascending or descending order.  Clicking on the name toggles the 
                    sorting order.
                </p>

                <p>
                    Some rows in the table may have a triangle next to them. This indicates that there have been 
                    multiple offerings of that course, and this row contains the average of the ratings of all 
                    offerings. Clicking on the triangle will expand the row to show all offerings of the class.  
                    If multiple expanded rows have the same course code/instructor and time, they are different 
                    sections taught during the same quarter.
                </p>

                <img src="img/expandedTable.png" alt="" className="large-tutorial-image" />

                <p>
                    Clicking on the triangle again will collapse the rows.
                </p>

                <h2>Hovering</h2>
                <p>
                    Hovering over an entry in the "% Completed" column will show the number of students who filled 
                    out evaluations for that class as a fraction.  Hovering over all other column entries will show 
                    the average department score for that column.
                </p>

                <img src="img/tableHover.png" alt="Table with hover feature shown" className="tableHoverStyle" />

                <h2>Pages</h2>
                <p>
                    Depending on how many search boxes you filled out, one of three pages will load. These pages are 
                    similar, with a few important differences.
                </p>
                
                <h3>Department Page</h3>
                <p>
                    If you specified only the name of the department, the department page will load. It shows all 
                    courses offered by the specified department.  The top 5 courses and instructors in this 
                    department are listed at the top of the page.
                </p>

                <img src="img/departmentPage.png" alt="" className="taller-tutorial-image" />

                <h3>Course Page</h3>
                <p>
                    If you specified both the department name and course number, the course page will load. The 
                    course page lists all instructors who have taught the specified course.  A line graph at the 
                    top shows the overall rating for each instructor during different quarters.  A maximum of 5 
                    instructors are shown on the graph.
                </p>

                <img src="img/coursePage.png" alt="" className="extra-taller-tutorial-image" />

                <h3>Instructor Page</h3>
                <p>
                    If you specified only the name of the instructor, the instructor page will load. The instructor 
                    page lists all courses taught by the specified instructor.   A line graph at the top shows the 
                    overall rating for each of the courses taught by the instructor.  A maximum of 5 courses are 
                    shown on the graph.
                </p>

                <img src="img/instructorPage.png" alt="" className="taller-tutorial-image" />

                <p>
                    On both the course and instructor pages, the line graph displays the quarter on the X axis and 
                    the overall rating on the Y axis.  Quarters for where there is no data point are left blank.  
                    Hovering over each dot displays its overall rating.
                </p>

                <p>
                    Clicking on a course code or instructor name in the table on any page will take you to the 
                    corresponding course page or instructor page respectively.
                </p>

                <h1>Comparing Courses</h1>
                <p>
                    To compare courses, click on the "Compare Courses" button at the top of the page. This will take 
                    you to a new page with two drop down boxes. The first allows you to specify a department, and the 
                    second a course code. After you specify a department and course code, a table summarizing the 
                    rating of the course will appear.
                </p>              
                <p>
                    The + and - buttons on either side of the drop down boxes can be used to increase and decrease the 
                    number of courses being compared respectively. The + button adds another set of drop down boxes, 
                    while the - button removes a set of drop down boxes. These drop down boxes can be used to specify 
                    more courses.
                </p>
                
                <img src="img/barchartSelection.png" alt="Comparison page selection after selecting a class" className="compareCourseStyle" />

                <p>
                    Hovering over a bar will display the name of the course represented by the bar, as well as its 
                    value. It will also display a black horizontal bar indicating the average rating of classes in 
                    that department. For example, in the following picture the cursor is hovering over the bar 
                    representing CSE 142. The black line indicates the average amount learned rating in the CSE 
                    department.  More information on what each bar represents can be found in the legend next to the chart.
                </p>
                
                <img src="img/barchartChart.png" alt="Comparison page chart after selecting a class" className="chart-final" />
                <img src="img/barchartTable.png" alt="Comparison page table after selecting a class" className="chart-table" />

                <p>
                    When a new course is specified, or an existing course is removed or modified, the 
                    table and chart update automatically.
                </p>

                <h1>The Data</h1>
                <p>
                    At the end of every course, students fill out an evaluation for the instructor and the course as a whole.  
                    Students give a score between 0 - 5 for multiple dimensions including overall rating, grading technique 
                    and effectiveness in teaching.  The median, the point where the data is evenly split with half of the data 
                    falling above and half falling below, is calculated and can be accessed from the UW data.  Since simply 
                    taking the median doesn{"'"}t best reflect the average score due to different sizes of subgroups, 
                    UW calculates the median in a slightly different manner.  More information on this can be found 
                    <a href="https://www.washington.edu/oea/services/course_eval/medians.html"> here</a>.  
                    Our site uses UW{"'"}s median for all calculations.
                </p>
            </div>
        );
    }
});

module.exports = TutorialComponent;
