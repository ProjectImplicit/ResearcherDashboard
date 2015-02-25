define(['api'], function (API) {


	var change = function (model) {

		var that=this;
		
		this.setHtml = function(){
			var html='<div><h4>Researcher name: *</h4><input type="text" id="changeName" class="form-control" style="width: 15%;" ><br/>'+
			'<h4>Researcher email address: * </h4><input id="changeEmail" type="text" class="form-control" style="width: 15%;">'+
			'<br/><h4>Study showfiles link * </h4>'+
			'For example: <a href="https://dw2.psyc.virginia.edu/implicit/showfiles.jsp?user=emily&study=sample/train" >https://dw2.psyc.virginia.edu/implicit/showfiles.jsp?user=emily&study=sample/train</a><input id="changeShow" type="text" class="form-control" style="width: 10%;">'+
			'<h4>Change Request *</h4>List all file names involved in the change request. Specify for each file whether file is being updated or added to production.<br/>'+
			'<textarea id="changeList"  rows="4" cols="50"></textarea><br/><h4>Use the space below for any additional comments</h4><textarea id="changeComment" rows="4" cols="50"></textarea>'+
			'<br/><br/><button id="changeSubmit" type="submit" class="btn btn-primary">Submit</button>';
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
			
			$(document).on('click','#changeSubmit',function(){
				data={};
				var name = $('#changeName').val();
				var email=$('#changeEmail').val();
				var show = $('#changeShow').val();
				var list = $('#changeList').val();
				var comment = $('#changeComment').val();
				data.tr='<tr><td>'+name+'</td><td>'+email+'</td><td>'+show+'</td><td>'+list+'</td><td>'+comment+'</td></tr>';
				var api = new API();
				api.submitChange(data,function(){
					
				});

			})
		};

	};
	return change;


});
