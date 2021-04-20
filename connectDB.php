  <?php

    $host = "******";
    $user = "******";
    $pwd = "******";
    $dbname = "******";
    $dbtable = "******";
    $link = mysqli_connect($host, $user, $pwd, $dbname);
    if ($link === false) {
        die("ERROR: Could not connect. " . mysqli_connect_error());
    }

    $id = $_GET["id"];
    $sql = "SELECT * FROM grocerydb.products WHERE (products.product_id = $id)";
    $res = [];
    if ($result = mysqli_query($link, $sql)) {
        if (mysqli_num_rows($result) > 0) {
            $res["success"] = true;
            while ($row = mysqli_fetch_array($result)) {
                $res["productID"] = $row["product_id"];
                $res["productName"] = $row["product_name"];
                $res["unitPrice"] = $row["unit_price"];
                $res["unitQuantity"] = $row["unit_quantity"];
                $res["inStock"] = $row["in_stock"];
            }
            mysqli_free_result($result);
        } else {
            $res["success"] = false;
            $res["message"] = "No records matching your query were found.";
        }
    } else {
        $res["success"] = false;
        $res["message"] = "ERROR: Could not able to execute $sql. " . mysqli_error($link);
    }

    mysqli_close($link);
    echo json_encode($res);
    ?>