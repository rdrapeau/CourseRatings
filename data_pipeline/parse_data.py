from os import listdir
from bs4 import BeautifulSoup
import re

PATH = 'cache/'
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


print ';'.join(['course_department', 'course_code', 'professor', 'time', 'course_title', 'completed', 'total_enrolled', 'course_description'] + list(possible))
for course in courses:
    output = [course['course_dep'], course['course_code'], course['prof'], course['time'], course['course_title'], course['completed'], course['total_enrolled'], course['course_description']]

    for rating in possible:
        if rating in course['ratings']:
            output.append(str(course['ratings'][rating]))
        else:
            output.append('NULL')

    print ';'.join(output)
