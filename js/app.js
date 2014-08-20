
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
        'context':'Contextmaster/context'
        

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
        'context':['jQuery']
        
        
    }
});
require(['domReady','api','jQuery','tracker','bootstrap','jshint','csvToTable',
  'tablesorter','chart','context'],
 function (domReady,API,$,Tracker,Chart) {
 
    // do something with the loaded modules
  domReady(function () {
      
      var model={};
      var api = new API();
      api.init(model,success,SetUser);
      var id=0;
      var fileTableModel ={};
      fileTableModel.user=false;
      var fileObj;
      context.init({preventDoubleContext: false},model);
  
      context.attach('.folder', [
        {header: 'Options'},
        {text: 'Upload File', action: uploadFile},
        {text: 'Create New Folder', action: newFolder}
        
      ]);
      context.attach('.file', [
        {header: 'Options'},
        {text: 'Download File', action: downloadFile}
        
        
      ]);

      $(document).find('input[type=file]').on('change', prepareUpload);

      $('.navbar li').click(function(e) {
        $('.navbar li.active').removeClass('active');
          var $this = $(this);
          if (!$this.hasClass('active')) {
              $this.addClass('active');
          }
          e.preventDefault();
      });

      $(document).on("click",'#createFolderOK', function(){
        var fullpath = getPath(model.elementID);
        api.createFolder(model.key,takespaces(fullpath),takespaces(model.folderCreate),folderCreated);

      });
      
      $(document).on("click",'#deploy', function(){
        $('#result').html('');
        model.activePage = 'deploy';

      });  
      $(document).on("click",'#trackmenu', function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'trackmenu';
        var studyExpt;
        if (model.study!=undefined){
          studyExpt = getExptid(model.study);
          appendTracker(studyExpt);
        }else{
          api.getUserName(takespaces(model.key),function(data){
          appendTracker(data);
           
          });
        }
      });    
      $(document).on("click",'#rde', function(){
        $('#result').html('');
        model.activePage = 'rde';

      });  
      $(document).on("click",'#home', function(){
        $('#result').html('');
        model.activePage = 'home';
        $('#studyTable').show();

      });  
      $(document).on("click",'#test', function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'test';
        api.getFiles(model.key,model.study,setFileTable);


      });  
      $(document).on("click",'.tableVal', function(){

        console.log($(this).text());
        model.study = $(this).text();
        $('.studyButt').text(model.study);
        var activeApp = model.active;
        if (activeApp!=null &&activeApp!=undefined) activeApp.studyChanged();
        
      });
      $(document).on("click",'#fileSys', function(){

        fileTableModel.user=true;
        api.getFiles(model.key,'all',setUserFileTable);
        $('#studyTable').hide();

      });
      $(document).on("click",'.testStudy',function(){
         console.log($(this));
         //debugger;
         var button = $(this);
         var span = $(button).parent().parent().find('.fileNameSpan');
         console.log(span);
         var fname = takespaces($(span).text());
         api.getUserName(takespaces(model.key),function(data){
         var user = data;
         window.open("https://dw2.psyc.virginia.edu/implicit/Launch?study=/user/"+user+"/"+model.study+"/"+fname+"&refresh=true");


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
      $(document).on("click",'.folder',function(){
        console.log($(this));
        //debugger;
        var td = $(this);
        var tr = $(td).parent();
        var folderName = $(tr).text();
        changeFolderState(folderName);
        createRaws(fileObj,false,fileTableModel.user);
      });

      $(document).on("click",'.test',function(){
             
        fileTableModel.user=true;
        console.log($(this));
        var button = $(this);
        var anchor = $(button).parent().parent().find('a');
        model.study = $(anchor).text();
        $('.studyButt').text(model.study);
        console.log(model.key);
        api.getFiles(model.key,model.study,setFileTable);


      });
      $(document).on("click",'.statistics',function(){

        var ctx = document.getElementById("myChart").getContext("2d");
        var data = getChartData();
        var myChart = new Chart(ctx);
        var myBarChart = myChart.Bar(data);
        $('#myStats').modal('show');

      });
      // $("input[name='fileName']" ).change(function () {
      //     $('#upload').click();
      // });

      function folderCreated(){
        alert('folder created');
      }
      function prepareUpload(event){
        
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
        data.append('cmd','UploadFile');
        api.uploadFile(data,uploadSuccess,uploadError);
       
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
      function downloadFile(e){
        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+'/';
        }
        //api.downloadFile(path,model.key,downLoadSuccess);
        window.location.href = '/implicit/dashboard/download/?path='+path+'&key='+model.key;
        //$('#fileDownload').attr('href','/implicit/dashboard/download/?path='+path+'&key='+model.key);
        //var anchor = $('#fileDownload');
        //$('#fileDownload').click();


      }
      function downLoadSuccess(data){
        alert('download syccesfull');
        
      }
      function uploadSuccess(data, textStatus, jqXHR){

        if(typeof data.error === 'undefined')
        {
          alert('success');
          
        }else{
          console.log('ERRORS: ' + data.error);
        }

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
      
      function getChartData(){
          var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
          };
          return data;
      }
      function parseline(str,a,b,c,d){
        var res = str.replace('{a}',a);
        res = res.replace('{b}',b);
        res = res.replace('{c}',c);
        res = res.replace('{d}',d);
        return res;
      }

      function SetUser(data){
        $('#userName').html('<i class="glyphicon glyphicon-user"></i><span class="caret"></span>'+data);
        
      }
      function success (data){
        console.log(data);
        var obj = jQuery.parseJSON( data );
        model.studyNames=obj;
        model.selectedName='';
        $.each(obj, function(key, value) {
            console.log(key + "/"+value);
             $.each(value, function(key2, value2) {
                if (key2.indexOf('name')!=-1){
                  var studyName = value2;
                  update(studyName);   
                }
                 
             });    
        });
            
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

      function changeFolderState(name){
        var folder = findFolder(fileObj,takespaces(name));
        if (folder.state!==null){
          if (folder.state==='open'){
            folder.state = 'close';
          }else{
            folder.state = 'open';

          }
        }else{
          folder.state='open';
        }
      }

      function takespaces(name){ return name.replace(/\s+/g, '');}

      /* Returns the folder object according to name


      */

      function findFolder(ObjTree,name){
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
              $.each(v, function(k2, v2) {
                if (k2==='state'){
                  if (v2==='open'){
                    createRaws(v,true,user,v);
                    fileTableModel.level=fileTableModel.level-1;
                  }
                }
              });
            }
            
          }
        });
      }

      function addExptRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;

        $('#fileTabale > tbody').append('<tr><td class="file" id="'+v.id+'"><i class="fa fa-file-text" ></i><span class="fileNameSpan" style="margin-left:'+level*50+'px"> '+file+
          '</span></td><td><button type="button" class="btn btn-primary btn-xs Svalidate">Run study validator</button><button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs testStudy">Test the study</button><button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs runData">Run data tester</button></td></tr>');
      }
      function addJspRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr><td class="file" id="'+v.id+'"><i class="fa fa-file-text" ></i><span style="margin-left:'+level*50+'px"> '+file+'</span></td><td></td></tr>');
      }
      function addFileRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr><td class="file" id="'+v.id+'"><i class="fa fa-file-text" ></i><span class="fileRaw" style="margin-left:'+level*50+'px"> '+file+'</span></td><td></td></tr>');
      }
      
      function addFolderRaw(file,level,v){

        fileTableModel.row = fileTableModel.row+1;
        var raw = fileTableModel.row;
        $('#fileTabale > tbody').append('<tr><td class="folder" id="'+v.id+'"><i class="fa fa-folder" ></i><span style="margin-left:'+level*50+'px"> '+file+'</span></td><td></td></tr>');

      }


      function setFilePerUser(data){

        fileObj = jQuery.parseJSON( data );
        createTable();
        createUserRaws(fileObj,false);

      }

      function setUserFileTable(data){
        console.log(data);
        fileObj = jQuery.parseJSON( data );
        createTable();
        var index ={};
        index.index=0;
        setIds(fileObj,index);
        model.fileSystem = fileObj;
        createRaws(fileObj,false,fileTableModel.user);
        

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
      function setFileTable(data){
        console.log(data);
        fileObj = jQuery.parseJSON( data );
        createTable();
        //debugger;
        createRaws(fileObj,false,false);
        

      }

      function addJSRaw(file,level){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr><td><i class="fa fa-file-text" ></i><span class="fileNameSpan" style="margin-left:'+level*50+'px"> '+file+'</span></td><td><button type="button" class="btn btn-primary btn-xs validate">Check js syntax</button></td></tr>');

      }    
      function createTable(){
        fileTableModel.row =0;
        fileTableModel.level =0;
        $('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');

      }
      function update(value){
        $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">'+value+'</a></li>');
        $('#studyTable > tbody').append(makerow(value));

      }
      function makerow(val){

        id++;
        var html='';
        html+='<tr>'+
              '<td><a href="#" data-toggle="modal" data-target="#myModal" class="">'+val+'</a>'+
              '</td>'+
              '<td class="">Runing</td>'+
              '<td class="">15%</td>'+
              '<td class="">'+
                  '<button type="button" class="btn btn-primary btn-xs statistics" data-toggle="modal"'+
                  'data-target="#myStats">Statistics</button>'+
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

     
      function appendTracker(studyExpt){
        var track = new Tracker(model,'design2');
        model.tracker.db = 'Research';
        model.tracker.list = 'Any';
        track.getTracker(studyExpt);
        track.getTable(studyExpt,true);
        model.active = track;
      }

     
  });
        
});
