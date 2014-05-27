<?php

define('API_TOKEN', 'ac2559a2fd8d81c6af251618b36df879e63e60f6');

$url = $_GET['url'];

$apiUrl = 'https://www.readability.com/api/content/v1/parser?token='. API_TOKEN .'&url=' . $url;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$apiRes = curl_exec($ch);
curl_close($ch);


if(!empty($apiRes)) {

	$data = json_decode($apiRes, true);
	$content = $data['content'];
	$content = str_replace(['</p>', '</h1>', '</h2>', '</h3>', '</h4>', '<br/>', '<br />'], "\r\n", $content);
	$content = strip_tags($content);

	$result = array(
		'status' => 'success',
		'result' => $content
	);
} else {
	$result = array(
		'status' => 'error',
		'result' => ''
	);
}

header('Content-Type: application/json');
echo json_encode($result);
die;