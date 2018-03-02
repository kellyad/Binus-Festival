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
        $('#btnExport').click(function(event){
        sx.ExportToExcel();
        });
      
    },
    loadPeriod : function() {
        $("#ddlPeriod").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriod').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllSystemPeriod",
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
                   sx.loadCampus();
                });
               sx.loadCampus();
            }
        });
    },
    loadCampus : function() {
        $("#ddlCampus").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCampus').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getCampus",
            type: "POST",
            success: function(data){
                $('#loaderCampus').hide();
                $('#ddlCampus').empty();
                if(data.length) {
                        option = "<option value='"+""+"'>"+"ALL"+"</option>";
                        $("#ddlCampus").append(option);
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
            url : BM.serviceUri + "staff/HeadPrefect_Configuration/getSystemConfiguration",
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
        console.log("kis");
                   sx.loadInit();
                });
               sx.loadInit();
            }
        });
    },
    loadInit: function() {
        var sx = this; 
        
        //gradeDataTable = $('#tableOfficialNotesPopUp').dataTable();
       // if(gradeDataTable) gradeDataTable.destroy();
        $('#tableOfficialNotesPopUp').remove();
        var copy = $('#tableOfficialNotesPopUp_Copy').clone().removeAttr('id').css('display', '').attr('id','tableOfficialNotesPopUp');
       $('#tableOfficialNotesPopUp_wrapper').remove();
       $('#tableOfficialNotesPopUp_Copy').after(copy);
         $('#tableOfficialNotesPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                 $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
        
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getAllLecturerSchedule",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriod option:selected').val() , SystemID: $('#ddlSystemName option:selected').val(), Campus: $('#ddlCampus option:selected').val() }),
            beforeSend: function(){
                        $('.dataPopUp').remove();
            },
            success: function(data){
           if (sx.gradeDataTable.length >0){$('#tableOfficialNotesPopUp').dataTable().fnDestroy();sx.gradeDataTable="";}
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
             
                     
                });}
                $('.dataPopUpLoading').remove();

                 sx.gradeDataTable = $('#tableOfficialNotesPopUp').DataTable({
                        destroy:        true,
                        scrollY:        "300px",
                        scrollX:        true,
                        scrollCollapse: true,
                        paging:         false,
                        fixedColumns:[{leftColumns : 1}],
                       
                        "fnInitComplete": function() {
                        this.fnAdjustColumnSizing(true);
                        }
                     // paging      : false,
                     // ordering    : true,
                     // info        : false,
                     // scrollX     : false,
                     // bScrollCollapse: true,
                     // bFilter : true,
                     // order: []
                });
                // new $.fn.dataTable.FixedColumns(  sx.gradeDataTable , {"iLeftColumns": 1} );
           // new $.fn.dataTable.FixedColumns( sx.gradeDataTable  );
            }
        });
            $('#damnClick').click();
        $('#btnSearch').removeAttr("disabled");

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
        sx.loadPeriod();
        sx.loadNewInstructor();
        $('#btnSearch').click(function(){
            
        $('#btnSearch').attr("disabled","disabled");
            sx.loadInit();
        });
        $('#btnSave').click(function () {
            if($.inArray($('#txtNewInstructor').val(), listInstructor) < 0 && $('#txtNewInstructor').val()!="")
            {
                BM.message({
                    targetid : '#popup-message',
                    title : 'Error!',
                    message : 'Instructor does not exist',
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
                    message : 'Are you still want to change the Lecturer?',
                    width : '400px',
                    button : ['Yes','No']
                },
                function(result){
                    if (result == 'Yes') {
                        $.fancybox.close();
                        var $this = $(this),
                        checked = $('tr.dataPopUp input.iChange:checked'),
                        newInstructor = $('#txtNewInstructor').val().split(' - ')[0],
                       // reason = $('#txtReason').val(),
                        jsonArray = [],
                        dataset;

                        // Blank Validation
                  
                        // Loop through checked Instructor
                        for(var i = 0; i < checked.length; i++)
                        {
                            dataset = checked[i].dataset;

                            // Same Instructor Validation
                            if(newInstructor === dataset.userid)
                            {
                                alert('New Instructor cannot be same with Existing Instructor, please choose another instructor.');
                                return false;
                            }

                            jsonArray.push({
                                BinusFestivalAttendanceID: dataset.binusfestivalattendanceid,
                                // oldid: dataset.userid,
                                 newid: newInstructor
                                // typeid: dataset.typeid,
                               // reason: reason
                            });
                        }

                        BM.ajax({
                            url: BM.serviceUri + "BinusFestival/changeAllLecturerSchedule",
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
                                        message : 'Lecturer saved successfully!',
                                        width : '400px',
                                        button : ['OK']
                                    },
                                    function(result){
                                        if(result == "OK")
                                        {
                                            $.fancybox.close();
                                        } sx.loadInit();
                                            $('#txtNewInstructor').val('');
                                            $('#txtReason').val('');
                                    });
                                }
                                else if(data[0].Result == 2){
                                    var Join ='<table><th>SystemName</th><th>StudentParticipantGroupName</th><th>Topic</th><th>Date</th><th>Time</th><th>Room</th><th>Campus</th>';
                                    $.each(data, function(a, e) {
                                            Join+= '<tr><td>'+e.SystemName + '</td> <td>' + e.StudentParticipantGroupName + '</td> <td>' + e.Topic + '</td> <td>' + e.Date + '</td> <td>' + e.Time + '</td> <td>'+ e.Room + '</td> <td>' + e.Descr+'</tr>';
                                        })
                                    Join +='</table>'
                                    BM.message({
                                        targetid : '#popup-message',
                                        title : 'Conflict!',
                                        message : 'Lecturer has Conflicted with other LecturerSchedule!'+'</br>'+Join,
                                        width : '400px',
                                        button : ['OK']
                                    },
                                    function(result){
                                        if(result == "OK")
                                        {
                                            $.fancybox.close();
                                        }
                                            sx.loadInit();
                                            $('#txtNewInstructor').val('');
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
    ExportToExcel : function() {
        var sx = this;
        var data = {};
                            data['Main'] = "LecturerSchedule";
                            data['Period'] = $('#ddlPeriod option:selected').val();
                            data['Campus'] = $('#ddlCampus option:selected').val();
                            data['SystemID'] =  $('#ddlSystemName option:selected').val() ;
                           
                var form = document.createElement("form");
            form.action = BM.serviceUri+'BinusFestival/getExportData';
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