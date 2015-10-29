//Store session username and token after login and register
var sessionUsername = '';
var sessionToken = '';

//Variables for the calendar
var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth();
var currentMonth = new Month(year, month);
var monthNumerate = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//Store the date of clicked cell for ajax request
var clickedCellDate;
var clickedEditCellDate;
var clickedEditCellContent;

//Tag counter, when it is an odd, show the tag of event, when it is even, hide the tag
//defualt is showing the tag
var counter = 1;

//After login or register, add event listener to every table cell
function addListenerToEveryTableCell () {
	var table = document.getElementById('basicCalendar');
	if (table !== null) {
		for (var i = 1; i < table.rows.length; i++) {
			for (var j = 0; j < table.rows[i].cells.length; j++) {
				var target = table.rows[i].cells[j];
				if (target.className == 'inThisMonth') {
					target.addEventListener("click", personalGroupWindow, false);
				}
			}
		}
	}
}


//Highlight the cell when mouse over after login
function highlightRows () {
	var table = document.getElementById('basicCalendar');
	if (table !== null) {
		for (var i = 1; i < table.rows.length; i++) {
			for (var j = 0; j < table.rows[i].cells.length; j++) {
				table.rows[i].cells[j].oldClassName = table.rows[i].cells[j].className;

				table.rows[i].cells[j].onmouseover = function () {
					this.className = "highlight";
				};

				table.rows[i].cells[j].onmouseout = function () {
					this.className = this.oldClassName;
				};
			}
		}
	}
}



//Highlight today, it is called after calendar table is created
function highLightToday () {
	var id = '#' + currentDate.getDate().toString();
	$(id).css("background-color", "#cba");
}



//check the current state is login or not, if login, after every check (check indicates
//new table has been created), which means need to add event listener to every new table cell
function checkLoginState () {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "checkLogin.php", true);
	xmlHttp.addEventListener("load", checkLoginStateCallback, false);
	xmlHttp.send(null);
}

function checkLoginStateCallback () {
	var jsonData = JSON.parse(event.target.responseText);
	if (jsonData.login) {
		document.getElementById('welcome').innerHTML = "Hello, " + jsonData.username + "!";
		$('#login').hide();
		$('#register').hide();
		$('#welcome').show();
		$('#logout').show();
		$('#tag').show();
		sessionUsername = jsonData.username;
		sessionToken = jsonData.token;
		addListenerToEveryTableCell();

		loadEvent();
		loadSharedEvent();
		loadGroupEvent();
	}
}



//After refresh, if already login, then needs to hold this state (display hello words)
function holdLoginState () {
	checkLoginState();
}

document.addEventListener("DOMContentLoaded", holdLoginState, false);



//Popup login or register window
function loginPopUp () {
	$('#login').hide();
	$('#register').hide();
	$('#loginPopUp').show(); 
}

function registerPopUp () {
	$('#login').hide();
	$('#register').hide();
	$('#registerPopUp').show(); 
}

document.getElementById('login').addEventListener("click", loginPopUp, false);
document.getElementById('register').addEventListener("click", registerPopUp, false);



//Cancel login or register
function loginCancel () {
	$('#login').show();
	$('#register').show();
	$('#loginPopUp').hide();
}

function registerCancel () {
	$('#login').show();
	$('#register').show();
	$('#registerPopUp').hide();
}

document.getElementById('loginCancel').addEventListener("click", loginCancel, false);
document.getElementById('registerCancel').addEventListener("click", registerCancel, false);



//Popup Modal message when login or register goes wrong
function modalMessage (id) {
	$(id).dialog({
    	modal: true,
      	buttons: {
        	Ok: function() {
          		$( this ).dialog( "close" );
        	}
      	}
    });
}

//Register
function register () {
	var username = document.getElementById('registerUsername').value;
	var password = document.getElementById('registerPassword').value;

	var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "register.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", registerCallback, false);
	xmlHttp.send(dataString);
}

function registerCallback () {
	var jsonData = JSON.parse(event.target.responseText);
	if (jsonData.success) {
		$('#registerPopUp').hide();
		document.getElementById('welcome').innerHTML = "Hello, " + jsonData.username + "!";
		$('#welcome').show();
		$('#logout').show();
		$('#tag').show();
		sessionUsername = jsonData.username;
		sessionToken = jsonData.token;
		addListenerToEveryTableCell();
	}else{
		modalMessage('#dialogMessageRegister');
	}
}

document.getElementById('registerSubmit').addEventListener("click", register, false);



//Login 
function login () {
	var username = document.getElementById('loginUsername').value;
	var password = document.getElementById('loginPassword').value;

	var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "login.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", loginCallback, false);
	xmlHttp.send(dataString);
}

function loginCallback () {
	var jsonData = JSON.parse(event.target.responseText);
	if (jsonData.success) {
		$('#loginPopUp').hide();
		document.getElementById('welcome').innerHTML = "Hello, " + jsonData.username + "!";
		$('#welcome').show();
		$('#logout').show();
		$('#tag').show();
		sessionUsername = jsonData.username;
		sessionToken = jsonData.token;
		addListenerToEveryTableCell();

		loadEvent();
		loadSharedEvent();
		loadGroupEvent();
	}else{
		modalMessage('#dialogMessageLogin');
	}
}

document.getElementById('loginSubmit').addEventListener("click", login, false);



//Logout
function logout () {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "logout.php", true);
	xmlHttp.addEventListener("load", logoutCallback, false);
	xmlHttp.send(null);
}

function logoutCallback () {
	var jsonData = JSON.parse(event.target.responseText);
	if (jsonData.success) {
		$('#welcome').hide();
		$('#logout').hide();
		$('#tag').hide();
		$('#login').show();
		$('#register').show();
		removeListenerToEveryTableCell();
		sessionUsername = '';
		sessionToken = '';

		//Inorder to remove the event which has loaded, need to remove current table and create a new one
		$('tr').remove();
		$('th').remove();
		$('td').remove();
		basicCalendar(currentMonth);
	}
}

document.getElementById('logout').addEventListener("click", logout, false);



//After logout, remove event listener on table cell
function removeListenerToEveryTableCell () {
	var table = document.getElementById('basicCalendar');
	if (table !== null) {
		for (var i = 1; i < table.rows.length; i++) {
			for (var j = 0; j < table.rows[i].cells.length; j++) {
				table.rows[i].cells[j].removeEventListener("click", personalGroupWindow, false);
			}
		}
	}
}



//Create calendar table once loaded
function basicCalendar (currentMonth) {
	var weekdayNumerate = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var table = document.getElementById('basicCalendar');
	var weeks = currentMonth.getWeeks();

	//Display Sunday through Saturday on the table
	var displayDays = document.createElement("tr");
	for (var i = 0; i < 7; i++) {
		var cellForDayDisplay = document.createElement("th");
		cellForDayDisplay.innerHTML = weekdayNumerate[i];
		displayDays.appendChild(cellForDayDisplay);
	}
	table.appendChild(displayDays); 

	//Create cell for each date
	var daysCounter = 1;
	for (var w in weeks) {
		var row = document.createElement("tr");
		var days = weeks[w].getDates();
		for (var d in days) {
			var column = document.createElement("td");

			//create division for date and event in each table cell
			var dateDisplayPlace = document.createElement("div");
			var eventDisplayPlace = document.createElement("div");
			var shareOrGroupDisplayPlace = document.createElement("div");
			dateDisplayPlace.className = "dateDisplayPlace";
			eventDisplayPlace.className = "eventDisplayPlace";
			shareOrGroupDisplayPlace.className = "shareOrGroupDisplayPlace";
			column.appendChild(dateDisplayPlace);
			column.appendChild(eventDisplayPlace);
			column.appendChild(shareOrGroupDisplayPlace);

			dateDisplayPlace.innerHTML = days[d].getDate();
			if (days[d].getMonth() != currentMonth.month) {
				column.className = "notThisMonth";
			}else{
				column.className = "inThisMonth";
				column.id = daysCounter.toString();
				++daysCounter;
			}
			row.appendChild(column);
		}
		table.appendChild(row);		
	}

	if (currentMonth.month == month) {
		highLightToday();
	}	
}

document.addEventListener("DOMContentLoaded", function () {basicCalendar(currentMonth);}, false);



//Back to today
function backToToday () {
	currentMonth = new Month(year, month);
	showCalendarTitle(currentMonth);
	writeMonthInButton(currentMonth);

	//Remove current table and create a new one
	$('tr').remove();
	$('th').remove();
	$('td').remove();
	basicCalendar(currentMonth);

	//If login, then need to add event listner to the new table cell
	checkLoginState();
}

document.getElementById('today').addEventListener("click", backToToday, false);


//Show the title of month and year once loaded
function showCalendarTitle (currentMonth) {
	var monthDisplay = currentMonth.month;
	var yearDisplay = currentMonth.year;
	document.getElementById('calendarTitle').innerHTML = monthNumerate[monthDisplay] + ", " + yearDisplay;
}

document.addEventListener("DOMContentLoaded", function () {showCalendarTitle(currentMonth);}, false);



//Write previous and next month in previous and next button once loaded
function writeMonthInButton (currentMonth) {
	var prevMonth = currentMonth.prevMonth().month;
	var nextMonth = currentMonth.nextMonth().month;

	document.getElementById('previous').innerHTML = monthNumerate[prevMonth] + ' &lang;&lang;&lang;';
	document.getElementById('next').innerHTML = '&rang;&rang;&rang; ' + monthNumerate[nextMonth];
}

document.addEventListener("DOMContentLoaded", function () {writeMonthInButton(currentMonth);}, false);



//when previous or next button is clicked, update title, button, calendar and event
function previousButtonClick () {
	currentMonth = currentMonth.prevMonth();
	showCalendarTitle(currentMonth);
	writeMonthInButton(currentMonth);
	
	//Remove current table and create a new one
	$('tr').remove();
	$('th').remove();
	$('td').remove();
	basicCalendar(currentMonth);

	//If login, then need to add event listner to the new table cell
	checkLoginState();
}

function nextButtonClick () {
	currentMonth = currentMonth.nextMonth();
	showCalendarTitle(currentMonth);
	writeMonthInButton(currentMonth);

	//Remove current table and create a new one
	$('tr').remove();
	$('th').remove();
	$('td').remove();
	basicCalendar(currentMonth);

	//If login, then need to add event listner to the new table cell
	checkLoginState();
}

document.getElementById('previous').addEventListener("click", previousButtonClick, false);
document.getElementById('next').addEventListener("click", nextButtonClick, false);



//Popup personal or group event window, this function will be called when table cell
//is clicked after login
function personalGroupWindow () {
	$('#personalGroupEvent').show();
	clickedCellDate = this.firstChild.innerHTML;
}



//Popup add event window when choosing personal
function addEventWindow () {
	$('#personalGroupEvent').hide();
	$('#addEvent').show();

	//Write Date into the add event window
	var date = document.getElementById('dateOfCell');
	var text = monthNumerate[currentMonth.month] + ' ' + clickedCellDate + ', ' + currentMonth.year;
	date.innerHTML = text;
}

document.getElementById('choosePersonal').addEventListener("click", addEventWindow, false);



//Popup edit or delete event window when a certain event is clicked
function editOrDeleteWindow () {
	event.stopPropagation();
	$('#editDeleteEvent').show();	
	clickedEditCellDate = this.parentNode.parentNode.firstChild.innerHTML;
	clickedEditCellContent = this.innerHTML;
}	



//Edit event window popup, share event window popup, add group event window popup
function editWindow () {
	$('#editDeleteEvent').hide();
	$('#editEvent').show();
}

function shareWindow () {
	$('#editDeleteEvent').hide();
	$('#shareEvent').show();
}

function groupEventWindow () {
	$('#personalGroupEvent').hide();
	$('#groupEventWindow').show();

	var date = document.getElementById('dateOfCellGroup');
	var text = monthNumerate[currentMonth.month] + ' ' + clickedCellDate + ', ' + currentMonth.year;
	date.innerHTML = text;
}

document.getElementById('chooseGroup').addEventListener("click", groupEventWindow, false);
document.getElementById('chooseEdit').addEventListener("click", editWindow, false);
document.getElementById('chooseShare').addEventListener("click", shareWindow, false);



//Close add event window, edit or delete event choice window, edit event window
function closeAddEventWindow () {
	$('#addEvent').hide();
}

function closeEditOrDeleteWindow () {
	$('#editDeleteEvent').hide();
}

function closeEditEvent () {
	$('#editEvent').hide();
}

function closeShareWindow () {
	$('#shareEvent').hide();
}

function closeGroupEventWindow () {
	$('#groupEventWindow').hide();
}

function closePersonalGroupWindow () {
	$('#personalGroupEvent').hide();
}

$('.close').bind("click", function () {closeAddEventWindow(); closeEditOrDeleteWindow(); closeEditEvent(); closeShareWindow();
										closeGroupEventWindow(); closePersonalGroupWindow()});



//Add event
function addEvent () {
	$('#addEvent').hide();

	var content = document.getElementById('eventContent').value;
	var time = document.getElementById('eventTime').value;
	var tag = document.getElementById('tagAdd').value;

	var dataString = "eventContent=" + encodeURIComponent(content) + "&year=" + encodeURIComponent(currentMonth.year)
					+ "&month=" + encodeURIComponent(currentMonth.month) + "&day=" + encodeURIComponent(clickedCellDate)
					+ "&token=" + encodeURIComponent(sessionToken) + "&username=" + encodeURIComponent(sessionUsername)
					+ "&time=" + encodeURIComponent(time) + "&tag=" + encodeURIComponent(tag);
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "addEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", addEventCallback, false);
	xmlHttp.send(dataString);
}

function addEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);
	if (jsonData.success) {
		//Need to create a new table, otherwise, event that has already been loaded will be loaded again
		$('tr').remove();
		$('th').remove();
		$('td').remove();
		basicCalendar(currentMonth);
		addListenerToEveryTableCell();

		loadEvent();
		loadSharedEvent();
		loadGroupEvent();
	}else{
		modalMessage('#dialogMessageAddEventFail');
	}
}

document.getElementById('submit').addEventListener("click", addEvent, false);



//load event in calendar
function loadEvent () {
	var dataString = "year=" + encodeURIComponent(currentMonth.year) + "&month=" +encodeURIComponent(currentMonth.month);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "loadEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", loadEventCallback, false);
	xmlHttp.send(dataString);
}

function loadEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);

	for (var i = 0; i < jsonData.event.length; i++) {
		if (jsonData.username[i] == sessionUsername) {
			var id = jsonData.day[i].toString();
			var temp = document.getElementById(id);
			var cell = temp.getElementsByClassName("eventDisplayPlace");

			if ((counter % 2) == 0) {
				cell[0].innerHTML += '<a href="javascript:void(0)" class="editDelete">' 
											+ jsonData.time[i] + " " + jsonData.event[i]; + '</a>';
			}else{
				cell[0].innerHTML += '<a href="javascript:void(0)" class="editDelete">' + jsonData.time[i] + " " 
											+ jsonData.event[i] + ' (' + jsonData.tag[i] + ')</a>';
			}
			cell[0].innerHTML += '<br>';
		}
	}

	//add event listener to every event
	$(".editDelete").bind("click", editOrDeleteWindow);
}



//Edit event
function editEvent () {
	$('#editEvent').hide();

	var content = document.getElementById('editEventContent').value;
	var time = document.getElementById('editEventTime').value;
	var tag = document.getElementById('tagEdit').value;

	//Split "clickedEditCellContent" into time and event
	if ((counter % 2) == 0) {
		var index = clickedEditCellContent.indexOf(" ");
		var originalTime = clickedEditCellContent.substr(0, index);
		var originalContent = clickedEditCellContent.substr(index+1);
	}else{
		var index1 = clickedEditCellContent.indexOf(" ");
		var originalTime = clickedEditCellContent.substr(0, index1);
		var temp = clickedEditCellContent.substr(index1+1);
		var index2 = temp.indexOf("(");
		var originalContent = temp.substr(0, index2-1);
	}

	var dataString = "eventContent=" + encodeURIComponent(content) + "&time=" + encodeURIComponent(time) + "&year=" + encodeURIComponent(currentMonth.year)
					+ "&month=" + encodeURIComponent(currentMonth.month) + "&day=" + encodeURIComponent(clickedEditCellDate)
					+ "&token=" + encodeURIComponent(sessionToken) + "&username=" + encodeURIComponent(sessionUsername) + "&originalContent=" 
					+ encodeURIComponent(originalContent) + "&originalTime=" + encodeURIComponent(originalTime) + "&tag=" + encodeURIComponent(tag);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "editEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", editEventCallback, false);
	xmlHttp.send(dataString);
}

function editEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);

	if (jsonData.success) {
		$('tr').remove();
		$('th').remove();
		$('td').remove();
		basicCalendar(currentMonth);
		addListenerToEveryTableCell();

		loadEvent();
		loadSharedEvent();
		loadGroupEvent();
	}else{
		modalMessage('#dialogMessageEditEventFail');
	}
}

document.getElementById('editSubmit').addEventListener("click", editEvent, false);



//Delete event
function deleteEvent () {
	$('#editDeleteEvent').hide();

	if ((counter % 2) == 0) {
		var index = clickedEditCellContent.indexOf(" ");
		var time = clickedEditCellContent.substr(0, index);
		var content = clickedEditCellContent.substr(index+1);
	}else{
		var index1 = clickedEditCellContent.indexOf(" ");
		var time = clickedEditCellContent.substr(0, index1);
		var temp = clickedEditCellContent.substr(index1+1);
		var index2 = temp.indexOf("(");
		var content = temp.substr(0, index2-1);
	}

	var dataString = "eventContent=" + encodeURIComponent(content) + "&time=" + encodeURIComponent(time) + "&year=" + encodeURIComponent(currentMonth.year)
					+ "&month=" + encodeURIComponent(currentMonth.month) + "&day=" + encodeURIComponent(clickedEditCellDate)
					+ "&token=" + encodeURIComponent(sessionToken) + "&username=" + encodeURIComponent(sessionUsername);
								
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "deleteEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", deleteEventCallback, false);
	xmlHttp.send(dataString);

}

function deleteEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);

	if (jsonData.success) {
		$('tr').remove();
		$('th').remove();
		$('td').remove();
		basicCalendar(currentMonth);
		addListenerToEveryTableCell();

		loadEvent();
		loadSharedEvent();
		loadGroupEvent();
	}else{
		modalMessage('#dialogMessageEditEventFail');
	}
}

document.getElementById('chooseDelete').addEventListener("click", deleteEvent, false);



//Share event
function shareEvent () {
	$('#shareEvent').hide();

	var friendName = document.getElementById('shareFriendName').value;

	if ((counter % 2) == 0) {
		var index = clickedEditCellContent.indexOf(" ");
		var time = clickedEditCellContent.substr(0, index);
		var content = clickedEditCellContent.substr(index+1);
	}else{
		var index1 = clickedEditCellContent.indexOf(" ");
		var time = clickedEditCellContent.substr(0, index1);
		var temp = clickedEditCellContent.substr(index1+1);
		var index2 = temp.indexOf("(");
		var content = temp.substr(0, index2-1);
	}

	var dataString = "eventContent=" + encodeURIComponent(content) + "&time=" + encodeURIComponent(time) + "&year=" + encodeURIComponent(currentMonth.year)
					+ "&month=" + encodeURIComponent(currentMonth.month) + "&day=" + encodeURIComponent(clickedEditCellDate) + "&token="
					+ encodeURIComponent(sessionToken) + "&username=" + encodeURIComponent(sessionUsername) + "&friendName=" +encodeURIComponent(friendName);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "shareEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", shareEventCallback, false);
	xmlHttp.send(dataString);
}

function shareEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);

	if (!jsonData.success) {
		modalMessage('#dialogMessageShareEventFail');
	}
}

document.getElementById('shareSubmit').addEventListener("click", shareEvent, false);



//Load shared events from your friend
function loadSharedEvent () {
	var dataString = "year=" + encodeURIComponent(currentMonth.year) + "&month=" +encodeURIComponent(currentMonth.month);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "loadShareEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", loadSharedEventCallback, false);
	xmlHttp.send(dataString);
}

function loadSharedEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);

	for (var i = 0; i < jsonData.event.length; i++) {
		if (jsonData.friendName[i] == sessionUsername) {
			var id = jsonData.day[i].toString();
			var temp = document.getElementById(id);
			var cell = temp.getElementsByClassName("shareOrGroupDisplayPlace");

			cell[0].innerHTML += jsonData.time[i] + " " + jsonData.event[i] + ' (' +jsonData.username[i] + ')';
			cell[0].innerHTML += '<br>';
		}
	}
}



//Add group event
function groupEvent () {
	$('#groupEventWindow').hide();

	var content = document.getElementById('groupEventContent').value;
	var time = document.getElementById('groupEventTime').value;
	var groupUserOne = document.getElementById('groupUser1').value;
	var groupUserTwo = document.getElementById('groupUser2').value;

	var dataString = "groupEventContent=" + encodeURIComponent(content) + "&year=" + encodeURIComponent(currentMonth.year)
					+ "&month=" + encodeURIComponent(currentMonth.month) + "&day=" + encodeURIComponent(clickedCellDate)
					+ "&token=" + encodeURIComponent(sessionToken) + "&username=" + encodeURIComponent(sessionUsername)
					+ "&time=" + encodeURIComponent(time) + "&groupUserOne=" +encodeURIComponent(groupUserOne)
					+ "&groupUserTwo=" + encodeURIComponent(groupUserTwo);
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "groupEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", groupEventCallback, false);
	xmlHttp.send(dataString);
}

function groupEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);

	if (jsonData.success) {
		$('tr').remove();
		$('th').remove();
		$('td').remove();
		basicCalendar(currentMonth);
		addListenerToEveryTableCell();

		loadEvent();
		loadSharedEvent();
		loadGroupEvent();
	}else{
		modalMessage('#dialogMessageAddEventFail');
	}
}

document.getElementById('groupEventSubmit').addEventListener("click", groupEvent, false);



//Load group event
function loadGroupEvent () {
	var dataString = "year=" + encodeURIComponent(currentMonth.year) + "&month=" +encodeURIComponent(currentMonth.month);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "loadGroupEvent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", loadGroupEventCallback, false);
	xmlHttp.send(dataString);
}

function loadGroupEventCallback () {
	var jsonData = JSON.parse(event.target.responseText);

	for (var i = 0; i < jsonData.event.length; i++) {
		if ((jsonData.memberOne[i] == sessionUsername) || (jsonData.memberTwo[i] == sessionUsername) || (jsonData.memberThree[i] == sessionUsername)) {
			var id = jsonData.day[i].toString();
			var temp = document.getElementById(id);
			var cell = temp.getElementsByClassName("shareOrGroupDisplayPlace");

			cell[0].innerHTML += jsonData.time[i] + " " + jsonData.event[i] + ' (Group)';
			cell[0].innerHTML += '<br>';
		}
	}
}



//Change the counter of tag
function changeTabCounter () {
	++counter;

	if ((counter % 2) == 0) {
		document.getElementById('tag').innerHTML = "Enable Tag Display";
	}else{
		document.getElementById('tag').innerHTML = "Disable Tag Display";
	}

	$('tr').remove();
	$('th').remove();
	$('td').remove();
	basicCalendar(currentMonth);
	addListenerToEveryTableCell();

	loadEvent();
	loadSharedEvent();
	loadGroupEvent();
}

document.getElementById('tag').addEventListener("click", changeTabCounter, false);	