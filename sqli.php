<?php


    $mysqli = new mysqli("localhost", "USER", "PASSWORD","DATABASE");
    if ($mysqli->connect_error) {
        die('Connect Error [' . $mysqli->connect_errno . '] ' . $mysqli->connect_error);
    }
    
    $qry = "INSERT INTO table (val1, val2, val3) VALUES ('first', '2nd', 'hey');";
    $res = $mysqli->query($qry);
    if ($res) {
        echo "Inserted!";
    } else {
        echo 'Error: ' . $mysqli->error;
    }
    
    $result = $mysqli->query("SELECT * FROM table");
    while ($row = $result->fetch_assoc()) {
        foreach($row as $key => $val) {
            echo "$key: $val";
        }
    }
    $result->free();
    $mysqli->close();

?> 