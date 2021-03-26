
/* ------------------------------------------------------------------------------------------
 setup global (đã được declare trong script.js dùng chung cho mọi trang)
------------------------------------------------------------------------------------------ */
/*

Shorthand cho URL của users database /users 
let usersURL = "https://changable-list-test.herokuapp.com/users"

Xác định id học viên nào được click
let targetId = "";

Xác định pagination hiện tại. Khởi điểm sẽ = 1 để load trang.
let currentPage = 1; (là NUMBER)

Xác định độ dài của mỗi page. Mặc định sẽ là 10 users
let currentLimit = "10";

Xác định số lượng users hiện tại có trên database, sẽ update mỗi khi có tương tác đến số lượng user (DELETE, POST)
let usersQuantity; (là NUMBER)

*/

/* ------------------------------------------------------------------------------------------
 load trang: GET users page 1 từ database, loop ra các tr là các users (có kèm id tương ứng)
------------------------------------------------------------------------------------------ */
function loadDoc() {
  //tạo
  let xhttp = new XMLHttpRequest();
  //code sẽ chạy khi lấy được dữ liệu từ server
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let users = JSON.parse(this.responseText);
      let content = "";
      for (let i = 0; i < users.length; i++) {
        content += `<tr id = "item${users[i].id}" class = "row${i + 1}">
          <td>
            <div class="checkbox-wrapper">
              <input type="checkbox">
            </div>
          </td>
          <td>${users[i].name}</td>
          <td>${users[i].birthday}</td>
          <td>${users[i].gender}</td>
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
        </tr>`;
      }
      $("tbody").html(content);
      $(".loading-wrapper").css("display", "none");
      $(".page-wrapper").css("display", "flex");
    }
  };
  //load 10 users
  xhttp.open("GET", `${usersURL}?_page=${currentPage}&_limit=10&_sort=id&_order=desc`, true);
  xhttp.send();
}

loadDoc();

/* ------------------------------------------------------------------------------------------
load trang: GET số lượng users, số lượng pages từ database
------------------------------------------------------------------------------------------ */

$.get(
  usersURL,
  ).done(
    function(data) {
      usersQuantity = data.length;
      pagesQuantity = Math.ceil(usersQuantity/10)

      console.log("Total users: " + usersQuantity)
      console.log("Total pages: " + pagesQuantity)
      console.log("Current page: " + currentPage)
      
    }
  )

/* ------------------------------------------------------------------------------------------
 "xóa đơn" toggler
------------------------------------------------------------------------------------------ */

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
        .children("td:nth-child(2)")
        .text()}</span> ?`
    );

    //update id học viên đang được chọn để xóa đơn
    targetId = this.parentElement.parentElement.id.slice(4);
});

//2. Event "click confirm xóa đơn": Xóa học viên trên table và database
$("#index__modal").on('click', '.modal--success.delete--single', function() {
  $.ajax({
    url: `${usersURL}/${targetId}`,
    type: "DELETE",
    success: () => {
      //item:id này đã được setup làm id cho từng tr khi load trang
      $(`#item${targetId}`).detach()
    }
  })
});



/* ------------------------------------------------------------------------------------------
 nút toggler chọn check tất cả 
------------------------------------------------------------------------------------------ */

//Event: khi bất kỳ thẻ input nào của thead (a.k.a checkbox tổng) có thay đổi
$("thead").on('change', 'input', function() { 

  //check xem checkbox tổng có đang check không
  if ( $("thead input").is(":checked") ) {

    //nếu có: check mọi checkbox đơn
    $("tbody input").prop("checked", true);
    console.log("check all")
  } else {

    //nếu không: hủy check mọi checkbox đơn
    $("tbody input").prop("checked", false);
    console.log("uncheck all")
  }
});



/* ------------------------------------------------------------------------------------------
 nút "Xóa các mục được chọn" 
------------------------------------------------------------------------------------------ */

$("table").on("change", "input", () => {
  if ($("table input").is(":checked")) {
    $(".buttons-wrapper .bg-danger").removeClass("disabled");
  } else {
    $(".buttons-wrapper .bg-danger").addClass("disabled");
  }
});

//1. Event "click lên nút Xóa các mục được chọn": kiểm tra tình trạng các checkbox để update modal và chế độ của nút xác nhận 
$(".buttons-wrapper").on("click", ".btn--delete-selected ", () => {

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

  //Tạo 1 array chứa các thẻ tr đang có input được check
  let itemArr = $("tbody tr").has("input:checked").toArray();

  //loop: mỗi tr trong array trên sẽ:
  for (let i = 0; i < itemArr.length; i++) {

    //update targetid
    targetId = itemArr[i].id.slice(4);

    //xóa dòng này
    $(`#item${targetId}`).detach();

    //xóa item trên database
    $.ajax({
      url: `${usersURL}/${targetId}`,
      type: "DELETE",
    });
  }

  //xóa nhiều xong thì bỏ check nút check tổng
  if ($("thead input").is(":checked")) {
    $("thead input")[0].checked = false;
  }
})



/* ------------------------------------------------------------------------------------------
 pagination 
------------------------------------------------------------------------------------------ */ 

//bấm nút prev: sẽ nhảy về trang ?_page= (currentPage - 1) &_limit=10&_sort=id&_order=desc 
$(".prev-page").click(() => {
  $(".loading-wrapper").css("display", "block");
  if (currentPage > 0) {
    
    $.get(
      `${usersURL}?_page=${currentPage - 1}&_limit=10&_sort=id&_order=desc`
    ).done(
      function(data) {
  
        for (let i = 0; i < 10; i++) {
          if (data[i] == undefined) {
            $(`.row${i + 1}`).detach()

          } else if ( $("tbody tr")[i] == undefined ) {
            $("tbody").append(`<tr id = "item${data[i].id}" class = "row${i + 1}">
            <td>
              <div class="checkbox-wrapper">
                <input type="checkbox">
              </div>
            </td>
            <td>${data[i].name}</td>
            <td>${data[i].birthday}</td>
            <td>${data[i].gender}</td>
            <td>${data[i].email}</td>
            <td>${data[i].phone}</td>
            <td>
            <a class="btn btn--edit text-primary" href="edit.html?${data[i].id}">
              <span> <i class="far fa-edit"></i> </span>
              <span class="ml-2">Chỉnh sửa</span>
              <span class="ml-3">|</span>
            </a>
            <button class="btn btn--delete text-danger pl-0" data-toggle="modal" data-target="#index__modal" data-backdrop="static" data-keyboard="false">
              <span> <i class="fas fa-trash-alt"></i> </span>
              <span class="ml-2">Xóa</span>
            </button>
            </td>
          </tr>`)
            console.log(data[i])

          } else {
            console.log($("btn--edit"))
            /* $("btn--edit")[i].href = `edit.html?${data[i].id}` */
            $("tbody tr")[i].id = `item${data[i].id}`;
            $("tbody tr")[i].children[1].innerText = data[i].name;
            $("tbody tr")[i].children[2].innerText = data[i].birthday;
            $("tbody tr")[i].children[3].innerText = data[i].gender;
            $("tbody tr")[i].children[4].innerText = data[i].email;
            $("tbody tr")[i].children[5].innerText = data[i].phone;
          }
        }
  
        $(".loading-wrapper").css("display", "none");  
  
        currentPage--;
        console.log("Current page: " + currentPage);
      }
    )
  }
})


//bấm nút next: sẽ nhảy sang trang ?_page= (currentPage + 1) &_limit=10&_sort=id&_order=desc 
$(".next-page").click(() => {
  $(".loading-wrapper").css("display", "block");

  if (currentPage < pagesQuantity) { //VD page 50 / 51 thì mới cho phép next
    $.get(
      `${usersURL}?_page=${currentPage + 1}&_limit=10&_sort=id&_order=desc`
    ).done(
      function(data) {
        let content = "";
        
        for ( let i = 0; i < data.length; i++) {
          content += rowTemplate(data, i)
        }

        $("tbody").html(content)

        $(".loading-wrapper").css("display", "none");  
  
        currentPage++;
        console.log("Current page: " + currentPage)
      }
    )
  }

})


//bấm nút last: sẽ nhảy sang trang ?_page= (pagesQuantity) &_limit=10 
$(".last-page").click(() => {
  $(".loading-wrapper").css("display", "block");

  $.get(
    `${usersURL}?_page=${pagesQuantity}&_limit=10&_limit=10&_sort=id&_order=desc`
  ).done(
    function(data) {

      for (let i = 0; i < 10; i++) {
        if (data[i] == undefined) {
          $(`.row${i + 1}`).detach()
        } else {
          $("tbody tr")[i].id = `item${data[i].id}`;
          $("tbody tr")[i].children[1].innerText = data[i].name;
          $("tbody tr")[i].children[2].innerText = data[i].birthday;
          $("tbody tr")[i].children[3].innerText = data[i].gender;
          $("tbody tr")[i].children[4].innerText = data[i].email;
          $("tbody tr")[i].children[5].innerText = data[i].phone;
        }
      }

      $(".loading-wrapper").css("display", "none");  

      currentPage = pagesQuantity;
      console.log("Current page: " + currentPage)
    }
  )
})






/* ------------------------------------------------------------------------------------------
 search area 
------------------------------------------------------------------------------------------ */

/* $(".search-input").focusin(() => {
  $(".input-group").css("border-color", "black")
})

$(".search-input").focusout(() => {
  $(".input-group").css("border-color", "#bbbbbb")
}) */

