<?php
    $errors = [];
    $data = [];
    
    if (empty($_POST['fullname'])) {
        $errors['fullname'] = 'Full name is required.';
    }
    
    if (empty($_POST['email'])) {
        $errors['email'] = 'Email is required.';
    }

    if (empty($_POST['address'])) {
        $errors['address'] = 'Address is required.';
    }
    
    if (empty($_POST['state'])) {
        $errors['state'] = 'State is required.';
    }
    
    if (empty($_POST['postcode'])) {
        $errors['postcode'] = 'Post code is required.';
    }
    
    if (empty($_POST['payment'])) {
        $errors['payment'] = 'Payment method is required.';
    }

    try{
        $to = $_POST['email'];
        $subject = 'Grocery Online Order Confirmation';
        $message = 'Happy shopping!\r\nOrder Details:\r\n';
        foreach ($_REQUEST as $key => $item) {
            if ($key=='submit') {
                break 1;
            }
            $message .= $key . ' : ' . $item->productName . ', ' . $item->unitQuantity . ' ×' . $item->number . '\r\n';
        }
        $message .= '\r\nStudent Name : \r\nStudent ID : \r\n';
        mail($to, $subject, $message);
    } catch (Exception $e){
        $errors['sendMail'] = false;
    }

    if (!empty($errors)) {
        $data['success'] = false;
        $data['errors'] = $errors;
    } else {
        $data['success'] = true;
        $data['message'] = 'Success!';
    }
    echo json_encode($data);
