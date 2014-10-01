
define(['api'], function (API) {


	var deploy = function (model,design) {

		this.setHtml = function(){
			var user=model.user;
			var name = user.name;
			var email = user.email;
			var study = model.study;
			var folder = this.getFolder(study);
			var exptFile;
			if (model.exptFile===undefined || model.exptFile===null){
				exptFile = this.getEXPT(study);
			}else{
				exptFile = model.exptFile;
				this.addHTML(name,email,folder,exptFile);

			}
			
			var chosenEXPT;
			var that=this;
			$('.expt').on('click',function(){
				chosenEXPT= $(this).next('label').text();
			});

			////////
			$('.deplotDrop').html('Not Filled '+' <span class="caret"></span>');
			$(document).on('click','#clearAnch',function(){
				$('#hide').val('parent');
				$('#rulename').val('parent');
				$('#restrictionshide').val('parent');
				$('#restrictions').text('None');

			});
				

			$('#clearForm').on('click',function(){
				$('.deplotDrop').html('Not Filled '+' <span class="caret"></span>');
				$('#targetNumber').val('');
			});
			$('#exptDepOK').on('click',function(){
				that.addHTML(name,email,folder,chosenEXPT);
				$('.deplotDrop').html('Not Filled '+' <span class="caret"></span>');
			});
				
		}

    
		this.addHTML = function(name,email,folder,chosenEXPT){
			var that=this;
			var html ='</br></br><table style ="width=500" class=""><tr><td><label>Researcher name: </label></td><td><span class="label label-info" id="researchName"> '+name+'</span></td></tr>'+
				'<tr><td><label> Researcher email address: </label></td><td><span class="label label-info" id="researchEmail">'+email+'</span></td></tr>'+
				'<tr><td><label> Study folder location: </label></td><td ><span class="label label-info" id="folder">'+folder+'</span></td></tr>'+
				'<tr><td><label>Name of experiment file: </label></td><td><span class="label label-info" id="experimentFile" >'+chosenEXPT+'</span></td></tr></table></br>'+
				'<h5 style="float: left;">Target number of completed study sessions: </h5> <div class="col-lg-1" style="float: left;"><input type="text" id="targetNumber" class="form-control" ></div></br>'+
				'<label id="targetNumber_error" class="errorLabel" style="visibility:hidden;color:Red;">* Not Filled</label>'+
				//'';
				this.addParticipation()+
				this.addQAuestions();
				$('#result').html(html);
				$('.selectdrop').on('click',function(){
		   			
					var selection = $(this).text();
					var button = $(this).parent().parent().parent().find('button');
					$(button).html(selection+' <span class="caret"></span>');
				});
				$('#processForm').on('click',function(){
					that.processForm();
				});
		
		}
	    this.addParticipation = function(){
	    	var html='</br>';
	    	html=html+'<h4>Participant restrictions</h4>'+
			'<p>Consider whether it makes sense for any person from any country of any age to complete your study.'+'</br>'+
			'List selection restrictions on your sample (e.g., "exclude age >60", "American citizens/residents only").'+'</br>'+
			'Also include other study IDs from the pool that should disqualify participants from being assigned to your study.'+'</br>'+
			'Type "None" if you want any person from any country of any age to complete your study.'+'</br>'+
			' See http://peoplescience.org/node/104 for more information on this item. '+'</br>'+
			' Type \'n/a\' for private studies (not in the Project Implicit research pool).</br>'+
			'To create restrictions, open the rules generator.'+
	    	'<a id ="rulaTableAnch" href="#" onclick="window.open(\'ruletable.html\',\'Rule Generator\',\'width=1100,height=900,scrollbars=yes\')"> Open the rule generator </a></p>'+
	    	'<div style="background-color:#f3f3f3;min-height:70px;width:300px;border:1px solid;border-color:#BDBDBD;">'+
			'<label id ="restrictions" style="padding:5px;" name="restrictions">None</label>'+
			'</div><a id ="clearAnch" href="#" onclick="return false;">Clear restrictions</a>'+
			'<a id="addComments" href="#" style="display: inline;margin-left:20px;" onclick="$(\'#commentModal\').modal(\'show\')">Add restrictions comments</a>';

			$('#CommentsOK').on('click',function(){

	   			$('#addComments').text('Show/Edit Comment');

	   		})
	    	return html;
	    }
	   
	   	this.addQAuestions = function(){

	   		var html ='';
	   		html=html+'<div>'+

	   		
		
			'<input type="hidden" id="rulename" name="Language" value="parent">'+
			'<input type="hidden" id="hide" name="Language" value="parent">'+
			'<input type="hidden" id="restrictionshide" name="Language" value="parent">'+
			'<h4> This study has been approved by the appropriate IRB *</h4>'+this.addDrop('Yes','No','approved')+
			'<label id="approved_error" class="errorLabel" style="visibility:hidden;color:Red;">* Not Filled</label>'+
			'<h4>All items on "Study Testing" and "Study Approval" from Project Implicit Study Development Checklist completed (items 9 - 17) *</br>'+
			'<small>The checklist is available at http://peoplescience.org/node/105</small></h4>'+this.addDrop('Yes','No','studyComplete')+
			'<label id="studyComplete_error" class="errorLabel" style="visibility:hidden;color:Red;">* Not Filled</label>'+
			'<h4>My study folder on dev2 includes ZERO files that aren\'t necessary for the study (e.g., word documents, older versions of files, items that were dropped from the final version) *</h4>'+
			this.addDrop('Yes','No','necessary')+
			'<label id="necessary_error" class="errorLabel" style="visibility:hidden;color:Red;">* Not Filled</label>'+
			'<h4>Study approved by a *User Experience* Reviewer (Colin Smith or Kate Ratliff) *</h4>'+
			'<p class="plabel">Email studysubmission@projectimplicit.net to have your study approved by one of the above reviewers.</p>'+
			this.addDrop('Yes','No','ReviewerYes')+
			'<label id="ReviewerYes_error" class="errorLabel" style="visibility:hidden;color:Red;">* Not Filled</label>'+
			'<h4>If you are building this study for another researcher (e.g. a contract study), has the researcher received the standard final launch confirmation email and confirmed that the study is ready to be launched? *</h4>'+
			'<p class="plabel">The standard email can be found here: http://peoplescience.org/node/135</p>'+this.addDrop('Yes','No','confirmationYes')+
			'<label id="confirmationYes_error" class="errorLabel" style="visibility:hidden;color:Red;">* Not Filled</label>'+
			'<h4>Study submitted to the Virtual Lab (http://rde.implicit.net/) *</h4>'+
			'<p class="plabel">Researchers should retrieve "real" data from the Virtual Lab at first opportunity after it moves to production as a sanity check on study and data accuracy</p>'+
			this.addDrop('Yes','No','Virtual')+
			'<label id="Virtual_error" class="errorLabel" style="visibility:hidden;color:Red;">* Not Filled</label>'+
			'</br>'+
			'<a id="addFinalComments" href="#" style="display: inline;" onclick="$(\'#CommentFinalModal\').modal(\'show\')">Add comments</a>'+
			'<br/><br/>'+
			'<button type="button" class="btn btn-primary" id="processForm">Submit</button>'+
			'<button type="button" class="btn btn-warning" id="clearForm" style="margin-left:20px;" >Clear</button>';
		return html;
	   	}


	   	this.validate= function(){
	   		var notFilled = '';
			var mistake=false;
			var selection;

			$('#ReviewerYes_error').css("visibility","hidden");
			$('#confirmationYes_error').css("visibility","hidden");
			$('#targetNumber_error').css("visibility","hidden");
			$('#approved_error').css("visibility","hidden");
			$('#studyComplete_error').css("visibility","hidden");
			$('#necessary_error').css("visibility","hidden");
			$('#Virtual_error').css("visibility","hidden");

 
			if (!($('#targetNumber').val())){

				notfilled  = "Name of experiment file is not filled";
				mistake=true;
				$('#targetNumber_error').css("visibility","visible");

			}
			var button = $('#approved').find('button'); 
			selection = this.takespaces($(button).text());
			if (selection==='NotFilled'){

				notfilled  = "Name of experiment file is not filled";
				mistake=true;
				$('#approved_error').css("visibility","visible");

			}
			selection = this.takespaces($('#studyComplete').find('button').text());

			if (selection==='NotFilled'){

				notfilled  = "Name of experiment file is not filled";
				mistake=true;
				$('#studyComplete_error').css("visibility","visible");

			}
			selection = this.takespaces($('#necessary').find('button').text());
			if (selection==='NotFilled'){

				notfilled  = "Name of experiment file is not filled";
				mistake=true;
				$('#necessary_error').css("visibility","visible");

			}
			selection = this.takespaces($('#Virtual').find('button').text());
			if (selection==='NotFilled'){

				notfilled  = "Name of experiment file is not filled";
				mistake=true;
				$('#Virtual_error').css("visibility","visible");

			}
			selection = this.takespaces($('#ReviewerYes').find('button').text());

			if (selection==='Not Filled'){
				notfilled  = "Name of experiment file is not filled";
				mistake=true;
				$('#ReviewerYes_error').css("visibility","visible");
			}
			selection = this.takespaces($('#confirmationYes').find('button').text());
			if (selection==='Not Filled'){
				notfilled  = "Name of experiment file is not filled";
				mistake=true;
				$('#confirmationYes_error').css("visibility","visible");
			}

			return mistake;
	   	}

	   	this.getFile = function(){

			var date = new Date();
			var year    = date.getFullYear();
			var month   = date.getMonth() +1;
			//var day     = date.getDay();
			var day     = date.getDate();
			var hour    = date.getHours();
			var minute  = date.getMinutes();
			var timestamp  = month+ "/"+day+"/"+year+", "+hour+":"+minute;
			
			//'<tr><td>8/19/2011 16:23:30</td><td>colintest</td><td>cts2e@virginia.edu</td><td>colin</td><td>1</td><td>non</td><td>yes</td><td>yes</td><td>yes</td><td>yes</td><td></td><td></td><td></td></tr>'
			var filedata = '<tr><td>'+timestamp+'</td><td><a href=\''+this.value('folder','label')+'\' >'+this.value('folder','label')+' </a></td><td>'+this.value('researchEmail','label')+'</td><td>'+this.value('researchName','label')+'</td><td>'+
			this.value('targetNumber','input')+'</td><td>'+this.value('rulename','input')+'</td><td>'+this.value('restrictions','label')+'</td><td>'+this.value('restrictionsComments','input')+'</td><td>'+this.value('ReviewerYes','drop')+'</td><td>'+this.value('studyComplete','drop')+
			'</td><td>'+this.value('Virtual','drop')+'</td><td>'+this.value('necessary','drop')+'</td><td>'+this.value('approved','drop')+'</td><td>'+
			this.value('experimentFile','label')+'</td><td>'+this.value('confirmationYes','drop')+'</td><td>'+this.value('comments','input')+'</td></tr>';

			return filedata;
   		}

   		this.takespaces = function(name){ 
   			return name.replace(/\s+/g, '');
   		}


   		this.value = function(field,type){
   			
   			var value;

			if (field==='folder'){
				value ='https://dw2.psyc.virginia.edu/implicit/showfiles.jsp';
				var showfile = $('#'+field).text();
				var array = showfile.split('\\');
				var length = array.length;
				var last = showfile.lastIndexOf('\\');
				var user;
				var study;
				if (last===-1){
					user = showfile;
					study='';
				}else{
					user = showfile.slice(1,last);
					study = array[length-1];
				}
				
				value=value+'?'+'user='+user+'&study='+study;
				
				
				return value;

			}
			if (type=='input'){
				value = $('#'+field).val();
				if (value==='' || value===undefined || value===null){
					value= '&nbsp';
				}
			}
			if (type==='label'){

				value = $('#'+field).text();
				if (value==='' || value===undefined || value===null){
					value= '&nbsp';
				}
			}
			if (type==='drop'){

				value = $('#'+field);
				var button = $(value).find('button');
				value = $(button).text();
				if (value==='' || value===undefined || value===null){
					value= '&nbsp';
				}
			}


			
			if (value==='parent') return 'None';
			if (field!='restrictions' && field!='restrictionsComments' && type!='drop'){
				value  = this.takespaces(value); 

			}
			
			return value;
   		}

   		this.sendToServer = function (xml,path,name,url,msg2,overwrite,callback){

   			var data={};
        //var path = this.params.folder;
        
	        data.path='/user/'+path;
	        data.FileName =name;
	        data.submit='false';
	        data.realPath = '';
	        console.log('name: '+data.FileName+ ', folder: '+data.path);
	        data.xml = xml;
	        data.overwrite = overwrite;
	        console.log(xml);
	        $.ajax({
	              type: 'POST',
	              url: url,
	              data: JSON.stringify(data),
	              success: function(result) {

	                      var res = result.length;
	                      if(res === 3){
	                        //alert('File was saved successfully.');
	                        msg2.success=true;
	                        msg2.text = "File was saved successfully, on: "+path+'/'+name;
	                        callback(msg2);
	                      }else{
	                      	if (res=== 4){
	                      		msg2.success=false;
	                      		msg2.text = "File was not saved, a file with this name already exist on the server.";
	                      		callback(msg2);
	                      	}else{
	                      		msg2.success =false;
	                      		//alert('File was not saved on our servers, check your study folder name.');
	                        	msg2.text = 'Study Folder was not Found, check your study folder name.';
	                        	callback(msg2);


	                      	}
	                        
	                      }
	                          
	                  },
	              fail: function(jqXHR, textStatus, errorThrown){
	                  console.log(jqXHR);
	                  console.log(textStatus);
	                  console.log(errorThrown);

	                  alert('fail');

	              },
	              dataType: 'text',
	              async:false
	        });
   		}
	   	this.processForm = function(){
	   		
	   		if (this.validate()){
				alert('Some of the fields above were not filled');
				return;
			}
			var that=this;
		    var msg1 ={};
		    var msg2={
		    	success: true,
		    	text :'No Rule File'
		    };


		     //var url="/implicit/rules";//on implicit
		     var url="/implicit/rules";//for local
		     //var msgurl = "/ruleGeneratorDev/msg.html";//for local
		     //var msgurl = "/implicit/user/bgoldenberg/ruleGenerator/msg.html";//on implicit
			
			 var xml = $('#hide' ).val();
			 var name = $('#researchName').text();
			// //var ruleName = $('#rulename').val();
			 var path = $('#folder').text();
			 var index = path.lastIndexOf("/") + 1;
		     var length = path.length;
		     var filename = path.substr(index,length);
		     if (filename=='') {
		     	var folders = path.split("/");
		     	var size = folders.length;
		     	filename = folders[size-2];
		     }
		     var ruleName = filename+'.rules';
		     if (xml!='parent'){
		     	$('#rulename').val(ruleName);
		     }else{
		     	$('#rulename').val('None');
		     }
    
			 var text = this.getFile();
			 if (xml!='parent'){
			 	this.sendToServer(xml,path,ruleName,url,msg2,'false',function(msg2){
			 		if (msg2.success===false && msg2.text==='File was not saved, a file with this name already exist on the server.'){

			 		$('#ruleModel').modal('show');
			 		$('#overwriteB').on('click',function(){
			 			//alert('click');
			 			$('#ruleModel').modal('hide');
			 			that.sendToServer(xml,path,ruleName,url,msg2,'true',function(msg2){
			 				if (msg2.success!=false){
				 				that.sendFormToServer(name,text,msg1,url,function(){alert('Study Deployed');});
				 			}
			 			});
			 		});
			 		$('#overwriteClose').on('click',function(){
			 			$('#ruleModel').modal('hide');
			 			
			 		});
				 	}else{


						if (msg2.success!=false){
							that.sendFormToServer(name,text,msg1,url,function(){
								alert('Study Deployed');	
							});
							
							//window.location.assign(msgurl+'?success1='+msg1.success+'&msg1='+msg1.text+'&success2='+msg2.success+'&msg2='+msg2.text);
							
					 	}else{
					 		$('#folderModel').modal('show');
					 		$('#OkClose').on('click',function(){
				 				$('#folderModel').modal('hide');
				 			
				 			});
					 		//msg1.sucess=false;
					 		//msg1.text = "Deploy Form Was not Sent because there was a problem saving the rule file. "
					 	}
					 
				 	}

				});
			}
				
	 
 		}

 		this.sendFormToServer = function(name,text,msg1,url,callback){
 			var timeStamp = Math.round(+new Date()/1000); 
			var data={};
		    //data.path='/user/'+'bgoldenberg';
		    data.path='/forms/checklistold.html';
		    data.FileName =name+timeStamp;
		    console.log('name: '+data.FileName+ ', folder: '+data.path);
		    data.xml = text;
		    data.submit='true';
		    data.realPath = '';
		    console.log(text);

			$.ajax({
		              type: 'POST',
		              url: url,
		              data: JSON.stringify(data),
		              success: function(result) {

		                      var res = result.length;
		                      if(res === 3){
		                        //alert('File was saved successfully.');
								    msg1.success=true;
									msg1.text = "The Deploy form was sent successfully ";
									callback(msg1);
		                      }else{
		                        //alert('File was not saved on our servers, check your study folder name.');
									msg1.success=false;
									msg1.text = "There was a problem sending the deploy form";
									callback(msg1);
		                      }
		                          
		                  },
		              fail: function(jqXHR, textStatus, errorThrown){
		                  console.log(jqXHR);
		                  console.log(textStatus);
		                  console.log(errorThrown);

		                  alert('fail');

		              },
		              dataType: 'text',
		              async:false
		   });
 		}
	   	this.addDrop = function(val1,val2,id){

	  //  		var html='<div class="row">'+
			//   '<div class="col-lg-1">'+
			//     '<div class="input-group">'+
			//       '<span class="input-group-addon">'+
			//         '<input type="checkbox">'+
			//       '</span>'+
			//       '<input type="text" class="form-control" value="'+val+'">'+
			//     '</div><!-- /input-group -->'+
			//   '</div><!-- /.col-lg-3 -->'+
			// '</div>';
			// return html;

			//id="'+id+'"
			
	   		var html = '<div class="dropdown depDrop" id="'+id+'" >'+
			  '<button id="dropdownMenu1" class="btn btn-default dropdown-toggle deplotDrop" type="button" data-toggle="dropdown">'+
			    'Not Filled'+
			    '<span class="caret"></span>'+
			  '</button>'+
			  '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">'+
			  	'<li role="presentation"><a role="menuitem" tabindex="-1" class="selectdrop">'+val1+'</a></li>'+
			    '<li role="presentation"><a role="menuitem" tabindex="-1" class="selectdrop">'+val2+'</a></li>'+
			  '</ul>'+
			'</div>';
			return html;
	   	}
	    this.getFolder = function (study){
	    	var studies = model.studyNames;
	    	var folder;
	    	$.each(studies,function(k,v){
	    		if (k===study){
	    			$.each(v,function(k2,v2){
	    				if (k2==='folder'){
	    					folder = v2;
	    					return false;
	    				}
	    			})
	    		}

	    	})
	    	var folders = folder.split("user");
	    	return folders[1];
	    }

	    this.getEXPT = function(study){
	    	var expt=[];
	    	var numOfExpt=0;
	    	$.each(model.studyNames,function(k,v){
	    		if (k===study){
	    			$.each(v,function(k2,v2){
	    				if (k2.indexOf('exptName')!=-1){
	    					expt.push(v2);
	    					numOfExpt++;
	    				}
	    			})
	    		}

	    	})
	    	if (numOfExpt==1){
	    		return expt[0];
	    	}else{
	    		var exphHtml='<div> There are several expt files for this study, choose one: ';
	    		for (var i=0;i<expt.length;i++){
	    			exphHtml = exphHtml+'</br>';
	    			exphHtml = exphHtml+ '<input type="checkbox" class="expt" /><label> '+expt[i]+'</label>';
	    		}
	    		exphHtml = exphHtml+ '</div>';
	    		$('#chooseEXPTDivDep').html(exphHtml);
	    		$('#chooseEXPTModalDeply').modal('show');
	    	}
	    }
	};
    return deploy;


});


