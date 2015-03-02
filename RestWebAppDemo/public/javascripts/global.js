/*
 * Global.js takes care of the event handling and updating of the page. 
 */
//Data array for userlist, used to fill info boxes
var userListData = [];

$(document).ready(function() {
	updateTable();
});

//On click of username link
$('#userList table tbody').on('click', 'td a.linkshowuser', displayUserData);

//Button click event for adding user
$('#btnAddUser').on('click', addUser);

//Delete user link click event
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

//This function is used to fill the userlist table with data
function updateTable(){

	var tableContent = '';

	//jQuery AJAX call for JSON from /users/userlists route
	$.getJSON('/users/userlist', function(data){
		//quick and dirty hack not great idea for large samples size
		userListData = data;
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
		});

    	//inject the entire content string into html table
    	$('#userList table tbody').html(tableContent);

	});
};

//Display user info
function displayUserData(event){

	event.preventDefault();

	//getting array index of thisUserName to get data from original user data array, userListData
	var thisUserName = $(this).attr('rel');
    //get the index in userListData of the value, thisUserName
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
	var thisUserObject = userListData[arrayPosition];

	//populating info box
	$('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

//Add a user to db
function addUser(event) {
    event.preventDefault();


    if($('#addUser fieldset input#inputUserName').val() != '' &&
       $('#addUser fieldset input#inputUserEmail').val() != '' &&
       $('#addUser fieldset input#inputUserFullname').val() != '' &&
       $('#addUser fieldset input#inputUserAge').val() != '' &&
       $('#addUser fieldset input#inputUserLocation').val() != '' &&
       $('#addUser fieldset input#inputUserGender').val() != ''
       ) {
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                updateTable();

            }
            else {

                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

//Delete user from db
function deleteUser(event){

	//Keeps link from firing
	event.preventDefault();

	//Use AJAX to delete user
	$.ajax({
		type: 'DELETE',
		url: '/users/deleteuser/' + $(this).attr('rel')
	}).done(function(response){
		//if the response is not successful
		if (response.msg !== ''){
			alert('Error: ' + response.msg);
		}
		//update the table
		updateTable();
	});
	

};
