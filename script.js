/*TODO
download and upload assignments from previous session
upload console
download list of assignments? and upload?
night mode button next to fullscreen?

BUG: if calculating grades, then adding an item, then claculating with an empty item, it shows percentage as NaN
 new feature: add modal with options to make different categories of assignments with different weights and have a select/option for those
 color scheme for grades on individual assignments?
 option to use cookies?

warn if anything under 0 or if grade > total
!!option to drop lowest
option to have different categories and weights assigned to each
option to enter own scale
make a large number of items at once with same weight/category
!!display number of items
!!if a blank item then ignore
!!and if no weights assume equal
!!console with number, letter, and name/id (optional)
!!checkbox to clear grades and name with each calculation
option to add one assignment to all students
option to print all grade or one person's
full java program has more features. can enter class title, time, semester, student id nums

BUGS
doesn't always display info to side of assignment correctly
*/

let invalid;

$(function() {
	$('#nightButton').on('click', function() {
		$('#nightTheme').attr('href', $('#nightTheme').attr('href')?'':'night.css');
	});

	for(let i=0; i<3; i++) {
		makeNewDiv();
	}

	$('#add').click(makeNewDiv);

	$('#clear').click(function() {
		$('.score').val(0);
		$('#studentName').val('');
	});

	$('#calc').click(calc);
	$('#fullscreen').click(toggleFullscreen);

	document.getElementById("same").onclick = function() {
		let weightInputs = document.getElementsByClassName("weight");
		for(let i = 0; i < weightInputs.length; i++) {
			weightInputs[i].value = 100/weightInputs.length;
		}
	}

	$('#copy').click(function() {
		if(!invalid) {
			document.oncopy = function(evt) {
				evt.clipboardData.setData('Text', $('#grade').html() + ' ' + $('#letter').html() );
				evt.preventDefault();
			};
			document.execCommand('copy');
			document.oncopy = undefined;
			//todo: notificaiton it was copied
		}
	});

	$('#clearConsole').click(function() {
		$('#console').val('').focus();
	});
	

	$('#downloadConsole').click(function() {		
		let data = [(document.getElementById("console").value.replace(/\r?\n/g, '\r\n'))];		
		properties = {type: 'plain/text'};
		try {
			file = new File(data, "grades.txt", properties);
		} catch(e) {
			file = new Blob(data, properties);
		}
		$('#downloadLink').prop('download', 'grade console ' + getFormattedDate() + '.txt');
		$('#downloadLink').prop('href', URL.createObjectURL(file) );
	});

});








function makeNewDiv() {
	$('#gradeItems').append('<div class="gradeItem">' + 
		'<p class="gradeLabel">Score: &nbsp;</p>' +
		'<input type="number" min="0" class="score form-control input-sm" value="0" title="Score">' +
		'<p>&nbsp;/&nbsp;</p>' +
		'<input type="number" min="0" value="100" class="total form-control input-sm" tabIndex="-1" title="Total">' +
		'<p class="breakP">&nbsp;|&nbsp;</p>' +
		'<p class="gradeLabel">Weight: &nbsp;</p>' +
		'<input type="number" min="0" value="100" class="weight form-control input-sm" tabIndex="-1" title="Weight (should add to 100%)">' +
		'<p>%</p>' +
		'<p class="breakP">&nbsp;|&nbsp;</p>' +
		'<p class="gradeLabel">Name: &nbsp;</p>' +
		'<input type="text" class="name form-control input-sm" tabIndex="-1" title="Assignment Name (optional)" placeholder="Assignment (optional)">' +
		'<button class="btn btn-default delete-button" title="Delete Item" tabIndex="-1" onclick="this.parentNode.parentNode.removeChild(this.parentNode);"><i class="fas fa-times"></i></button>' +
		'<p class="gradeInfo"></p>' +
		'</div>');
	return;



	let div = document.createElement("div");
	div.className = "gradeItem";

	let scoreP = document.createElement("p");
	scoreP.innerHTML = " Score: &nbsp;";
	scoreP.className = "gradeLabel";
	div.appendChild(scoreP);
	
	let scoreInput = document.createElement("input");
	scoreInput.type = "number";
	scoreInput.min = "0";
	scoreInput.className = "score form-control input-sm";
	scoreInput.value = "0";
	scoreInput.title = "Score";
	div.appendChild(scoreInput);
	
	let slash = document.createElement("p");
	slash.innerHTML = "&nbsp;/&nbsp;"; //space slash space
	div.appendChild(slash);
	
	let totalInput = document.createElement("input");
	totalInput.type = "number";
	totalInput.min = "0";
	totalInput.value = "100";
	totalInput.className = "total form-control input-sm";
	totalInput.tabIndex = "-1";
	totalInput.title = "Total";
	div.appendChild(totalInput);

	let breakP = document.createElement("p");
	breakP.innerHTML = "&nbsp;|&nbsp;"; //space bar space
	breakP.className = "breakP";
	div.appendChild(breakP);
	
	let weightP = document.createElement("p");
	weightP.innerHTML = "Weight: &nbsp;";
	weightP.className = "gradeLabel";
	div.appendChild(weightP);
	
	let weightInput = document.createElement("input");
	weightInput.type = "number";
	weightInput.min = "0";
	weightInput.className = "weight form-control input-sm";
	weightInput.tabIndex = "-1";
	weightInput.title = "Weight (should add to 100%)";
	div.appendChild(weightInput);

	let percentP = document.createElement("p");
	percentP.innerHTML = " % ";
	div.appendChild(percentP);
	
	breakP = document.createElement("p");
	breakP.innerHTML = "&nbsp;|&nbsp;"; //space bar space
	breakP.className = "breakP";
	div.appendChild(breakP);
	
	let nameP = document.createElement("p");
	nameP.innerHTML = " Name: &nbsp;";
	nameP.className = "gradeLabel";
	div.appendChild(nameP);
	
	let nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.min = "0";
	nameInput.tabIndex = "-1";
	nameInput.title = "Assignment Name (optional)";
	nameInput.className = "name form-control input-sm";
	nameInput.placeholder = "Assignment (optional)"
	div.appendChild(nameInput);
	
	let deleteButton = document.createElement("button");
	deleteButton.className = "btn btn-default delete-button";
	deleteButton.innerHTML = "<i class='fas fa-times'></i>";
	deleteButton.title = "Delete Item";
	deleteButton.tabIndex = "-1";
	deleteButton.onclick = function() {
		this.parentNode.parentNode.removeChild(this.parentNode);
	}
	div.appendChild(deleteButton);
	
	let gradeInfo = document.createElement("p");
	gradeInfo.className = "gradeInfo";
	div.appendChild(gradeInfo);

	document.getElementById("gradeItems").appendChild(div);
}

function calc() {
	let scoreInputs = document.getElementsByClassName("score");
	let totalInputs = document.getElementsByClassName("total");
	let weightInputs = document.getElementsByClassName("weight");
	let gradeInfos = document.getElementsByClassName("gradeInfo");
	let weightTotal = 0;
	for(let i = 0; i < weightInputs.length; i++) {
		weightTotal += parseFloat(weightInputs[i].value);
	}
	let grade = 0;
	let invalid = false;
	for(let j = 0; j < scoreInputs.length; j++) {
		if(scoreInputs[j].value == "" || totalInputs[j].value == "" || weightInputs[j].value == "") {
			grade = "Please enter all numerical inputs and delete empty items";
			invalid = true;
			break;
		} else {
			let newVal = scoreInputs[j].value/totalInputs[j].value*weightInputs[j].value/weightTotal*100;
			gradeInfos[j].innerHTML = "&nbsp; Points: " + Math.round(newVal*100)/100 + "% Grade: " + Math.round(scoreInputs[j].value/totalInputs[j].value*10000)/100 + "%";
			
			grade += newVal;
		}
	}
	if(scoreInputs.length == 0) {
		invalid = true;
		grade = "Please add an item with the button on the left";
	}
	if(!invalid) {
		grade = Math.round(grade*100)/100;
		document.getElementById("letter").innerHTML = getGradeLetter(grade);
		let consoleText = document.getElementById("console");
		consoleText.value = document.getElementById("studentName").value + " " + grade + "% " + getGradeLetter(grade) + "\n" + consoleText.value;
		document.getElementById("grade").innerHTML = grade + " %";
	} else {
		document.getElementById("letter").innerHTML = "";
		document.getElementById("grade").innerHTML = grade;
	}
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
