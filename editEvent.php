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
	$originalContent = urldecode(($_POST['originalContent']));
	$originalTime = $_POST['originalTime'];
	$tag = htmlentities($_POST['tag']);

	require "database.php";

	$stmt = $mysqli->prepare("update event set time = ?, event = ?, class = ? where username = ? and year = ? and month = ?
								and day = ? and time = ? and event = ?");

	if (!$stmt) {
		$message = printf("Query Prep Failed: %s\n", $mysqli->error);
		echo json_encode(array(
			"success" => false,
			"message" => $message
		));
		exit;
	}

	$stmt->bind_param('ssssdddss', $time, $content, $tag, $username, $year, $month, $day, $originalTime, $originalContent);
	$stmt->execute();
	$stmt->close();

	echo json_encode(array(
		"success" => true,
		"message" => "Successfully Edit"
	));
?>