
    require.config({
    paths: {
        'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
        'bootstrap': '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min',
        'jshint': 'jshint',
        'csvToTable':'jquery.csvToTable',
        'tablesorter':'tablesorter/jquery.tablesorter',
        'datepicker':'datepicker/js/bootstrap-datepicker',
        'chart': 'chart',
        //'jui':'//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui',
        'context':'Contextmaster/context',
        'knobmin':'knobmin'
        

    },
    waitSeconds: 25,
    shim: {
        'jQuery': {
            exports: '$'
        },
        'bootstrap' : ['jQuery'],
        'csvToTable': ['jQuery'],
        'tablesorter':['jQuery'],
        'datepicker': ['jQuery','bootstrap'],
        'jshint':['jQuery'],
        'context':['jQuery'],
        'chart':['jQuery'],
        'knobmin':['jQuery']
        
        
    }
});
require(['domReady','api','jQuery','tracker','chart','settings','fileSys','deploy','bootstrap','jshint','csvToTable',
  'tablesorter','context'],
 function (domReady,API,$,Tracker,ChartFX,Settings,Filesys,Deploy) {
 
    // do something with the loaded modules
  domReady(function () {
      
      var model={};
      var api = new API();
      api.init(model,setStudies,SetUser);
      var id=0;
      var fileTableModel ={};
      fileTableModel.user=false;
      var fileObj;
      context.init({preventDoubleContext: false},model);
  
      // context.attach('.folder', [
      //   {header: 'Options'},
      //   {text: 'Upload File', action: uploadFile},
      //   {text: 'Create New Folder', action: newFolder},
      //   {text: 'Delete Folder', action: deleteFolder}
        
      // ]);
      // context.attach('.file', [
      //   {header: 'Options'},
      //   {text: 'View File', action: viewFile},
      //   {text: 'Download File', action: downloadFile},
      //   {text: 'Delete File', action: deleteFile}
      
        
      // ]);

      //$(document).find('input[type=file]').on('change', prepareUpload);
      $(document).find('input[type=file]').on('click',function(){
        this.value = null;

      })
      
      $(document).find('input[type=file]').bind("change", function () {
            var file = this.files[0];
            if (file) {
                // if file selected, do something
                
                prepareUpload();
            } else {
                // if user clicks 'Cancel', do something
            }
        });
      $('.navbar li').click(function(e) {
        $('.navbar li.active').removeClass('active');
          var $this = $(this);
          if (!$this.hasClass('active')) {
              $this.addClass('active');
          }
          e.preventDefault();
      });

      $(document).on("click",'#createFolderOK', function(){
        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+'/';
        }
        var folderToCreate = $('#folderName').val();
        api.createFolder(model.key,takespaces(path),takespaces(folderToCreate),folderCreated);

      });
      
      


      $(document).on('click','#uploadFile', function(){
        var element =$(this);
        var tr = $(element).parent().parent();
        var td = $(tr).find('.folder');
        var id = $(td).attr("id");
        model.elementID = id;
        uploadFile();

      });
      $(document).on('click','#newFolder', function(){
        var element =$(this);
        var tr = $(element).parent();
        var td = $(tr).find('.folder');
        var id = $(td).attr("id");
        model.elementID = id;
        newFolder();

      });
      $(document).on('click','#deleteFolder', function(){
        var element =$(this);
        var tr = $(element).parent();
        var td = $(tr).find('.folder');
        var id = $(td).attr("id");
        model.elementID = id;
        deleteFolder();

      });

      $(document).on('click','#viewFile', function(){
        var element =$(this);
        var tr = $(element).parent().parent();
        var td = $(tr).find('.file');
        var id = $(td).attr("id");
        model.elementID = id;
        viewFile();

      });
      $(document).on('click','#downloadFile', function(){
        var element =$(this);
        var tr = $(element).parent();
        var td = $(tr).find('.file');
        var id = $(td).attr("id");
        model.elementID = id;
        downloadFile();

      });
      $(document).on('click','#deleteFile', function(){
        var element =$(this);
        var tr = $(element).parent();
        var td = $(tr).find('.file');
        var id = $(td).attr("id");
        model.elementID = id;
        $('#deleteModal').modal('show');
        

      });
      $(document).on('click','#statsFile',function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'trackmenu';
        var studyExpt;
        if (model.study!=undefined){
          var exptName = $(this).parent().parent().text();
          var study = model.study+"("+exptName+")";
          studyExpt = getExptid(study);
          if (studyExpt==='not_set'){
            api.getExpt(model.key,model.study,function(data){
              studyExpt = data;
              appendTracker(studyExpt);
            })
          }else{
            appendTracker(studyExpt);
          }
          
        }else{
          api.getUserName(takespaces(model.key),function(data){
          appendTracker(data);
           
          });
        }


      });
      $(document).on('click','#deleteOK', function(){
        deleteFile();

      });
      $(document).on('click','#newStudy', function(){
        $('#NewStudyModal').modal('show');

      });
      $(document).on('click','#newStudyOK',function(){

        var studyName = $('#studyName').val();
        api.newStudy(takespaces(studyName),model.key,newStudySuccess);
        //api.getStudies(model.key,setStudies);

      });

      /**
      * Desc: main listener for the 
      * 'deploy' top menu navigetaion bar.
      *
      *
      */

      $(document).on("click",'#deploy', function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'deploy';
        var deployObj = new Deploy(model,'design1');
        deployObj.setHtml();
        model.active = deployObj;
        


      });  
      
      
      $(document).on("click",'#trackmenu', function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'trackmenu';
        var studyExpt;
        if (model.study!=undefined){
          studyExpt = getExptid(model.study);
          if (studyExpt==='not_set'){
            api.getExpt(model.key,model.study,function(data){
              studyExpt = data;
              appendTracker(studyExpt);
            })
          }else{
            appendTracker(studyExpt);
          }
          
        }else{
          api.getUserName(takespaces(model.key),function(data){
          appendTracker(data);
           
          });
        }
      });

      /**
      * Desc: main listener for the 
      * 'rde' top menu navigetaion bar.
      *
      *
      */

      $(document).on("click",'#rde', function(){
        $('#result').html('');
        model.activePage = 'rde';
        model.active='';

      });

      /**
      * Desc: main listener for the 
      * 'home' top menu navigetaion bar.
      *
      */  

      $(document).on("click",'#home', function(){
        $('#result').html('');
        model.activePage = 'home';
        $('#studyTable').show();

      }); 

      /**
      * Desc: main listener for the 
      * 'test' top menu navigetaion bar.
      *
      */ 

      $(document).on("click",'#test', function(){
        $('#uploadedModal').modal('show');
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'test';
        model.active='';
        var study = model.study;
        if (study===null || study===undefined) study='all';
        api.getFiles(model.key,study,setStudyTable);


      });

      $(document).on("click",'.tableVal', function(){

        console.log($(this).text());
        model.study = $(this).text();
        $('.studyButt').html(model.study+'<span class="caret"></span>');
        var activeApp = model.active;
        if (model.activePage === 'test'){
          $('#test').click()
        }else{
          if (activeApp!=null &&activeApp!=undefined &&activeApp!='') activeApp.studyChanged();
        }
      });

      /**
      * Desc: main listener for the 
      * 'file system' top menu navigetaion bar.
      *
      */  

      // $(document).on("click",'#fileSys', function(){
      //   $('#uploadedModal').modal('show');
      //   $('#result').html('');
      //   fileTableModel.user=true;
      //   model.active='';
      //   model.activePage = 'file';
      //   var study = model.study;
      //   //var fs = new Filesys(model,fileTableModel);
      //   //fs.setFileSysTable('all');

      //   api.getFiles(model.key,'all',setUserFileTable);
      //   $('#studyTable').hide();
        

      // });
      $(document).on("click",'.testStudy',function(){
         console.log($(this));
         //debugger;
         var button = $(this);
         var span = $(button).parent().parent().find('.fileNameSpan');
         console.log(span);
         var fname = takespaces($(span).text());
         api.getUserName(takespaces(model.key),function(data){
         var user = data;
         var studyName = model.study;
         studyName = takeOutBraclet(studyName);
         window.open("https://dw2.psyc.virginia.edu/implicit/Launch?study=/user/"+user+"/"+studyName+"/"+fname+"&refresh=true");


         });
      });
      $(document).on("click",'.Svalidate',function(){
         console.log($(this));
         //debugger;
         var button = $(this);
         var span = $(button).parent().parent().find('.fileNameSpan');
         console.log(span);
         var fname = $(span).text();
         api.Studyvalidate(model.key,model.study,takespaces(fname),openStudyValidation);

      });
      $(document).on("click",'.validate',function(){
         console.log($(this));
         //debugger;
         var button = $(this);
         var span = $(button).parent().parent().find('.fileNameSpan');
         console.log(span);
         var fname = $(span).text();
         api.validateFile(model.key,model.study,takespaces(fname),openValidation);

      });
      
      /**
      * Desc: Listener for pressing a folder
      * in the file system
      * 
      *
      */

      $(document).on("click",'.folder',function(){
        console.log($(this));
        //debugger;
        var td = $(this);
        var tr = $(td).parent();
        var folderName = $(tr).text();
        var id = $(td).attr("id");
        changeFolderState(takespaces(folderName),id);
        createRaws(fileObj,false,fileTableModel.user);
        //createRawsWButt(fileObj,false);
      });

      $(document).on("click",'.test',function(){
        //$('#result').html('');
        //$('#studyTable').hide();
        model.activePage = 'test';     
        fileTableModel.user=true;
        console.log($(this));
        var button = $(this);
        var anchor = $(button).parent().parent().find('a');
        model.study = $(anchor).text();
        $('.studyButt').text(model.study);
        $('#test').click();
        //console.log(model.key);
        //api.getFiles(model.key,model.study,setStudyTable);


      });
      $(document).on("click",'.statistics',function(){

        var button = $(this);
        var anchor = $(button).parent().parent().find('a');
        var study = $(anchor).text();
        setChartData(study);
        

      });
      // $("input[name='fileName']" ).change(function () {
      //     $('#upload').click();
      // });
///////////////////////////fUNCTIONS////////////////////////////////////

      function deleteFolder(){
        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+'/';
        }
        api.deleteFolder(path,model.key,deleteSuccess);
      }
      function deleteSuccess(){
        //alert('folder deleted');
        $('#fileSys').click();
      }


      function newStudySuccess(studyname){
        //alert('study was created');
        var studies = model.studyNames;
        var index=0;
        $.each(studies, function(key, value) {
            index++;
        });
        studies[index] = {name:studyname,exptID:'not_set'};
        //studies.push({name:studyname,exptID:'not_set'});
        setStudies(studies);
        

      }
      function folderCreated(){
        //alert('folder created');
        $('#fileSys').click();
      }
      function prepareUpload(){
        
        var data =new FormData();
        var pathA = new Array();
        var info={};
        info.found=false;
        var path='';
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+'/';
        }
        $.each(event.target.files, function(key, value)
        {
          data.append(key, value);
        });
        data.append('UserKey',model.key);
        data.append('folder',takespaces(path));
        data.append('study',model.study);
        data.append('cmd','UploadFile');
        api.uploadFile(data,fileOpSuccess);
       
      }
      function folderID(fileSystem){
        var res;
        $.each(fileSystem, function(k, v) {
          if (k==='id'){
            res=v;
            return false;
          }
        });
        return res;
      }
      function findElement(fileSystem,elementID,info){
        
        $.each(fileSystem, function(k, v) {
               if (info.found) return false; 
               var extension = k.split(".");
               if (extension.length>1){
                 if (v.id===elementID){
                  info.folder = k;
                  info.found=true;
                  return false;
                 }
               }else{
                 if (k!='state' && k!='id'){
                   if (folderID(v)===elementID){
                    info.found=true;
                    info.folder = v;
                    return false;
                   }else{
                    findElement(v,elementID,info);
                    
                   }
                   
                 }
               }
             
          });
        
      }
      /**
      * Desc: using file or folder id
      * get the path of thar file/folder
      * return an array of path elements.
      *
      */
      function getPath(fileSystem,elementID,pathA,info){
        
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
                   if (folderID(v)===elementID){
                    info.found=true;
                    return false;
                   }else{
                    getPath(v,elementID,pathA,info);
                    if (!info.found) pathA.pop();

                   }
                   
                 }
               }
             
          });
        
       
      }
      function deleteFile(e){
        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+'/';
        }
        api.deleteFile(path,model.key,fileOpSuccess);
      }
      function viewFile(e){
        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+'/';
        }
        window.open('/implicit/dashboard/view/?path='+path+'&key='+model.key);
      }
      function downloadFile(e){
        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+'/';
        }
        window.location.href = '/implicit/dashboard/download/?path='+path+'&key='+model.key;
        
      }
      
      function downLoadSuccess(data){
        //alert('download syccesfull');
        
      }
      
       /**
      * Desc: update the file component
      * after a file operation like upload or delete.
      * 
      */

      function fileOpSuccess(data){

        $('#uploadedModal').modal('show');
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'test';
        model.active='';
        var study = model.study;
        if (study===null || study===undefined) study='all';
        api.getFiles(model.key,study,function(data){

          $('#uploadedModal').modal('hide');
          fileObj = jQuery.parseJSON( data );
          createTable();
          var index ={};
          index.index=0;
          setIds(fileObj,index);
          model.fileSystem = fileObj;
          fileTableModel.user = false;
          $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">Studies</a></li>');
          createRaws(fileObj,false,fileTableModel.user);

        });
        
      }
      function uploadError(jqXHR, textStatus, errorThrown){
        console.log('ERRORS: ' + textStatus);

      }
      function newFolder(e){
        console.log('upload folder: '+model.elementID);
        $('#createFolderModal').modal('show');
      }
      function uploadFile(e){
        console.log('upload folder: '+model.elementID);
        $("input[name='fileName']" ).click();
        
      }
      
      function setChartData(study){
         var data = {};
         var studyExpt = getExptid(study);
         var ctx = document.getElementById("myChart").getContext("2d");
         var settings = new Settings();
         var currentdate = new Date();
         var since = new Date();
         since.setDate(since.getDate()-7);

         var sinceTxt = (since.getMonth()+1)+"/"+since.getDate()+"/"+since.getFullYear();
         var untilTxt = (currentdate.getMonth()+1)+"/"+currentdate.getDate()+"/"+currentdate.getFullYear(); 
         data.db = 'Research';
         data.testDB= "test";
         data.current = 'Any';
         data.study = studyExpt;
         //data.study = 'cebersole.ml3full';
         data.task = '';
         data.since = sinceTxt;
         data.until = untilTxt;
         data.refresh ='no';
         data.endTask='';
         data.filter = '';
         data.endTask='';
         data.studyc ='true';
         data.taskc = 'false';
         data.datac = 'false';
         data.timec = 'true';
         data.dayc = 'true';
         data.weekc = 'false';
         data.monthc = 'false';
         data.yearc = 'false';
         data.method = '3';
         data.curl= settings.getCurl();
         data.hurl= settings.getHurl();
         data.cpath='';
         data.hpath='';
         data.tasksM='3';
         data.threads = 'yes';
         data.threadsNum = '1';
         data.baseURL = settings.getBaseURL();

         api.getTracker(data,function(result){

          console.log(result);
          var resultRaws = result.replace( /\n/g, " " ).split( " " );
           // var datatry = {
           //   labels: ["January", "February", "March", "April", "May", "June", "July"],
           //   datasets: [
           //       {
           //           label: "My First dataset",
           //           fillColor: "rgba(220,220,220,0.5)",
           //           strokeColor: "rgba(220,220,220,0.8)",
           //           highlightFill: "rgba(220,220,220,0.75)",
           //           highlightStroke: "rgba(220,220,220,1)",
           //           data: [65, 59, 80, 81, 56, 55, 40]
           //       }//,
           //       // {
           //       //     label: "My Second dataset",
           //       //     fillColor: "rgba(151,187,205,0.5)",
           //       //     strokeColor: "rgba(151,187,205,0.8)",
           //       //     highlightFill: "rgba(151,187,205,0.75)",
           //       //     highlightStroke: "rgba(151,187,205,1)",
           //       //     data: [28, 48, 40, 19, 86, 27, 90]
           //       // }
           //   ]
           // };
          
          var datactx = {};
          var labels =[];
          var datasets = [{
            label: "CR%",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
          }];

          for (var i=1;i<resultRaws.length-2;i++){
            var raws = resultRaws[i].split(",");
            labels[i-1]=raws[1];
            var cr = raws[4];
            cr = cr.substring(0,cr.length-2);
            datasets[0].data[i-1] = cr;
            
          }

          datactx.labels = labels;
          datactx.datasets = datasets;
          var myChart = new ChartFX(ctx);
          var myBarChart = myChart.Bar(datactx);
          $('#myStats').modal('show');


         });

          
      }
      function parseline(str,a,b,c,d){
        var res = str.replace('{a}',a);
        res = res.replace('{b}',b);
        res = res.replace('{c}',c);
        res = res.replace('{d}',d);
        return res;
      }

      function SetUser(data){
        var userObj = jQuery.parseJSON( data );
        model.user = userObj;
        $('#userName').html('<i class="glyphicon glyphicon-user"></i><span class="caret"></span>'+userObj.name);
        
      }
      // function getExptOfStudy(studyName){
      //   var exptRes=[];
      //   var studyObj = model.studyNames;
      //   $.each(studyObj, function(key, value) {
      //       $.each(value, function(key2, value2) {
      //           if (key2.indexOf('name')!=-1){
      //             var studyName = value2;
      //             if (studyName.indexOf("(")!=-1){
      //               var names = studyName.split("(");
      //               var name = names[0];                   
      //               if (name===studyName){
      //                 exptRes.push(names[1]);
      //               }

      //             }else{

                    
      //             }
                  
      //           }
                 
      //        });    
      //   });

      // }
      function setStudies (data){
        
       console.log(data);
       $('.dropdownLI').html('');
        $('#studyTable > tbody').html('');
        var obj;
        var studies=[];
        if(typeof data =='object'){
          obj = data;
        }else{
          obj = $.parseJSON( data );
        }
        model.studyNames=obj;
        model.selectedName='';
        $.each(obj, function(key, value) {
            console.log(key + "/"+value);
            update(key);
             // $.each(value, function(key2, value2) {
             //    if (key2.indexOf('name')!=-1){
             //      var studyName = value2;
             //      if (studyName.indexOf("(")!=-1){
             //        var names = studyName.split("(");
             //        var name = names[0];                   
             //        if (!($.inArray(name, studies))){
             //          studies.push(name);
             //        }

             //      }else{
             //        studies.push(studyName);
             //      }
             //      //update(studyName);   
             //    }
                 
             // });    
        });
        // for (var i=0;i<studies.length;i++){
        //   update(studies[i]);
        // }
            
      }
      function openStudyValidation(data){
        //debugger;
        var errors = data.split("<br/>");
        console.log(errors);
        var len = errors[0].length;
        errors[0]=errors[0].slice(4,len);
        $('#validateTable > tbody').empty();
        if (errors.length===0){
          $('#validateTable > tbody').append('<tr><td>No Errors Found</td></tr>');
        }
        for (var i=0;i<errors.length;i++){
          var error = errors[i];
          $('#validateTable > tbody').append('<tr><td>'+error+'</td></tr>');
        }
        $('#validateModal').modal('show');
      }

      function openValidation(data){
        console.log(data);
        var configuration = '/* jshint undef: true, es3:true */';
        var globals = '/* global define,xGetCookie,$,top */';
        var cont =globals+'\n'+configuration+'\n'+data;
        JSHINT(cont);
        console.log(JSHINT.errors);
         $('#validateTable > tbody').empty();
        for (var i=0;i<JSHINT.errors.length;i++){

              //console.log(JSHINT.errors[i]);
              var obj = JSHINT.errors[i];
              var a = obj.a;
              var b = obj.b;
              var c = obj.c;            
              var d = obj.d;            
              var objerr = obj.id;
              var rawobj = obj.raw;
              var rawS = parseline(rawobj,a,b,c,d);
              var line = obj.line;
              var char = obj.character;
              var error = 'Error: '+objerr+'     '+'Description: '+rawS+'     '+'line: '+line+'     '+'charecter: '+char;
              //var error = JSON.stringify(obj, null, 2);
              $('#validateTable > tbody').append('<tr><td>'+error+'</td></tr>');
              
        }
        if (JSHINT.errors.length===0){
         $('#validateTable > tbody').append('<tr><td>No Errors Found</td></tr>');
        }
        $('#validateModal').modal('show');
      }

      /**
      * Desc: changes the folder from open
      * to close state or vise versa when
      * it is being clicked.
      */

      function changeFolderState(name,id){
        var obj = model.openStruct;
        for (var key in obj) {
           if (obj.hasOwnProperty(key)) {
              if (key===id){
                if(obj[key]==='open'){
                  obj[key]='close';
                }else{
                  obj[key]='open';
                }
              }
           }
        }
        // $.each(obj,function(k,v){
        //   if (k===id){
        //     if (v==='open'){
        //       v='close' ;
        //     }else{
        //       v='open';
        //     } 
        //   }

        // });
       
      }



      // function changeFolderState(name,id){
      //   var info = {};
      //   info.found = false;
      //   var element;
      //   findElement(fileObj,id,info);
      //   var folder = info.folder;
      //   if (folder.state!=null){
      //     if (folder.state==='open'){
      //       folder.state = 'close';
      //     }else{
      //       folder.state = 'open';

      //     }
      //   }else{
      //     folder.state='open';
      //   }
      // }

      function takespaces(name){ return name.replace(/\s+/g, '');}

      /* Returns the folder object according to name


      */

      function findFolder(ObjTree,name,id){
        var res;
        //debugger;
        $.each(ObjTree, function(k, v) {
          if (k===name){
            res= v;
            return false;
          }
          if (k.indexOf(".")===-1 && k!='state' && k!='id'){
            res = findFolder(v,name);
            if (res!=undefined){
              return false;
            }
            
          }
          
         });
        return res;
      }

      
      function createRaws(filesObj,recursive,user){

        fileTableModel.level=fileTableModel.level+1;
       
        if (recursive===false){

          $('#result').html('');
          createTable();
        }
        $.each(filesObj, function(k, v) {
          
          var extension = k.split(".");
          if (extension.length>1){
            
            if (extension[1]==='jsp' && user===false){
              addJspRaw(k,fileTableModel.level,v);
            }else{
              if (extension[1]==='expt' && user===false){
              addExptRaw(k,fileTableModel.level,v);
              }else{
                if (extension[1]==='js' && user===false){
                  addJSRaw(k,fileTableModel.level,v);
                }else{
                   addFileRaw(k,fileTableModel.level,v);
                }
              }
            }
          }else{
            if (k!='state' && k!='id'){
              addFolderRaw(k,fileTableModel.level,v);
              if (FolderState(v)==='open'){
                createRaws(v,true,user);
                fileTableModel.level=fileTableModel.level-1;
              }
            }
            
          }
        });
      }

      function addExptRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;

        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px" >'+
              '<i class="fa fa-file-text" ></i> '+file+
            '</span>'+
          '</td>'+
          '<td>'+
            '<button type="button" class="btn btn-primary btn-xs Svalidate">Run study validator</button>'+
            '<button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs testStudy">Test the study</button>'+
            '<button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs runData">Run data tester</button>'+
            '<button type="button" id="viewFile" style="margin-left:20px;" class="btn btn-primary btn-xs">View File</button>'+
            '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
            '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
            '<button type="button" id="deployFile" style="margin-left:20px;" class="btn btn-primary btn-xs">Deploy</button>'+
            '<button type="button" style="margin-left:20px;" id="statsFile" class="btn btn-primary btn-xs">Statistics</button>'+
            '<button type="button" style="margin-left:20px;" id="dataFile" class="btn btn-primary btn-xs ">Data</button>'+
           '</td>'+
        '</tr>');
      }
      function addJspRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span style="margin-left:'+level*50+'px"><i class="fa fa-file-text" >'+
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
      function addJSRaw(file,level){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file">'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px"> '+
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
      function addFileRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span class="fileRaw" style="margin-left:'+level*50+'px">'+
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
      
      function addFolderRaw(file,level,v){

        fileTableModel.row = fileTableModel.row+1;
        var raw = fileTableModel.row;
        $('#fileTabale > tbody').append('<tr>'+
            '<td class="folder" id="'+v.id+'" style="cursor:pointer">'+
              '<span  style="margin-left:'+level*50+'px">'+
                '<i class="fa fa-folder" ></i> '+file+
              '</span>'+
            '</td>'+
            '<td>'+
                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
                '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFolder" class="btn btn-primary btn-xs ">Delete Folder</button>'+
            '</td>'+
          '</tr>');

      }


      function setFilePerUser(data){

        fileObj = jQuery.parseJSON( data );
        createTable();
        createUserRaws(fileObj,false);

      }

      function setOpenStruct(fileObj){
      
         $.each(fileObj, function(k, v) {
            var extension = k.split(".");
            if (extension.length>1){
            }else{
              if (k!='state' && k!='id'){
                var obj = model.openStruct;
                $.each(v, function(k2, v2) {
                  if (k2==='id'){
                    obj[v2] = 'close';
                  }
                });
                setOpenStruct(v);
                
              }
              
            }
          });
         
      }
      // function setUserFileTable(data){
      //   //console.log(data);
      //   $('#uploadedModal').modal('hide');
      //   fileObj = jQuery.parseJSON( data );
      //   createTable();
      //   var index ={};
      //   index.index=0;
      //   setIds(fileObj,index);
      //   model.openStruct={};
      //   model.fileSystem = fileObj;
      //   setOpenStruct(fileObj,model.openStruct);
      //   //createRaws(fileObj,false,fileTableModel.user);
      //   createRawsWButt(fileObj,false);
        
        

      // }

      function addFolderRawB (file,level,v){
          
          $('#fileTabale > tbody').append(
            '<tr>'+
              '<td class="folder" id="'+v.id+'" >'+
                '<span  style="margin-left:'+level*50+'px"><i class="fa fa-folder" ></i> '+file+'</span>'+
              '</td>'+
              '<td>'+
                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
              '</td>'+  
              '<td>'+  
                  '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
              '</td>'+    
              '<td>'+    
                  '<button type="button" style="margin-left:20px;" id="deleteFolder" class="btn btn-primary btn-xs ">Delete Folder</button>'+
              '</td>'+
            '</tr>'
          );
      }

      function addFileRawB (file,level,v){

          
          $('#fileTabale > tbody').append(
            '<tr>'+
             '<td class="file" id="'+v.id+'" >'+
               '<span class="fileRaw" style="margin-left:'+level*50+'px">'+
                  '<i class="fa fa-file-text"  ></i> '+file+
                '</span>'+
              '</td>'+
              '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
              '</td>'+
              '<td>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
              '</td>'+  
              '<td>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
              '</td>'+
            '</tr>');
     }
      
      function createRawsWButt(filesObj,recursive){

          fileTableModel.level=fileTableModel.level+1;
          if (recursive===false){
            $('#result').html('');
            createTable();
          }
          $.each(filesObj, function(k, v) {
            var extension = k.split(".");
            if (extension.length>1){
            addFileRawB(k,fileTableModel.level,v);
            }else{
              if (k!='state' && k!='id'){
                addFolderRawB(k,fileTableModel.level,v);
                $.each(v, function(k2, v2) {
                  if (k2==='state'){
                    if (v2==='open'){
                      createRawsWButt(v,true);
                      fileTableModel.level=fileTableModel.level-1;
                    }
                  }
                });
              }
              
            }
          });
      }
      function setIds(filesObj,index){

        $.each(filesObj, function(k, v) {
          index.index++;
          var extension = k.split(".");
          if (extension.length>1){
            v.id='file'+index.index;
          }else{
            if (k!='state' && k!='id'){
              v.id="folder"+index.index;
              setIds(v,index);
              
            }
          }
        });

      }
      /**
      * Desc: callback function that sets 
      * the table of studies and the study dropdown
      *
      */
      function setStudyTable(data){
        //console.log(data);
        $('#uploadedModal').modal('hide');
        fileObj = jQuery.parseJSON( data );
        createTable();
        var index ={};
        index.index=0;
        setIds(fileObj,index);
        model.openStruct={};
        model.fileSystem = fileObj;
        setOpenStruct(fileObj,model.openStruct);
        fileTableModel.user = false;
        $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">Studies</a></li>');
        createRaws(fileObj,false,fileTableModel.user);
        

      }

      /**
      * Desc: returns the satet of the folder
      * input: folder key/value object
      *
      */
      function FolderState(folder){
        var id;
        var state;
        $.each(folder,function(k,v){
          if (k==='id'){
            id=v;
          }
          

        });
        var obj = model.openStruct;
        $.each(obj,function(k,v){
          if (k===id){
            state= v;
          }

        });
        return state;
      }
      
      function createTable(){
        fileTableModel.row =0;
        fileTableModel.level =0;
        $('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');

      }
      function update(name){
        $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">'+name+'</a></li>');
        $('#studyTable > tbody').append(makerow(name));

      }
      function makerow(val){

        id++;
        var html='';
        html+='<tr>'+
              '<td><span href="#" data-toggle="modal" data-target="#myModal" class="">'+val+'</span>'+
              '</td>'+
              '<td class="">Runing</td>'+
              '<td class="">'+
                  '<button type="button" class="btn btn-primary btn-xs statistics">Statistics</button>'+
              '</td>'+
              '<td class="">'+
                  '<button type="button" class="btn btn-primary btn-xs test" >Test</button>'+
              '</td>'+
             '<td class="">'+
                  '<button type="button" class="btn btn-primary btn-xs" id="1deploy">Deploy</button>'+
              '</td>'+
          '</tr>';
        return html;
      }
      
      function findStudy(study){
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
      function getExptid(name){
        
        var study = findStudy(name);
        var res;
        $.each(study, function(key, value) {
            if (key.indexOf('expt')!=-1){
              res = value;
              return false;
            }
               
        });
        return res;    
      }

     
      function takeOutBraclet(name){
        var studyName;
        if (name.indexOf("(")!=-1){
           var studies = name.split("(");
           studyName = studies[0];
           return studyName;  
         }else{
          return name;

         }
      }
      function appendTracker(studyExpt){
        var track = new Tracker(model,'design1');
        model.tracker.db = 'Research';
        model.tracker.list = 'Any';
        track.getTracker(studyExpt);
        track.getTable(studyExpt,true);
        model.active = track;
      }

     
  });
        
});
