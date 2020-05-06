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

	let gradeHistoryData = [$('#student-name').val()];
	$('.grade-item').each( (idx, val)=> {
		let item = getAssignmentGrade($(val), weightTotal);
		if(item.invalid) {
			invalid = true;
		 } else {
			grade += item.grade;

			gradeHistoryData.push($(val).find('.score').val() );
		}
	});
	gradeHistoryData.push(grade);

	if(invalid) {
		$('#letter-text').html('');
		$('#grade-text').html('Please enter all numerical inputs and delete empty items');
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

// returns array of isValid, grade if valid
function getAssignmentGrade(elm, weightTotal) {
	let scoreInput = elm.find('.score');
	let totalInput = elm.find('.total');
	let weightInput = elm.find('.weight');
	let gradeInfo = elm.find('.grade-info');

	if(scoreInput.val() == '' || totalInput.val() == '' || weightInput.val() == '')
		return {invalid: true};

	let newVal = scoreInput.val() / totalInput.val() * weightInput.val() / weightTotal * 100;
	gradeInfo.html('&nbsp; Points: ' + Math.round(newVal*100)/100 + '% Grade: ' + Math.round(scoreInput.val()/totalInput.val()*10000)/100 + '%');
	return {invalid: false, grade: newVal};
}
