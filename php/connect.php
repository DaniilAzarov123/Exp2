<?php
try {
        $host = 'mysql.uits.iu.edu';
        $port = '3306'; //replace [PORT] with your port number
        $dbname = 'pcl_experiments'; //replace [DATABASE] with your database name
        $user = 'pcl_root'; //replace [USER] with your MySQL user
        $pass = 'dF^-M+r-v)G-HpE-?dZ-{)>-umD-+7j'; //replace [PASSWORD] with your MySQL password

        $dbh = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br />";
        die();
    }
?>
