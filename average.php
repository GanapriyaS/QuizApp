<?php
$host="localhost";
  $username="root";
  $password="";
  $database="lab3";
try {
$conn= mysqli_connect($host,$username,$password,$database);
if($conn){
}
}catch(Exception $errormsg){
echo $errormsg->getMessage();
die("Error". mysqli_connect_error());
}

if(isset($_POST['updateYourScore']))
{
  $sco=$_POST['updateYourScore'];
  $update = mysqli_query($conn,"insert into score(mark) values($sco);");
  $select = mysqli_query($conn,"SELECT avg(mark) as avg FROM score;");
  $row = mysqli_fetch_assoc($select);
  $value=$row["avg"];

    echo "<p>Your Result is: ".$sco." %</p><p>Median Score is: ".$value." %</p>";
  }
if(isset($_POST['updateTotalCount']))
{
  $select = mysqli_query($conn,"SELECT tot FROM total;");
  $update=mysqli_query($conn,"update total set tot=tot+1;");
  $row = mysqli_fetch_assoc($select);
  $value=$row["tot"];
    echo $value;

}
?>
