let gradeHistory = [];

// add student name, then scores on each assignment
function addGradeHistory(grades) {
	gradeHistory.push(grades);
}

// note: doesn't error check for assignments deleted inbetween, invalid numbers, etc
// https://stackoverflow.com/a/14966131/4907950
function downloadCSV() {

	// assignment labels
	let rows = [
		['Assignment Name', 'Assignment Total', 'Assignment Weight']
	];

	let assignmentNames = [];

	// assignments
	$('.grade-item').each( (idx, val)=> {
		// $(val).find('.score')
		rows.push([
			$(val).find('.name').val(),
			$(val).find('.total').val(),
			$(val).find('.weight').val()
		]);

		let assignmentName = $(val).find('.name').val();
		assignmentName = assignmentName==''?'Untitled Assignment':assignmentName;
		assignmentNames.push(assignmentName + ' Grade');
	});

	// empty row before student data
	rows.push([]);

	assignmentNames.push('Final Grade');
	assignmentNames.unshift('Student Name');
	// student grades label
	// unshift adds to beginning of array
	rows.push(assignmentNames );

	// add student data
	// 2d array, pushing in each 1d array
	gradeHistory.forEach( val=> rows.push(val) );


	// const rows = [
	// 	['name1', 'city1', 'some other info'],
	// 	['name2', 'city2', 'more info']
	// ];

	let csvContent = 'data:text/csv;charset=utf-8,' 
		+ rows.map(e => e.join(',') ).join('\n');

	let encodedUri = encodeURI(csvContent);

	let link = document.createElement('a');
	link.setAttribute('href', encodedUri);
	link.setAttribute('download', 'grade_data.csv');
	document.body.appendChild(link); // for firefox
	link.click();
}