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

	/**
	 * Gets the organizations
	 * @param {Function} callback Callback to execute after retrieval
	 */
	public static getTaffy(callback : Function) : void {

        JSZipUtils.getBinaryContent(DataAPI.PAYLOAD_URL, function(err, data) {
            if (err) {
                throw err; // or handle err
            }

            var zip = new JSZip(data);

            var csv = zip.file(DataAPI.INSIDE_ZIP).asText();

            var lines = csv.split('\n');
            var header = lines[0].split(';');

            var output = [];
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
                    if (!isNaN(line[j])) {
                        course[header[j]] = Number(line[j]);
                    } else {
                        if (line[j] === 'NULL') {
                            course[header[j]] = null;
                        } else {
                            course[header[j]] = line[j];
                        }
                    }
                }

                output.push(course);
            }

            callback(TAFFY.taffy(output));

        });
	}
}

export = DataAPI;
