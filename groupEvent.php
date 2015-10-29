<?php
	header("Content-Type: application/json");
	
	session_start();

	$token = $_POST['token'];
	if ($_SESSION['token'] != $token) {
		echo json_encode(array(
			"success" => false,
			"message" => "Request forgery detected"
		));
		exit;
	}

	$username = $_POST['username'];
	$content = htmlentities(urldecode($_POST['groupEventContent']));
	$year = intval($_POST['year']);
	$month = intval($_POST['month']);
	$day = intval($_POST['day']);
	$time = htmlentities($_POST['time']);
	$groupUserOne = htmlentities($_POST['groupUserOne']);
	$groupUserTwo = htmlentities($_POST['groupUserTwo']);


	require "database.php";

	$stmt = $mysqli->prepare("insert into groupEvent (memberOne, memberTwo, memberThree, event, time, year, month, day) values (?,?,?,?,?,?,?,?)");

	if (!$stmt) {
		$message = printf("Query Prep Failed: %s\n", $mysqli->error);
		echo json_encode(array(
			"success" => false,
			"message" => $message
		));
		exit;
	}

	$stmt->bind_param('sssssddd', $username, $groupUserOne, $groupUserTwo, $content, $time, $year, $month, $day);
	$stmt->execute();
	$stmt->close();

	echo json_encode(array(
		"success" => true,
		"message" => "Successfully Register"
	));
?>