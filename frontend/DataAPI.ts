import JQuery = require('jquery');
import TAFFY = require('taffydb');
var JSZip = require('jszip');
var JSZipUtils = require('jszip-utils');

/**
 * Provides an interface to get data for the front end application
 */
class DataAPI {
	private static PAYLOAD_URL = 'courses/data.csv.zip';
    private static INSIDE_ZIP = 'data.csv';

    private static TIME_TO_DATETIME = {
        "wi": 0,
        "sp": 1,
        "su": 2,
        "au": 3
    };

    private static KEYS: any = ["the_course_as_a_whole", "the_course_content", "amount_learned", "instructors_effectiveness", "grading_techniques"];

    private static processCSV(csv : string, callback : Function) : void {
        var lines = csv.split('\n');
        var header = lines[0].split(';');

        var output = [];
        var depAverages = {};
        for (var i = 1; i < lines.length - 1; i++) {
            var line = lines[i].split(';');
            var course = { 'course_whole_code': line[0] + line[1] };
            var percentEnrolled = Math.round(1000.0 * Number(line[header.indexOf('completed')]) / Number(line[header.indexOf('total_enrolled')])) / 10;
            course['percent_enrolled'] = Math.min(percentEnrolled, 100);

            var time = line[header.indexOf('time')];
            var quarter = time.substring(0, 2);
            var year = time.substring(2);
            course['datetime'] = year + DataAPI.TIME_TO_DATETIME[quarter];

            for (var j = 0; j < line.length; j++) {
                if (!isNaN(Number(line[j])) && header[j] != "course_code") {
                    course[header[j]] = Math.max(0, Number(line[j]));

                    if (header[j] != "completed" && header[j] != "total_enrolled") {
                        course[header[j]] = Math.min(5, Number(course[header[j]]));
                    }
                } else {
                    if (line[j] === 'NULL') {
                        course[header[j]] = null;
                    } else {
                        course[header[j]] = line[j];
                    }
                }
            }

            if (course['the_course_as_a_whole']) {
                output.push(course);

                if (!(course['course_department'] in depAverages)) {
                    depAverages[course['course_department']] = {};
                    for (var j = 0; j < DataAPI.KEYS.length; j++) {
                        depAverages[course['course_department']][DataAPI.KEYS[j]] = course[DataAPI.KEYS[j]];
                    }

                    depAverages[course['course_department']]['length'] = 1.0;
                } else {
                    for (var j = 0; j < DataAPI.KEYS.length; j++) {
                        depAverages[course['course_department']][DataAPI.KEYS[j]] += course[DataAPI.KEYS[j]];
                    }

                    depAverages[course['course_department']]['length'] += 1.0;
                }
            }
        }

        for (var department in depAverages) {
            for (var attribute in depAverages[department]) {
                if (attribute !== 'length') {
                    depAverages[department][attribute] = Math.round(depAverages[department][attribute] / depAverages[department]['length'] * 100) / 100;
                }
            }
        }

        callback(TAFFY.taffy(output), output, depAverages);
    }

	/**
	 * Gets the organizations
	 * @param {Function} callback Callback to execute after retrieval
	 */
	public static getTaffy(callback : Function) : void {
        JSZipUtils.getBinaryContent(DataAPI.PAYLOAD_URL, (err, data) => {
            if (err) {
                setTimeout(() => {
                    DataAPI.getTaffy(callback);
                }, 500);
                return;
            }

            var zip = new JSZip(data);
            var csv = zip.file(DataAPI.INSIDE_ZIP).asText();
            DataAPI.processCSV(csv, callback);
        });
	}
}

export = DataAPI;
