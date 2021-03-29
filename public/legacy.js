/* ------------------------------------------------------------------------------------------
 index legacy
------------------------------------------------------------------------------------------ */

//load trang: GET users page 1 từ database, loop ra các tr là các users (có kèm id tương ứng)
/* function loadDoc() {
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

loadDoc(); */


/* 
//bấm nút PREV: sẽ nhảy về trang ?_page= (currentPage - 1) &_limit=10&_sort=id&_order=desc 
$(".prev-page").click(() => {

  //Điều kiện cho phép click nút prev: page hiện tại phải lớn hơn 1 (1 không thể prev về 0)
  if (currentPage > 1) { 

    //loading screen: on
    $(".loading-wrapper").css("display", "block");

    //search mode
    if (isSearching == true) {
      
      //lấy data từ db: page trước đó (điều kiện: q=)
      $.get(
        `${usersURL}?q=${searchInput}&_page=${currentPage - 1}&_limit=10&_sort=id&_order=desc`
      ).done(
        //sau đó render lại bảng theo data lấy được
        function (data) {
          let content = "";

          for (let i = 0; i < data.length; i++) {
            content += rowTemplate(data, i);
          }

          $("tbody").html(content);

          $(".loading-wrapper").css("display", "none");

          currentPage--;
          currentMaxUsers = currentPage * currentLimit;

          if (currentMaxUsers > usersQuantity) {
            currentMaxUsers = usersQuantity;
          }

          $(".custom-pagination__display-text").text(
            `${
              currentPage * currentLimit - currentLimit + 1
            } - ${currentMaxUsers} / ${usersQuantity} hội viên`
          );

          $(".page-item").removeClass("active");

          console.log(`Current page: ${currentPage}/${pagesQuantity}`);
        }
      );

    //normal mode
    } else {
      //lấy data từ db: page trước đó (điều kiện vẫn như cũ)
      $.get(
        `${usersURL}?_page=${currentPage - 1}&_limit=10&_sort=id&_order=desc`
      ).done(
        //sau đó render lại bảng theo data lấy được
        function (data) {
          let content = "";

          for (let i = 0; i < data.length; i++) {
            content += rowTemplate(data, i);
          }

          $("tbody").html(content);

          $(".loading-wrapper").css("display", "none");

          currentPage--;
          currentMaxUsers = currentPage * currentLimit;

          if (currentMaxUsers > usersQuantity) {
            currentMaxUsers = usersQuantity;
          }

          $(".custom-pagination__display-text").text(
            `${
              currentPage * currentLimit - currentLimit + 1
            } - ${currentMaxUsers} / ${usersQuantity} hội viên`
          );

          $(".page-item").removeClass("active");

          console.log(`Current page: ${currentPage}/${pagesQuantity}`);
        }
      );
    }
  }
}) */



/* 
//bấm nút NEXT: sẽ nhảy sang trang ?_page= (currentPage + 1) &_limit=10&_sort=id&_order=desc 
$(".next-page").click(() => {

  //Điều kiện cho phép click nút next: page hiện tại < tổng số pages
  if (currentPage < pagesQuantity) { 

    //loading screen
    $(".loading-wrapper").css("display", "block");

    //search mode
    if (isSearching == true) {

    $.get(
        `${usersURL}?q=${searchInput}&_page=${currentPage + 1}&_limit=10&_sort=id&_order=desc`
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

    //normal mode
    } else {
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
  }
}) 
*/


//bấm nút FIRST: nhảy về trang đầu tiên
/* $(".first-page").click(() => {

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
}) */

//bấm nút LAST: sẽ nhảy sang trang ?_page= (pagesQuantity) &_limit=10&_sort=id&_order=desc  
/* $(".last-page").click(() => {

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
}) */

//nút chuyển sang trang tùy chọn

/* $(".choose-page__confirm").click(() => {

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
}) */

$("#index__modal").on("click", ".modal--success.delete--multiple", () => {
  //Tạo 1 array chứa các thẻ tr đang có input được check
  let choosenItems = $("tbody tr").has("input:checked").toArray();

  //loop: mỗi tr trong array "bị xóa" sẽ:
  for (let i = 0; i < choosenItems.length; i++) {
    //lấy ra targetid của tr này
    targetId = choosenItems[i].id.slice(4);

    //xóa tr này trên giao diện
    $(`#item${targetId}`).detach();

    //dựa theo targetid lấy được, xóa item tương ứng trên database
    $.ajax({
      url: `${usersURL}/${targetId}`,
      type: "DELETE",
    });
  }

  //update usersQuantity
  usersQuantity -= choosenItems.length;

  //sau khi xóa nhiều xong thì bỏ check nút check tổng
  if ($("thead input").is(":checked")) {
    $("thead input")[0].checked = false;
  }
});
