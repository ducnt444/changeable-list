
function loadDoc() {
  //tạo
  let xhttp = new XMLHttpRequest();
  //code sẽ chạy khi lấy được dữ liệu từ server
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let users = JSON.parse(this.responseText); 
      let content = "";
      for (let i = 0; i < users.length; i++) {
        content += `<tr id = "item${users[i].id}">
          <td>${users[i].name}</td>
          <td>${users[i].birthday.substr(-4)}</td>
          <td>${users[i].email}</td>
          <td>${users[i].phone}</td>
          <td>
          <a class="btn btn--edit text-primary" href="edit.html?${users[i].id}">
            <span> <i class="far fa-edit"></i> </span>
            <span class="ml-2">Chỉnh sửa</span>
            <span class="ml-3">|</span>
          </a>
          <button class="btn btn--delete text-danger pl-0" data-toggle="modal" data-target="#index__modal" data-backdrop="static" data-keyboard="false">
            <span> <i class="fas fa-trash-alt"></i> </span>
            <span class="ml-2">Xóa</span>
          </button>
          </td>
          <td>
            <input type="checkbox">
          </td>
        </tr>`;
      }
      $("tbody").html(content);
    }
  };
  
  //GET từ server
  xhttp.open("GET", "https://changable-list-test.herokuapp.com/users", true);
  xhttp.send();
}

loadDoc();

//Xác định id học viên nào được click
let targetId = "";
let targetArr = [];


/* -----------------------------------
 "xóa đơn" toggler
----------------------------------- */

//1. Event "click nút xóa đơn": toggle và update modal confirm
$("tbody").on('click', '.btn--delete', function() { 
  
    //nút xác nhận đổi sang chế độ "xác nhận xóa đơn"
    $("#index__modal .modal--success").addClass("delete--single");

    //nút cancel được hiển thị 
    $("#index__modal .modal--cancel").css("display", "block");

    //nội dung .modal__text thay đổi
    $("#index__modal .modal__text").html(
      `Bạn có muốn xóa học viên <span class="bold-font">${$(this)
        .parents("tr")
        .children("td:first-child")
        .text()}</span> ?`
    );

    //update id học viên đang được chọn để xóa đơn
    targetId = +this.previousElementSibling.href.split("?")[1] 
});

//2. Event "click confirm xóa đơn": Xóa học viên trên table và database
$("#index__modal").on('click', '.modal--success.delete--single', function() {
  $.ajax({
    url: `https://changable-list-test.herokuapp.com/users/${targetId}`,
    type: "DELETE",
    success: () => {
      //item:id này đã được setup làm id cho từng tr khi load trang
      $(`#item${targetId}`).detach()
    }
  })
});



/* -----------------------------------
 nút toggler chọn check tất cả 
----------------------------------- */

//Event: khi bất kỳ thẻ input nào của thead có thay đổi
$("thead").on('change', 'input', function() { 

  //check xem checkbox tổng có đang check không
  if ( $("thead input").is(":checked") ) {

    //nếu có: check mọi checkbox đơn
    $("tbody input").prop("checked", true);
  } else {

    //nếu không: hủy check mọi checkbox đơn
    $("tbody input").prop("checked", false);
  }
});



/* -----------------------------------
 nút "Xóa các mục được chọn" 
----------------------------------- */

//1. Event "click lên nút Xóa các mục được chọn": kiểm tra tình trạng các checkbox để update modal và chế độ của nút xác nhận 
$("thead").on("click", ".btn--delete-selected ", () => {

  //Check: nếu có bất kỳ checkbox nào trong table đang được check
  if ($("table input").is(":checked")) {

    //nút xác nhận hủy chế độ "xác nhận xóa đơn", chuyển sang chế độ "xóa nhiều"
    $("#index__modal .modal--success").removeClass("delete--single");
    $("#index__modal .modal--success").addClass("delete--multiple");

    //Hiển thị nút cancel trong index modal
    $("#index__modal .modal--cancel").css("display", "block");

    //Update .modal__text
    $("#index__modal .modal__text").text("Bạn có muốn xóa các mục được chọn?");

  //Check: nếu không có bất kỳ checkbox nào trong table đang được check 
  } else {

    //nút xác nhận hủy chế độ "xác nhận xóa đơn"
    $("#index__modal .modal--success").removeClass("delete--single");

    //Ẩn nút cancel trong index modal
    $("#index__modal .modal--cancel").css("display", "none");

    //Update .modal__text
    $("#index__modal .modal__text").text("Không có mục nào được chọn");
  }
});

//2. Event "click lên nút xác nhận xóa nhiều": kiểm tra tình trạng các checkbox để xóa item tương ứng

$("#index__modal").on("click", ".modal--success.delete--multiple", () => {

  let itemArr = $("tbody tr").has("input:checked").toArray()

  for(let i = 0; i < itemArr.length; i ++) {

    targetId = itemArr[i].id.slice(4);

    $(`#item${targetId}`).detach();

    $.ajax({
      url: `https://changable-list-test.herokuapp.com/users/${targetId}`,
      type: "DELETE"
    })
  }

  if($("thead input").is(":checked")) {
    $("thead input")[0].checked = false;
  }
  
})


