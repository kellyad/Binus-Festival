var sx, prms = ''; var $i=0;
var tempDetail = [],gradeDataTable='';

var tempData = {};
(function($){
    $.fn.openOneCloseAll = function(){
        this.addClass('open');
        this.parent().parent().parent().nextAll().children().next().children().children().next().removeClass('open');
        this.parent().parent().parent().prevAll().children().next().children().children().next().removeClass('open');
        
        return this;
    };
 }(jQuery));
var subView = {
    title: 'Binus Festival Attendance Tapping Area - Binusmaya',
    require: 'event/binusfestival',
    rel: 'FestivalContent',
    gradeDataTable:'',
    onLoaded: function(arg)
    {
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        sx = this;
        prms = BM.popupparam;
        sx.init();
        $('#btnExport').click(function(event){
        sx.ExportToExcel();
        });
      
    },
    loadInstitution : function() {
        $("#ddlAcademicInstitution").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderInstitution').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/GeneralHandler/getAcademicInstitutionNoFilter",
            type: "POST",
            success: function(data){
                $('#loaderInstitution').hide();
                $('#ddlAcademicInstitution').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].AcademicInstitution+"'>"+data[i].Description+"</option>";
                        $("#ddlAcademicInstitution").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlAcademicInstitution").append(option);
                }
                $("#ddlAcademicInstitution").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlAcademicInstitution").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlAcademicInstitution').change(function(){
                    sx.loadDegree();
                });
                sx.loadDegree();
            }
        });
    },
    loadDegree : function() {
        $("#ddlDegree").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderDegree').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/GeneralHandler/getAcademicCareer",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val()
                }),
            success: function(data){
                $('#loaderDegree').hide();
                $('#ddlDegree').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].Acad_Career+"'>"+data[i].Descr+"</option>";
                        $("#ddlDegree").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlDegree").append(option);
                }
                $("#ddlDegree").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlDegree").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlDegree').change(function(){
                   sx.loadCampus();
                   sx.loadPeriod();
                });
                sx.loadCampus();
                sx.loadPeriod();
            }
        });
    },
    loadCampus : function() {
        $("#ddlCampus").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCampus').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/GeneralHandler/getCampus",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(data){
                //    $('#ddlCampus').multiselect();
                //     $('.multiselect-container').css('z-index', '2');

                //     $('.btn-group').click(function(event){
                //         if(!$(this).hasClass('open'))
                //         {
                //             event.stopPropagation();
                //             $(this).openOneCloseAll();
                //         }
                //     });
                //     $('html').click(function(){
                //     $('#ddlCampus').siblings().removeClass('open');
                //      });
                   
                // $('#loaderCampus').hide();
                //  var d = [];
                // for(var i = 0; i< data.length; i++)
                //     d.push({label:data[i].DESCR, value:data[i].CAMPUS});

                // $('#ddlCampus').multiselect('dataprovider', d);
                $('#loaderCampus').hide();
                $('#ddlCampus').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].CAMPUS+"'>"+data[i].DESCR+"</option>";
                        $("#ddlCampus").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlCampus").append(option);
                }
                $("#ddlCampus").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlCampus").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlCampus').change(function(){
                    sx.loadLocation();
                });
                sx.loadLocation();
            }
        });
    },
    loadPeriod : function() {
        $("#ddlPeriod").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriod').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/SystemHandler/getAllSystemPeriod",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(data){
                $('#loaderPeriod').hide();
                $('#ddlPeriod').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].STRM+"'>"+data[i].DESCR+"</option>";
                        $("#ddlPeriod").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlPeriod").append(option);
                }
                $("#ddlPeriod").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlPeriod").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlPeriod').change(function(){
                 //  sx.loadSystemName();
                });
              // sx.loadSystemName();
            }
        });
    },
    loadLocation : function() {
        $("#ddlLocation").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderLocation').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/GeneralHandler/getLocation",
            type: "POST",
            data: JSON.stringify({ Campus: $('#ddlCampus option:selected').val(),Institution: $('#ddlAcademicInstitution option:selected').val() }),
            success: function(data){
                $('#loaderLocation').hide();
                $('#ddlLocation').empty();
                if(data.length) {
                        option = "<option value='"+""+"'>"+"ALL"+"</option>";
                        $("#ddlLocation").append(option);
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].LOCATION+"'>"+data[i].LOCATION+"</option>";
                        $("#ddlLocation").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlLocation").append(option);
                }
                $("#ddlLocation").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlLocation").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlLocation').change(function(){
        // console.log("kis");
        //            sx.loadInit();
                });
             //  sx.loadInit();
            }
        });
    },
    loadReportType : function() {
        $("#ddlReportType").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderReportType').show();
        option = "<option value='"+"Summary"+"'>"+"SUMMARY"+"</option>";
        $("#ddlReportType").append(option);
        option = "<option value='"+"Detail"+"'>"+"DETAIL"+"</option>";
        $("#ddlReportType").append(option);
        $("#ddlReportType").closest(".custom-combobox").find(".combobox-label").remove();
        $("#ddlReportType").closest(".custom-combobox").data("has-init","no").binus_combobox();
        $('#loaderReportType').hide();
    },
    loadInit: function() {
        var sx = this; 
        $('.filter').show();
        $('#divContent').show();
        $('#LabelInstitution').html($('#ddlAcademicInstitution').closest('.custom-combobox').find('.combobox-label').html());
        $('#LabelAcadCareer').html($('#ddlDegree').closest('.custom-combobox').find('.combobox-label').html());
        $('#LabelSTRM').html($('#ddlPeriod').closest('.custom-combobox').find('.combobox-label').html());
        $('#LabelCampus').html($('#ddlCampus').closest('.custom-combobox').find('.combobox-label').html());
        $('#LabelLocation').html($('#ddlLocation').closest('.custom-combobox').find('.combobox-label').html());
        $('#labelStartDate').html(($('#TxtStartDate').val()=="")?"ALL" :new Date($('#TxtStartDate').val()).toString("dd MMMM yyyy"));
        $('#labelEndDate').html(($('#TxtEndDate').val()=="")?"ALL" :new Date($('#TxtEndDate').val()).toString("dd MMMM yyyy"));
         BM.ajax({
            url : BM.serviceUri + "BifestController/TappingAreaHandler/getAllRoom",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(result){
               var d = [];
            for(var i = 0; i< result.length; i++)
                d.push({label:result[i].LOCATION+" - "+result[i].CAMPUS+" - "+result[i].DESCR, value:result[i].FACILITY_ID});

                  $('#ddlTappingArea').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlTappingArea').siblings().removeClass('open');
                     });
                   
                $('#loaderTappingArea').hide();
                
                $('#ddlTappingArea').multiselect('dataprovider', d);
            }
        });
                   BM.ajax({
                url : BM.serviceUri + "BifestController/TappingAreaHandler/getTappingAreaData",
                type: "POST",
                data: JSON.stringify({ 
                    Institution: $('#ddlAcademicInstitution option:selected').val(),
                    Acad_Career: $('#ddlDegree option:selected').val(),
                    Campus: $('#ddlCampus option:selected').val(),
                    Location: $('#ddlLocation option:selected').val(),
                    STRM: $('#ddlPeriod option:selected').val(),
                    StartDate: $('#TxtStartDate').val(),
                    EndDate: $('#TxtEndDate').val() }),
                beforeSend: function(){
                            $('.dataPopUp').remove();
                            $('.dataPopULoading').remove();
                            $('#btnSearch').attr("disabled",true);$('#tableTappingAreaPopUp tbody').empty();
                              $('#tableTappingAreaPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                     $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
            
                },
                success: function(data){
                $('#btnSearch').attr("disabled",false);
               if (sx.gradeDataTable!=''){$('#tableTappingAreaPopUp').DataTable().destroy();}
               $('#tableTappingAreaPopUp tbody').empty(); 
           
                   if(data.length>0) {$.each(data, function(a, e) {
                        var c = $('#iTappingAreaPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                        $('input.iChange',c).attr({
                            'data-binusfestivalattendanceid': e.BinusFestivalAttendanceID,
                            'data-tappingarea':e.TappingArea
                        });
                        // $('.iChange',c).data('data-binusfestivalattendanceid',e.BinusFestivalAttendanceID);
                        $('.iDate ',c).attr("data",e.StartDate);
                        $('.iDate ',c).html(e.StartDate);
                        $('.iTime ', c).html(e.StartTime +' - '+ e.EndTime);
                        $('.iTopic ', c).html(e.Topic);
                        $('.iRoom ', c).html(e.Room);
                        $('.iCampus ', c).html(e.DESCR);
                        $('.iLocation ', c).html(e.LOCATION);
                        $('.iTappingArea ', c).html(e.SubmittedTappingArea);
                        $('input.iChange',c).change(function(){
                        var status = [];
                        var realsplit = $('input.iChange',c)[0].dataset.tappingarea.split(",");
                        var checked = $('tr.dataPopUp input.iChange:checked');
                        for(var j = 0; j < realsplit.length; j++)
                        {status[j]= false;
                            for(var i = 0; i < checked.length; i++)
                            { 
                                if((','+checked[i].dataset.tappingarea+',').indexOf(','+realsplit[j]+',') != -1 && (status[j]==false || status[j] == ""))
                                    status[j]= true;

                                // dataset = checked[i].dataset;
                                if(i == checked.length-1 && (status[j] == $('input.iChange',c).prop('checked')))
                                {
                                    if($('input.iChange',c).prop('checked'))
                                        $('#ddlTappingArea').multiselect("select",realsplit[j]);
                                     if($('input.iChange',c).prop('checked') == false)
                                        $('#ddlTappingArea').multiselect("deselect",realsplit[j]);


                                }
                            }
                        }
                        });
                        // if( e.TappingArea!= null)
                        //    $(".iChooseTappingArea #ddlTappingArea",c).multiselect('select',e.TappingArea.split(","));
                        //$('.iChooseTappingArea ', c).html(e.TappingArea);
                        // $('.iCampus ', c).html(e.Campus);
                        // $('.iLecturerName ', c).html(e.LecturerName);
                        // $('.iStatus ', c).html((e.Status=="data has been conflicted ")?e.Status+" in "+e.kampus:e.Status);
                        $('#tableTappingAreaPopUp tbody').append(c);
                       
                         
                    });}
                    $('.dataPopUpLoading').remove();

                     sx.gradeDataTable = $('#tableTappingAreaPopUp').DataTable({
                        destroy:    true,
                            scrollY:        "300px",
                            scrollX:        true,
                            scrollCollapse: true,
                            paging:         false
                         // paging      : false,
                         // ordering    : true,
                         // info        : false,
                         // scrollX     : false,
                         // bScrollCollapse: true,
                         // bFilter : true,
                         // order: []
                    });

               // new $.fn.dataTable.FixedColumns( sx.gradeDataTable  );
                }
            });

        
            $('#damnClick').click();

    },
    loadNewInstructor: function()
    {
        var sx = this;
        BM.ajax({
            url: BM.serviceUri + 'loginAs/Lecturer/getAutoCompleteNameLecturer',
            type: 'GET',
            success: function(data) {
                listInstructor = [];

                for (var i = 0; i < data.length; i++) 
                    listInstructor.push(data[i].LECTURERID.trim() + " - " + data[i].LECTURERNAME.trim());

                $("#txtNewInstructor").BMautocomplete({
                    dataset: listInstructor
                });
            }
        });
    },
    init: function() {
        var sx = this;
        $(".datepicker" ).datepicker( {dateFormat: "yy-mm-dd"});
        sx.loadInstitution();
        sx.loadReportType();
        //sx.loadAllRoom();
       // sx.loadNewInstructor();
        $('#btnSearch').click(function () {
            sx.loadInit();
        });
        $('#btnSave').click(function () {
            if($('#ddlTappingArea').val()==null && $('#ddlTappingArea').val()=="")
            {
                BM.message({
                    targetid : '#popup-message',
                    title : 'Error!',
                    message : 'Tapping Area does not exist',
                    width : '400px',
                    button : ['OK']
                },
                function(result){
                    if(result == "OK")
                    {

                    }
                });
            }
            else
            {
                BM.message({
                    targetid : '#popup-message',
                    title : 'Confirmation!',
                    message : 'Are you still want to change tapping area for this schedule?',
                    width : '400px',
                    button : ['Yes','No']
                },
                function(result){
                    if (result == 'Yes') {
                        $.fancybox.close();
                        var $this = $(this),
                        checked = $('tr.dataPopUp input.iChange:checked'),
                        newTappingArea = $('#ddlTappingArea').val(),
                       // reason = $('#txtReason').val(),
                        jsonArray = [],
                        dataset;

                        // Blank Validation
                  
                        // Loop through checked Instructor
                        for(var i = 0; i < checked.length; i++)
                        {
                            dataset = checked[i].dataset;

                            // Same Instructor Validation
                            // if(newInstructor === dataset.userid)
                            // {
                            //     alert('New Instructor cannot be same with Existing Instructor, please choose another instructor.');
                            //     return false;
                            // }   

                            jsonArray.push({
                                BinusFestivalAttendanceID: dataset.binusfestivalattendanceid,
                                // oldid: dataset.userid,
                                 newid: newTappingArea
                                // typeid: dataset.typeid,
                               // reason: reason
                            });
                        }

                        BM.ajax({
                            url: BM.serviceUri + "BifestController/TappingAreaHandler/changeAllTappingArea",
                            type: "POST",
                            data: JSON.stringify(jsonArray),
                            beforeSend: function() {
                                $this.attr('disabled', true);
                            },
                            success: function(data) {
                                $this.attr('disabled', false);
                                console.log(data[0]);
                                if(data[0] == '') {
                                    BM.message({
                                        targetid : '#popup-message',
                                        title : 'Congratulations!',
                                        message : 'Tapping Area saved successfully!',
                                        width : '400px',
                                        button : ['OK']
                                    },
                                    function(result){
                                        if(result == "1")
                                        {
                                            $.fancybox.close();
                                        } sx.loadInit();
                                            $('#ddlTappingArea').multiselect("deselectAll", false);
                                            $('.btn-group .multiselect-selected-text').html("None selected");
                                            $('#txtReason').val('');
                                    });
                                }
                               
                            }
                        });       
                    }
                });
            }
        });
    },
    
    initFilter: function(initParam) {
        var sx = this;
        $('#ddlPopupAcademicInstitution').val(initParam.Institution);
        $('#ddlPopupCampus').val(initParam.Campus);
        $('#ddlPopupDegreeByID').val(initParam.Career).change();
        $('#ddlPopupPeriod').val(initParam.Period).change();
        sx.refreshCombobox();
    },
    ExportToExcel : function() {
        var sx = this;
        var data = {};
                            data['Main'] = "AttendanceTappingArea";
                            data['Institution'] = $('#ddlAcademicInstitution option:selected').val();
                            data['Acad_Career'] = $('#ddlDegree option:selected').val();
                            data['Campus'] =  $('#ddlCampus option:selected').val() ;
                            data['Location'] = $('#ddlLocation option:selected').val();
                            data['STRM'] = $('#ddlPeriod option:selected').val();
                            data['StartDate'] = $('#TxtStartDate').val();
                            data['EndDate'] = $('#TxtEndDate').val();
                           
                var form = document.createElement("form");
            form.action = BM.serviceUri+'BifestController/TappingAreaHandler/getExportData';
                form.method = 'POST';
                form.target = '_blank';
                if (data) {
                    for (var key in data) {
                        var input = document.createElement("textarea");
                        input.name = key;
                        input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                        form.appendChild(input);
                    }
                }
                form.style.display = 'none';
                document.body.appendChild(form);
                form.submit();
        
    }
};