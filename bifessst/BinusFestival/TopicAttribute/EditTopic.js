var psv;
var popupSubView = {
    title: '',
    time: [],
    name: [],
    data: [],
    flag: [false, false],
    success: 0,
    validate: function(type, data) {
        if (type == "hh") {
            return data <= 24 && data >= 0;
        } else if (type == "mm") {
            return data <= 59 && data >= 0;
        }
    },
    onLoaded: function() {
        psv= this;
        BM.ajax({
            url: BM.serviceUri + 'bifest/masterevent/getMasterEventType',
            type: 'post',
            data: JSON.stringify({
                INSTITUTION: "BNS01"
            }),
            success: function(data){
                $('#loaderEventType').hide();
                    $('#ddlEventType').empty();
                    data = data.data;
                    if(data.length>0) {
                        for(i=0 ; i < data.length ; i++){
                            option = "<option value='"+data[i].EventTypeId+"'>"+data[i].EventTypeName+"</option>";
                            $("#ddlEventType").append(option);
                        }
                    } else {
                        option = "<option value = ''>All</option>";
                        $("#ddlEventType").append(option);
                    }
                    $("#ddlEventType").closest(".custom-combobox").find(".combobox-label").remove();
                    $("#ddlEventType").closest(".custom-combobox").data("has-init","no").binus_combobox();
                    // $('#ddlEventType').closest('.custom-combobox').find('.combobox-label').html($('#ddlFaculty option[value='+datas[0].Include_ACAD_ORG+']').html());
                    // $("#ddlEventType").val(datas[0].Include_ACAD_ORG);
                   
            }
        });
         BM.ajax({
            url : BM.serviceUri + "BinusFestival/getAllRoom",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(data){
                $('#loaderRoom').hide();
                    $('#ddlRoom').empty();
                 if(data.length>0) {
                        for(i=0 ; i < data.length ; i++){
                            option = "<option value='"+data[i].FACILITY_ID+"'>"+data[i].LOCATION+" - "+data[i].CAMPUS+" - "+data[i].DESCR+"</option>";
                            $("#ddlRoom").append(option);

                        }
                        $("#ddlRoom").change(function(){
                               for(i=0 ; i < data.length ; i++){
                            if(data[i].FACILITY_ID == $("#ddlRoom").val()) {
                                if($("#RoomCapacity").html()!="Infinite(~)")
                                    {$("#RoomCapacity").html(data[i].ROOMDESCR);}
                            }

                        }
                             });
                    } else {
                        option = "<option value = ''>All</option>";
                        $("#ddlRoom").append(option);
                    }
            BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getAllTopicAttribute',
            type: 'post',
            data: JSON.stringify({
                Period: BM.filter.Period,
                TopicID: BM.filter.TopicID
            }),
            success: function(data){
                $(".txtTopic").val(data[0].Topic);
                $("#ddlEventType").val(data[0].EventTypeID);
                 $("#ddlEventType").closest("span.custom-combobox").children(".combobox-label").remove();
                $("#ddlEventType").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                $("#ddlEventType").trigger("change");
                 setTimeout(function(){
                     $('#TxtStartDate').datepicker('setDate',data[0].StartDate);
                //$('#TxtEndDate').datepicker('setDate',data[0].EndDate);
                    $("#ddlRoom").val(data[0].Room);
                     $("#ddlRoom").closest("span.custom-combobox").children(".combobox-label").remove();
                    $("#ddlRoom").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    $("#ddlRoom").trigger("change");
                }, 2000);
                 document.getElementsByClassName('hour')[0].value =new Date(data[0].StartTime).getHours();
                 document.getElementsByClassName('hour')[1].value =new Date(data[0].StartTime).getMinutes();
                 document.getElementsByClassName('hour')[2].value =new Date(data[0].EndTime).getHours();
                 document.getElementsByClassName('hour')[3].value =new Date(data[0].EndTime).getMinutes(); 
                $("#AssignedCapacity").html(data[0].CapacityFilled);
                $("#RoomCapacity").html((data[0].Capacity=="-1")? "Infinite(~)":data[0].Capacity);
                   
            }
        });
            $('#btnSave').show();
            }
        });
      
         
$('#btnSave').click(function(e) {
    var start = ("0" + $('.hour')[0].value.trim()).slice(-2) + ':' + ("0" + $('.hour')[1].value.trim()).slice(-2),
        end = ("0" + $('.hour')[2].value.trim()).slice(-2) + ':' + ("0" + $('.hour')[3].value.trim()).slice(-2);
    if ($('.txtTopic').val().trim() != '' ) {
            if($('#ddlRoom').val()!=''){
                if($('#ddlEventType').val()!=''){
            // if ($('#txtBinusian').val().split(' - ')[1] != undefined) {
                if (($('#TxtStartDate').val()!='') && $('#TxtStartDate').val()!='')  {
                    // JANGTONI20160307:FIX02 --BEGIN--
                     if ($('.hour')[0].value.trim() != '' && $('.hour')[1].value.trim() != '' && $('.hour')[2].value.trim() != '' && $('.hour')[3].value.trim() != '') {
                                if ($('.hour')[0].value.trim() < 24 && $('.hour')[1].value.trim() < 60 && $('.hour')[2].value.trim() < 24 && $('.hour')[3].value.trim() < 60) {
                                    
                                                     $(this).attr('disabled', 'disabled');
                                                    
                                                    BM.ajax({
                                                        url: BM.serviceUri + 'BinusFestival/CheckConflictedRoom',
                                                        type: 'POST',
                                                        data: JSON.stringify({
                                                            TopicID: BM.filter.TopicID,
                                                            STRM: BM.filter.Period,
                                                            Facility_ID : $("#ddlRoom").val(),
                                                            StartDate: $('#TxtStartDate').val(),
                                                            StartTime: '1970-01-01 ' + start,
                                                            EndTime: '1970-01-01 ' + end
                                                           
                                                        }),
                                                        beforeSend: function(){
                                                            $('#btnSave').css('opacity', 0);
                                                            $('#btnSave').before('<div style="float: right;"><span id="imgLoading2" class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span></div>');
                                                        },
                                                        success: function(result) {
                                                            if (result[0].Status == "Success") {
                                                                // $(document).ajaxStop(function() {
                                                                // $('#formAdd').empty().append('<h3>Success insert '+psv.success+' data</h3>');
                                                                BM.ajax({
                                                                    url: BM.serviceUri + 'BinusFestival/UpdateSchedule',
                                                                    type: 'POST',
                                                                    data: JSON.stringify({
                                                                        TopicID:BM.filter.TopicID,
                                                                        STRM: BM.filter.Period,
                                                                        Facility_ID : $("#ddlRoom").val(),
                                                                        Topic: $('.txtTopic').val(),
                                                                        StartDate: $('#TxtStartDate').val(),
                                                                        StartTime: '1970-01-01 ' + start,
                                                                        EndTime: '1970-01-01 ' + end,
                                                                        EventTypeID: $('#ddlEventType option:selected').val()
                                                                       
                                                                    }),
                                                                    beforeSend: function(){
                                                                        $('#btnSave').css('opacity', 0);
                                                                        $('#btnSave').before('<div style="float: right;"><span id="imgLoading2" class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span></div>');
                                                                    },
                                                                    success: function(data) {
                                                                        if (data[0].Status == "Success") {e.preventDefault();
                                                                            // $(document).ajaxStop(function() {
                                                                            // $('#formAdd').empty().append('<h3>Success insert '+psv.success+' data</h3>');
                                                                            alert("data saved");sx.loadInit();
                                                                            $.fancybox.close();

                                                                         $('#imgLoading2').remove();
                                                                         $('#btnSave').css('opacity', 1);
                                                                        }
                                                                        else if (data[0].Status == "failed"){
                                                                            sx.loadInit();
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            else if (result[0].Status == "failed"){
                                                                $('#PopupMessage').show();
                                                                $('#BeforePrev').hide();// sx.loadInit();
                                                                 $.each(result, function(a, e) {
                                                                    var c = $('#iTemplatePopUp').clone().removeAttr('id').css('display', '').addClass('dataSchedulePopUp');
                                                                    $('.iTopic', c).append(e.Topic);
                                                                    $('.iDate ', c).append(e.StartDate); 
                                                                    $('.iStartTime ', c).append(e.StartTime);
                                                                    $('.iEndTime ', c).append(e.EndTime);
                                                                    $('.iRoom ', c).append(e.Room);
                                                                    $('#tableFailed tbody').append(c);  
                                                                });
                                                                $('#btnYesPopup').click(function(){
                                                                
                                                                BM.ajax({
                                                                    url: BM.serviceUri + 'BinusFestival/UpdateSchedule',
                                                                    type: 'POST',
                                                                    data: JSON.stringify({
                                                                        TopicID:BM.filter.TopicID,
                                                                        STRM: BM.filter.Period,
                                                                        Facility_ID : $("#ddlRoom").val(),
                                                                        Topic: $('.txtTopic').val(),
                                                                        StartDate: $('#TxtStartDate').val(),
                                                                        StartTime: '1970-01-01 ' + start,
                                                                        EndTime: '1970-01-01 ' + end,
                                                                        EventTypeID: $('#ddlEventType option:selected').val()
                                                                       
                                                                    }),
                                                                    beforeSend: function(){
                                                                        $('#btnSave').css('opacity', 0);
                                                                        $('#btnSave').before('<div style="float: right;"><span id="imgLoading2" class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span></div>');
                                                                    },
                                                                    success: function(data) {
                                                                        if (data[0].Status == "Success") {
                                                                            // $(document).ajaxStop(function() {
                                                                            // $('#formAdd').empty().append('<h3>Success insert '+psv.success+' data</h3>');
                                                                            alert("data saved");sx.loadInit();
                                                                            $.fancybox.close();

                                                                         $('#imgLoading2').remove();
                                                                         $('#btnSave').css('opacity', 1);
                                                                        }
                                                                        else if (data[0].Status == "failed"){
                                                                           alert("data failed"); sx.loadInit();
                                                                        }

                                                                    $('#PopupMessage').hide();
                                                                    $('#BeforePrev').show();
                                                                    }
                                                                });
                                                            });
                                                                $('#btnNoPopup').click(function(){
                                                                     $('#PopupMessage').hide();
                                                                    $('#BeforePrev').show();
                                                                });
                                                            }
                                                        }
                                                    });
                                                  
                                          
                                } else alert('Wrong Time Format, Hour must less than 24 and Minute must less than 60');
                            } else alert('Time field must be filled');
                    } else alert('please filled Start Date and End Date');
                } else alert('Please select Event Type to be filled');
            } else alert('Please select Room to be filled');
        } else alert('please filled Topic Name');
});

// $('#btnPreview').click(function() {
//             var start = ("0" + $('.hour')[0].value.trim()).slice(-2) + ':' + ("0" + $('.hour')[1].value.trim()).slice(-2),
//                 end = ("0" + $('.hour')[2].value.trim()).slice(-2) + ':' + ("0" + $('.hour')[3].value.trim()).slice(-2);
//             if ($('.txtTopic').val().trim() != '' ) {
//                         if (($('#TxtStartDate').val()!='') && $('#TxtStartDate').val()!='')  {
//                             // JANGTONI20160307:FIX02 --BEGIN--
//                              if ($('.hour')[0].value.trim() != '' && $('.hour')[1].value.trim() != '' && $('.hour')[2].value.trim() != '' && $('.hour')[3].value.trim() != '') {
//                                         if ($('.hour')[0].value.trim() < 24 && $('.hour')[1].value.trim() < 60 && $('.hour')[2].value.trim() < 24 && $('.hour')[3].value.trim() < 60) {
//                                             if ($('.txtDuration').val()>0) {
//                                                 if ($('.txtPostDuration').val()>=0) {
//                                                     BM.ajax({
//                                                         url: BM.serviceUri + "BinusFestival/GetShiftPreview",
//                                                         data: JSON.stringify({'Topic': $('.txtTopic').val(),
//                                                         'StartDate' : $('#TxtStartDate').val(),
//                                                         'EndDate' : $('#TxtEndDate').val(),
//                                                         'StartTime' : start,
//                                                         'EndTime' : end,
//                                                         'ShiftDuration' :$('.txtDuration').val(),
//                                                         'PostDuration' : $('.txtPostDuration').val()
//                                                     }),
//                                                         type: "POST",
//                                                         async: false,
//                                                         dataType: "json",
//                                                         beforeSend: function() {
                                                           
//                                                             $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
//                                                             $('#loadingpopup').show();
//                                                         },
//                                                         success: function(result) {
//                                                         $("#PopupMessage").show();
//                                                                 $('#BeforePrev').hide();
//                                                         $.each(result, function(a, e) {
//                                                                 var c = $('#iTemplatePopUp').clone().removeAttr('id').css('display', '').addClass('dataSchedulePopUp');
//                                                                 $('.iTopic', c).append(e.Topic);
//                                                                 $('.iDate ', c).append(e.Date); 
//                                                                 $('.iStartTime ', c).append(e.StartTime);
//                                                                 $('.iEndTime ', c).append(e.EndTime);
//                                                                 $('.iDuration ', c).append(e.Duration);
//                                                                 $('#tablePreview tbody').append(c);  
//                                                             });    
//                                                         $('#btnClosePopup').click(function(){
//                                                                 $('#BeforePrev').show();
//                                                                 $("#PopupMessage").hide();
//                                                         });
//                                                         }
//                                                     });
//                                                 } else alert('Please Fill The Post Duration ');
//                                             } else alert('Please Fill The Duration ');
//                                         } else alert('Wrong Time Format, Hour must less than 24 and Minute must less than 60');
//                                     } else alert('Time field must be filled');
//                         } else alert('please filled Start Date and End Date');
//                 } else alert('please filled Topic Name');

//         });
    }
    // ,
    // loadRoom: function(){
    //     var psv = this;
    //     BM.ajax({
    //         url : BM.serviceUri + "BinusFestival/getAllRoom",
    //         type: "POST",
    //         data: JSON.stringify({
    //             Facility_ID: $('#ddlRoom').val()
    //             }),
    //         success: function(data){
    //             if(document.getElementsById('RoomCapacity').value =="Infinite(~)")
    //             $("#RoomCapacity").html(data[0].ROOM_CAPACITY);
                 
    //             }
    //         });

    // }
};