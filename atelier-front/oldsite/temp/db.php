<?
    try
    {
    $dbh = new PDO('mysql:host=Db647133807.db.1and1.com;dbname=test', 'dbo647133807', 'u53976298','zYE9e@bx');

    echo "connected sucessfully";
    }
    catch(Exception $e)
    {
        echo $e->getMessage();
    }


?>