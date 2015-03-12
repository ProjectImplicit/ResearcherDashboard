define(['api'], function (API) {


	var change = function (model) {

		var that=this;
		
		this.setHtml = function(){
			var user = model.user;
			var email = user.email;
			var name = user.name;
			var study = model.studsyObj;
			var html='<div><h4>Researcher name: *</h4><input type="text" id="changeName" class="form-control" style="width: 15%;" ><br/>'+
			'<h4>Researcher email address: * </h4><input id="changeEmail" type="text" class="form-control" style="width: 15%;">'+
			'<br/><h4>Study showfiles link * </h4>'+
			'For example: <a href="http://app-dev-01.implicit.harvard.edu/implicit/showfiles.jsp?user='+name+'&study='+study.folder+'" target="_blank">http://app-dev-01.implicit.harvard.edu/implicit/showfiles.jsp?user='+name+'&study='+study.folder+'</a><input id="changeShow" type="text" class="form-control" style="width: 10%;">'+
			'<br/><h4>Change Request *</h4>List all file names involved in the change request. Specify for each file whether file is being updated or added to production.<br/>'+
			'<textarea style="margin-top:10px;" id="changeList"  rows="4" cols="50"></textarea><br/><br/><h4>Use the space below for any additional comments</h4><textarea id="changeComment" rows="4" cols="50"></textarea>'+
			'<br/><br/><button id="changeSubmit" type="submit" class="btn btn-primary">Submit</button>';
			
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
				var date = new Date();
				var year    = date.getFullYear();
				var month   = date.getMonth() +1;
				//var day     = date.getDay();
				var day     = date.getDate();
				var hour    = date.getHours();
				var minute  = date.getMinutes();
				var timestamp  = month+ "/"+day+"/"+year+", "+hour+":"+minute;
				data.tr='<tr><td>'+timestamp+'</td><td>'+name+'</td><td>'+email+'</td><td>'+show+'</td><td>'+list+'</td><td>'+comment+'</td></tr>';
				var api = new API();
				api.submitChange(data,function(data){
					$('#msgspan').text(data);
          			$('#msgModal').modal('show');
					
				});

			})
		};

	};
	return change;


});
