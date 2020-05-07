function updateGradebook(gradeData) {
	addStudentGrades(gradeData);
	let assignmentNames = updateAssignmentsTable();
	updateStudentsTable(assignmentNames);
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

let studentGrades = [];

// add student name, then scores on each assignment
function addStudentGrades(grades) {
	studentGrades.push(grades);
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