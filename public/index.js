
/* ------------------------------------------------------------------------------------------
 setup global (đã được declare trong script.js dùng chung cho mọi trang)
------------------------------------------------------------------------------------------ */
/*

Shorthand cho URL của users database /users 
let usersURL = "https://changable-list-test.herokuapp.com/users"

Xác định id hội viên nào được click
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

      $(".custom-pagination__display-text").text(`1 - ${currentLimit} / ${usersQuantity} hội viên`)

      console.log("Total users: " + usersQuantity)
      console.log("Total pages: " + pagesQuantity)
      console.log(`Current page: ${currentPage}/${pagesQuantity}`)
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
      `Bạn có muốn xóa hội viên <span class="bold-font">${$(this)
        .parents("tr")
        .children("td:nth-child(2)")
        .text()}</span> ?`
    );

    //update id hội viên đang được chọn để xóa đơn
    targetId = this.parentElement.parentElement.id.slice(4);
});

//2. Event "click confirm xóa đơn": Xóa hội viên trên table và database
$("#index__modal").on('click', '.modal--success.delete--single', function() {
  $.ajax({
    url: `${usersURL}/${targetId}`,
    type: "DELETE",
    success: () => {
      //item:id này đã được setup làm id cho từng tr khi load trang
      $(`#item${targetId}`).detach();
      usersQuantity--;
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

  //loop: mỗi tr trong array "bị xóa" sẽ:
  for (let i = 0; i < itemArr.length; i++) {

    //lấy ra targetid của tr này
    targetId = itemArr[i].id.slice(4);

    //xóa tr này trên giao diện
    $(`#item${targetId}`).detach();

    //dựa theo targetid lấy được, xóa item tương ứng trên database
    $.ajax({
      url: `${usersURL}/${targetId}`,
      type: "DELETE",
    });
  }

  //update usersQuantity
  usersQuantity -= itemArr.length

  //sau khi xóa nhiều xong thì bỏ check nút check tổng
  if ($("thead input").is(":checked")) {
    $("thead input")[0].checked = false;
  }
})




/* ------------------------------------------------------------------------------------------
 search mode 
------------------------------------------------------------------------------------------ */




//hiệu ứng
$(".search-input").focusin(() => {
  $(".input-group").css("border-color", "black")
})

$(".search-input").focusout(() => {
  $(".input-group").css("border-color", "#bbbbbb")
})

  
  
//Khi click nút search

$(".search-submit").click(() => {

  //khởi động chế độ search
  isSearching = true;

  //lấy giá trị input search
  let searchInput = $(".search-input").val()

  //loading: on
  $(".loading-wrapper").css("display", "block");

  //GET từ input search, mode: search
  $.get(
    `${usersURL}?q=${searchInput}&_page=${currentPage}&_limit=10&_sort=id&_order=desc`
  ).done(
    function(data) {
      let content = "";

      for ( let i = 0; i < data.length; i++) {
        content += rowTemplate(data, i)
      }

      $("tbody").html(content);

      //loading: off
      $(".loading-wrapper").css("display", "none");
      
      //update data khả dụng trong chế độ search

      usersQuantity = data.length; //số lượng users trở thành số lượng users phù hợp search route

      currentPage = 1; //số trang hiện tại trở về 1

      //update pagination
      currentMaxUsers = currentPage * currentLimit; 

      if (currentMaxUsers > usersQuantity) {
        currentMaxUsers = usersQuantity;
      }

      $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`)

      console.log(usersQuantity)
      console.log(currentPage)

    }
  )
})



/* ------------------------------------------------------------------------------------------
 pagination 
------------------------------------------------------------------------------------------ */ 

//update disabled/allow của các nút điều hướng trang



//bấm nút prev: sẽ nhảy về trang ?_page= (currentPage - 1) &_limit=10&_sort=id&_order=desc 
$(".prev-page").click(() => {

  //Điều kiện cho phép click nút prev: page hiện tại phải lớn hơn 1 (1 không thể prev về 0)
  if (currentPage > 1) { 

    //loading screen
    $(".loading-wrapper").css("display", "block");

    //lấy data từ db: page trước đó (điều kiện vẫn như cũ)
    $.get(
      `${usersURL}?_page=${currentPage - 1}&_limit=10&_sort=id&_order=desc`
    ).done( 
      //sau đó render lại bảng theo data lấy được
      function(data) {
        let content = "";

        for ( let i = 0; i < data.length; i++) {
          content += rowTemplate(data, i)
        }

        $("tbody").html(content);

        $(".loading-wrapper").css("display", "none");  


        currentPage--;
        currentMaxUsers = currentPage * currentLimit;

        if (currentMaxUsers > usersQuantity) {
          currentMaxUsers = usersQuantity;
        }

        $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`)

        $(".page-item").removeClass("active")

        console.log(`Current page: ${currentPage}/${pagesQuantity}`)
      }
    )
  }
})


//bấm nút next: sẽ nhảy sang trang ?_page= (currentPage + 1) &_limit=10&_sort=id&_order=desc 
$(".next-page").click(() => {

  //Điều kiện cho phép click nút next: page hiện tại < tổng số pages
  if (currentPage < pagesQuantity) { 

    //loading screen
    $(".loading-wrapper").css("display", "block");

    //lấy data từ db: page tiếp theo (điều kiện vẫn như cũ)
    $.get(
      `${usersURL}?_page=${currentPage + 1}&_limit=10&_sort=id&_order=desc`
    ).done( 
      //sau đó render lại bảng theo data lấy được
      function(data) {
        let content = "";

        for ( let i = 0; i < data.length; i++) {
          content += rowTemplate(data, i)
        }

        $("tbody").html(content);

        $(".loading-wrapper").css("display", "none");  

        currentPage++;
        currentMaxUsers = currentPage * currentLimit;

        if (currentMaxUsers > usersQuantity) {
          currentMaxUsers = usersQuantity;
        }

        $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`)

        console.log(`Current page: ${currentPage}/${pagesQuantity}`)


      }
    )
  }
})


//bấm nút first: sẽ nhảy về trang ?_page= (1) &_limit=10&_sort=id&_order=desc  
$(".first-page").click(() => {

  //Điều kiện cho phép click nút last: page hiện tại > 1 (page 1 không thể về first)
  if (currentPage > 1) { 

    //loading screen
    $(".loading-wrapper").css("display", "block");

    //lấy data từ db: page tiếp theo (điều kiện vẫn như cũ)
    $.get(
      `${usersURL}?_page=1&_limit=10&_sort=id&_order=desc`
    ).done( 
      //sau đó render lại bảng theo data lấy được
      function(data) {
        let content = "";

        for ( let i = 0; i < data.length; i++) {
          content += rowTemplate(data, i)
        }

        $("tbody").html(content);

        $(".loading-wrapper").css("display", "none");  

        currentPage = 1;
        currentMaxUsers = currentPage * currentLimit;
        
        if (currentMaxUsers > usersQuantity) {
          currentMaxUsers = usersQuantity;
        }

        $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`)
        
        console.log(`Current page: ${currentPage}/${pagesQuantity}`)
      }
    )
  } else {

  }
})

//bấm nút last: sẽ nhảy sang trang ?_page= (pagesQuantity) &_limit=10&_sort=id&_order=desc  
$(".last-page").click(() => {

  //Điều kiện cho phép click nút last: page hiện tại < tổng số pages (page cuối không thể sang last)
  if (currentPage < pagesQuantity) { 

    //loading screen
    $(".loading-wrapper").css("display", "block");

    //lấy data từ db: page tiếp theo (điều kiện vẫn như cũ)
    $.get(
      `${usersURL}?_page=${pagesQuantity}&_limit=10&_sort=id&_order=desc`
    ).done( 
      //sau đó render lại bảng theo data lấy được
      function(data) {
        let content = "";

        for ( let i = 0; i < data.length; i++) {
          content += rowTemplate(data, i)
        }

        $("tbody").html(content);

        $(".loading-wrapper").css("display", "none");  

        currentPage = pagesQuantity;
        currentMaxUsers = currentPage * currentLimit;

        if (currentMaxUsers > usersQuantity) {
          currentMaxUsers = usersQuantity;
        }

        $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`)

        console.log(`Current page: ${currentPage}/${pagesQuantity}`)
      }
    )
  }
})

//nút chuyển sang trang tùy chọn

$(".choose-page__confirm").click(() => {

  let choosePageNum = +$(".choose-page__input").val()

  $(".loading-wrapper").css("display", "block");

  
  $.get(
    `${usersURL}?_page=${choosePageNum}&_limit=10&_sort=id&_order=desc`
  ).done(
    function(data) {
      let content = "";

      for ( let i = 0; i < data.length; i++) {
        content += rowTemplate(data, i)
      }

      $("tbody").html(content);

      $(".loading-wrapper").css("display", "none");  

      currentPage = choosePageNum;
      currentMaxUsers = currentPage * currentLimit;

      $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`)

      console.log(`Current page: ${currentPage}/${pagesQuantity}`)
    }
  )
})

