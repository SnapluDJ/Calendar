<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Calendar</title>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
		<script type="text/javascript" src="http://classes.engineering.wustl.edu/cse330/content/calendar.min.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
		<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
		<meta charset="utf-8" />
	</head>

	<body>
		<!--Display basic calendar-->
		<table id="basicCalendar"></table>

		<!-- Display the title of the chosen month and year -->
		<div id="calendarTitle"></div>

		<!-- Back to today -->
		<button id="today">Back to Today</button>

		<!-- Previous and Next button -->
		<button id="previous"></button>
		<button id="next"></button>

		<!--Login and Register mark-->
		<div id="loginRegisterMark">
			<button id="login">Login</button>
			<button id="register">Register</button>
		</div>

		<!--LoginPopUp-->	
		<div id="loginPopUp">
			Username:<input type="text" id="loginUsername" required="required" />
			Password:<input type="password" id="loginPassword" required="required" />
			<button id="loginSubmit">Login</button>
			<button id="loginCancel">Cancel</button>
		</div>

		<!-- Modal message -->
		<div id="dialogMessageRegister">Existing user, please change!</div>
		<div id="dialogMessageLogin">Incorrect username or password!</div>
		<div id="dialogMessageAddEventFail">Error!</div>
		<div id="dialogMessageEditEventFail">Error!</div>
		<div id="dialogMessageDeleteEventFail">Error!</div>

		<!--RegisterPopUp-->
		<div id="registerPopUp">
			Username:<input type="text" id="registerUsername" name="username" required="required" />
			Password:<input type="password" id="registerPassword" name="password" required="required" />
			<button id="registerSubmit">Register</button>
			<button id="registerCancel">Cancel</button>
		</div>

		<!--After login or register, the welcome words and logout button-->
		<div id="welcome"></div>
		<button id="logout">Logout</button>

		<!-- Add event window -->
		<div id="addEvent">
			<div class="popupContent">
				<form action="#" method="POST">
					<img src="close.png" class="close" alt="close">
					<h2>Add Event</h2>
					<h3 id="dateOfCell"></h3>
					<hr>
					<textarea id="eventTime" placeholder="eg. 6:30Am" required="required"></textarea>
					<textarea id="eventContent" placeholder="Type event" required="required"></textarea>
					<a href="javascript:void(0)" id="submit">Add</a>
				</form>
			</div>
		</div>

		<!-- Edit and Delete choice window -->
		<div id="editDeleteEvent">
			<div class="popupContent">
				<form action="#" method="POST">
					<img src="close.png" class="close" alt="close">
					<h2>Make a Choice</h2>
					<hr>
					<a href="javascript:void(0)" id="chooseEdit">Edit</a>
					<br/>
					<a href="javascript:void(0)" id="chooseDelete">Delete</a>
					<br/>
					<a href="javascript:void(0)" id="chooseShare">Share</a>
				</form>
			</div>
		</div>

		<!-- Edit event window-->
		<div id="editEvent">
			<div class="popupContent">
				<form action="#" method="POST">
					<img src="close.png" class="close" alt="close">
					<h2>Edit Event</h2>
					<hr>
					<textarea id="editEventTime" placeholder="eg. 6:30Am" required="required"></textarea>
					<textarea id="editEventContent" placeholder="Type event" required="required"></textarea>
					<a href="javascript:void(0)" id="editSubmit">Submit Edit</a>
				</form>
			</div>
		</div>

		<script type="text/javascript" src="global.js"></script>
	</body>
</html>