<?php
	header("Content-Type: application/json");
	
	session_start();

	$year = intval($_POST['year']);
	$month = intval($_POST['month']);

	require "database.php";

	$stmt = $mysqli->prepare("select username, event, time, day, class from event where year = ? and month = ? ");
	if (!$stmt) {
		$message = printf("Query Prep Failed: %s\n", $mysqli->error);
		echo json_encode(array(
			"success" => false,
			"message" => $message
		));
		exit;
	}

	$stmt->bind_param('dd', $year, $month);
	$stmt->execute();
	$stmt->bind_result($varUsername, $varEvent, $varTime, $varDay, $varTag);

	$username = array();
	$event = array();
	$day = array();
	$time = array();
	$tag = array();

	while ($stmt->fetch()) {
		$username[] = $varUsername;
		$event[] = $varEvent;
		$time[] = $varTime;
		$day[] = $varDay;
		$tag[] = $varTag;
	}

	$stmt->close();

	$result = array();
	$result['username'] = $username;
	$result['event'] = $event;
	$result['time'] = $time;
	$result['day'] = $day;
	$result['tag'] = $tag;

	echo json_encode($result);
?>