$(document).ready(function(){

    //$(document).on('click', "button.takeThisBookButton", function() {
    //    var temp = $(this).parent().find("img").prop("alt");
    //    console.log(temp);
    //    $.get( '/books/takeBookButton', {book: temp}, function(data) {
    //        console.log(data);
    //        location.reload();
    //    });
    //});

    //$(document).on('click', "button.editThisBookButton", function() {
    //    var temp = $(this).parent().find("img").prop("alt");
    //    console.log(temp);
    //    $.get( '/books/editBookButton', {book: temp}, function(data) {
    //        console.log(data);
    //        if (typeof data.redirect == 'string') {
    //            window.location = data.redirect;
    //        };
    //    });
    //});
/*
    $(document).on('click', "button.addNewBookButton", function() {
        var newBookName = $("#newBookName").val();
        var newBookShortInfo = $("#newBookShortInfo").val();
        var newBookFullInfo = $("#newBookFullInfo").val();
        var newBook = {
            "bookName" : newBookName,
            "shortInfo" : newBookShortInfo,
            "fullInfo" : newBookFullInfo
        };
        $.post( '/books/addNewBook', newBook, function(data) {
            console.log(data);
            if (typeof data.redirect == 'string') {
                window.location = data.redirect;
            };
        });
    });
*/


	//************************************************************************
	//$( '#loginForm' ).on("submit", function(e) {
	//	e.preventDefault();
	//	var login = $('#inputLogin2').val();
	//	var pass = $('#inputPassword3').val();
	//	var data0 = {
	//		login: login,
	//		password : pass
	//	};
    //
	//	/*$.get( '/test', function(data) {
	//		console.log(data);
	//	});*/
    //
	//	$('#inputLogin2, #inputPassword3').val("");
	//	$.ajax({
	//		type: "POST",
	//		url: "/auth/loginForm",
	//		data: data0,
	//		success: function(data) {
	//			console.log(data);
	//			//$(" #inputLogin2 ").val(data.password);
	//			//alert(msg);
	//		}
	//	});
	//});
});