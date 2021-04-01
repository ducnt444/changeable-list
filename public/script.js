
/* ------------------------------------------------------------------------------------------
 setup global
------------------------------------------------------------------------------------------ */

//Shorthand cho các URL
let API_URL = "https://changeable-list.herokuapp.com"
let usersURL = "https://changeable-list.herokuapp.com/users"
let usersURLMin = "https://changeable-list.herokuapp.com/users?_page=1&_limit=1"
let usersURLSorted = "&_sort=id&_order=desc"

//Lấy token từ local Storage
let token = localStorage.getItem("changeable-list-token");
let activeUserID = localStorage.getItem("active-user-id");
let bearerToken = {Authorization: `Bearer ${token}`}

//Tạo bản sao data
let users;

//Xác định id hội viên nào được click
let targetId = "";

//Xác định (các) hội viên được chọn checkbox
let selectedArray = [];

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

$("#logout__modal .modal--confirm").click(() => {
  localStorage.setItem("changeable-list-token", "")
  localStorage.setItem("active-user-id", "")
  localStorage.setItem("active-user-name", "")
  toggleLoadingOn()
  setTimeout(() => location.replace("login.html"), 1000)
})

function toggleLoading() {
  if ($(".loading-wrapper").css("display") == "none") {
    $(".loading-wrapper").css("display", "block");
  } else {
    $(".loading-wrapper").css("display", "none");
  }
}

function toggleLoadingOn() {
  if ($(".loading-wrapper").css("display") == "none") {
    $(".loading-wrapper").css("display", "block");
  }
}

function toggleLoadingOff(lastLoop, indicator) {
  if (lastLoop == indicator) {
      $(".loading-wrapper").css("display", "none");
    }
}

/* Xác định template cho 1 tr:
Sẽ là 1 function, nhận vào 2 tham số: dataFromServer (truyền data vào) và loopIndicator (truyền i của loop vào)
Sẽ return ra đoạn code dưới đây, với data và i được truyền vào tương ứng với mỗi lần gọi */
function rowTemplate(dataFromServer, loopIndicator) {
  let checked = ""
  if ( selectedArray.indexOf (dataFromServer[loopIndicator].id.toString() ) != -1 ) {
    checked = "checked"
  }

  return `
  <tr id = "${dataFromServer[loopIndicator].id}">
    <td>
      <div class="checkbox-wrapper">
        <input type="checkbox" class=${dataFromServer[loopIndicator].selection} ${checked}>
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

//render ra page dựa trên currentPage: update pagination và render bảng
function renderCurrentPage() {

  //1. update pagination
  currentMaxUsers = currentPage * currentLimit; //update current Max Users

  if (currentMaxUsers > usersQuantity) { //check xem current Max Users có vượt quá số lượng users, nếu có thì giới hạn lại
    currentMaxUsers = usersQuantity;  
  }

  $(".custom-pagination__display-text").text(`${currentPage * currentLimit - currentLimit + 1} - ${currentMaxUsers} / ${usersQuantity} hội viên`); //update text

  //2. render bảng
  let content = ""; 

  for (let i = (currentPage * 10 - 10); i < (currentPage * 10) && i < usersQuantity; i++) { //loop tối đa 10 lần, trong TH users < 10 thì tối đa là số lượng users
    content += rowTemplate(users, i); //mỗi loop render ra 1 tr, cho vào content
  }
 //nếu item nào đang được checked trước đó (lưu = .selected) thì sẽ checked lại
 
  $("tbody").html(content); //render bảng bằng content

  /* $(".selected").prop("checked", true); */

  $("thead input").prop("checked", false);

/*   console.log(`Current page: ${currentPage}/${pagesQuantity}`);  */
}

//update lại các global variable sau khi database thay đổi (sau POST, PUT, DELETE)
function updateData(data) {
  users = data; //update global variable users
  
  usersQuantity = users.length; //update số lượng users

  pagesQuantity = Math.ceil(usersQuantity / 10); //update số lượng pages
}

function updateUsers() {
  usersQuantity = users.length; //update số lượng users

  pagesQuantity = Math.ceil(usersQuantity / 10); //update số lượng pages
}

//load lần đầu: load up to 10 items đầu tiên rồi bỏ loading, sau đó load ngầm toàn bộ users
function firstLoad() {
  $.ajax({
    url: `${usersURL}?${usersURLSorted}$_page=1&_limit=10`,
    method: "GET",
    headers: bearerToken,
    error: () => {
      location.replace("login.html");
    }
  }).done(

  )
}

//load trang
function loadFirstPageFullData() {
  $.ajax({
    url: `${usersURL}?${usersURLSorted}`,
    method: "GET",
    headers: {Authorization: `Bearer ${token}`},
    error: () => {
      location.replace("login.html");
    }
  }).done(function (data) {
      //clone data
      users = data;
  
      //update số lượng users
      usersQuantity = users.length;
  
      //update số lượng pages
      pagesQuantity = Math.ceil(usersQuantity / 10);

      let activeUserIDInGlobalVar = users.findIndex(
        item => item.id.toString() == activeUserID
      )

      $(".account__name").text(users[activeUserIDInGlobalVar].name)

      //render table (page 1)
      renderCurrentPage()
  
      toggleLoading()
      $(".page-wrapper").css("display", "flex");
  
      //check
      console.log(`Bearer ${token}`)
      console.log("Total users: " + usersQuantity);
      console.log("Total pages: " + pagesQuantity);
      console.log(`Current page: ${currentPage}/${pagesQuantity}`);
    }
  );
}

