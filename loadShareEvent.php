<?php
	header("Content-Type: application/json");
	
	session_start();

	$year = intval($_POST['year']);
	$month = intval($_POST['month']);

	require "database.php";

	$stmt = $mysqli->prepare("select username, friendName, event, time, day from share where year = ? and month = ? ");
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
	$stmt->bind_result($varUsername, $varFriendUsername, $varEvent, $varTime, $varDay);

	$username = array();
	$friendName = array();
	$event = array();
	$day = array();
	$time =array();

	while ($stmt->fetch()) {
		$username[] = $varUsername;
		$friendName[] = $varFriendUsername;
		$event[] = $varEvent;
		$time[] = $varTime;
		$day[] = $varDay;
	}

	$stmt->close();

	$result = array();
	$result['username'] = $username;
	$result['friendName'] = $friendName;
	$result['event'] = $event;
	$result['time'] = $time;
	$result['day'] = $day;

	echo json_encode($result);
?>