<?php
try {
        $host = 'mysql.iu.edu';
        $port = '3656'; //replace [PORT] with your port number
        $dbname = 'experiments'; //replace [DATABASE] with your database name
        $user = 'root'; //replace [USER] with your MySQL user
        $pass = 'iuo34km'; //replace [PASSWORD] with your MySQL password

        $dbh = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br />";
        die();
    }
?>
