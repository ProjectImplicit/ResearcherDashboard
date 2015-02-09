
define(['api'], function (API) {


	

	var fileComposer = function() {
		var that=this;	
		var fileObj;
		var id;
		var api = new API();

		this.configure = function (options){

		}
		this.start = function (id){
			this.id =id;
			this.setListeners();
	        this.api.getFiles('','_USER',this.updateView);

		}
		this.setListeners = function(){

			$(document).on('click','#newFolder', function(){
        		var element =$(this);
        		var tr = $(element).parent().parent();
        		var td = $(tr).find('.folder').parent().parent();
        		var id = $(td).attr("id");
        		model.elementID = id;
        		this.newFolder();
      		});

      		$(document).on("click",'.folder',function(){
		        var td = $(this).parent().parent();
		        var tr = $(td).parent();
		        var folderName = takespaces($(this).text());
		        var id = $(td).attr("id");
		        this.api.drillDown(id,this.updateView);
		        
		        
		    });

		}
		this.updateView = function(data){
			console.log(data);
			var dataObj = jQuery.parseJSON( data );
	        fileObj = dataObj.filesys;
	        $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">Studies</a></li>');
	        that.createRaws(fileObj);

		}
		this.createTable = function (){
	    	$('#'+this.id).append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');
	    }
		this.createUserButtons = function(){
	        var user = model.user;
	        var role = user.role;
	        if (role==='SU'){
	          if (model.study==='all' || model.study==='user'){
	            $('#'+this.id).append('<div><button class="btn btn-success btn-sm" type="button" id="userFolder" type="button">User</button>'+
	            '<button class="btn btn-success btn-sm" type="button" id="personalFolder" type="button" style="margin-left:10px;">Personal</button></div>');
	          }
	  
	        }
      	}
      	this.addFolderRaw = function(file,level,id){

	        //fileTableModel.row = fileTableModel.row+1;
	        //var raw = fileTableModel.row;
	        $('#fileTabale > tbody').append('<tr>'+
	            '<td id="'+id+'" >'+
	              '<span  style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;">'+
	                '<span class="folder" style="cursor:pointer"><i class="fa fa-folder" ></i> <span id="folderNameR">'+file+'</span></span>'+
	              '</span>'+
	            '</td>'+
	            '<td>'+
	                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
	                '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
	                '<button type="button" style="margin-left:20px;" id="deleteFolder" class="btn btn-primary btn-xs ">Delete Folder</button>'+
	                '<button type="button" style="margin-left:20px;" id="downloadFolder" class="btn btn-primary btn-xs ">Download Folder</button>'+
	            '</td>'+
	          '</tr>');

      }
      this.addEmptyRaw = function(level){

        fileTableModel.row = fileTableModel.row+1;
        var raw = fileTableModel.row;
        $('#fileTabale > tbody').append('<tr>'+
            '<td class="" id="" >'+
              '<span style="margin-left:'+level*50+'px;">'+
                'Folder is Empty'+
              '</span>'+
            '</td>'+
            '<td>'+
            '</td>'+
          '</tr>');

      }
	  this.createRaws = function(fileObj){
	  	this.createDandD();
	  	this.createTable();
	  	$.each(fileObj, function(key, value){
	  		console.log(key);
	  		if (value.type==='folder'){
  				that.addFolderRaw(value.name,0,value.id);

  			}
  			if (value.type==='file'){
  				that.addFile(value.name,0,value.id);

  			}
	  	});
   	
	  }
	  this.addFile(name,level,id){
	  	var array = name.split('.');
	  	if (array[1]==='jsp'){
	        this.addJspRaw();
	        return;
	    }
	    if (array[1]==='expt'){
	    	this.addExptRaw(k,fileTableModel.level,filesObj[k]);
	    	return;
	    }
	    if (array[1]==='js'){
	    	this.addJSRaw(k,fileTableModel.level,filesObj[k]);
	    	return;
	    }
	    this.addFileRaw(k,fileTableModel.level,filesObj[k]);
	  	

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
            $('#uploadedModal').modal('show');
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
	             $('#uploadedModal').modal('show');
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