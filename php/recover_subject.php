<?php

include('connect.php'); // creates $dbh PDO object

// pull id
$prolific_pid = $_POST['prolific_pid'];

// query the database to get subject condition
$query = $dbh->prepare("SELECT * FROM instructor_mediation_exp_2_subjects WHERE prolific_pid = ?");
$query->execute(array($prolific_pid));
$result = $query->fetchAll(PDO::FETCH_ASSOC);

//var_dump($result)

$enthusiasm_condition = $result[0]['enthusiasm_condition'];
$memory_condition = $result[0]['memory_condition'];

$arr = array('enthusiasm_condition' => $enthusiasm_condition, 'memory_condition' => $memory_condition);
echo json_encode($arr);

?>
