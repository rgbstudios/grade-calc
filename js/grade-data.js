// @todo: pass standardized assignment / student object arrays between functions, no global.
// avoids confusion / makes code cleaner

// 2d array. each item is an array with student name followed by their scores on each assignment
let studentGrades = [];

function updateGradebook(gradeData) {
	// add 1d array of student's grades to 2d array of all student grades
	studentGrades.push(gradeData); // update internal variable for student grades

	updateTables();
}

function updateTables() {
	let assignmentNames = updateAssignmentsTable(); // update assignment table from assignment view
	updateStudentsTable(assignmentNames); // using assignment names and interval variable, update student table	
}

function updateAssignmentsTable() {
	let tmpHTML = 
		'<tr class="thead-dark">' +
			'<th>Assignment</th>' +
			'<th>Total</th>' +
			'<th>Weight</th>' +
		'</tr>';

	assignmentNames = [];
	let i = 1;
	$('.grade-item').each( (idx, val)=> {
		let assignmentName = $(val).find('.name').val();
		if(assignmentName == '') {
			assignmentName = 'Assignment ' + (i++);
		}
		tmpHTML +=
		'<tr>' +
			'<td>' + assignmentName + '</td>' +
			'<td>' + $(val).find('.total').val() + '</td>' +
			'<td>' + $(val).find('.weight').val() + '</td>' +
		'</tr>';
		assignmentNames.push(assignmentName);
	});

	$('#assignments-table').html(tmpHTML);

	return assignmentNames;
}

function updateStudentsTable(assignmentNames) {
	let assignmentNamesHTML = '<th>' + assignmentNames.join('</th><th>') + '</th>';
	let tmpHTML = 
		'<tr class="thead-dark">' +
			'<th>Student</th>' +
			assignmentNamesHTML +
			'<th>Final Grade</th>' +
		'</tr>';

	for(item of studentGrades) {
		tmpHTML += '<tr><td>' + item.join('</td><td>') + '</td></tr>';
	}

	$('#students-table').html(tmpHTML);
}

// note: doesn't error check for assignments deleted inbetween, invalid numbers, etc
// note: more than several thousand rows and it doesn't work
// https://stackoverflow.com/a/14966131/4907950
function downloadCSV() {
	// assignment labels
	let rows = [
		['Assignment', 'Total', 'Weight']
	];

	let assignmentNames = [];

	// assignments
	let i = 1;
	$('.grade-item').each( (idx, val)=> {
		let assignmentName = $(val).find('.name').val();
		if(assignmentName == '') {
			assignmentName = 'Assignment ' + (i++);
		}
		assignmentNames.push(assignmentName);

		rows.push([
			assignmentName,
			$(val).find('.total').val(),
			$(val).find('.weight').val()
		]);
	});

	// empty row before student data
	rows.push([]);

	assignmentNames.push('Final Grade');
	assignmentNames.unshift('Student');
	// student grades label
	// unshift adds to beginning of array
	rows.push(assignmentNames );

	// add student data
	// 2d array, pushing in each 1d array
	studentGrades.forEach( val=> rows.push(val) );

	// rows is 2d array to be converted into csv
	let csvContent = 'data:text/csv;charset=utf-8,' 
		+ rows.map(e => e.join(',') ).join('\n');
	let encodedUri = encodeURI(csvContent);

	let link = document.createElement('a');
	link.setAttribute('href', encodedUri);
	link.setAttribute('download', 'grade_data_' + getFormattedDate() + '.csv');
	document.body.appendChild(link); // for firefox
	link.click();
}

function uploadCSV() {
	$('#spreadsheet-file-input').click(); // calls readCSV
}

function readCSV(evt) {
	let f = evt.target.files[0];
	if(f) {
		let r = new FileReader();
		r.onload = function(e) {
			let contents = e.target.result;

			console.log(`file ${f.name} uploaded of type ${f.type}, size ${f.size} with contents \n${contents}`);
			// // todo: notification (toast, modal, or alert) for 'imported file ' + f.name

			let lines = contents.split('\n');



			// remove all assignments
			$('.grade-item').remove();

			// skip the first line (labels), keep going until a blank line to load assignments
			let i = 1;
			for(; i<lines.length; i++) {
				let lineData = lines[i].split(',');

				// if empty line then break
				// if(lineData==['']) doesn't work
				if(lineData.length==1 && lineData[0]=='') break;

				let score = 0, total = lineData[1], weight = lineData[2], name = lineData[0];
				makeNewDiv(score, total, weight, name);
			}
			// loop through all students and import them
			i+=2; // skip 2 lines (empty line then labels)
			let gradeData = [];
			for(; i<lines.length; i++) {
				let lineData = lines[i].split(',');

				// convert everything but student name to float
				for(let j=1; j<lineData.length; j++) {
					lineData[j] = parseFloat(lineData[j]);
				}

				// update internal data
				studentGrades.push(lineData); // add array with student name, assignment grades, and final score
			}

			// update gradebook tables
			updateTables();



			// load in the assignments, then updateGradebook
			// currently just replaces everything
			// todo: checkbox for keep current assignment data or use new assignment data
			// todo: select for merge grades, uploaded grades only, current grades only
			// if merge grades, select for redundant students: if students have the same (name/all data) then (replace with upload, keep current, keep both)


		}
		r.readAsText(f);
	} else {
		console.log('failed to load file');
		// todo: notification (toast, modal, or alert) for 'failed to load file'
	}
}