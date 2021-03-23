
function loadDoc() {
  //tạo
  let xhttp = new XMLHttpRequest();
  //code sẽ chạy khi lấy được dữ liệu từ server
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let users = JSON.parse(this.responseText); 
      let content = "";
      for (let i = 0; i < users.length; i++) {
        content += `<tr>
          <td>${users[i].name}</td>
          <td>${users[i].birthday.substr(-4)}</td>
          <td>${users[i].email}</td>
          <td>${users[i].phone}</td>
          <td>
          <a class="btn btn--edit text-primary" href="edit.html?${i+1}">
            <span> <i class="far fa-edit"></i> </span>
            <span class="ml-2">Chỉnh sửa</span>
            <span class="ml-3">|</span>
          </a>
          <button class="btn btn--delete text-danger pl-0">
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

$("tbody").on('click', '.btn--delete', function() { console.log(this.previousElementSibling.href.split("?")[1]); });

