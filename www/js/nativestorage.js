if (typeof(Storage) !== "undefined") {
    console.log("defined"); // Code for localStorage/sessionStorage.
    //app.showAlert('test','define');
} else {
	//app.showAlert('test','undefine');
    console.log("undefined"); // Sorry! No Web Storage support..
}