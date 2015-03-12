

define(['api','fileComposer'], function (API,Composer) {

	
	var fileSys = function(model,fileTableModel,method,thisContext) {
		var that=this;	
		var compose = new Composer();
		var options={};
		options.thisContext =thisContext;
		compose.configure(options);

		
		this.setFileSysTable = function (){
			if (method===1){
				$('#uploadedModal').modal('show');
				var api = new API();
				if (model.activePage==='file'){
					this.setListeners();
	        		api.getFiles(model.key,model.studyID,this.setStudyTable);
				}
	        	
	        	
			}
			if (method===2){
				if (model.activePage==='file'){
					compose.start('result','_USER');
	      		}else{
	      			compose.start('result','_ROUTER_'+model.studyID);
	      		}
	      		
	        	

			}
			
			
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
		        console.log($(this));
		        //debugger;
		        console.log('in .folder' +model.study);
		        var td = $(this).parent().parent();
		        var tr = $(td).parent();
		        var folderName = takespaces($(this).text());
		        var id = $(td).attr("id");
		        var state = changeFolderState(takespaces(folderName),id);
		        if (state==='open'){
		          var currentFolder={};
		          currentFolder.name = folderName;
		          currentFolder.id = id;
		         //currentFolder.state=state;
		          model.currentFolder = currentFolder;
		        }else{
		          var currnetModel = model.currentFolder;
		          if (currnetModel != undefined){
		            var name = currnetModel.name;
		            if (name===folderName){
		             model.currentFolder=undefined;
		            }
		          }
		          
		        }
		        createRaws(model.studyFileSystem,false,fileTableModel.user);
		        
		    });
		}

		this.newFolder = function(){
			console.log('upload folder: '+model.elementID);
        	$('#createFolderModal').modal('show');

		}
		
		this.setStudyTable = function(data){
        	debugger; 
	        $('#uploadedModal').modal('hide');
	        var dataObj = jQuery.parseJSON( data );
	        fileObj = dataObj.filesys;
	        model.openStruct= dataObj.openfilesys;
	        var index ={};
	        index.index=0;
	        that.setIds(fileObj,index);
	        model.fileSystem = fileObj;
	        model.studyFileSystem=fileObj;
	        fileTableModel.user = false;
	        $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">Studies</a></li>');
	        console.log('before createRaws'+model.study);
	        that.createRaws(fileObj,false,fileTableModel.user);
	        console.log('in setStudyTable'+model.study);
        

      	}
      	this.setIds = function(filesObj,index){

	        $.each(filesObj, function(k, v) {
	          index.index++;
	          //var extension = k.split(".");
	          if (that.isFile(k,filesObj)){
	            v.id='file'+index.index;
	          }else{
	            if (k!='state' && k!='id' && k!='path****'){
	              v.id="folder"+index.index;
	              that.setIds(v,index);
	              
	            }
	          }
	        });

	    }
		

		this.isFile = function(k,obj){

	        if (k==='state' || k==='id' || k==='path****'){
	          return false;
	        }
	        var object = obj[k];
	        var path = object['path****'];
	        if (path!=undefined){
	          return false;
	        }else{
	          return true;
	        }

	    }
		this.setUserFileTable = function (data){
			$('#uploadedModal').modal('hide');
	        var fileObj = jQuery.parseJSON( data );
	        this.createTable();
	         var index ={};
	         index.index=0;
	         this.setIds(fileObj,index);
	         model.fileSystem = fileObj;
	         createRawsWButt(fileObj,false);


		}

		this.createTable = function(){
	        fileTableModel.row =0;
	        fileTableModel.level =0;
	        //if (model.activePage === 'file'){                    
	          //$('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');          
	        //}else{
	          $('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');
	          $('#fileTabale > tbody').append(
	            '<tr>'+
	              '<td id="0" >'+
	                '<span  style="margin-left:0px;">+<span class="folder" ></span></span>'+
	              '</td>'+
	              '<td>'+
	                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
	                '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
	                '<button type="button" style="margin-left:20px;" id="multiple" class="btn btn-primary btn-xs">Multiple Download</button>'+
	                '<button type="button" style="margin-left:20px;" id="multipleDelete" class="btn btn-primary btn-xs">Multiple Delete</button>'+
	              '</td>'+    
	            '</tr>'
	          );
        
      	}
		this.createUserButtons = function(){
	        var user = model.user;
	        var role = user.role;
	        if (role==='SU'){
	          if (model.study==='all' || model.study==='user'){
	            $('#result').append('<div><button class="btn btn-success btn-sm" type="button" id="userFolder" type="button">User</button>'+
	            '<button class="btn btn-success btn-sm" type="button" id="personalFolder" type="button" style="margin-left:10px;">Personal</button></div>');
	          }
	  
	        }
      	}
		this.createDandD = function(){
	        var name;
	        if (model.currentFolder != null && model.currentFolder != undefined){
	          var currentFolder = model.currentFolder;
	          name = currentFolder.name;
	        }else{
	          name='';
	        }

	        $('#result').append('<label style="position:relative;left:-10px;color:#92AAB0;" id="currentfolder">Current folder: <span id="currentName">'+name+'</span></label></br><div id="dragandrophandler">Drag & Drop Files Here</div>');
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
      	this.sortedKeys = function(filesObj){
	        var sortArray= new Array();
	        $.each(filesObj, function(key, value) {
	            sortArray.push(key);
	        });
	        sortArray.sort(function (a, b) {
	          return a.toLowerCase().localeCompare(b.toLowerCase());
	        });
	        //sortArray.sort();
	        return sortArray;
      	}
      	
      	this.createRaws = function(filesObj,recursive,user){

        
	        this.createRawsRecursive(filesObj,recursive,user);
	        var currentFolder={};
	        var check;
	        if (model.currentFolder != null && model.currentFolder != undefined){
	         currentFolder = model.currentFolder;
	         var td = $(document).find('#'+currentFolder.id);
	         var tr  = td.parent();
	         check = $(tr).find('[type=checkbox]');
	         $(check).prop('checked', true);
	         currentFolder.name = takespaces($(tr).find('.folder').text());
	         
	        }
	        
	        $('#currentName').text(currentFolder.name);
      	}

      	this.FolderState = function(folder){
	        var id;
	        var state;
	        var path=folder['path****'];
	        id = folder['id'];
	        var obj = model.openStruct;
	        return obj[path];
      	}
	 	this.createRawsRecursive = function(filesObj,recursive,user){

	        fileTableModel.level=fileTableModel.level+1;
	        var keys = this.sortedKeys(filesObj);
	        console.log('in create raws:' +model.study);
	        if (recursive===false){//entering this function for the first time

	          $('#result').html('');
	          this.createDandD();
	          this.createUserButtons();
	          this.createTable();
	        }

	       var numOfElements=0;
	       for (var i=0;i<keys.length;i++){
	          var k = keys[i];
	          if (k!='state' && k!='id' && k!='path****'){
	             numOfElements++;
	          }

	          var extension = k.split(".");
	          if (this.isFile(k,filesObj)){
	            if (extension[1]==='jsp' && user===false){
	             this.addJspRaw(k,fileTableModel.level,filesObj[k]);
	           }else{
	             if (extension[1]==='expt' && user===false){
	             this.addExptRaw(k,fileTableModel.level,filesObj[k]);
	             }else{
	               if (extension[1]==='js' && user===false){
	                 this.addJSRaw(k,fileTableModel.level,filesObj[k]);
	               }else{
	                 this.addFileRaw(k,fileTableModel.level,filesObj[k]);
	               }
	             }
	           }
	          }else{
	           if (k!='state' && k!='id' && k!='path****'){
	             this.addFolderRaw(k,fileTableModel.level,filesObj[k]);
	             if (that.FolderState(filesObj[k])==='open'){
	               this.createRaws(filesObj[k],true,user);
	               fileTableModel.level=fileTableModel.level-1;
	             }
	           }
	          
	         }


	            
	         }
	         if (numOfElements===0){
	          this.addEmptyRaw(fileTableModel.level);

	         }
        }

        this.addExptRaw = function(file,level,v){
        	fileTableModel.row = fileTableModel.row+1;
	        var html = '<tr>'+
	          '<td class="file" id="'+v.id+'" >'+
	            '<span class="fileNameSpan" style="margin-left:'+level*50+'px" ><input type="checkbox" class="check" style="margin-right:10px;">'+
	              '<i class="fa fa-file-text" ></i> '+file+
	            '</span>'+
	          '</td>'+
	          '<td>'+
	              '<button type="button" class="btn btn-primary btn-xs Svalidate">Run study validator</button>'+getStudyTestlHtml()+
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
      this.addJspRaw = function(file,level,v){

        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;"><i class="fa fa-file-text" >'+
            '</i> '+file+
            '</span>'+
          '</td>'+
          '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
          '</td>'+
        '</tr>');
      }

      this.addJSRaw = function(file,level,v){

        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'">'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px"> <input type="checkbox" class="check" style="margin-right:10px;">'+
              '<i class="fa fa-file-text" ></i> '+file+
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
      this.addFileRaw = function(file,level,v){

        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span class="fileRaw fileNameSpan" style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;">'+
              '<i class="fa fa-file-text"  ></i> '+file+
            '</span>'+
          '</td>'+
          '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
          '</td>'+
        '</tr>');
      }
      
      this.addFolderRaw = function(file,level,v){

        fileTableModel.row = fileTableModel.row+1;
        var raw = fileTableModel.row;
        $('#fileTabale > tbody').append('<tr>'+
            '<td id="'+v.id+'" >'+
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




	    this.createTable = function (){
	    	fileTableModel.row =0;
        	fileTableModel.level =0;
        	$('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');
	    }
	  

	
	};

	return fileSys;


});