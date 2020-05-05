let invalid;

$( ()=> {

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});

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
		properties = {type: 'plain/text'};
		try {
			file = new File(data, "grades.txt", properties);
		} catch(e) {
			file = new Blob(data, properties);
		}
		$('#download-link').prop('download', 'grade console ' + getFormattedDate() + '.txt');
		$('#download-link').prop('href', URL.createObjectURL(file) );
	});

});

function makeNewDiv() {
	$('#grade-items').append(
		'<div class="gradeItem">' + 
			'<p class="gradeLabel">Score: &nbsp;</p>' +
			'<input type="number" min="0" class="score form-control input-sm" value="0" title="Score">' +
			'<p>&nbsp;/&nbsp;</p>' +
			'<input type="number" min="0" value="100" class="total form-control input-sm" tabIndex="-1" title="Total">' +
			'<p class="breakP">&nbsp;|&nbsp;</p>' +
			'<p class="gradeLabel">Weight: &nbsp;</p>' +
			'<input type="number" min="0" class="weight form-control input-sm" tabIndex="-1" title="Weight (should add to 100%)">' +
			'<p>%</p>' +
			'<p class="breakP">&nbsp;|&nbsp;</p>' +
			'<p class="gradeLabel">Name: &nbsp;</p>' +
			'<input type="text" class="name form-control input-sm" tabIndex="-1" title="Assignment Name (optional)" placeholder="Assignment (optional)">' +
			'<button class="btn btn-light delete-btn" title="Delete Item" tabIndex="-1" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">' +
			'<i class="fas fa-times"></i></button>' +
			'<p class="gradeInfo"></p>' +
		'</div>'
	);
}

function doCalc() {
	if($('.gradeItem').length==0) {
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
	$('.gradeItem').each( (idx, val)=> {
		let item = getAssignmentGrade($(val), weightTotal);
		if(item.invalid) {
			invalid = true;
			message = item.message;
		 } else {
			grade += item.grade;		 	
		}
	});
	if(invalid) {
		$('#letter-text').html('');
		$('#grade-text').html(message);
		$('.gradeInfo').html('');
	} else {
		grade = Math.round(grade*100)/100;
		$('#letter-text').html(getGradeLetter(grade) );
		$('#console').val($('#student-name').val() + ' ' + grade + '% ' + getGradeLetter(grade) + '\n' + $('#console').val() );
		$('#grade-text').html(grade + '%');
	}
}

// returns array of isValid, grade if valid, message otherwise
function getAssignmentGrade(elm, weightTotal) {
	let scoreInput = elm.find('.score');
	let totalInput = elm.find('.total');
	let weightInput = elm.find('.weight');
	let gradeInfo = elm.find('.gradeInfo');

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