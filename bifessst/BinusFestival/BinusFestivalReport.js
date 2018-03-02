var sx, prms = '';
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
    title: 'Konfigurasi Sistem - Binusmaya',
    require: 'event/binusfestival',
    rel: 'FestivalContent',
    gradeDataTable:'',
    onLoaded: function(arg)
    {
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        sx = this;
        prms = BM.popupparam;
        sx.init();
      
      
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
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val()
                }),
            success: function(data){
                   $('#ddlCampus').multiselect();
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlCampus').siblings().removeClass('open');
                     });
                   
                $('#loaderCampus').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].Descr, value:data[i].Campus});

                $('#ddlCampus').multiselect('dataprovider', d);
                // $('#ddlCampus').empty();
                // if(data.length) {
                //     for(i=0 ; i < data.length ; i++){
                //         option = "<option value='"+data[i].Campus+"'>"+data[i].Descr+"</option>";
                //         $("#ddlCampus").append(option);
                //     }
                // } else {
                //     option = "<option value = ''>All</option>";
                //     $("#ddlCampus").append(option);
                // }
                // $("#ddlCampus").closest(".custom-combobox").find(".combobox-label").remove();
                // $("#ddlCampus").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlCampus').change(function(){
                  //  sx.loadFaculty();
                });
                //sx.loadFaculty();
            }
        });
    },
    loadPeriod : function() {
        $("#ddlPeriod").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriod').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/GeneralHandler/getPeriod",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val()
                }),
            success: function(data){
                $('#loaderPeriod').hide();
                $('#ddlPeriod').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].Waktu+"'>"+data[i].DESCR+"</option>";
                        $("#ddlPeriod").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlPeriod").append(option);
                }
                $("#ddlPeriod").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlPeriod").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlPeriod').change(function(){
                   sx.loadSystemName();
                });
               sx.loadSystemName();
            }
        });
    },
    loadSystemName : function() {
        $("#ddlSystemName").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderSystemName').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/SystemHandler/getSystemConfiguration",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriod option:selected').val() }),
            success: function(data){
                $('#loaderSystemName').hide();
                $('#ddlSystemName').empty();
                if(data.length) {
                        option = "<option value='"+""+"'>"+"ALL"+"</option>";
                        $("#ddlSystemName").append(option);
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].SystemID+"'>"+data[i].SystemName+"</option>";
                        $("#ddlSystemName").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlSystemName").append(option);
                }
                $("#ddlSystemName").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlSystemName").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlSystemName').change(function(){
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
        
         $('#tableOfficialNotesPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                 $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
        
        BM.ajax({
            url : BM.serviceUri + "BifestController/LecturerScheduleHandler/getAllLecturerSchedule",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriod option:selected').val() , SystemID: $('#ddlSystemName option:selected').val(), Campus: $('#ddlCampus option:selected').val() }),
            beforeSend: function(){
                        $('.dataPopUp').remove();
            },
            success: function(data){
           if (sx.gradeDataTable.length >0){$('#tableOfficialNotesPopUp').DataTable().destroy();}
           $('#tableOfficialNotesPopUp tbody').empty(); 
               if(data.length>0) {$.each(data, function(a, e) {
                    var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                   // $('.iOption', c).append('<a target="_blank" href="'+BM.baseUri+"newstaff/#/event/binusfestival/konfigurasiSystem."+e.SystemID+'"class="icon icon-edit"  style="cursor:pointer;"></a>');
                    // var d = $('#formparticipant .custom-combobox').clone();
                    // $('#ddlPeriodPopUp', d).val(e.STRM);
                    // $('.iOfficialNotesID ', c).append(e.SystemID);
                    // $('.iPeriod ', c).append(d);
                    $('input.iChange',c).attr({
                            'data-binusfestivalattendanceid': e.BinusFestivalAttendanceID
                        });
                    $('.iSystem ',c).attr("data",e.SystemID);
                    $('.iSystem ', c).html(e.SystemName);
                    $('.iParticipantGroupName ', c).html(e.StudentParticipantGroupName);
                    $('.iTopic ', c).html(e.Topic);
                    $('.iEventType ', c).html(e.EventType);
                    $('.iDate ', c).html(e.Date);
                    $('.iTime ', c).html(e.Time);
                    $('.iRoom ', c).html(e.Room);
                    $('.iCampus ', c).html(e.Campus);
                    $('.iLecturerName ', c).html(e.LecturerName);
                    //$('.iStatus ', c).html((e.Status=="data has been conflicted ")?e.Status+" in "+e.kampus:e.Status);
                    $('#tableOfficialNotesPopUp tbody').append(c);
                   //  $('.iOption .icon-trash').click(function(e){
                   //      e.preventDefault();
                
                   // //      }
                   //      //$(this).closest('tr').remove();
                   //      if ($('tbody').find('.dataPopUp').length == 1)
                   //      {
                   //          $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                   //          $('.failed').show();
                   //      }
                   //      else if($(".iPeriod", $(this).closest("tr")).find('.txtPeriod').attr('kdPeriod') == null)
                   //      {
                   //          $(this).closest('tr').remove();
                   //      }
                   //  });
                     
                });}
                $('.dataPopUpLoading').remove();

                 sx.gradeDataTable = $('#tableOfficialNotesPopUp').DataTable({
                        scrollY:        "300px",
                        scrollX:        true,
                        scrollCollapse: true,
                        paging:         false,
                        fixedColumns:[{leftColumns : 1}]
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
        sx.loadInstitution();
        sx.loadReportType();
       // sx.loadNewInstructor();
        $('#btnGenerate').click(function () {
            var data = {};
                            data['STRM'] = $('#ddlPeriod').val();
                            data['Institution'] = $('#ddlAcademicInstitution').val();
                            data['Acad_Career'] = $('#ddlDegree').val();
                            data['Campus'] = $('#ddlCampus').val().join();
                            data['SystemID'] = $('#ddlSystemName').val();
                           
                var form = document.createElement("form");
            form.action = BM.serviceUri+'BifestController/ReportHandler/getBinusFestivalReportData';
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
    loadBindCmb: function(datas) {
        var sx = this;
        var requestFormData = {
            listField: ['TermbyCareer'],
            Acad_Career: $('#ddlPopupDegreeByID option:selected').val(),
            CAMPUS: $('#ddlPopupCampus option:selected').val(),
            ACAD_INSTITUTION: $('#ddlPopupAcademicInstitution option:selected').val(),
            ACAD_GROUP: $('#ddlPopupGroup option:selected').val()
        };
        BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/getFilterData",
            data: JSON.stringify(requestFormData),
            type: "POST",
            async: false,
            dataType: "json",
            success: function(data) {
                $('#ddlPopupPeriod').empty();
                var strm = data.TermbyCareer;
                $.each(strm, function(a, e) {
                    $('#ddlPopupPeriod').append("<option value='" + e.STRM + "'>" + e.DESCR + "</option>");
                });
                if (typeof datas != "undefined") {
                    $('#ddlPopupPeriod').val(data.STRM);
                }
                $('#ddlPopupPeriod').unbind().change(function() {
                    sx.loadBindCmbClass(datas);
                });
                $('#ddlPopupGroup').unbind().change(function() {
                    sx.loadBindCmbClass(datas);
                });
                $('#ddlPopupGroup').change();
                sx.refreshCombobox();
            }
        });
    },
    loadBindCmbClass: function(datas) {
        var sx = this;
        var requestFormData = {
            listField: ['ClassType'],
            Acad_Career: $('#ddlPopupDegreeByID option:selected').val(),
            CAMPUS: $('#ddlPopupCampus option:selected').val(),
            ACAD_INSTITUTION: $('#ddlPopupAcademicInstitution option:selected').val(),
            ACAD_GROUP: $('#ddlPopupGroup option:selected').val(),
            STRM: $('#ddlPopupPeriod option:selected').val()
        };
        BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/getFilterData",
            data: JSON.stringify(requestFormData),
            type: "POST",
            async: false,
            dataType: "json",
            success: function(data) {
                $('#ddlClassType').empty();
                var classType = data.ClassType;
                if (classType.length == 0) {
                    $('#ddlClassType').append("<option value=''>No data Available</option>");
                }
                $.each(classType, function(a, e) {
                    $('#ddlClassType').append("<option value='" + e.FIELDVALUE + "'>" + e.XLATLONGNAME + "</option>");
                });
                if (typeof datas != "undefined") {
                    console.log(datas);
                    $('#ddlClassType').val(datas.SSR_COMPONENT);
                }
                sx.refreshCombobox();
                $('#ddlClassType').unbind().change(function() {
                    sx.loadBindofBindCmb();

                });
                $('#ddlClassType').change();

            }
        });
    },
    loadData : function(param){}
};