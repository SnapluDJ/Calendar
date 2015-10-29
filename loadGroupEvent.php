<?php
	header("Content-Type: application/json");
	
	session_start();

	$year = intval($_POST['year']);
	$month = intval($_POST['month']);

	require "database.php";

	$stmt = $mysqli->prepare("select memberOne, memberTwo, memberThree, event, time, day from groupEvent where year = ? and month = ? ");
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
	$stmt->bind_result($varMemberOne, $varMemberTwo, $varMemberThree, $varEvent, $varTime, $varDay);

	$memberOne = array();
	$memberTwo =array();
	$memberThree = array();
	$event = array();
	$day = array();
	$time = array();

	while ($stmt->fetch()) {
		$memberOne[] = $varMemberOne;
		$memberTwo[] = $varMemberTwo;
		$memberThree[] = $varMemberThree;
		$event[] = $varEvent;
		$time[] = $varTime;
		$day[] = $varDay;
	}

	$stmt->close();

	$result = array();
	$result['memberOne'] = $memberOne;
	$result['memberTwo'] = $memberTwo;
	$result['memberThree'] = $memberThree;
	$result['event'] = $event;
	$result['time'] = $time;
	$result['day'] = $day;

	echo json_encode($result);
?>