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
	$content = htmlentities(urldecode($_POST['eventContent']));
	$year = intval($_POST['year']);
	$month = intval($_POST['month']);
	$day = intval($_POST['day']);
	$time = htmlentities($_POST['time']);
	$tag = htmlentities($_POST['tag']);

	require "database.php";

	$stmt = $mysqli->prepare("insert into event (username, event, time, year, month, day, class) values (?,?,?,?,?,?,?)");

	if (!$stmt) {
		$message = printf("Query Prep Failed: %s\n", $mysqli->error);
		echo json_encode(array(
			"success" => false,
			"message" => $message
		));
		exit;
	}

	$stmt->bind_param('sssddds', $username, $content, $time, $year, $month, $day, $tag);
	$stmt->execute();
	$stmt->close();

	echo json_encode(array(
		"success" => true,
		"message" => "Successfully Register"
	));
?>