let invalid;

$( ()=> {

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});

	$('#speadsheet-btn').click(downloadCSV);

	$('#night-btn').click( ()=> {
		$('#nightTheme').attr('href', $('#nightTheme').attr('href')?'':'css/night.css');
	});

	for(let i=0; i<3; i++) {
		makeNewDiv();
	}

	$('#add-btn').click(makeNewDiv);

	$('#clear-btn').click( ()=> {
		$('.score').val(0);
		$('#student-name').val('');
	});

	$('#calc-btn').click(doCalc);
	$('#fullscreen-btn').click(toggleFullscreen);

	$('#same-btn').click( ()=> {
		let weightInputs = $('.weight');
		for(input of weightInputs)
			input.value = 100/weightInputs.length;
	});

	$('#copy-btn').click( ()=> {
		if(!invalid) {
			copyText($('#grade-text').html() + ' ' + $('#letter-text').html() );
			//todo: notificaiton it was copied
		}
	});

	$('#clear-console-btn').click( ()=> $('#console').val('') );
	
	$('#download-console-btn').click( ()=> {		
		let data = [($('#console').val().replace(/\r?\n/g, '\r\n'))];		
		let properties = {type: 'plain/text'};
		try {
			file = new File(data, 'grades.txt', properties);
		} catch(e) {
			file = new Blob(data, properties);
		}
		$('#download-link').prop('download', 'grade console ' + getFormattedDate() + '.txt');
		$('#download-link').prop('href', URL.createObjectURL(file) );
	});

});

function makeNewDiv() {
	$('#grade-items').append(
		'<div class="grade-item">' + 
			'<span class="grade-label">Score: &nbsp;</span>' +
			'<input type="number" min="0" class="score form-control input-sm" value="0" title="Score">' +
			'<span>&nbsp;/&nbsp;</span>' +
			'<input type="number" min="0" value="100" class="total form-control input-sm" tabIndex="-1" title="Total">' +
			'<span class="breakP">&nbsp;|&nbsp;</span>' +
			'<span class="grade-label">Weight: &nbsp;</span>' +
			'<input type="number" min="0" class="weight form-control input-sm" tabIndex="-1" title="Weight (should add to 100%)">' +
			'<span> %</span>' +
			'<span class="breakP">&nbsp;|&nbsp;</span>' +
			'<span class="grade-label">Name: &nbsp;</span>' +
			'<input type="text" class="name form-control input-sm" tabIndex="-1" title="Assignment Name (optional)" placeholder="Assignment (optional)">' +
			'<button class="btn delete-btn" title="Delete Assignment" tabIndex="-1" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">' +
			'<i class="fas fa-times"></i></button>' +
			'<small><span class="grade-info"></span></small>' +
		'</div>'
	);
}

function doCalc() {
	if($('.grade-item').length==0) {
		invalid = true;
		$('#grade-text').html('Please add an item with the "New Item" button');
		return;
	}

	let weightTotal = 0;
	$('.weight').each( (idx, val)=> {
		weightTotal += parseFloat($(val).val() );
	});
	let grade = 0;
	invalid = false;	
	let message = '';

	let gradeHistoryData = [$('#student-name').val()];
	$('.grade-item').each( (idx, val)=> {
		let item = getAssignmentGrade($(val), weightTotal);
		if(item.invalid) {
			invalid = true;
			message = item.message;
		 } else {
			grade += item.grade;

			gradeHistoryData.push($(val).find('.score').val() );
		}
	});
	gradeHistoryData.push(grade);

	if(invalid) {
		$('#letter-text').html('');
		$('#grade-text').html(message);
		$('.grade-info').html('');
	} else {
		grade = Math.round(grade*100)/100;
		$('#letter-text').html(getGradeLetter(grade) );
		$('#console').val($('#student-name').val() + ' ' + grade + '% ' + getGradeLetter(grade) + '\n' + $('#console').val() );
		$('#grade-text').html(grade + '%');
	
		$('.grade-item:first-child').find('.score').select();

		addGradeHistory(gradeHistoryData);
	}
}

// returns array of isValid, grade if valid, message otherwise
function getAssignmentGrade(elm, weightTotal) {
	let scoreInput = elm.find('.score');
	let totalInput = elm.find('.total');
	let weightInput = elm.find('.weight');
	let gradeInfo = elm.find('.grade-info');

	if(scoreInput.val() == '' || totalInput.val() == '' || weightInput.val() == '')
		return {invalid: true, message:'Please enter all numerical inputs and delete empty items'};

	let newVal = scoreInput.val() / totalInput.val() * weightInput.val() / weightTotal * 100;
	gradeInfo.html('&nbsp; Points: ' + Math.round(newVal*100)/100 + '% Grade: ' + Math.round(scoreInput.val()/totalInput.val()*10000)/100 + '%');
	return {invalid: false, grade: newVal};
}

function getGradeLetter(grade) {
	if(grade >= 100)
		return 'A+';

	let letter;
	if(grade >= 90)
		letter = 'A';
	else if(grade >= 80)
		letter = 'B';
	else if(grade >= 70)
		letter = 'C';
	else if(grade >= 60)
		letter = 'D';
	else
		return 'F';
	
	if(grade%10 >= 7)
		letter += '+';
	else if(grade%10 < 3)
		letter += '-';
	
	return letter;
}

function getFormattedDate() {
	let today = new Date();
	let day = today.getDate();
	let mon = today.getMonth()+1; // Jan is 0
	day = day < 10 ? '0' + day : day;
	mon = mon < 10 ? '0' + mon : mon;
	return mon + '/' + day + '/' + today.getFullYear();	
}

function toggleFullscreen() {
	let elem = document.documentElement;
	if (!document.fullscreenElement && !document.mozFullScreenElement &&
		!document.webkitFullscreenElement && !document.msFullscreenElement) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

function copyText(str) {
	let tmp = $('<input type="text">').appendTo(document.body);
	tmp.val(str);
	tmp.select();
	document.execCommand('copy');
	tmp.remove();
}

// ----------------

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

	console.log(assignmentNames);
	console.log(gradeHistory);
	console.log(rows);

	let csvContent = 'data:text/csv;charset=utf-8,' 
		+ rows.map(e => e.join(',') ).join('\n');

	let encodedUri = encodeURI(csvContent);

	let link = document.createElement('a');
	link.setAttribute('href', encodedUri);
	link.setAttribute('download', 'grade_data.csv');
	document.body.appendChild(link); // for firefox
	link.click();
}