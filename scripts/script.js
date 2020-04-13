$(document).ready(function () {

		//Focus Event
	var searchField = $('#query'),
		fieldWidth = $('.fieldcontanier');

	$(searchField).on('focus', function () {
		$(fieldWidth).animate({
			width: '100%'
		}, 400);
	});

		//Blur Event
	$(searchField).on('blur', function () {
		if (searchField.val() === '') {
			$(fieldWidth).animate({
				width: '70%'
			}, 400);
		}
	});

		//Prevent submit
		$('#search-form').submit(function (e) {
			e.preventDefault();
		});

});

	//Search function
	function search(token) {

		//Clear result
		$('#results').html('');
		$('#buttons').html('');

		//Get form input
		var q = $('#query').val();

		//Get Request on API
		$.get("https://www.googleapis.com/youtube/v3/search", {
				part: 'snippet',
				q: q,
				pageToken: token,
				type: 'video',
				key: 'AIzaSyCY5OhYPzF4LJ58aWeM_PEr-iB3PswIZuM'
			}).done(function(data) {
				var nextPageToken = data.nextPageToken,
					prevPageToken = data.prevPageToken;
				$.each(data.items, function (i, item) {
					var output = getOutput(item);

					//Display result
					$('#results').append(output);
				});
				var buttons = getButtons(prevPageToken, nextPageToken);
				//Display buttons
				$('#buttons').append(buttons);
			})
			.fail(function(response) {
				console.log(response);
			});
	}
		// Get Output
		function getOutput (item) {
			var videoId = item.id.videoId,
				title = item.snippet.title,
				description = item.snippet.description,
				channelTitle = item.snippet.channelTitle,
				thumb = item.snippet.thumbnails.high.url;
			//Output string
			var output = '<li class="row">' +
			'<div class="pull-left col-sm-4">' +
			'<img class="img-thumbnail img-responsive" src="' + thumb + '">' +
			'</div>' +
			'<div class="pull-right col-sm-8">' +
			'<h3><a class="fancybox fancybox.iframe"' +
			' href="https://www.youtube.com/embed/' +videoId+ '">' +title+ '</a></h3>' +
			'<small>By <span>' +channelTitle+ '</span></small>' +
			'<p>' +description+ '</p>' +
			'</div></li>';

			return output;
		}

		//Prev and Next Page functions
		function nextPage () {
			var token = $('#nextBtn').data('token'),
				q = $('#nextBtn').data('query');
				search(token, q);
		}
		function prevPage () {
			var token = $('#prevBtn').data('token'),
				q = $('#prevBtn').data('query');
				search(token, q);
		}

		// Get Buttons
		function getButtons (prevPageToken, nextPageToken, q) {
			var nextButton = '<button id="nextBtn" type="button" class="btn btn-info" data-token="' +
					nextPageToken +'" data-query="' +q+ '"' +
					'onclick="nextPage();">Next Page</button>',
				prevButton = '<button id="prevBtn" type="button" class="btn btn-info" data-token="' +
					prevPageToken +'" data-query="' +q+ '"' +
					'onclick="prevPage();">Prev Page</button>',
				buttonOutput;

			if (!prevPageToken) {
				buttonOutput = '<div class="button-container">' +
				nextButton + '</div>';
			} else {
				buttonOutput = '<div class="button-container">' +
				prevButton + ' ' + nextButton + '</div>';
			}
			return buttonOutput;
		}

