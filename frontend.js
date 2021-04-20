/* global $ */
$(document).ready(function() {
  console.log('JQuery loaded successfully!');
  $('#homePageLink').click(function() {
    $(this).addClass('active');
    $('#aboutPageLink').removeClass('active');
  });
  $('#aboutPageLink').click(function() {
    $(this).addClass('active');
    $('#homePageLink').removeClass('active');
    var aboutInfo = $('<div></div>').html('Author: XXXXXXX<br>Libraries: JQuery, Bootstrap 4').addClass('fs-5');
    $('#mainPage').empty().append(aboutInfo);
    return false;
  });
});

var currentProduct;

function getDetails(id) {
  $('#loadingSpinner').css('visibility', 'initial');
  var xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  }
  else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xhr.open('GET', 'connectDB.php?id=' + id, true);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var resJSON = JSON.parse(this.responseText);
      if (resJSON.success) {
        $('#productID').html(resJSON.productID);
        $('#productName').html(resJSON.productName);
        $('#unitPrice').html('$' + parseFloat(resJSON.unitPrice).toFixed(2));
        $('#unitQuantity').html(resJSON.unitQuantity);
        $('#inStock').html(resJSON.inStock);
        $('#numberInputCurr').val(1);
        currentProduct = resJSON;
        $('#btnGroupCurr').css('visibility', 'initial');
      }
      else { alert(resJSON.message); }
    }
    $('#loadingSpinner').css('visibility', 'hidden');
  };
  xhr.send();
}

function checkNumberInput(event) {
  let id = /\d+/.exec(event.target.id);
  var stock;
  if (id === null) {
    stock = currentProduct.inStock;
  }
  else {
    stock = JSON.parse(sessionStorage.getItem(id[0])).inStock;
  }

  var val = parseInt(event.target.value);
  if (isNaN(val)) {
    event.target.value = 1;
    alert('Please enter a number.');
    return;
  }
  else if (val < 1) {
    alert('Item number should be at least one');
    return;
  }
  else if (val > parseInt(stock)) {
    alert('Item number should not exceed current stock.');
    return;
  }
}

function minusOne(e) {
  var val = $(e).siblings('input:text').val();
  if (parseInt(val) - 1 < 1) {
    alert('Item number should be at least one');
    return;
  }
  else {
    $(e).siblings('input:text').val(parseInt(val) - 1);
  }
}

function plusOne(e) {
  let id = /\d+/.exec($(e).siblings('input:text').attr('id'));
  var stock;
  if (id === null) {
    stock = currentProduct.inStock;
  }
  else {
    stock = JSON.parse(sessionStorage.getItem(id[0])).inStock;
  }

  var val = $(e).siblings('input:text').val();
  if (parseInt(val) + 1 > parseInt(stock)) {
    alert('Item number should not exceed current stock.');
    return;
  }
  else {
    $(e).siblings('input:text').val(parseInt(val) + 1);
  }
}

function addToCart() {
  try {
    var item = JSON.parse(sessionStorage.getItem(currentProduct.productID));
    if (item) {
      item.number += parseInt($('#numberInputCurr').val());
      $('#numberInput' + item.productID).val(item.number);
      updateCartItem(item.productID);
    }
    else {
      item = currentProduct;
      item.number = parseInt($('#numberInputCurr').val());
      createCartItem(item);
      sessionStorage.setItem(currentProduct.productID, JSON.stringify(item));
    }
    isCartEmpty();
    $('#numberInputCurr').val(1);
    alert('Items added.');
  }
  catch (err) {
    alert('No item selected. Please select a product first.');
  }
}

function getCartItems() {
  var keys = Object.keys(sessionStorage),
    i = keys.length;
  while (i--) {
    var item = JSON.parse(sessionStorage.getItem(keys[i]))
    createCartItem(item);
  }
}

function createCartItem(item) {
  var tdName = $('<td></td>').text(item.productName + ', ' + item.unitQuantity);

  var btnMinus = $('<button></button>').text('-').addClass('btn btn-sm btn-light').attr('onClick', 'minusOne(this); updateCartItem(' + item.productID + ')');
  var inputNumber = $('<input>').attr({
    type: 'text',
    value: item.number,
    id: 'numberInput' + item.productID,
    onChange: 'checkNumberInput(event); updateCartItem(' + item.productID + ')',
    style: 'width: 56px;'
  });
  var btnPlus = $('<button></button>').text('+').addClass('btn btn-sm btn-light').attr('onClick', 'plusOne(this); updateCartItem(' + item.productID + ')');
  var btnDelete = $('<button></button>').text('🗑').addClass('btn btn-sm btn-light').attr('onClick', 'removeCartItem(' + item.productID + ')');

  var tdBtnGroup = $('<td></td>').append(btnMinus, inputNumber, btnPlus, btnDelete).addClass('input-group');

  var tdSubtotal = $('<td></td>').text('$' + (item.number * parseFloat(item.unitPrice)).toFixed(2)).addClass('text-end');

  var tableRow = $('<tr></tr>').append(tdName, tdBtnGroup, tdSubtotal).attr('id', 'cartItem' + item.productID);
  $('#cart').append(tableRow);
}

function updateCartItem(id) {
  var item = JSON.parse(sessionStorage.getItem(id));
  item.number = parseInt($('#numberInput' + item.productID).val());
  sessionStorage.setItem(id, JSON.stringify(item));
  $('#cartItem' + item.productID + ' td:nth-child(3)').text('$' + (item.number * parseFloat(item.unitPrice)).toFixed(2));
}

function removeCartItem(id) {
  $('#cartItem' + id).remove();
  sessionStorage.removeItem(id);
  isCartEmpty();
}

function removeCartItems() {
  $('#cart').empty();
  sessionStorage.clear();
  isCartEmpty();
}

function isCartEmpty() {
  if (Object.keys(sessionStorage).length < 1) {
    $('#checkOut').removeAttr('data-bs-toggle');
    return true;
  }
  else {
    $('#checkOut').attr('data-bs-toggle', 'modal');
    return false;
  }
}

function checkOut() {
  if (isCartEmpty()) {
    alert('Cart is empty. Please add an item first.');
    return;
  }
  else {
    var items = [],
      keys = Object.keys(sessionStorage),
      i = keys.length;
    var totalPrice = 0.00;
    while (i--) {
      var item = JSON.parse(sessionStorage.getItem(keys[i]))

      var subtotalPrice = item.number * parseFloat(item.unitPrice);
      totalPrice += subtotalPrice;

      var tdName = $('<td></td>').text(item.productName + ', ' + item.unitQuantity);
      var tdNumber = $('<td></td>').text('×' + item.number);
      var tdSubtotal = $('<td></td>').text('$' + subtotalPrice.toFixed(2)).addClass('text-end');
      var tableRow = $('<tr></tr>').append(tdName, tdNumber, tdSubtotal);
      $('#confirmOrderDetails').append(tableRow);
    }

    var tdTotalItems = $('<td></td>').text(items.length + ' Items');
    var tdTotalPrice = $('<td></td>').text('Total 💲 ' + totalPrice.toFixed(2)).attr('colspan', '2').addClass('text-end');
    var tableRowTotal = $('<tr></tr>').append(tdTotalItems, tdTotalPrice).addClass('fs-4');
    $('#confirmOrderDetails').append(tableRowTotal);
  }
}

function cancelCheckOut() {
  $('#confirmOrderDetails').empty();
  $('#confirmOrderBtn').removeAttr('disabled').removeClass('btn-light').addClass('btn-primary');
  $('#confirmOrderBtn').siblings('button').removeClass('btn-primary').addClass('btn-light');
  $('#confirmResInfo').remove();
  $('#confirmation').children().css('visibility', 'initial');
}

function confirmOrder() {
  event.preventDefault();

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'confirmOrder.php');
  xhr.onload = function(event) {

    alert('Submission ' + (JSON.parse(event.target.response).success ? 'succeed.' : 'failed.'));

    if (JSON.parse(event.target.response).success) {
      $('#confirmOrderForm').trigger('reset');
      $('#confirmation').children().css('visibility', 'hidden');
      var resInfo = $('<div></div>').html('🎉🎉🎉<br>You placed an order successfully!<br>Happy Shopping.').attr('id', 'confirmResInfo').addClass('text-center fs-2');
      resInfo.insertBefore('#confirmOrderForm');
      $('#confirmOrderBtn').attr('disabled', 'disabled').removeClass('btn-primary').addClass('btn-light');
      $('#confirmOrderBtn').siblings('button').removeClass('btn-light').addClass('btn-primary');
      removeCartItems();
    }
  };
  var formData = new FormData(document.getElementById('confirmOrderForm'));
  var keys = Object.keys(sessionStorage),
    i = keys.length;
  while (i--) { formData.append(keys[i], sessionStorage.getItem(keys[i])); }
  xhr.send(formData);
}

isCartEmpty();
getCartItems();