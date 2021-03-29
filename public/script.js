
/* ------------------------------------------------------------------------------------------
 setup global
------------------------------------------------------------------------------------------ */

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



/* ------------------------------------------------------------------------------------------
 functions
------------------------------------------------------------------------------------------ */

function toggleLoading() {
  if ($(".loading-wrapper").css("display") == "none") {
    $(".loading-wrapper").css("display", "block");
  } else {
    $(".loading-wrapper").css("display", "none");
  }
}

/* Xác định template cho 1 tr:
Sẽ là 1 function, nhận vào 2 tham số: dataFromServer (truyền data vào) và loopIndicator (truyền i của loop vào)
Sẽ return ra đoạn code dưới đây, với data và i được truyền vào tương ứng với mỗi lần gọi */
function rowTemplate(dataFromServer, loopIndicator) {
  return `
  <tr id = "item${dataFromServer[loopIndicator].id}">
    <td>
      <div class="checkbox-wrapper">
        <input type="checkbox">
      </div>
    </td>
    <td>${dataFromServer[loopIndicator].name}</td>
    <td>${dataFromServer[loopIndicator].birthday}</td>
    <td>${dataFromServer[loopIndicator].gender}</td>
    <td>${dataFromServer[loopIndicator].email}</td>
    <td>${dataFromServer[loopIndicator].phone}</td>
    <td>
    <a class="btn btn--edit text-primary" href="edit.html?${dataFromServer[loopIndicator].id}">
      <span> <i class="far fa-edit"></i> </span>
      <span class="ml-2">Chỉnh sửa</span>
      <span class="ml-3">|</span>
    </a>
    <button class="btn btn--delete text-danger pl-0" data-toggle="modal" data-target="#index__modal" data-backdrop="static" data-keyboard="false">
      <span> <i class="fas fa-trash-alt"></i> </span>
      <span class="ml-2">Xóa</span>
    </button>
    </td>
  </tr>`
}

//update currentMaxUsers
function updateCurrentMaxUsers() {
  currentMaxUsers = currentPage * currentLimit;

  if (currentMaxUsers > usersQuantity) {
    currentMaxUsers = usersQuantity;
  }

  $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`);
}

//render current page, gọi sau khi next/prev (currentPage đã thay đổi) hoặc sau DELETE
function renderCurrentPage() {
  let content = "";

  for (let i = (currentPage * 10 - 10); i < (currentPage * 10) && i < usersQuantity; i++) {
    content += rowTemplate(users, i);
  }

  $("tbody").html(content);

  console.log(`Current page: ${currentPage}/${pagesQuantity}`);
}

//render first page
function renderFirstPage(length) {
  let content = "";

  for ( let i = 0; i < 10 && i < length; i++) {
    content += rowTemplate(users, i)
  }

  $("tbody").html(content);
}

//render last page
function renderLastPage() {
  let content = "";

  for ( let i = (pagesQuantity * 10 - 10); i < (pagesQuantity * 10 - 1) && i < (usersQuantity); i++) {
    content += rowTemplate(users, i)
  }

  $("tbody").html(content);

  console.log(`Current page: ${currentPage}/${pagesQuantity}`);
}

//update lại các global variable sau khi database thay đổi (sau POST, PUT, DELETE)
function updateData(data) {

  //update users global variable
  users = data;

  //update số lượng users
  usersQuantity = users.length;

  //update số lượng pages
  pagesQuantity = Math.ceil(usersQuantity / 10);
}

//load trang
function loadFirstPageFullData() {
  $.get(
    `${usersURL}?${usersURLSorted}`
    ).done(function (data) {
      //clone data
      users = data;
  
      //update số lượng users
      usersQuantity = users.length;
  
      //update số lượng pages
      pagesQuantity = Math.ceil(usersQuantity / 10);
  
      //update custom pagination
      $(".custom-pagination__display-text").text(
        `1 - ${currentLimit} / ${usersQuantity} hội viên`
      );
      
      //update table (page 1)
      renderFirstPage(users.length);
  
      $(".loading-wrapper").css("display", "none");
      $(".page-wrapper").css("display", "flex");
  
      //check
      console.log("Total users: " + usersQuantity);
      console.log("Total pages: " + pagesQuantity);
      console.log(`Current page: ${currentPage}/${pagesQuantity}`);
    }
  );
}