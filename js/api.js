
/*
    API to query the implicit dashboard

    This version is using Require.js 


    




*/

define([], function () {
    
    var api = function () {

        
        this.init = function(model,callback,UserCallBack){
            
            var apiParam= this.urlParam('api');
                 

            if (apiParam!=null){
                $('body').html('<h3>API console</h3><div id="console" style="white-space: pre"></div>');
                if (apiParam==='create'){
                    var table = urlParam('table');
                    var name = urlParam('name');
                    var key = urlParam('key');
                    var folder = urlParam('folder');
                    var exptid = urlParam('exptid');
                    var userid = urlParam('userid');
                    data.api = api;
                    data.table = table;
                    data.name = name;
                    data.key = key;
                    data.exptid = exptid;
                    data.userid = userid;
                    data.folder = folder;
                }
                if (apiParam==='find'){
                    var table = urlParam('table');
                    var col = urlParam('by');
                    var val = urlParam('value');
                    data.api = api;
                    data.table = table;
                    data.column = col;
                    data.value = val;

                }
                if (apiParam==='origin'){
                    var base = urlParam('base');
                    data.api = api;
                    data.base = base;
                    


                }
                $.ajax({
                    type: "GET",
                    url: '/implicit/dashboard',
                    data: data,
                    success: apiconsole,
                    error: errorconsole

                });
                
            }else{
                var key = this.urlParam('key');
                model.key=key;
                this.getUser(model.key,UserCallBack)
                console.log("calling getfiles api");
                //this.getStudies(key,callback);
                
            }
        }

        this.getStudies = function (key,callback){
            $.ajax({
                    type: "POST",
                    url: '/implicit/dashboard',
                    data: {
                        cmd: 'getstudies',
                        //OSFKey: 'testkey123456'
                        OSFKey: key
                    },
                    success: callback,
                    
                });

        }
        
        /**
        * Desc: get the user information
        * Input: user key.
        * Return: user name, user folder and user email.
        */

        this.getUser = function (key,callback){
            var url = "/implicit/dashboard/getname/"+key;
            var res;
            $.ajax({
                type: "GET",
                url: url,
               
                                
            }).done(callback)

        }
        this.Studyvalidate = function (user,study,filename,callback){
            var url = "/implicit/dashboard/studyvalidate/"+user+"/file/"+study+"/"+filename;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "html"
                //success: callback
                
            }).done(callback).fail(function( jqXHR, textStatus ) {
                alert( "Request failed: " + textStatus );
            });

        }
        this.validateFile = function (user,study,filename,callback){
            var url = "/implicit/dashboard/validate/"+user+"/file/"+study+"/"+filename;
            $.ajax({
                type: "GET",
                url: url,
                success: callback
                
            });

        }
        this.getExpt = function(key,study,callback){
            var url = "/implicit/dashboard/getexpt/"+key+"/"+study;
            $.ajax({
                type: "GET",
                url: url,
                success: callback
                
            });
        }
        this.createFolder = function (key,uploadFolder,folderCreate,study,success){
            //var url = "/implicit/dashboard/create/folder/"+key+"/"+uploadFolder+"/"+folderCreate;
            var url = '/implicit/dashboard';
            data={};
            data.cmd="create";
            data.key=key;
            data.uploadFolder= uploadFolder;
            data.folderCreate=folderCreate;
            data.study=study;
            $.ajax({
                type: "POST",
                data:data,
                url: url,
                success: success
                
            });

        }
        this.downloadFile = function (downloadFile,key,downLoadSuccess){
            
            var data ={};
            data.key = key;
            data.downloadFile = downloadFile;
            data.cmd='download';

            $.ajax({
                url: '/implicit/dashboard',
                //url:url,
                type: "POST",
                data: data,
                success: downLoadSuccess
                
            });

        }
        this.fileExist = function (fileName,userKey,path,study,filename){
            data={};
            data.cmd='exist';
            data.path = path;
            data.file  = filename;
            var res;
            $.ajax({
                url:'/implicit/dashboard',
                type: 'POST',
                data: data,
                async: false,
                success: function(data){
                    if (data==='yes'){
                        res= true;    
                    }else{
                        res= false;
                    }
                    
                }   
            });
            return res;
        }
        this.uploadFile = function (data,callback){
          $.ajax({
              url: '/implicit/dashboard',
              type: 'POST',
              data: data,
              cache: false,
              dataType: 'json',
              processData: false, 
              contentType: false 
            
              
              
            }).done(callback).fail(callback);

        }
        this.getFiles = function (user,study,successFunc){
            var url = "/implicit/dashboard/test/"+user+"/files/"+study;
            $.ajax({
                type: "GET",
                url: url,
                success: successFunc
                
            });

        }
        this.newStudy = function (studyName,key,success){
            var url = '/implicit/dashboard/createstudy/'+key+'/file/'+studyName;
            $.ajax({
                type: "GET",
                url: url,
                success: success
                
            });

        }

        this.deleteFolder = function (path,key,study,success){
            var data ={};
            data.key = key;
            data.path = path;
            data.study = study;
            data.cmd='delete';

            $.ajax({
                url: '/implicit/dashboard',
                type: "POST",
                data: data,
                success: success
                
            });

        }
        this.deleteFile = function (path,key,study,success){
            var data ={};
            data.key = key;
            data.path = path;
            data.study = study;
            data.cmd='delete';

            $.ajax({
                url: '/implicit/dashboard',
                type: "POST",
                data: data,
                success: success
                
            });

        }
        this.getTracker = function (data,callback){
            
            var url = '/implicit/PITracking';
                        
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                success: callback
                
            });

        }
        
        
        this.errorconsole = function (data){
            //$('#console').text(data);
        }
        this.apiconsole = function (data){

            //$('#console').text(data);
        }

        this.urlParam = function (name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
               return null;
            }
            else{
               return results[1] || 0;
            }
        }
        


   };

    return api;
        
});
        
        
        
