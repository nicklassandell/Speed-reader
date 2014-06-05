<?php

$uri = $_SERVER['REQUEST_URI'];
preg_match('/(.*)\/text\/(.*)/', $uri, $matches);

if(!empty($_REQUEST['text'])) {
	$text = $_REQUEST['text'];
} else {
	$text = $matches[2];
}

$appUrl = "http://$_SERVER[HTTP_HOST]$matches[1]";

setcookie('READ_TEXT', $text, time()+60, '/');

header('Location: ' . $appUrl);
die;