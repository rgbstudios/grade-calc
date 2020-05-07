let invalid;

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

	let studentName = checkDefault($('#student-name').val(), 'Anonymous');
	let gradeData = [studentName];
	$('.grade-item').each( (idx, val)=> {
		let assignmentGrade = getAssignmentGrade($(val), weightTotal);
		if(assignmentGrade == -1) {
			invalid = true;
		 } else {
			grade += assignmentGrade;

			gradeData.push(parseFloat($(val).find('.score').val() ) );
		}
	});

	if(invalid) {
		$('#letter-text').html('');
		$('#warning-text').html('Please enter all numerical inputs and delete empty items. Numbers must be positive.');
		$('#grade-text').html('');
		$('#copy-btn').hide();
		$('.grade-info').html('');
	} else {
		grade = round(grade);
		let letterGrade = getGradeLetter(grade);

		$('#letter-text').html(letterGrade);
		$('#console').val(studentName + ' ' + grade + '% ' + letterGrade + '\n' + $('#console').val() );
		$('#warning-text').html('');
		$('#grade-text').html(grade + '%');
		$('#copy-btn').show();

		gradeData.push(grade);	
		updateGradebook(gradeData);

		if($('#clear-oncalc-switch').is(':checked') ) {
			$('#clear-btn').click();
		}

		$('.grade-item:first-child').find('.score').select();
	}
}

// return grade if valid, else -1
// update grade-info display
function getAssignmentGrade(elm, weightTotal) {
	let score = parseFloat(elm.find('.score').val() );
	let total = parseFloat(elm.find('.total').val() );
	let weight = parseFloat(elm.find('.weight').val() );

	if(!isValid(score) || !isValid(total) || !isValid(weight) ) return -1;

	let assignmentGrade = score / total * weight / weightTotal * 100;
	elm.find('.grade-info').html('<br>Points: ' + round(assignmentGrade) + '% Grade: ' + round(score/total*100) + '%');
	return assignmentGrade;
}
