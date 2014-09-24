



define(['api','settings','datepicker'], function (API,Settings) {


	

	var tracker = function (model,design) {

		model.tracker={};
		var that=this;
		var exptid;
	    this.getTracker = function(expt){
	    	console.log('from tracker:'+exptid);
	    	if (expt.length>1){
	    		var exphHtml='<div> There are several expt files for this study, choose one: ';
	    		for (var i=0;i<expt.length;i++){
	    			exphHtml = exphHtml+'</br>';
	    			exphHtml = exphHtml+ '<input type="checkbox" class="expt" /><label> '+expt[i]+'</label>';
	    		}
	    		exphHtml = exphHtml+ '</div>';
	    		$('#chooseEXPTDiv').html(exphHtml);
	    		$('#chooseEXPTModal').modal('show');
	    	}else{
	    		exptid = expt[0];
	    		that.addTracker(exptid);
	    	}
	    	$('.expt').on('click',function(){
				exptid= $(this).next('label').text();
				exptid = that.takespaces(exptid);
			});
	    	$('#exptOK').on('click',function(){
				that.addTracker(exptid);

			});
	    	
	         return true;
	    }
	    this.takespaces = function(name){ 
   			return name.replace(/\s+/g, '');
   		}
	    this.addTracker = function (exptid){
	    	var currentdate = new Date(); 
	    	var since = (currentdate.getMonth())+"/01/"+currentdate.getFullYear();
        	var until = (currentdate.getMonth()+1)+"/"+currentdate.getDate()+"/"+currentdate.getFullYear();
       		var html='<div id="trackerDashBoard" style="width:auto;margin-top:20px;">'+
				         '<label >Study: </label>'+
						 '<input id="studyI" type="text" value='+exptid+'></input>'+
						 '<label>Task: </label>'+
						 '<input id="filterI" type="text" style="margin-left:10x;"></input>'+
						 '<div id="sinceUntil" style="display:inline;">'+
							'<label>Since: </label>'+
							'<input id="sinceI" type="text" data-provide="datepicker" id="sinceI" value='+since+'></input>'+
							'<label>Until: </label>'+
							'<input id="untilI" type="text" id="untilI" value='+until+'></input>'+
						'</div>'+ this.designHtml()+

						 '<div class="dropdown" style="display:inline;margin-left:10px;">'+
				              '<button class="btn btn-default dropdown-toggle btn-sm" type="button" id="dbButton" data-toggle="dropdown">'+
				                'Research'+
				                '<span class="caret"></span>'+
				              '</button>'+
				              '<ul class="dropdown-menu " role="menu" aria-labelledby="dropdownMenu1">'+
				              	'<li><a href="#" id="research">Research</a><li>'+
				              	'<li><a href="#" id="demo">Demo</a><li>'+
				              	'<li><a href="#" id="both">Both</a><li>'+
				              '</ul>'+
		         		 '</div>'+
		        		 '<div class="dropdown" style="display: inline;margin-left:10px;">'+
			                '<button class="btn btn-default dropdown-toggle btn-sm" type="button" id="listButton" data-toggle="dropdown">'+
			                'Any'+
			                '<span class="caret"></span>'+
			                '</button>'+
			                '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu2">'+
			                	'<li><a href="#" id="current">Current</a><li>'+
				              	'<li><a href="#" id="history">History</a><li>'+
				              	'<li><a href="#" id="any">Any</a><li>'+
			                '</ul>'+
			                '<button class="btn btn-primary btn-sm" type="button" id="submit" style="margin-left:10px;">Submit</button>'+
		         		 '</div><br/>'+this.getShowBy()+
						''+this.getCompute();+
					'</div>';

					model.tracker.studyc = 'true';
					$('#result').append(html);
					$('#timeTable').hide();
					$('#result').append('<div id="CSVTable"></div>');
					$('#studyC').prop('checked',true);
					$('#sinceI').datepicker();
					$('#untilI').datepicker();
					this.setListeners();
	    }
	    
	    this.designHtml = function(){
	    	var html='';
	    	if (design==='design2'){
	    		html=html+'</br></br>';

	    	}
	    	return html;
	    }
	    this.getCompute = function(){
	    	var html=''+
	    		'<div style="margin-top:10px;">'+
					'<div style="display:inline;">'+
						'<span style="font-style:italic;">Compute completion:  </span>'+
					'</div>'+
		
					'<div id="enterStarted" style="display:inline;" class="inline" style="margin-left:80px;">'+
						'<label>First Task: </label>'+
						'<input id="taskI" type="text" style="margin-left:8px;"></input>'+
						'<label style="margin-left:10px;">Last Task: </label>'+
						'<input id="completedI" type="text" style="margin-left:8px;"></input>'+
					'</div>'+
				'</div>';

	    	return html;
	    }
	    this.getShowBy = function(){
	    	var html = ''+
	    	'<div style="display:inline-block;margin-left:10px;margin-top:20px;">'+
					
    				'<span style="font-style:italic;">Show by (or combination of those): </span>'+
    				
  			'</div>'+
			'<div style="display:inline-block;padding:10px;margin-left:10px;margin-top:-10px;">'+
				'<input id="studyC" type="checkbox" name="sports" value="soccer" style="margin-left:10px;"/> Study'+
				'<input id="taskC" type="checkbox" name="sports" value="soccer" style="margin-left:13px;" /> Task'+
				'<input id="dataC" type="checkbox" name="sports" value="soccer" style="margin-left:13px;" /> Data Group'+
				'<input id="timeC" type="checkbox" name="sports" value="soccer" style="margin-left:13px;" /> Time'+
				'<div id="timeTable" style="display:inline-block;border:1px solid;padding:10px;margin-left:10px;width:170px;">'+
					'<input id="dayC" type="checkbox" style="margin-left:10px;" /> D'+
					'<input id="weekC" type="checkbox" style="margin-left:10px;" /> W'+
					'<input id="monthC" type="checkbox" style="margin-left:10px;" /> M'+
					'<input id="yearC" type="checkbox" style="margin-left:10px;" /> Y'+
				'</div>'+
			'</div>';
			return html;
	    }

	    this.getTable = function(studyExpt){
	    	
	    	var data = this.getData();
	    	console.log(data);
	    	var api = new API();
	    	//$('#knob').modal('show');
	    	//$(".dial").knob({'min':-50,
              //   			'max':50});
	    	api.getTracker(data,this.setTrackerTable);
	    	//if (listeners) this.setListeners();
	    }
	    this.setTrackerTable = function(data){
	        console.log(data);
	        //$('#knob').modal('hide');
		    $('#CSVTable').CSVToTable(data,{
		    	tableClass:'tablesorter'
		        }).bind("loadComplete",function() { 
		      	$('#CSVTable').find('#cvsT').addClass('tablesorter');
		      	$('#CSVTable').find('table').tablesorter();
	        });
      	} 
      	this.getData = function (){

	        var settings = new Settings();
	        var data = {};
	        data.db = model.tracker.db;
	        data.testDB= settings.getDbString();
	        data.current = model.tracker.list;
	        data.study = $('#studyI').val();
	        data.task = $('#taskI').val();
	        data.since = $('#sinceI').val();
	        data.until = $('#untilI').val();
	        data.refresh ='no';
	        if ($('#studyC').is(":checked")){
				model.tracker.studyc = 'true';
			}else{
				model.tracker.studyc = '';
			}
			if ($('#taskC').is(":checked")){
				model.tracker.taskc = 'true';
			}else{
				model.tracker.taskc = '';
			}
			if ($('#dataC').is(":checked")){
				model.tracker.datac = 'true';
			}else{
				model.tracker.datac = '';
			}
			if ($('#timeC').is(":checked")){
				model.tracker.timec = 'true';
			}else{
				model.tracker.timec = '';
			}
			if ($('#dayC').is(":checked")){
				model.tracker.dayc = 'true';
			}else{
				model.tracker.dayc = '';
			}
			if ($('#weekC').is(":checked")){
				model.tracker.weekc = 'true';
			} else{
				model.tracker.weekc = '';
			}
			if ($('#monthC').is(":checked")){
				model.tracker.monthc = 'true';
			}else{
				model.tracker.monthc = '';
			}
			if ($('#yearC').is(":checked")){
				model.tracker.yearc = 'true';
			}else{
				model.tracker.yearc = '';

			}
			if ($('#zero').is(":checked")){
				model.tracker.zero = 'true';
			}else{
				model.tracker.zero = '';

			}
	        data.endTask='';
	        data.filter = $(document).find('#filterI').val();
	        data.endTask=$(document).find('#completedI').val();
	        data.studyc =model.tracker.studyc;
	        data.taskc = model.tracker.taskc;
	        data.datac = model.tracker.datac;
	        data.timec = model.tracker.timec;
	        data.dayc = model.tracker.dayc;
	        data.weekc = model.tracker.weekc;
	        data.monthc = model.tracker.monthc;
	        data.yearc = model.tracker.yearc;
	        data.method = '3';
	        data.curl= settings.getCurl();
	        data.hurl= settings.getHurl();
	        data.cpath='';
	        data.hpath='';
	        data.tasksM='3';
	        data.threads = 'yes';
	        data.threadsNum = '1';
	        data.baseURL = settings.getBaseURL();
	        return data;
      	}

      	this.studyChanged = function(){
      		var api = new API();
      		var exptid = this.getExptid(model.study);
      		$('#studyI').val(exptid);
      		this.getTable(exptid,false);

      	}
      	this.getExptid = function(name){
        
	        var study = this.findStudy(name);
	        var res;
	        $.each(study, function(key, value) {
	            if (key.indexOf('expt')!=-1){
	              res = value;
	              return false;
	            }
	               
	        });
	        return res;    
      	}
      	this.findStudy = function(study){
	        var obj = model.studyNames;
	        var res;
	        $.each(obj, function(key, value) {
	          $.each(value, function(key2, value2) {
	              if (key2.indexOf('name')!=-1){
	                if (value2===study){
	                  res=value;
	                  return false;

	                }
	                   
	              }
	               
	          });    
	        });
	        return res;
      	}

	    this.setListeners = function(){

	    	$('#research').click(function(){
	    		model.tracker.db = 'Research';
	    		$('#dbButton').html('Research <span class="caret"></span>');

	    	});
	    	$('#demo').click(function(){
	    		model.tracker.db = 'Demo';
	    		$('#dbButton').html('Demo <span class="caret"></span>');

	    	});
	    	$('#both').click(function(){
	    		model.tracker.db = 'Both';
	    		$('#dbButton').html('Both <span class="caret"></span>');

	    	});
	    	$('#current').click(function(){
	    		model.tracker.list = 'Current';
	    		$('#listButton').html('Current <span class="caret"></span>');
	    	});
	    	$('#history').click(function(){
	    		model.tracker.list = 'History';
	    		$('#listButton').html('History <span class="caret"></span>');

	    	});
	    	$('#any').click(function(){
	    		model.tracker.list = 'Any';
	    		$('#listButton').html('Any <span class="caret"></span>');

	    	});
	    	$('#timeC').click(function(){
	    		if (model.tracker.time===null||model.tracker.time===undefined|| model.tracker.time===false ){
	    			$('#timeTable').fadeIn("slow");
	    			model.tracker.time=true;

	    		}else{
	    			$('#timeTable').fadeOut("slow");
	    			model.tracker.time=false;
	    		}
	    	});

	    	$('#dayC').on('click', function(){
				if ($('#dayC').is(":checked")){
					$('#weekC').prop('checked', false);
					$('#monthC').prop('checked', false);
					$('#yearC').prop('checked', false);
				}
			});
			$('#weekC').on('click', function(){
				if ($('#weekC').is(":checked")){
					$('#dayC').prop('checked', false);
					$('#monthC').prop('checked', false);
					$('#yearC').prop('checked', false);
				}
			});
			$('#monthC').on('click', function(){
				if ($('#monthC').is(":checked")){
					$('#weekC').prop('checked', false);
					$('#dayC').prop('checked', false);
					$('#yearC').prop('checked', false);
				}
			});
			$('#yearC').on('click', function(){
				if ($('#yearC').is(":checked")){
					$('#weekC').prop('checked', false);
					$('#monthC').prop('checked', false);
					$('#dayC').prop('checked', false);
				}
			});

	    	$('#submit').click(function(){
	    		
	    		var api = new API();
	      		var exptid = $('#studyI').val();
	      		console.log('exptid: '+exptid);
	      		that.getTable(exptid,false);

	    	});


	    }
    	
    };

    return tracker;


});
