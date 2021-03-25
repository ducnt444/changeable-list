
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
let usersQuantity = "";