$( ()=> {

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});

	$('#download-spreadsheet-btn').click(downloadCSV);
	$('#upload-spreadsheet-btn').click(uploadCSV);

	$('#spreadsheet-file-input').change(readCSV);

	$('#night-btn').click( ()=> {
		$('#nightTheme').attr('href', $('#nightTheme').attr('href')?'':'css/night.css');
		$('.table').toggleClass('table-dark');
	});

	for(let i=0; i<3; i++) {
		makeNewDiv();
	}

	$('#copy-btn').hide();

	$('#add-btn').click(makeNewDiv);

	$('#clear-btn').click( ()=> {
		$('.score').val(0);
		$('#student-name').val('');
	});

	$('#calc-btn').click(doCalc);
	$('#fullscreen-btn').click(toggleFullscreen);

	$('#same-btn').click( ()=> {
		$('.weight').val(100);
		// $('.weight').val(round(100/$('.weight').length) );
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
		$('#download-link').prop('download', 'grade_history_' + getFormattedDate() + '.txt');
		$('#download-link').prop('href', URL.createObjectURL(file) );
	});

	$('#remove-all-btn').click( ()=> {
		$('.grade-item').remove();
	});

	$('input').click( (evt)=> {
		if($('#select-onclick-switch').is(':checked') ) {
			$(evt.target).select();
		}
	});

	$('#clear-oncalc-switch').change( ()=> {
		$('#calc-btn').html('Calculate ' + 
			($('#clear-oncalc-switch').is(':checked')?'and Clear ':'') + 
			'<i class="fas fa-chevron-circle-right"></i>');
	});

});

function makeNewDiv(score=0, total=100, weight=100, name='') {
	$('#grade-items').append(
		`<div class="grade-item">
			<span class="grade-label">Score: &nbsp;</span>
			<input type="number" min="0" class="score form-control input-sm" value="${score}" title="Score">
			<span>&nbsp;/&nbsp;</span>
			<input type="number" min="0" value="${total}" class="total form-control input-sm" tabIndex="-1" title="Total">
			<span class="breakP">&nbsp;|&nbsp;</span>
			<span class="grade-label">Weight: &nbsp;</span>
			<input type="number" min="0" class="weight form-control input-sm" value="${weight}" tabIndex="-1" title="Weight (should add to 100%)">
			<span class="breakP">&nbsp;|&nbsp;</span>
			<span class="grade-label">Name: &nbsp;</span>
			<input type="text" class="name form-control input-sm" value="${name}" tabIndex="-1" title="Assignment Name (optional)" placeholder="Assignment (optional)">
			<button class="btn delete-btn" title="Delete Assignment" tabIndex="-1" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">
			<i class="fas fa-times"></i></button>
			<small><span class="grade-info"></span></small>
		</div>`
	);
}