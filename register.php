<?php
	header("Content-Type: application/json");

	$username = htmlentities($_POST['username']);
	
	//check username and make sure it is alphanumeric with limited other characters
	if (!preg_match('/^[\w_\.\-]+$/', $username)) {
		echo json_encode(array(
			"success" => false,
			"message" => "Invalid Username"
		));
		exit;
	}

	require "database.php";

	//check if this user already exists
	$stmt = $mysqli->prepare("select count(*) from userinfo where username=?");
	if (!$stmt) {
		$message = printf("Query Prep Failed: %s\n", $mysqli->error);
		echo json_encode(array(
			"success" => false,
			"message" => $message
		));
		exit;
	}

	$stmt->bind_param('s', $username);
	$stmt->execute();
	$stmt->bind_result($cnt);
	$stmt->fetch();
	$stmt->close();

	if ($cnt == 1) {
		echo json_encode(array(
			"success" => false,
			"message" => "Existing username, please change!"
		));
		exit;
	}

	//create new user
	ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = $username;
	$cryptPassword = crypt(htmlentities($_POST['password']));
	$token = substr(md5(rand()), 0, 10);
	$_SESSION['token'] = $token;

	$stmt = $mysqli->prepare("insert into userinfo (username, password, token) values (?,?,?)");
				
	if (!$stmt) {
		$message = printf("Query Prep Failed: %s\n", $mysqli->error);
		echo json_encode(array(
			"success" => false,
			"message" => $message
		));
		exit;
	}

	$stmt->bind_param('sss', $username, $cryptPassword, $token);
	$stmt->execute();
	$stmt->close();

	echo json_encode(array(
		"success" => true,
		"message" => "Successfully Register",
		"username" => $username,
		"token" => $token
	));
?>