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
	$content = urldecode($_POST['eventContent']);
	$year = intval($_POST['year']);
	$month = intval($_POST['month']);
	$day = intval($_POST['day']);
	$time = $_POST['time'];

	require "database.php";

	$stmt = $mysqli->prepare("delete from event where username = ? and event = ? and time = ?
								and year = ? and month = ? and day = ?");

	if (!$stmt) {
		$message = printf("Query Prep Failed: %s\n", $mysqli->error);
		echo json_encode(array(
			"success" => false,
			"message" => $message
		));
		exit;
	}

	$stmt->bind_param('sssddd', $username, $content, $time, $year, $month, $day);
	$stmt->execute();
	$stmt->close();

	echo json_encode(array(
		"success" => true,
		"message" => "Successfully Edit"
	));
?>