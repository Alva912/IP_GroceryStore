/* UTS MIT 2020Autumn 32516IP Assignment1 OnlineGroceryStore
 * JiahuaLi */
$(function () {
  // Menu
  $("#mainpage a").attr("href", "javascript:void(0);");
  $(".menu-body").accordion({
    collapsible: true,
    active: false,
    heightStyle: "content",
  });
  // Menu icons
  $(".menu-body > h3 > a")
    .contents()
    .before("<span class='material-icons'>menu</span>");
  $(".menu-body > ul > li > a")
    .contents()
    .after("<span class='material-icons'>double_arrow</span>");
  // Click menu to display
  $(".menu-node").attr("onclick", "displayProduct(this.value)");
  // Cart buttons
  $(document).on("click", ".minus-num", function () {
    var unit_price = $(this).parent().parent().siblings(".uprice").text();
    var input_num = $(this).siblings(".input-num").val();
    if (!$.isNumeric(input_num)) {
      alert("Invalid input. Please enter a number.");
      $(this).siblings(".input-num").val(1);
      $(this).parent().parent().siblings(".subtotal").text(unit_price);
    } else {
      if (--input_num < 1) {
        $(this).siblings(".input-num").val(1);
        $(this)
          .parent()
          .parent()
          .siblings(".subtotal")
          .text(unit_price.toFixed(2));
      } else {
        var subtotal = input_num * unit_price;
        $(this).siblings(".input-num").val(input_num);
        $(this)
          .parent()
          .parent()
          .siblings(".subtotal")
          .text(subtotal.toFixed(2));
      }
    }
  });
  $(document).on("click", ".add-num", function () {
    var input_num = $(this).siblings(".input-num").val();
    var unit_price = $(this).parent().parent().siblings(".uprice").text();
    if (!$.isNumeric(input_num)) {
      alert("Invalid input. Please enter a number.");
      $(this).siblings(".input-num").val(1);
      $(this).parent().parent().siblings(".subtotal").text(unit_price);
    } else {
      ++input_num;
      var subtotal = input_num * unit_price;
      $(this).siblings(".input-num").val(input_num);
      $(this).parent().parent().siblings(".subtotal").text(subtotal.toFixed(2));
    }
  });
  $(document).on("click", ".enter-num", function () {
    var input_num = $(this).siblings(".input-num").val();
    var unit_price = $(this).parent().parent().siblings(".uprice").text();
    if (!$.isNumeric(input_num)) {
      alert("Invalid input. Please enter a number.");
      $(this).siblings(".input-num").val(1);
      $(this).parent().parent().siblings(".subtotal").text(unit_price);
    } else {
      var subtotal = input_num * unit_price;
      $(this).parent().parent().siblings(".subtotal").text(subtotal.toFixed(2));
    }
  });
  $(document).on("click", ".del-item", function () {
    var phead = $(this).parent().siblings(".phead").html();
    $(this).parent().parent().html("");
    sessionStorage.removeItem(phead);
  });
  $(document).on("click", ".del-cart, .sub-form", function () {
    $(".cart-row").detach();
    $(".ck-row").detach();
    sessionStorage.clear();
    document
      .getElementById("check-out")
      .removeAttribute("data-target", "#staticBackdrop");
    document
      .getElementById("check-out")
      .removeAttribute("data-toggle", "modal");
  });
  // Check out form
  $(document).on("click", "#check-out", function () {
    $(".sub-row").hide();
  });

  $(".billing").hide(); // the form feild is hided by default
  $(document).on("click", "#order", function () {
    $(".billing").show(); // show the form feild
  });
});

// Display
function displayProduct(str) {
  if (str == "") {
    document.getElementById("displayTxt").innerHTML = "";
    return;
  }
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      document.getElementById("displayTxt").innerHTML = xmlhttp.responseText;
    }
  };
  xmlhttp.open("GET", "products.php?pk=" + str, true);
  xmlhttp.send();
}

// Add to cart list
function ssAdd() {
  try {
    var pid = document.getElementById("product_id").innerHTML;
    var pname = document.getElementById("product_name").innerHTML;
    phead = pid + ": " + pname;
    var uprice = document.getElementById("unit_price").innerHTML;
    sessionStorage.setItem(phead, uprice);
    ssLoad();
    alert("Product has been added in the shopping cart.");
  } catch (err) {
    alert("Please select a product from menu.");
  }
}

// Cart list
function ssLoad() {
  var list1 = document.getElementById("cart-list");
  var result1 = "<tbody id='cart-list'>";
  for (var i = 0; i < sessionStorage.length; i++) {
    var phead = sessionStorage.key(i);
    var uprice = sessionStorage.getItem(phead);
    result1 +=
      "<tr class='cart-row'><td>#</td><td class='phead' id='" +
      phead +
      "'>" +
      phead +
      "</td><td class='uprice'>" +
      uprice +
      "</td><td><div class='input-group'>" +
      "<input type='button' class='minus-num btn btn-sm btn-light' value='-'>" +
      "<input type='button' class='add-num btn btn-sm btn-light' value='+'>" +
      "<input type='text' class='input-num' value='1' style='width: 20px;'>" +
      "<input type='button' class='enter-num btn btn-sm btn-light' value='Ent'>" +
      "</div></td><td class='subtotal'>" +
      uprice +
      "</td><td class='input-group'>" +
      "<input type='button' class='del-item btn btn-sm btn-light' value='Bin'>" +
      "</td></tr>";
  }
  result1 += "</tbody>";
  list1.innerHTML = result1;
}

// Check Out list
function checkOut() {
  if (sessionStorage.length < 1) {
    alert("Shopping cart is empty.");
  } else {
    document
      .getElementById("check-out")
      .setAttribute("data-target", "#staticBackdrop");
    document.getElementById("check-out").setAttribute("data-toggle", "modal");
    var num = document.getElementsByClassName("input-num"); //get the num elms
    var list2 = document.getElementById("ck-list"); //target place
    var result2 = "<tbody id='ck-list'>"; //target content
    var tprice = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      var phead = sessionStorage.key(i);
      var uprice = sessionStorage.getItem(phead); //get the uprice
      sessionStorage.setItem(phead, num[i].value); //set new val cknum, remove old val uprice
      var cknum = sessionStorage.getItem(phead); //get the new val cknum
      var sprice = uprice * cknum;
      result2 +=
        "<tr class='ck-row'><td><input type='text' class='sub-row' name='" +
        phead +
        "' value='" +
        cknum +
        "unit'></td><td>" +
        phead +
        "</td><td class='ck-uprice'>" +
        uprice +
        "</td><td class='ck-num'>" +
        cknum +
        "</td><td class='ck-subtotal'>" +
        sprice.toFixed(2) +
        "</td></tr>";
      tprice += sprice;
    }
    result2 +=
      "<tr><td colspan='5' class='h5 text-right px-3'>Total Price : $" +
      tprice.toFixed(2) +
      "<input type='text' class='sub-row' name='Total Price' value='" +
      tprice +
      "'></td></tr></tbody>";
    list2.innerHTML = result2;
  }
}

// Close Check Out
function ssBack() {
  var ckuprice = document.getElementsByClassName("ck-uprice"); //get the num elms
  for (let i = 0; i < sessionStorage.length; i++) {
    var phead = sessionStorage.key(i);
    sessionStorage.setItem(phead, ckuprice[i].innerHTML); //set new val, remove old val
  }
}
