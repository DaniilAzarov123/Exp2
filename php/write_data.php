<?php

// Submit Data to mySQL database
// Josh de Leeuw, August 2012

include('connect.php');

// You should not need to edit below this line

function mysql_insert($table, $inserts,$dbh) {
    $values = array_values($inserts);
    var_dump($values);
    $keys = array_keys($inserts);
    $query = "INSERT INTO ".$table." (".implode(',', $keys).") VALUES ('".implode("','", $values)."')";
    print $query;
    try{
      return $dbh->exec($query);
    } catch(Exception $e){
      echo 'Failed: ' . $e->getMessage();
    }
}

// get the table name
$tab = $_POST['table'];

// decode the data object from json
$trials = json_decode($_POST['new_data']);

//var_dump($trials);

// get the optional data (decode as array)
$opt_data = json_decode($_POST['opt_data'], true);
$opt_data_names = array_keys($opt_data);

// for each element in the trials array, insert the row into the mysql table
for($i=0;$i<count($trials);$i++)
{
	$to_insert = (array)($trials[$i]);
	// add any optional, static parameters that got passed in (like subject id or condition)
	for($j=0;$j<count($opt_data_names);$j++){
		$to_insert[$opt_data_names[$j]] = $opt_data[$opt_data_names[$j]];
	}
  //var_dump($to_insert);
	$result = mysql_insert($tab, $to_insert,$dbh);
  print $result;
}

// confirm the results
if (!$result) {
	die('Invalid query');
} else {
	print "successful insert!";
}

?>
