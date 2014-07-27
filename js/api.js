
    var api= urlParam('api');
        var data={};
        var model={};
        var key;
        if (api!=null){
            $('body').html('<h3>API console</h3><div id="console" style="white-space: pre"></div>');
            if (api==='create'){
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
            if (api==='find'){
                var table = urlParam('table');
                var col = urlParam('by');
                var val = urlParam('value');
                data.api = api;
                data.table = table;
                data.column = col;
                data.value = val;

            }
            if (api==='origin'){
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
            var key = urlParam('key');
            console.log("calling getfiles api");
            $.ajax({
                type: "POST",
                url: '/implicit/dashboard',
                data: {
                    cmd: 'getstudies',
                    //OSFKey: 'testkey123456'
                    OSFKey: key
                },
                success: success,
                
            });
        }
        function success(data){
            console.log(data);
            var selectValues = data.split("/");
            model.studyNames=selectValues;
            model.selectedName='';
            $.each(selectValues, function(key, value) {
                //$('#studyDropBox').append($("<option></option>").attr("value",key).text(value));
                update(value); 
                
            });
            
        }
        function getUserName(key,callback){
            var url = "/implicit/dashboard/getname/"+key;
            $.ajax({
                type: "GET",
                url: url,
                                
            }).done(callback);

        }
        function Studyvalidate(user,study,filename,callback){
            var url = "/implicit/dashboard/studyvalidate/"+user+"/file/"+study+"/"+filename;
            $.ajax({
                type: "GET",
                url: url,
                success: callback
                
            });

        }
        function validateFile(user,study,filename,callback){
            var url = "/implicit/dashboard/validate/"+user+"/file/"+study+"/"+filename;
            $.ajax({
                type: "GET",
                url: url,
                success: callback
                
            });

        }
        function getFiles(user,study,successFunc){
            var url = "/implicit/dashboard/test/"+user+"/files/"+study;
            $.ajax({
                type: "GET",
                url: url,
                success: successFunc
                
            });

        }

        function errorconsole(data){
            //$('#console').text(data);
        }
        function apiconsole(data){

            //$('#console').text(data);
        }

        function urlParam(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
               return null;
            }
            else{
               return results[1] || 0;
            }
        }
        
