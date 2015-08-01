from os import listdir
from bs4 import BeautifulSoup
import re

PATH = 'cache/'

META_DATA = {
    "course_dep" : 'course_department',
    "course_code" : 'course_code',
    "prof" : 'professor',
    "time" : 'time',
    "course_title" : 'course_title',
    "completed" : 'completed',
    "total_enrolled" : 'total_enrolled',
    # "course_description" : 'course_description',
}

META_DATA_ORDER = [
    "course_dep",
    "course_code",
    "prof",
    "time",
    "course_title",
    "completed",
    "total_enrolled",
    # "course_description",
]

FULL_DATA_ORDER = [
    "the lab section content",
    "clear and organized",
    "instructor established rapport",
    "coordination with lectures",
    "the course as a whole",
    "instructor was accessible",
    "instructor was challenging",
    "amount learned",
    "instructor feedback",
    "relevance and usefulness of homework",
    "instuctor's interest",
    "quiz section content",
    "instructor was knowledgeable",
    "instructor's effectiveness",
    "instructor's contribution",
    "grading techniques",
    "instructor overall",
    "effectiveness of format",
    "tailoring instruction to skills",
    "textbook overall",
    "instructor was enthusiastic",
    "quiz section as a whole",
    "procedures/skill taught",
    "the course content",
    "the lab section as a whole",
    "rotation/studio as a whole",
]

FULL_DATA = {
    "the lab section content" : 'lab_section_content',
    "clear and organized" : 'clear_and_organized',
    "instructor established rapport" : 'instructor_established_rapport',
    "coordination with lectures" : 'coordination_with_lectures',
    "the course as a whole" : 'the_course_as_a_whole',
    "instructor was accessible" : 'instructor_was_accessible',
    "instructor was challenging" : 'instructor_was_challenging',
    "amount learned" : 'amount_learned',
    "instructor feedback" : 'instructor_feedback',
    "relevance and usefulness of homework" : 'relevance_and_usefulness_of_homework',
    "instuctor's interest" : 'instuctors_interest',
    "quiz section content" : 'quiz_section_content',
    "instructor was knowledgeable" : 'instructor_was_knowledgeable',
    "instructor's effectiveness" : 'instructors_effectiveness',
    "instructor's contribution" : 'instructors_contribution',
    "grading techniques" : 'grading_techniques',
    "instructor overall" : 'instructor_overall',
    "effectiveness of format" : 'effectiveness_of_format',
    "tailoring instruction to skills" : 'tailoring_instruction_to_skills',
    "textbook overall" : 'textbook_overall',
    "instructor was enthusiastic" : 'instructor_was_enthusiastic',
    "quiz section as a whole" : 'quiz_section_as_a_whole',
    "procedures/skill taught" : 'procedures_and_skills_taught',
    "the course content" : 'the_course_content',
    "the lab section as a whole" : 'the_lab_section_as_a_whole',
    "rotation/studio as a whole" : 'rotation_and_studio_as_a_whole',
}

SMALL_DATA_ORDER = {
    "the course as a whole",
    "the course content",
    "amount learned",
    "instructor's effectiveness",
    "grading techniques",
}

SMALL_DATA = {
    "the course as a whole" : 'the_course_as_a_whole',
    "the course content" : 'the_course_content',
    "amount learned" : 'amount_learned',
    "instructor's effectiveness" : 'instructors_effectiveness',
    "grading techniques" : 'grading_techniques',
}

course_names = {}
possible = set()

with open('class_names.csv', 'r') as f:
    lines = f.read().splitlines()
    for line in lines:
        parsed = line.split(';')
        course_names[parsed[0]] = (parsed[1], parsed[2])

courses = []
for filename in listdir(PATH):
    with open(PATH + filename, 'r') as f:
        soup = BeautifulSoup(f.read())

    title = soup.find('h1')
    prof_time = soup.find('h2')
    caption = soup.find('caption')
    entries = soup.find_all('tr')[1:]

    page_values = {}
    for entry in entries:
        entry = str(entry).replace('<tr>', '').replace('</tr>', '').replace('<td>', '').split('</td>')[:-1]
        median = float(entry[-1])
        label = entry[0].strip().lower()[:-1]
        page_values[label] = median
        possible.add(label)

    parsed_caption = str(caption).replace(' surveyed ', '').replace(' enrolled</caption>', '').replace('"', '').split('\xc2\xa0')

    if not parsed_caption[-3].isdigit() or parsed_caption[-1].isdigit():
        continue

    completed = str(int(parsed_caption[-3]))
    total_enrolled = str(int(parsed_caption[-1]))

    parsed_prof = str(prof_time).replace('<h2>', '').replace('</h2>', '').split('\xc2\xa0')

    name = parsed_prof[0].strip().lower()
    time = parsed_prof[-1].strip().lower()

    parsed_title = str(title).replace('<h1>', '').replace('</h1>', '').replace('&amp;', 'and').split()[:-1]

    course_code = parsed_title[-1]
    if not course_code.isdigit():
        continue

    try:
        course_dep = re.match('^[a-zA-Z]+[0-9]{3}', filename).group(0)[:-3]
    except AttributeError:
        continue

    course_dep_code = (course_dep + course_code).lower().replace(' ', '')
    course_title = 'NULL'
    if course_dep_code in course_names:
        course_title, course_description = course_names[course_dep_code]

    courses.append({'course_code' : course_code, 'ratings' : page_values, 'prof' : name, 'time' : time, 'course_dep' : course_dep, 'course_title' : course_title, 'completed' : completed, 'total_enrolled' : total_enrolled, 'course_description' : course_description})

print ';'.join([META_DATA[key] for key in META_DATA_ORDER] + [SMALL_DATA[key] for key in SMALL_DATA_ORDER])
for course in courses:
    output = [course[key] for key in META_DATA_ORDER]
    for rating in SMALL_DATA_ORDER:
        if rating in course['ratings']:
            output.append(str(course['ratings'][rating]))
        else:
            output.append('NULL')

    print ';'.join(output)
