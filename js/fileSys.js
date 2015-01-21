

define(['api'], function (API) {

	var fileSys = function(model,fileTableModel) {

		this.setFileSysTable = function (part){
			var api = new API();
			api.getFiles(model.key,part,this.setUserFileTable);


		}
		//this.setIds = function (fileObj,index){
			
			// $.each(filesObj, function(k, v) {
		 //         index.index++;
		 //         var extension = k.split(".");
		 //         if (extension.length>1){
		 //           v.id='file'+index.index;
		 //         }else{
		 //           if (k!='state' && k!='id'){
		 //             v.id="folder"+index.index;
		 //             this.setIds(v,index);
		            
		 //           }
		 //         }
	  //  		});
		//}
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

		// this.createRawsWButt = function (filesObj,recursive){


	 //        fileTableModel.level=fileTableModel.level+1;
	       
	 //        if (recursive===false){

	 //          $('#result').html('');
	 //          this.createTable();
	 //        }
	 //        $.each(filesObj, function(k, v) {
	          
	 //          var extension = k.split(".");
	 //          if (extension.length>1){
	 //          	this.addFileRaw(k,fileTableModel.level,v);
	         
	 //          }else{
	 //            if (k!='state' && k!='id'){
	 //              this.addFolderRaw(k,fileTableModel.level,v);
	 //              $.each(v, function(k2, v2) {
	 //                if (k2==='state'){
	 //                  if (v2==='open'){
	 //                    this.createRaws(v,true);
	 //                    fileTableModel.level=fileTableModel.level-1;
	 //                  }
	 //                }
	 //              });
	 //            }
	            
	 //          }
	 //        });
	 //    }

	    this.createTable = function (){
	    	fileTableModel.row =0;
        	fileTableModel.level =0;
        	$('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');
	    }
	    // this.addFileRaw = function (file,level,v){

        	
     //    	$('#fileTabale > tbody').append(
     //    		'<tr>'+
	    //     		'<td class="file" id="'+v.id+'" >'+
	    //     			'<span class="fileRaw" style="margin-left:'+level*50+'px">'+
	    //     				'<i class="fa fa-file-text"  ></i> '+file+
	    //     			'</span>'+
	    //     		'</td>'+
	    //     		'<td>'+
	    //     			'<button type="button" onclick="viewFile()" class="btn btn-primary btn-xs">View File</button>'+
	    //     			'<button type="button" style="margin-left:20px;" onclick="downloadFile()" class="btn btn-primary btn-xs">Download File</button>'+
	    //     			'<button type="button" style="margin-left:20px;" onclick="deleteFile()" class="btn btn-primary btn-xs ">Delete File</button>'+
	    //     		'</td>'+
     //    		'</tr>');
     //  	}
      
      	// this.addFolderRaw = function (file,level,v){
        	
       //  	$('#fileTabale > tbody').append(
       //  		'<tr>'+
       //  			'<td class="folder" id="'+v.id+'" >'+
       //  				'<span  style="margin-left:'+level*50+'px"><i class="fa fa-folder" ></i> '+file+'</span>'+
       //  			'</td>'+
       //  			'<td>'+
       //  				'<button type="button" onclick="uploadFile()" class="btn btn-primary btn-xs">Upload File</button>'+
	      //  				'<button type="button" style="margin-left:20px;" onclick="newFolder()" class="btn btn-primary btn-xs">Create New Folder</button>'+
	      //  				'<button type="button" style="margin-left:20px;" onclick="deleteFolder()" class="btn btn-primary btn-xs ">Delete Folder</button>'+
       //  			'</td>'+
       //  		'</tr>'
       //  	);
      	// }

	
	};

	return fileSys;


});