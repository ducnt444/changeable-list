
/* ------------------------------------------------------------------------------------------
 setup global (đã được declare trong script.js dùng chung cho mọi trang)
------------------------------------------------------------------------------------------ */
/*
//Shorthand cho URL của users và URL users (sorted)
let usersURL = "https://changable-list-test.herokuapp.com/users"
let usersURLSorted = "&_sort=id&_order=desc"

//Tạo bản sao data
let users;

//Xác định id hội viên nào được click
let targetId = "";

//Xác định pagination hiện tại. Khởi điểm sẽ = 1 để load trang. 
let currentPage = 1; //là NUMBER

//Xác định độ dài của mỗi page. Mặc định sẽ là 10 users
let currentLimit = "10";

//Xác định số lượng users hiện tại có trên database, sẽ update mỗi khi có tương tác đến số lượng user (DELETE, POST)
let usersQuantity; //(là NUMBER)

//Xác định số lượng trang hiện tại (usersQuantity/10)
let pagesQuantity; //(là NUMBER)

//Xác định số hội viên max
let currentMaxUsers = currentPage * currentLimit; //(là NUMBER)

//Xác định các chế độ để update GET URL tương ứng khi pagination

let isSearching = false //có đang trong mode search không, default là không (nếu đang search mode == true, load trang sẽ bỏ search mode)

let isOldFirst = false //có đang trong mode sắp xếp item cũ nhất lên trước không, default là không
*/

/* ------------------------------------------------------------------------------------------
 load trang 2 steps: 1.GET toàn bộ users từ database 2.loop ra các 10 tr là các users (có kèm id tương ứng)
------------------------------------------------------------------------------------------ */

//1. get data (số lượng, info...)
loadFirstPageFullData()

/* ------------------------------------------------------------------------------------------
 "xóa đơn" toggler
------------------------------------------------------------------------------------------ */

//1. Event "click nút xóa đơn": toggle và update modal confirm
$("tbody").on('click', '.btn--delete', function() { 
  
    //nút xác nhận: đổi sang chế độ "xác nhận xóa đơn"
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
      $.get(
        /* `${usersURL}?${usersURLSorted}&_page=${currentPage}&_limit=${currentLimit}` */
        `${usersURL}?${usersURLSorted}&_page=${currentPage}&_limit=${currentLimit}`
      ).done((data) => {
          //clone data
          users = data;
      
          //update custom pagination
          $(".custom-pagination__display-text").text(
            `1 - ${currentLimit} / ${usersQuantity} hội viên`
          );
          
          //update table (page 1)
          renderFirstPage()
      
          $(".loading-wrapper").css("display", "none");
          $(".page-wrapper").css("display", "flex");
      
          //check
          console.log("Total users: " + usersQuantity);
          console.log("Total pages: " + pagesQuantity);
          console.log(`Current page: ${currentPage}/${pagesQuantity}`);
        }
      )
    }
  })
});



/* ------------------------------------------------------------------------------------------
 nút toggler chọn check tất cả 
------------------------------------------------------------------------------------------ */

//Event: khi "bất kỳ thẻ input nào của thead" (chính là checkbox tổng) có thay đổi
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

//settings
$(".search-input").focusin(() => {
  $(".input-group").css("border-color", "black")
})

$(".search-input").focusout(() => {
  $(".input-group").css("border-color", "#bbbbbb")
})

//Xác nhận giá trị input search
let searchInput;
  
//Event: Khi click nút SEARCH

$(".search-submit").click(() => {

  //loading: on
  $(".loading-wrapper").css("display", "block");

  //Lấy giá trị input của search
  searchInput = $(".search-input").val()

  //Reset trang về 1
  currentPage = 1;

  //GET data mới từ input search, mode: search
  $.get(
    //get toàn bộ user phù hợp search (bỏ _page và _limit, nhưng sau đó sẽ chỉ render 10 items đầu tiên)
    `${usersURL}?q=${searchInput}&_sort=id&_order=desc`
  ).done(
    function(data) {
      //clone data mới
      users = data;

      //render content (chỉ 10 items đầu)
      renderFirstPage()

      //Update bảng thông báo kết quả search
      $(".search__result").text(
        `Kết quả tìm kiếm cho "${searchInput}"`
      );
      
      //update data khả dụng trong chế độ search
      usersQuantity = users.length; //số lượng users trở thành số lượng users phù hợp search route

      //update số lượng pages
      pagesQuantity = Math.ceil(usersQuantity / 10);

      //update pagination
      updateCurrentMaxUsers()

      //loading: off
      $(".loading-wrapper").css("display", "none");

      console.log(`Total users: ${usersQuantity}`);
      console.log(`Current max users: ${currentMaxUsers}`);
      console.log(`Current page: ${currentPage}/${pagesQuantity}`);
    }
  )
})



/* ------------------------------------------------------------------------------------------
 pagination 
------------------------------------------------------------------------------------------ */ 

//update disabled/allow của các nút điều hướng trang



//bấm nút PREV: sẽ nhảy về trang ?_page= (currentPage - 1) &_limit=10&_sort=id&_order=desc 
$(".prev-page").click(() => {

  //Điều kiện cho phép click nút prev: page hiện tại phải lớn hơn 1 (1 không thể prev về 0)
  if (currentPage > 1) { 

    currentPage--;

    updateCurrentMaxUsers()

    renderNextPrev()
  }
})


//bấm nút NEXT: sẽ nhảy sang trang ?_page= (currentPage + 1) &_limit=10&_sort=id&_order=desc 
$(".next-page").click(() => {

  //Điều kiện cho phép click nút next: page hiện tại < tổng số pages
  if (currentPage < pagesQuantity) { 

    currentPage++;

    updateCurrentMaxUsers()

    renderNextPrev()
  }
})


//bấm nút FIRST: nhảy về trang đầu tiên
$(".first-page").click(() => {

  //Điều kiện cho phép click nút last: page hiện tại > 1 (page 1 không thể về first)
  if (currentPage > 1) { 

    currentPage = 1;

    updateCurrentMaxUsers()

    renderFirstPage()
  } 
})

//bấm nút LAST: sẽ nhảy sang trang cuối
$(".last-page").click(() => {

  //Điều kiện cho phép click nút last: page hiện tại < tổng số pages (page cuối không thể sang last)
  if (currentPage < pagesQuantity) { 

    currentPage = pagesQuantity;
    
    updateCurrentMaxUsers()

    renderLastPage()
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
