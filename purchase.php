<html>

<head>
  <meta charset="UTF-8" />
  <meta name="description" content="UTS MIT 2020Autumn 32516IP Assignment1 OnlineGroceryStore">
  <meta name="keywords" content="HTML,CSS,JavaScript">
  <meta name="author" content="JiahuaLi">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ass1 Grocery Store</title>
  <script type="text/javascript" src="http://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
</head>

<body>

  <?php
  if (isset($_POST['submit'])) {
    $to = $_REQUEST['Email'];
    $subject = "Online Grocery Store Purchase Confirmation";
    $messsage = "A purchase was made.";
    echo "<div class='container w-50 mx-auto text-center'><h3>A purchase was made.</h3><br><h3>Order details:</h3><br><table class='table w-50 mx-auto'>";
    foreach ($_REQUEST as $key => $value) {
      echo "<tr><td>" . $key . "</td>";
      echo "<td class='text-right'>" . $value . "</td></tr>";
      $messsage+= $key+" : "+$value+" ; ";
    }
    echo "</table></div>";
    mail($to, $subject, $messsage);
  }
  ?>

</body>

</html>