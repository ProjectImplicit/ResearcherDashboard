define(['api'], function (API) {


	var file = function (model) {

		var that =this;

		this.setIds = function (filesys,index){

	        $.each(filesys, function(k, v) {
	          index.index++;
	          var extension = k.split(".");
	          if (extension.length>1){
	            v.id='file'+index.index;
	          }else{
	            if (k!='state' && k!='id'){
	              v.id="folder"+index.index;
	              that.setIds(v,index);
	              
	            }
	          }
	        });

      	}
      	this.setOpenStruct = function(fileSystem){

      
        	$.each(fileSystem, function(k, v) {
	            var extension = k.split(".");
	            if (extension.length>1){//file 
	            }else{
	              if (k!='state' && k!='id'){
	                var obj = model.openStruct;
	                $.each(v, function(k2, v2) {
	                  if (k2==='id'){
	                    var pathA = new Array();
	                    var path='';
	                    var info = {};
	                    info.found = false;
	                    that.getPath(model.fileSystem,v2,pathA,info);
	                    for (var i=0;i<pathA.length;i++){
	                      path+=pathA[i]+'/';
	                    }
	                    obj[path] = 'close';
	                  }
	                });
	                that.setOpenStruct(v);
	                
	              }
	              
	            }
         	});
         
      	}//end file setOpenStruct
      	this.getPath = function(fileSystem,elementID,pathA,info){
        
          $.each(fileSystem, function(k, v) {
               if (info.found) return false; 
               var extension = k.split(".");
               if (extension.length>1){
                 if (v.id===elementID){
                  if (!info.found) pathA.push(k);
                  info.found=true;
                  return false;
                 }
               }else{
                 if (k!='state' && k!='id'){
                   if (!info.found) pathA.push(k);
                   if (that.folderID(v)===elementID){
                    info.found=true;
                    return false;
                   }else{
                    that.getPath(v,elementID,pathA,info);
                    if (!info.found) pathA.pop();

                   }
                   
                 }
               }
             
          });
        
       
      	}//function getPath


      	this.getStudyFromFileSys = function(fileSystem,info){
        
	        $.each(fileSystem, function(k, v) {
	          if (k.indexOf(".")===-1&& k!='id'&&k!='state'){//if folder
	            if (k===info.study){
	              info.studyObj=v;
	              return false;
	            }else{
	              that.getStudyFromFileSys(v,info);
	            }
	          }
	        });


    	}//getStudyFromFileSys
    	this.folderID = function(fileSystem){
	        var res;
	        $.each(fileSystem, function(k, v) {
	          if (k==='id'){
	            res=v;
	            return false;
	          }
	        });
	        return res;
        }//folderID


	};//file main function
    return file;


});
