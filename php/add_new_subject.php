<?php

include('connect.php'); // creates $dbh PDO object

// pull id
$prolific_pid = $_POST['prolific_pid'];

// query the database to get subject count
$query = "SELECT DISTINCT prolific_pid FROM instructor_mediation_exp_2_subjects";
$result = $dbh->query($query);
$count = $result->rowCount();
$condition = $count % 4;

if($condition == 0){
  $enthusiasm_condition = 'enthused';
  $memory_condition = 'massed';
} else if($condition == 1) {
  $enthusiasm_condition = 'neutral';
  $memory_condition = 'massed';
} else if($condition == 2) {
  $enthusiasm_condition = 'enthused';
  $memory_condition = 'spaced';
} else if($condition == 3) {
  $enthusiasm_condition = 'neutral';
  $memory_condition = 'spaced';
}

$insert_q = $dbh->prepare('INSERT INTO instructor_mediation_exp_2_subjects (prolific_pid, enthusiasm_condition, memory_condition) VALUES (?, ?, ?)');
try {
  $insert_q->execute(array($prolific_pid,$enthusiasm_condition,$memory_condition));
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br />";
    die();
}
$arr = array('enthusiasm_condition' => $enthusiasm_condition, 'memory_condition' => $memory_condition);
echo json_encode($arr);

?>
