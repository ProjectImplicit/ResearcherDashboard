



define(['api','settings','datepicker','FileSaver'], function (API,Settings) {


	

	var tracker = function (model,design) {

		
		var trackNum=0;
		var that=this;
		var resultCVS;
		var inputData;
		var dbChoise;
		
		var pihistory = [];
		var historyLimit =5;
		var historyIndex=0;
//		var historyCurrent=0;




	    this.getTracker = function(expt){
	    	
	    	console.log('from tracker:'+exptid);
	    	
			var exptid='';
			
	    	if (expt.length>1){
	    		$(document).one("click",'.expt',function(){
					exptid= $(this).next('label').text();
					exptid = that.takespaces(exptid);
				});
				
				// $(document).one('click','#exptOK',function(){
	   //  			that.addTracker(exptid);
				// });
				$(document).one('hidden.bs.modal',function(){
	    			that.addTracker(exptid);
				});
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
	 
	    }
	    this.takespaces = function(name){ 
   			return name.replace(/\s+/g, '');
   		}

   		this.getHistoryButt = function(){
   			var html=
   			'<div style="margin-left:0.5%;display:inline">'+
				'<i id="historyLeft" style="color:#4588E6;cursor: pointer;" class="fa fa-caret-square-o-left" title="backward"></i>'+
				'<i id="historyRight" style="color:#4588E6;margin-left:10px;cursor: pointer;" class="fa fa-caret-square-o-right" title="forward"></i>'+
			'</div>';

			return html;
   		}
   		this.setHistory = function(csv,data){
			var historyObj={};
			historyObj.csv = csv;
			historyObj.data = data;
			pihistory.push(historyObj);
			historyIndex++;
			historyCurrent=historyIndex;

		}
	    this.addTracker = function (exptid){
	    	if (exptid===undefined) exptid='';
	    	var currentdate = new Date(); 
	    	var since = (currentdate.getMonth())+"/01/"+currentdate.getFullYear();
        	var until = (currentdate.getMonth()+1)+"/"+currentdate.getDate()+"/"+currentdate.getFullYear();
       		var html=this.getHistoryButt()+'</br></br>'+this.getbuttons()+'</br><div id="trackerDashBoard" style="width:auto;margin-top:20px;">'+
				         '<label >Study: </label>'+
						 '<input id="studyI" style="margin-left:8px;" type="text" value='+exptid+'></input>'+
						 '<label>Task: </label>'+
						 '<input id="filterI" type="text" style="margin-left:8px;"></input>'+
						 '<div id="sinceUntil" style="display:inline;">'+
							'<label>Since: </label>'+
							'<input id="sinceI" style="margin-left:8px;" type="text" data-provide="datepicker" id="sinceI" value='+since+'></input>'+
							'<label>Until: </label>'+
							'<input id="untilI" style="margin-left:8px;" type="text" id="untilI" value='+until+'></input>'+
						'</div>'+ this.designHtml()+
						   '<button class="btn btn-success btn-sm" type="button" id="submit" style="margin-left:10px;">Submit</button>'+
		         			'<br/>'+this.getShowBy()+
						''+this.getCompute()+
					'</br>'+this.getMoreOptions()+'</div>';

					model.tracker.studyc = 'true';
					model.tracker.list = 'Current';
					$('#result').append(html);
					$('#timeTable').hide();
					$('#result').append('<div id="CSVTable"></div>');
					$('#studyC').prop('checked',true);
					$('#sinceI').datepicker();
					$('#untilI').datepicker();
					this.setListeners();
	    }
	    
	    this.getbuttons = function(){
	    	 
	    	var html=
	    	'<div class="dropdown" style="display:inline;margin-left:8px;">'+
              '<button class="btn btn-primary dropdown-toggle btn-sm" type="button" id="dbButton" data-toggle="dropdown">'+
                'Research'+
                '<span class="caret"></span>'+
              '</button>'+
              '<ul class="dropdown-menu " role="menu" aria-labelledby="dropdownMenu1">'+
              	'<li><a href="#" id="research">Research</a><li>'+
              	'<li><a href="#" id="demo">Demo</a><li>'+
              	'<li><a href="#" id="both">Both</a><li>'+
              '</ul>'+
 		 '</div>'+
		 '<div class="dropdown" style="display: inline;margin-left:8px;">'+
            '<button class="btn btn-primary dropdown-toggle btn-sm" type="button" id="listButton" data-toggle="dropdown">'+
            'Current'+
            '<span class="caret"></span>'+
            '</button>'+
            '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu2">'+
            	'<li><a href="#" id="current">Current</a><li>'+
              	'<li><a href="#" id="history">History</a><li>'+
              	'<li><a href="#" id="any">Any</a><li>'+
            '</ul>'+
          '</div>';  
          return html;
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
						'<span style="font-style:italic;margin-left:10px">Compute completion:  </span>'+
					'</div>'+
		
					'<div id="enterStarted" style="display:inline;" class="inline" style="margin-left:80px;">'+
						'<label>First Task: </label>'+
						'<input id="taskI" type="text" style="margin-left:10px;"></input>'+
						'<label style="margin-left:10px;">Last Task: </label>'+
						'<input id="completedI" type="text" style="margin-left:8px;"></input>'+
					'</div>'+
				'</div>';

	    	return html;
	    }
	    this.getMoreOptions = function(){
	    	var html =
	    	'<div style="margin-top:10px;margin-left:10px;">'+
				'<span style="font-style:italic;">More options: </span>'+
				'<div style="display:inline">'+
					'<div style="margin-top:2px;display: inline;"><input id="zero" type="checkbox" name="sports" value="soccer"  />Hide Rows with Zero Started Sessions</div>'+
					'<button id="download" class="btn-primary btn-xs" style="margin-left:10px; display:inline;">Download CSV</button>'+
					'</br>'+
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
	    	
	    	inputData = this.getData();
	    	//console.log(data);
	    	var api = new API();
	    	//$('#knob').modal('show');
	    	//$(".dial").knob({'min':-50,
              //   			'max':50});
	    	api.getTracker(inputData,this.setTrackerTable);
	    	//if (listeners) this.setListeners();
	    }
	    this.setTrackerTable = function(data){
	        console.log(data);
	        $('#uploadedModal').modal('hide');
	        resultCVS=data;
	        resultCVS = that.handleZero(resultCVS);
	        that.setHistory(resultCVS,inputData);
	        that.setTable(resultCVS);
		   
      	}
      	this.setTable = function(data) {
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
	        data.zero = model.tracker.zero;
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

      	this.handleZero = function(csv){

			var AnelysedCSV='';
			if( ($('#zero').is(':checked')) ){
			
				 var lines =csv.split("\n");
				 var commas = lines[0].split(",");
				 var index;
				  for (var i=0;i<commas.length;i++){
				  	if (commas[i]==='Started'){
				  		index=i;
				  	}
				  }
				  for(var i = lines.length - 1; i >= 0; i--) {
				  	var line = lines[i];
				  	var lineCommas = line.split(",");
				  	var started  = lineCommas[index];
				  	if (started==='0'){
				  		lines.splice(i,1);
						
				  	}
				  }
				
				for (var i=0;i<lines.length;i++){
					AnelysedCSV += lines[i]+'\n';
				}
				return AnelysedCSV;
			}else{
				return csv;
			}
			
		}
	    this.setListeners = function(){

	    	$('#download').click(function(){
	    		var csvName = $('#studyI').val();
      			var blob = new Blob([resultCVS], {type: "text/plain;charset=utf-8"});
        		saveAs(blob,csvName+'.csv');
	    	});
	    	$('#research').click(function(){
	    		model.tracker.db = 'Research';
	    		$('#dbButton').html('Research <span class="caret"></span>');
	    		$(document).find('#listButton').html('Current <span class="caret"></span>');
				dbChoise = 'research';
				$(document).find("#listButton").prop('disabled', false);
		

	    	});
	    	$('#demo').click(function(){
	    		model.tracker.db = 'Demo';
	    		$('#dbButton').html('Demo <span class="caret"></span>');
	    		$(document).find('#listButton').html('Any <span class="caret"></span>');
				dbChoise = 'demo';
				$(document).find("#listButton").prop('disabled', true);
		

	    	});
	    	$('#both').click(function(){
	    		model.tracker.db = 'Both';
	    		$('#dbButton').html('Both <span class="caret"></span>');
	    		$(document).find('#listButton').html('Any <span class="caret"></span>');
				dbChoise = 'both';
				$(document).find("#listButton").prop('disabled', true);
				$('#dataC').prop('checked', true);
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
	    		$('#uploadedModal').modal('show');
	    		var api = new API();
	      		var exptid = $('#studyI').val();
	      		console.log('exptid: '+exptid);
	      		that.getTable(exptid,false);

	    	});
	    	////////////////////////////////////////

	    	$('#historyRight').on('click',function(){

				if ( typeof historyCurrent === 'undefined' || historyCurrent===historyIndex) return;
				historyCurrent++;
				var historyObj = pihistory[historyCurrent-1];
				var csv = historyObj.csv;
				var data = historyObj.data;
				if (data.db==='Research'){
					$(document).find('#dbButton').html('Research <span class="caret"></span>');
					$("#listButton").prop('disabled', false);
				}
				if (data.db==='Demo'){
					$(document).find('#dbButton').html('Demo <span class="caret"></span>');
					$(document).find('#listButton').html('Any <span class="caret"></span>');
					dbChoise='demo';
					$("#listButton").prop('disabled', true);
				}
				if (data.current==='Both'){
					$(document).find('#dbButton').html('Both <span class="caret"></span>');
					$(document).find('#listButton').html('Any <span class="caret"></span>');
					dbChoise = 'both';
					$("#listButton").prop('disabled', true);
					$('#dataC').prop('checked', true);
				}
				if (data.current==='Current'){
					$(document).find('#listButton').html('Current <span class="caret"></span>');

				}
				if (data.current==='History'){
					$(document).find('#listButton').html('History <span class="caret"></span>');
				}
				if (data.current==='Any'){
					$(document).find('#listButton').html('Any <span class="caret"></span>');
				}
				if (data.studyc === 'true'){
					$('#studyC').prop('checked', true);
				}else{
					$('#studyC').prop('checked', false);
				}
				if (data.taskc === 'true'){
					$('#taskC').prop('checked', true);
				}else{
					$('#taskC').prop('checked', false);
				}
				if (data.datac=== 'true'){
					$('#dataC').prop('checked', true);
				}else{
					$('#dataC').prop('checked', false);
				}
				if (data.timec=== 'true'){
					$('#timeC').prop('checked', true);
					$('#timeTable').fadeIn();
				}else{
					$('#timeC').prop('checked', false);
					$('#timeTable').fadeOut();
				}
				if (data.dayc ==='true'){
					$('#dayC').prop('checked', true);
				}else{
					$('#dayC').prop('checked', false);
				}
				if (data.weekc=== 'true'){
					$('#weekC').prop('checked', true);
				}else{
					$('#weekC').prop('checked', false);
				}
				if (data.monthc=== 'true'){
					$('#monthC').prop('checked', true);
				}else{
					$('#monthC').prop('checked', false);
				}
				if (data.yearc ==='true'){
					$('#yearC').prop('checked', true);
				}else{
					$('#yearC').prop('checked', false);
				}
				if (data.zero ==='true'){
					$('#zero').prop('checked', true);
				}else{
					$('#zero').prop('checked', false);
				}
				
				$(document).find('#studyI').val(data.study);
				$(document).find('#taskI').val(data.task);
				$(document).find('#sinceI').val(data.since);
				$(document).find('#untilI').val(data.until);
				$(document).find('#completedI').val(data.endTask);
				$(document).find('#filterI').val(data.filter);
				that.setTable(csv);
				resultCVS= csv;
			});
			$('#historyLeft').on('click',function(){

				if (typeof historyCurrent === 'undefined' || historyCurrent===1 ) return;
				historyCurrent--;
				var historyObj = pihistory[historyCurrent-1];
				var csv = historyObj.csv;
				var data = historyObj.data;
				if (data.db==='Research'){
					$(document).find('#dbButton').html('Research <span class="caret"></span>');
					$("#listButton").prop('disabled', false);
				}
				if (data.db==='Demo'){
					$(document).find('#dbButton').html('Demo <span class="caret"></span>');
					$(document).find('#listButton').html('Any <span class="caret"></span>');
					dbChoise='demo';
					$("#listButton").prop('disabled', true);
				}
				if (data.current==='Both'){
					$(document).find('#dbButton').html('Both <span class="caret"></span>');
					$(document).find('#listButton').html('Any <span class="caret"></span>');
					dbChoise = 'both';
					$("#listButton").prop('disabled', true);
					$('#dataC').prop('checked', true);
				}
				if (data.current==='Current'){
					$(document).find('#listButton').html('Current <span class="caret"></span>');
					$("#listButton").prop('disabled', false);
					
				}
				if (data.current==='History'){
					$(document).find('#listButton').html('History <span class="caret"></span>');
					$("#listButton").prop('disabled', false);
				}
				if (data.current==='Any'){
					$(document).find('#listButton').html('Any <span class="caret"></span>');
				}
				if (data.studyc === 'true'){
					$('#studyC').prop('checked', true);
				}else{
					$('#studyC').prop('checked', false);
				}
				if (data.taskc === 'true'){
					$('#taskC').prop('checked', true);
				}else{
					$('#taskC').prop('checked', false);
				}
				if (data.datac=== 'true'){
					$('#dataC').prop('checked', true);
				}else{
					$('#dataC').prop('checked', false);
				}
				if (data.timec=== 'true'){
					$('#timeC').prop('checked', true);
					$('#timeTable').fadeIn();
				}else{
					$('#timeC').prop('checked', false);
					$('#timeTable').fadeOut();

				}
				if (data.dayc ==='true'){
					$('#dayC').prop('checked', true);
				}else{
					$('#dayC').prop('checked', false);
				}
				if (data.weekc=== 'true'){
					$('#weekC').prop('checked', true);
				}else{
					$('#weekC').prop('checked', false);
				}
				if (data.monthc=== 'true'){
					$('#monthC').prop('checked', true);
				}else{
					$('#monthC').prop('checked', false);
				}
				if (data.yearc ==='true'){
					$('#yearC').prop('checked', true);
				}else{
					$('#yearC').prop('checked', false);
				}
				if (data.zero ==='true'){
					$('#zero').prop('checked', true);
				}else{
					$('#zero').prop('checked', false);
				}
				$(document).find('#studyI').val(data.study);
				$(document).find('#taskI').val(data.task);
				$(document).find('#sinceI').val(data.since);
				$(document).find('#untilI').val(data.until);
				$(document).find('#completedI').val(data.endTask);
				$(document).find('#filterI').val(data.filter);
				that.setTable(csv);
				resultCVS= csv;
			});

	    	////////////////////////////////////////

	    }
    	
    };

    return tracker;


});
