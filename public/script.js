
/* ------------------------------------------------------------------------------------------
 setup global
------------------------------------------------------------------------------------------ */

//Shorthand cho URL của users database /users 
let usersURL = "https://changable-list-test.herokuapp.com/users"

//Xác định id học viên nào được click
let targetId = "";

//Xác định pagination hiện tại. Khởi điểm sẽ = 1 để load trang. 
let currentPage = 1; //(là NUMBER)

//Xác định độ dài của mỗi page. Mặc định sẽ là 10 users
let currentLimit = "10";

//Xác định số lượng users hiện tại có trên database, sẽ update mỗi khi có tương tác đến số lượng user (DELETE, POST)
let usersQuantity; //(là NUMBER)

//Xác định số lượng trang hiện tại (usersQuantity/10)
let pagesQuantity; //(là NUMBER)

/* Xác định template cho 1 tr:
Sẽ là 1 function, nhận vào 2 tham số: dataFromServer (truyền data vào) và loopIndicator (truyền i của loop vào)
Sẽ return ra đoạn code dưới đây, với data và i được truyền vào tương ứng với mỗi lần gọi */
function rowTemplate(dataFromServer, loopIndicator) {
  return `
  <tr id = "item${dataFromServer[loopIndicator].id}" class = "row${loopIndicator + 1}">
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

