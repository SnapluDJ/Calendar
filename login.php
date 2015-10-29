<?php
	header("Content-Type: application/json");

	$username = htmlentities($_POST['username']);
	$pwd_guess = htmlentities($_POST['password']);

	require "database.php";

	//check if username and password are correct
	$stmt = $mysqli->prepare("select count(*), password, token from userinfo where username = ?");
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
	$stmt->bind_result($cnt, $pwd_hash, $identity);
	$stmt->fetch();
	$stmt->close();

	if ($cnt == 1 && crypt($pwd_guess, $pwd_hash) == $pwd_hash) {
		ini_set("session.cookie_httponly", 1);
		session_start();
		$_SESSION['username'] = $username;
		$_SESSION['token'] = $identity;
		echo json_encode(array(
			"success" => true,
			"message" => "Successfully Login",
			"username" => $username,
			"token" => $identity
		));
	}else{
		echo json_encode(array(
			"success" => false,
			"message" => "Incorrect username or password"
		));
	}
?>