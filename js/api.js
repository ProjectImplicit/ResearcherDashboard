
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
                this.getUserName(model.key,UserCallBack)
                console.log("calling getfiles api");
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
        }

        
        this.getUserName = function (key,callback){
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
        this.createFolder = function (key,uploadFolder,folderCreate,success){
            var url = "/implicit/dashboard/create/folder/"+key+"/"+uploadFolder+"/"+folderCreate;
            $.ajax({
                type: "GET",
                url: url,
                success: success
                
            });

        }
        this.uploadFile = function (data,success,error){
          $.ajax({
              url: '/implicit/dashboard',
              type: 'POST',
              data: data,
              cache: false,
              dataType: 'json',
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              success:success,
              error:error
              // success: function(data, textStatus, jqXHR)
              // {
              //   if(typeof data.error === 'undefined')
              //   {
              //     // Success so call function to process the form
              //     alert('success');
              //     //submitForm(event, data);
              //   }
              //   else
              //   {
              //     // Handle errors here
              //     console.log('ERRORS: ' + data.error);
              //   }
              // },
              // error: function(jqXHR, textStatus, errorThrown)
              // {
              //   // Handle errors here
              //   console.log('ERRORS: ' + textStatus);
              //   // STOP LOADING SPINNER
              // }
            });
        }
        this.getFiles = function (user,study,successFunc){
            var url = "/implicit/dashboard/test/"+user+"/files/"+study;
            $.ajax({
                type: "GET",
                url: url,
                success: successFunc
                
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
        
        
        
