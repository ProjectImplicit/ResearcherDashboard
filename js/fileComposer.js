
define(['api'], function (API) {


	

	var fileComposer = function() {
		var that=this;	
		var fileObj;
		var id;
		var api;
		var level;
    var data;
    var topPath;

		this.configure = function (options){
      that.api = new API();
      that.api.configureFileModule(options,function(data){
        that.data = jQuery.parseJSON( data );
        that.setListeners();  
      });
      

		}
		this.start = function (id,base){
			this.id =id;
			this.level=0;
	    this.api.getFiles('',base,this.updateView);

		}
		this.takespaces = function(name){ return name.replace(/\s+/g, '');}

		this.setListeners = function(){

			$(document).on('click','#newFolder', function(){
            debugger;
        		var element =$(this);
        		var tr = $(element).parent().parent();
        		var td = $(tr).find('.folder').parent().parent();
        		var id = $(td).attr("id");
        		that.data.elementID = id;
        		that.newFolder();
      		});

      		$(document).on('click','.folder',function(){
      			var td = $(this).parent().parent();
		        var tr = $(td).parent();
		        var folderName = that.takespaces($(this).text());
		        var id = $(td).attr("id");
		        that.level++;
		        that.api.drillDown(id,that.updateView);
		        
		        
		    });

		    $(document).on('click','#drillUp',function(){
		    	that.level--;
		    	that.api.drillUp(that.updateView);


		    });

        $(document).on('click','#deleteFile', function(){
          var element =$(this);
          var tr = $(element).parent().parent();
          var td = $(tr).find('.file');
          var id = $(td).attr("id");
          that.data.elementID = id;
          that.data.deleteAction='file';
          $('#deleteModal').modal('show');
        });

        $(document).on('click','#deleteOK', function(){

          if (that.data.deleteAction==='folder'){
            that.deleteFolder();
          }else{
            that.deleteFile();
          }
        });

        $(document).on('click','#deleteFolder', function(){
          var element =$(this);
          var tr = $(element).parent().parent();
          var td = $(tr).find('.folder').parent().parent();
          var id = $(td).attr("id");
          that.data.elementID = id;
          that.data.deleteAction='folder';
          $('#deleteModal').modal('show');
        

      });
      $(document).on("click",'#createFolderOK', function(){
        
        var folderToCreate = $('#folderName').val();
        $('#folderName').val('');
        that.api.createFolder('',that.data.elementID,that.takespaces(folderToCreate),'_ID',that.updateView);

      });

		}
    this.newFolder = function(){
      $('#createFolderModal').modal('show');

    }
    this.deleteFolder = function(){
        
        that.api.deleteFolder(that.data.elementID,'','_ID',that.updateView);
    }
    this.deleteFile = function(e){
        
        that.api.deleteFile(that.data.elementID,'','_ID',that.updateView);
    }
		this.updateView = function(data){
      debugger;
			console.log(data);
			$('#'+that.id).html('');
			var dataObj = jQuery.parseJSON( data );
	    fileObj = dataObj.filesys;
      that.topPath = fileObj.toppath;
	    $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">Studies</a></li>');
	    that.createRaws(fileObj);

		}
		this.createTable = function(id){
	        
          $('#'+that.id).append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');
          var html= '<tr>'+
              '<td id="'+id+'">'+
                '<span style="margin-left:0px;">';
          if (that.level!=0 || that.data.role==='SU'){
          	html=html+'<i id="drillUp" class="fa fa-level-up" style="cursor:pointer"></i>';
		      }      
		      html=html+'<span class="folder" ></span></span>'+
	              '</td>'+
	              '<td>'+
	                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
	                '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
	                '<button type="button" style="margin-left:20px;" id="multiple" class="btn btn-primary btn-xs">Multiple Download</button>'+
	                '<button type="button" style="margin-left:20px;" id="multipleDelete" class="btn btn-primary btn-xs">Multiple Delete</button>'+
	              '</td>'+    
	            '</tr>';
	          $('#fileTabale > tbody').append(html);
        
      	}
		// this.createUserButtons = function(){
	 //        var user = model.user;
	 //        var role = user.role;
	 //        if (that.data.role==='SU'){
	 //          if (model.study==='all' || model.study==='user'){
	 //            $('#'+this.id).append('<div><button class="btn btn-success btn-sm" type="button" id="userFolder" type="button">User</button>'+
	 //            '<button class="btn btn-success btn-sm" type="button" id="personalFolder" type="button" style="margin-left:10px;">Personal</button></div>');
	 //          }
	  
	 //        }
  //     	}
      	this.getStudyTestlHtml = function(){
        	var html='<div class="dropdown" style="display: inline">'+
                    '<button type="button" id="dropdownTest" style="margin-left:20px;" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="true">'+
                      'Study Tester'+
                      '<span class="caret"></span>'+
                    '</button>'+
                    '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownTest">'+
                      '<li><a class="testStudy nohref">Run Study</a></li>'+
                      '<li><a  class="copyLink nohref">Copy link</a></li>'+
                    '</ul>'+
                  '</div>';
        	return html;

      	}
      	this.addExptRaw = function(name,level,id){
        	
	        var html = '<tr>'+
	          '<td class="file" id="'+id+'" >'+
	            '<span class="fileNameSpan" style="margin-left:'+level*50+'px" ><input type="checkbox" class="check" style="margin-right:10px;">'+
	              '<i class="fa fa-file-text" ></i> '+name+
	            '</span>'+
	          '</td>'+
	          '<td>'+
	              '<button type="button" class="btn btn-primary btn-xs Svalidate">Run study validator</button>'+that.getStudyTestlHtml()+
	              '<!--<button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs testStudy">Test the study</button>'+
	              '<button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs runData">Run data tester</button>-->'+
	              '<button type="button" id="viewFile" style="margin-left:20px;" class="btn btn-primary btn-xs">View File</button>'+
	              '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
	              '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
	              '<!--<button type="button" id="deployButton" style="margin-left:20px;" class="btn btn-primary btn-xs">Deploy</button>'+
	              '<button type="button" style="margin-left:20px;" id="statisticsButton" class="btn btn-primary btn-xs ">Statistics</button>'+
	              '<button type="button" style="margin-left:20px;" id="dataFile" class="btn btn-primary btn-xs ">Data</button>-->'+
	            '</td>'+
	          '</tr>';
	          
	          
        	$('#fileTabale > tbody').append(html);
      }
      this.addJspRaw = function(name,level,id){

        
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+id+'" >'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;"><i class="fa fa-file-text" >'+
            '</i> '+name+
            '</span>'+
          '</td>'+
          '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
          '</td>'+
        '</tr>');
      }

      this.addJSRaw = function(name,level,id){

        
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+id+'">'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px"> <input type="checkbox" class="check" style="margin-right:10px;">'+
              '<i class="fa fa-file-text" ></i> '+name+
            '</span>'+
          '</td>'+
          '<td>'+
            '<button type="button" class="btn btn-primary btn-xs validate">Check js syntax</button>'+
            '<button type="button" id="viewFile" style="margin-left:20px;" class="btn btn-primary btn-xs">View File</button>'+
            '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
            '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+     
           '</td>'+
        '</tr>');

      }    
      this.addFileRaw = function(name,level,id){

        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+id+'" >'+
            '<span class="fileRaw fileNameSpan" style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;">'+
              '<i class="fa fa-file-text"  ></i> '+name+
            '</span>'+
          '</td>'+
          '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
          '</td>'+
        '</tr>');
      }
      this.addFolderRaw = function(name,level,id){

        
        $('#fileTabale > tbody').append('<tr>'+
            '<td id="'+id+'" >'+
              '<span  style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;">'+
                '<span class="folder" style="cursor:pointer"><i class="fa fa-folder" ></i> <span id="folderNameR">'+name+'</span></span>'+
              '</span>'+
            '</td>'+
            '<td>'+
                '<!--<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
                '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>-->'+
                '<button type="button" id="deleteFolder" class="btn btn-primary btn-xs ">Delete Folder</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFolder" class="btn btn-primary btn-xs ">Download Folder</button>'+
            '</td>'+
          '</tr>');

      }
      this.addEmptyRaw = function(level){
        
        $('#fileTabale > tbody').append('<tr>'+
            '<td class="" id="" >'+
              '<span class="folderup" style="margin-left:'+level*50+'px;"><i class="fa fa-level-up"></i>'+
              '</span>'+
            '</td>'+
            '<td>'+
            '</td>'+
          '</tr>');

      }
      this.setToPath = function(){
        $('#'+that.id).append('<div>'+that.topPath+'</div>');
      }
  	  this.createRaws = function(fileObj){
  	  	this.createDandD();
        this.setToPath();
        this.createTable(fileObj.current.id);
        

        for (var key in fileObj) {
          if (fileObj.hasOwnProperty(key)) {
              var value = fileObj[key];
              if (value.type==='folder'){
                that.addFolderRaw(value.name,0,value.id);
              }
              if (value.type==='file'){
                that.addFile(value.name,0,value.id);
              }
          }
        }
      

	  	// $.each(fileObj, function(key, value){
	  	// 	console.log(key);
	  	// 	if (value.type==='folder'){
  		// 		that.addFolderRaw(value.name,0,value.id);

  		// 	}
  		// 	if (value.type==='file'){
  		// 		that.addFile(value.name,0,value.id);

  		// 	}
	  	// });
   	
	  }
	  this.addFile = function(name,level,id){
	  	var array = name.split('.');
	  	if (array[1]==='jsp'){
	        that.addJspRaw(name,level,id);
	        return;
	    }
	    if (array[1]==='expt'){
	    	that.addExptRaw(name,level,id);
	    	return;
	    }
	    if (array[1]==='js'){
	    	that.addJSRaw(name,level,id);
	    	return;
	    }
	    that.addFileRaw(name,level,id);
	  	

	  }
  	  this.DrophandleFileUpload = function(files,obj){

        model.elementID=undefined;
        var cmd='UploadFile';
        var folderpath='';

        $( '.check' ).each(function( index ) {
          var input = $(this);
          var tr  = $(input).parent().parent();
          var id = $(tr).attr("id");
          if (id===undefined){
            var upTD = $(tr).find('.folder');
            id = $(upTD).attr("id");
          }
          if ($(input).prop('checked')){
            model.elementID = id;
            $(this).attr('checked', false);
          }
        });
        if (model.elementID===undefined) model.elementID='0';
        var data =new FormData();
        var pathA = new Array();
        var study;
        var info={};
        info.found=false;
        var path='';
        if (model.elementID==='0'){
          path=fileSeperator();
          study=model.study;
          if (study===undefined) study='all';
        }else{//this is not a root file operation so use full path study='all'
          getPath(model.fileSystem,model.elementID,pathA,info);
          for (var i=0;i<pathA.length;i++){
            path+=pathA[i]+fileSeperator();
          }
          study='all';
        }
        updateDatawithFiles(files,data,cmd,folderpath);
        //if (model.activePage === 'file') model.study='all';
        createExistFilesArray(files,path,data,study,function(){
          if (model.exist.length>0){
          setModals(model);
          }else{
            data.append('UserKey',model.key);
            data.append('folder',takespaces(path));
            data.append('study',model.study);
            data.append('cmd','UploadFile');
            //$('#uploadedModal').modal('show');
            api.uploadFile(data,fileOpSuccess);
          }

        });
    

      }
      	this.createDandD = function(){
      		$('#'+this.id).append('<div id="dragandrophandler">Drag & Drop Files Here</div>');
	        var obj = $("#dragandrophandler");
	        obj.on('dragenter', function (e) 
	        {
	            e.stopPropagation();
	            e.preventDefault();
	            $(this).css('border', '2px solid #0B85A1');
	        });
	        obj.on('dragover', function (e) 
	        {
	             e.stopPropagation();
	             e.preventDefault();
	        });
	        obj.on('drop', function (e) 
	        {
	         
	             $(this).css('border', '2px dotted #0B85A1');
	             e.preventDefault();
	             var filesI = e.originalEvent.dataTransfer.files;
	             var files = e.originalEvent.dataTransfer.items;
	             //var length = e.originalEvent.dataTransfer.items.length;
	             //We need to send dropped files to Server
	             //$('#uploadedModal').modal('show');
	             if (   (navigator.userAgent).indexOf('Mozilla')!=-1    ) {
	              DrophandleFileUpload(filesI,obj);

	             }else{
	              DrophandleFileUpload(files,obj);
	             }
	             
	        });
      	}


	};

	return fileComposer;


});