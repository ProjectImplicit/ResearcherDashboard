define(['api'], function (API) {


	var remove = function (model) {

		var that=this;
		
		this.setHtml = function(){
			var html='<div><h4>Researcher name: *</h4><input type="text" id="changeName" class="form-control" style="width: 15%;" ><br/>'+
			'<h4>Researcher email address: * </h4><input id="changeEmail" type="text" class="form-control" style="width: 15%;">'+
			'<br/><h4>Study name * </h4>'+
			'This is the name you submitted to the RDE (e.g., colinsmith.elmcogload) <br/><input id="studyname" type="text" class="form-control" style="width: 10%;margin-top:10px;">'+
			'<br/><h4>Please enter your completed n below *</h4>you can use the following link <a href="https://app-dev-01.implicit.harvard.edu/implicit/research/pitracker/PITracking.html#3"'+
			'>https://app-dev-01.implicit.harvard.edu/implicit/research/pitracker/PITracking.html#3</a><br/><br/>'+
			'<h4>Additional comments </h4>(e.g., anything unusual about the data collection, consistent participant comments, etc.)<br/>'+
			'<textarea style="margin-top:10px;" id="commentsText"  rows="4" cols="50"></textarea><br/>'+
			'<br/><button id="removeSubmit" type="submit" class="btn btn-primary">Submit</button>';
			var user = model.user;
			var email = user.email;
			var name = user.name;
			$('#result').html(html);
			$('#changeName').val(name);
			$('#changeEmail').val(email);



		};
		this.configure = function (options){
			this.setLisetners();

		}
		this.setLisetners = function (){
			
			$(document).on('click','#removeSubmit',function(){
				data={};
				var name = $('#changeName').val();
				var email=$('#changeEmail').val();
				var studyname = $('#studyname').val();
				var comment = $('#commentsText').val();
				var date = new Date();
				var year    = date.getFullYear();
				var month   = date.getMonth() +1;
				//var day     = date.getDay();
				var day     = date.getDate();
				var hour    = date.getHours();
				var minute  = date.getMinutes();
				var timestamp  = month+ "/"+day+"/"+year+", "+hour+":"+minute;
				data.tr='<tr><td>'+timestamp+'</td><td>'+name+'</td><td>'+email+'</td><td>'+studyname+'</td><td>'+comment+'</td></tr>';
				var api = new API();
				api.submitRemove(data,function(data){
					$('#msgspan').text(data);
          			$('#msgModal').modal('show');
					
				});

			})
		};

	};
	return remove;


});
