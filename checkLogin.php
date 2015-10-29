<?php
	header("Content-Type: application/json");

	session_start();

	if (!empty($_SESSION['username'])) {
		echo json_encode(array(
			"login" => true,
			"username" => $_SESSION['username'],
			"token" => $_SESSION['token']
		));
	}else{
		session_destroy();
		echo json_encode(array(
			"login" => false 
		));
	}
?>