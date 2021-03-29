
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

/*
A. Event "click nút xóa đơn": 
1. Update modal confirm
2. Lấy targetID
*/
$("tbody").on('click', '.btn--delete', function() {
  //1. Update modal confirm
  $("#index__modal .modal--success").addClass("delete--single"); //nút xác nhận: đổi sang chế độ "xác nhận xóa đơn"

  $("#index__modal .modal--cancel").css("display", "block"); //nút cancel được hiển th

  $("#index__modal .modal__text").html(
    //nội dung .modal__text thay đổi
    `Bạn có muốn xóa hội viên <span class="bold-font">${$(this)
      .parents("tr")
      .children("td:nth-child(2)")
      .text()}</span> ?`
  );

  targetId = this.parentElement.parentElement.id.slice(4); //lấy id hội viên đang được chọn để xóa đơn
});

/*
B. Event "click confirm xóa đơn": 
  1. Xóa hội viên trên database; 
  2. GET database mới
  3. Update global variables, pagination;
  4. Render;
*/ 
$("#index__modal").on('click', '.modal--success.delete--single', function() {

  toggleLoading(); //bật loading

  $.ajax({
    url: `${usersURL}/${targetId}`,
    type: "DELETE",
    success: () => {
      $.get(
        /* `${usersURL}?${usersURLSorted}&_page=${currentPage}&_limit=${currentLimit}` */
        `${usersURL}?${usersURLSorted}`
      ).done((data) => {
        updateData(data); //update global variables

        updateCurrentMaxUsers(); //update pagination

        renderCurrentPage(); //render lại bảng

        toggleLoading(); //tắt loading

        //check
        console.log(`Deleted 1 user ID: ${targetId}`);
        console.log("Total users: " + usersQuantity);
        console.log("Total pages: " + pagesQuantity);
        console.log(`Current page: ${currentPage}/${pagesQuantity}`);
      });
    },
  });
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

//A. Event "click lên nút Xóa các mục được chọn": kiểm tra tình trạng các checkbox để update modal và chế độ của nút xác nhận 
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

/*
B. Event "click lên nút xác nhận xóa nhiều": kiểm tra tình trạng các checkbox để xóa item tương ứng
  1. Lọc ra các item được chọn cho vào 1 array choosen items
  1. Xóa các hội viên trong array trên khỏi database; 
  2. GET database mới
  3. Update global variables, pagination;
  4. Render lại trang hiện tại;
*/
$("#index__modal").on("click", ".modal--success.delete--multiple", () => {

  toggleLoading()

  //Tạo 1 array chứa các thẻ tr đang có input được check
  let choosenItems = $("tbody tr").has("input:checked");
  let choosenItemsIDArr = [];
  for (let i = 0; i < choosenItems.length; i++) {
    choosenItemsIDArr.push(choosenItems[i].id.slice(4));
  }
  console.log

/*   $.ajax({
    url: `${usersURL}/${choosenItems[i].id.slice(4)}`,
    type: "DELETE",
    data: choosenItemsIDArr
  }); */

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
  toggleLoading();

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
      if (data.length > 0) {
        //clone data mới
        updateData(data);

        //render content (chỉ 10 items đầu)
        renderFirstPage(data.length);

        //Update bảng thông báo kết quả search
        $(".search__result").text(`Kết quả tìm kiếm cho "${searchInput}"`);;

        //update pagination
        updateCurrentMaxUsers();

        console.log(`Total users: ${usersQuantity}`);
        console.log(`Current max users: ${currentMaxUsers}`);
        console.log(`Current page: ${currentPage}/${pagesQuantity}`);

      } else { //nếu không có kết quả phù hợp (response array rỗng)
        $(".search__result").text(`Không tìm thấy kết quả phù hợp cho "${searchInput}"`);
        $("tbody").html("")
        $(".custom-pagination__display-text").html(`0 - 0 / 0 hội viên`);
      }

      toggleLoading();//loading: off
    }
  )
})



/* ------------------------------------------------------------------------------------------
 pagination 
------------------------------------------------------------------------------------------ */ 

//update disabled/allow của các nút điều hướng trang



//bấm nút PREV: 1. currentPage--; 2. Update current max users; 3. render
$(".prev-page").click(() => {

  //Điều kiện cho phép click nút prev: page hiện tại phải lớn hơn 1 (1 không thể prev về 0)
  if (currentPage > 1) { 

    currentPage--;

    updateCurrentMaxUsers()

    renderCurrentPage()
  }
})


//bấm nút NEXT: 1. currentPage++; 2. Update current max users; 3. render
$(".next-page").click(() => {

  //Điều kiện cho phép click nút next: page hiện tại < tổng số pages
  if (currentPage < pagesQuantity) { 

    currentPage++;

    updateCurrentMaxUsers()

    renderCurrentPage()
  }
})


//bấm nút FIRST: 1. Current page về 1; 2. update pagination; 3. render
$(".first-page").click(() => {

  //Điều kiện cho phép click nút first: page hiện tại > 1 (page 1 không thể về first)
  if (currentPage > 1) { 

    currentPage = 1;

    updateCurrentMaxUsers()

    renderFirstPage()
  } 
})

//bấm nút LAST: 1. Current page = pages Quantity; 2. update pagination; 3. render
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

  toggleLoading();

  $.get(
    `${usersURL}?_page=${choosePageNum}&_limit=10&_sort=id&_order=desc`
  ).done(
    function(data) {
      let content = "";

      for ( let i = 0; i < data.length; i++) {
        content += rowTemplate(data, i)
      }

      $("tbody").html(content);

      toggleLoading(); 

      currentPage = choosePageNum;
      currentMaxUsers = currentPage * currentLimit;

      $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`)

      console.log(`Current page: ${currentPage}/${pagesQuantity}`)
    }
  )
})
