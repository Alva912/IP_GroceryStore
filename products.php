<!-- UTS MIT 2020Autumn 32516IP Assignment1 OnlineGroceryStore JiahuaLi -->
<?php
// Receive from JS
$pk = $_GET["pk"];

// Connect to database
$host = "******";
$user = "******";
$pwd = "******";
$dbname = "******";
$dbtable = "******";
$link = mysqli_connect($host,$user,$pwd,$dbname);
if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
// Get a table and its columns and rows number
$result = mysqli_query($link, "select * from products");
$field_cnt = mysqli_num_fields($result);
$res_cnt = mysqli_num_rows($result);
// Get all candidate keys name ie. all columns name
$field_name = array ();
for ($i = 0; $i < $field_cnt; $i++){
    $field_name[$i] = mysqli_fetch_field_direct($result, $i)->name;
}
// Get all rows content
$res_array = array();
$index = 0;
while ($row = mysqli_fetch_array($result)){
    $res_array[$index] = $row;
    $index++;
}

// Generate XML
$doc = new DOMDocument("1.0","UTF-8");
$doc->formatOutput = true;
// The structure is root--node--attr(as subsidiary elem)--val
$root = $doc->createElement($dbname);
$doc->appendChild($root);
foreach ($res_array as $res => $value){
    $node = $doc->createElement($dbtable);
    $root->appendChild($node);
    $n = 0;
    while ($n < $field_cnt){
        $attr[$n] = $doc->createElement($field_name[$n]);
        $val = $doc->createTextNode($value[$field_name[$n]]);
        $attr[$n]->appendChild($val);
        $node->appendChild($attr[$n]);
        $n++;
    }
}
// Get the 1st column name ie. primary key name which is unique
$x = $doc->getElementsByTagName($field_name[0]);
for ($i=0; $i<=$x->length-1; $i++){
    // It's an attr of parent node in the form of subsidiary elem
    if ($x->item($i)->nodeType == 1){
        if ($x->item($i)->childNodes->item(0)->nodeValue == $pk){
            $y=($x->item($i)->parentNode);
        }
    }
}
// Get all attributes of parent node ie. all sub-elements
$attr=($y->childNodes);
for ($i=0;$i<$attr->length;$i++){ 
    if ($attr->item($i)->nodeType==1){
        // Output attributes
        echo("<tr><td>");
        echo($attr->item($i)->nodeName);
        echo(":</td><td id='");
        echo($attr->item($i)->nodeName);
        // Output value
        echo("' value='");
        echo($attr->item($i)->childNodes->item(0)->nodeValue);
        echo("'>");
        echo($attr->item($i)->childNodes->item(0)->nodeValue);
        echo("</td></tr>");
    }
}

mysqli_close($link);

?>