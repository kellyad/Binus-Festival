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
    onLoaded: function(arg) {
        $('#GroupName').html(BM.filter.ParticipantGroupName);
         BM.ajax({
            url : BM.serviceUri + "BifestController/ScheduleHandler/getGroupingConfiguration",
            type: "POST",
            data: JSON.stringify({
                    ParticipantGroupID:BM.filter.ParticipantGroupID,
                    Session:BM.filter.SessionID
                }),
            success: function(data){
                      if(data){
                        //data[0].GroupBy
                        $("input:radio[value='"+data[0].GroupBy+"']").prop('checked', true);
                        $("input:radio[value='"+((data[0].Capacity==0)?"Oracle":(data[0].Capacity==99999)?"Ignore":"Individu")+"']").prop('checked', true);
                        (data[0].EvenlyDivideByShift==1)? $('#Shift:checkbox').prop('checked', true):$('#Shift:checkbox').prop('checked', false);
                        (data[0].EvenlyDivideByDay==1)? $('#Day:checkbox').prop('checked', true):$('#Day:checkbox').prop('checked', false);
                        (data[0].EvenlyDivideByRoom==1)? $('#Room:checkbox').prop('checked', true):$('#Room:checkbox').prop('checked', false);
                        if(data[0].Capacity>0 && data[0].Capacity<99999){
                            $('#Individualnumber').val(data[0].Capacity);
                        }
                      }
                }
            });
        $('#btnGroupSubmit').click(function(){
            if($("input[type='radio'][name='Capacity']:checked").val()=="Individu" && $('#Individualnumber').val()==""){
                alert("Please filled capacity")
            }else{
            BM.ajax({
            url : BM.serviceUri + "BifestController/ScheduleHandler/saveGroupingConfiguration",
            type: "POST",
            data: JSON.stringify({
                    ParticipantGroupID:BM.filter.ParticipantGroupID,
                    Session:BM.filter.SessionID,
                    Capacity : ($("input[type='radio'][name='Capacity']:checked").val()=="Individu")? $('#Individualnumber').val():(($("input[type='radio'][name='Capacity']:checked").val()=="Ignore")?99999:0),
                    GroupBy : $("input[type='radio'][name='GroupBy']:checked").val(),
                    DivideByShift : $('#Shift:checkbox:checked').length,
                    DivideByDay : $('#Day:checkbox:checked').length,
                    DivideByRoom : $('#Room:checkbox:checked').length

                }),
            success: function(data){
                      if(data.Status="Success"){
                        alert("data Success");
                        $.fancybox.close();
                      }
                }
            });
        }
        });
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
                $('#ddlCampus').change(function(){
                    sx.loadFaculty();
                });
                sx.loadFaculty();
            }
        });
        psv = this;
        psv.Founded = false;
        var ajax;
        $('#room').text(sv.indexData[0]);
        $('#max').text('Max ' + sv.indexData[1]);
        var date = new Date(sv.date);
        date = ("0" + (date.getDate())).slice(-2) + ' - ' + ("0" + (date.getMonth() + 1)).slice(-2) + ' - ' + date.getFullYear();
        $('#date').text(date);

        // JANGTONI2016021501
        BM.ajax({
            url: BM.serviceUri + 'room/room/getCurrentUserID',
            type: 'POST',
            beforeSend: function(){
                $('#txtBinusian').attr('disabled', 'disabled');
            },
            success: function(d){
                console.log(d.length);
                if (d != null){
                    BM.ajax({
                        url: BM.serviceUri + 'room/room/getBinusIDDetail',
                        type: 'POST',
                        data: JSON.stringify({
                            BinusID: d.MyID,
                            SearchMode: 0       
                        }),
                        success: function(f){
                            $('#txtBinusian').removeAttr('disabled').val(d.MyID);
                            $('#lblName').html('<p>' + f[0].Name + '</p>');
                        }
                    });
                }
            }
        });
        // END HERE

        BM.ajax({
            url: BM.serviceUri + 'room/room/getEventList',
            type: "POST",
            beforeSend: function(data){
                $('#ddlEvent').append('<option value="">Loading...</option>');
            },
            success: function(data) {
                var listOptions = '';
                for (var i = 0; i < data.length; i++) {
                    if (i == 0){
                        listOptions += '<option value="' + data[i].CAMPUS_EVENT_NBR + '" selected="selected">' + data[i].DESCR + '</option>';
                    }else{
                        listOptions += '<option value="' + data[i].CAMPUS_EVENT_NBR + '">' + data[i].DESCR + '</option>';
                    }
                    //listOptions.push([data[i].DESCR, data[i].CAMPUS_EVENT_NBR])
                }
                $('#ddlEvent').children().remove();
                $('#ddlEvent').append(listOptions);
                $('#ddlEvent').siblings('.combobox-label').text($('#ddlEvent option:selected').text());
            }
        });

        /*BM.ajax({
            url:BM.serviceUri + 'room/room/getAcadCareer',
            success:function(data){
                $.each(data,function(k,v){
                    $('#ddlAcad').append('<option value="'+v.ACAD_CAREER+'">'+v.DESCR+'</option>');
                });
                
            }
        });*/

        BM.ajax({
            url: BM.serviceUri + 'room/room/getMeetingType',
            type: "POST",
            beforeSend: function(){
                $('#ddlRoomUsage').append('<option value="">Loading...</option>');
            },
            success: function(data) {
                var listOptions = '';
                for (var i = 0; i < data.length; i++) {
                    // $('#ddlRoomUsage').append('<option value="'+data[i].CAMPUS_MTG_TYPE+'">'+data[i].CAMPUS_MTG_TYPE_DESCR+'</option>');
                    //listOptions.push([data[i].CAMPUS_MTG_TYPE_DESCR, data[i].CAMPUS_MTG_TYPE]);
                    if (i == 0){
                        listOptions += '<option value="' + data[i].CAMPUS_MTG_TYPE + '" selected="selected">' + data[i].CAMPUS_MTG_TYPE_DESCR + '</option>';
                    }else{
                        listOptions += '<option value="' + data[i].CAMPUS_MTG_TYPE + '">' + data[i].CAMPUS_MTG_TYPE_DESCR + '</option>';
                    }
                }
                $('#ddlRoomUsage').children().remove();
                //$('#ddlRoomUsage').empty();
                $('#ddlRoomUsage').append(listOptions);
                $('#ddlRoomUsage').siblings('.combobox-label').text($('#ddlRoomUsage option:selected').text());
            }
        });
                
        /* FC: JANGTONI201601105 by Jeffry Angtoni on January 11, 2016
        /*BM.ajax({
            url: BM.serviceUri + 'room/room/getLayout',
            type: 'POST',
            success: function(data) {
                $('#LoadingLayout').remove();
                for (i = 0; i < data.length; i++) {
                    var e = $('#iRadioTemplate').clone().removeAttr('id').removeClass('looptemplate');
                    $('.iRadio', e).val(data[i].RESOURCE_CD);
                    (i == 0) ? $('.iRadio', e).attr('checked', 'checked') : false;
                    $('.iImage', e).html('<img width="30%" src="images/' + data[i].RoomLayoutPath + '">');
                    $('.iName', e).html(data[i].DESCR);
                    $('#iRadioTemplate').before(e);
                }
            }
        });*/
        BM.ajax({
            url: BM.serviceUri + 'room/room/getBookedShiftByRoom',
            type: 'POST',
            data: JSON.stringify({
                Location: sv.location,
                Date: sv.date,
                Room: sv.room
            }),
            success: function(shift) {
                //console.log('shift: ' + shift);
                var book = [];
                var book2 = [];
                BM.ajax({
                    url: BM.serviceUri + 'room/room/getBookingShift',
                    type: 'POST',
                    data: JSON.stringify({
                        Location: sv.location
                    }),
                    success: function(data) {
                        console.log('data: ' + data);
                        BM.ajax({
                            url: BM.serviceUri + 'room/room/getBookedRoom2',
                            type: 'POST',
                            data: JSON.stringify({
                                Location: sv.location,
                                Date: sv.date,
                                Room: sv.room
                            }),
                            success: function(shift2) {
                                //console.log('shift2: ' + shift2);
                                for (var i = 0; i < data.length; i++) {
                                    book.push(data[i].StartTime.substring(0, 5));
                                    book2.push(data[i].EndTime.substring(0, 5));
                                }
                                // console.log(book);
                                // console.log(shift);
                                // for (var i = 1; i < data.length; i++) {
                                //  //var index = $.inArray(shift[i].MEETING_TIME_START.substring(0, 5), book);
                                //  for (var j = 0; j < shift2.length; j++) {
                                //      if (data[i - 1].StartTime.substring(0, 5) <= shift2[j].MEETING_TIME_START.substring(11, 16) && shift2[j].MEETING_TIME_START.substring(11, 16) < data[i].StartTime.substring(0, 5)) book[i - 1] = 0;
                                //  }
                                //  for (var j = 0; j < shift.length; j++) {
                                //      if (data[i - 1].StartTime.substring(0, 5) <= shift[j].MEETING_TIME_START.substring(0, 5) && shift[j].MEETING_TIME_START.substring(0, 5) < data[i].StartTime.substring(0, 5)) book[i - 1] = 0;
                                //  }
                                // }
                                // for (var i = 0; i < data.length - 1; i++) {
                                //  for (var j = 0; j < shift2.length; j++) {
                                //      if (data[i].EndTime.substring(0, 5) <= shift2[j].MEETING_TIME_END.substring(11, 16) && shift2[j].MEETING_TIME_END.substring(11,16) < data[i + 1].EndTime.substring(0, 5)) book2[i ] = 0;
                                //  }
                                //  //var index = $.inArray(shift[i].MEETING_TIME_START.substring(0, 5), book);
                                //  for (var j = 0; j < shift.length; j++) {
                                //      if (data[i].EndTime.substring(0, 5) <= shift[j].MEETING_TIME_END.substring(0, 5) && shift[j].MEETING_TIME_END.substring(0, 5) < data[i + 1].EndTime.substring(0, 5)) book2[i ] = 0;
                                //  }
                                // }
                                for (var i = 0; i < shift.length; i++) {
                                    for (var j = shift[i].SHIFT_START - 1; j < shift[i].SHIFT_END; j++) {
                                        book[j] = 0;
                                        book2[j] = 0;
                                    }
                                }
                                for (var i = 0; i < shift2.length; i++) {
                                    for (var j = shift2[i].SHIFT_START - 1; j < shift2[i].SHIFT_END; j++) {
                                        book[j] = 0;
                                        book2[j] = 0;
                                    }
                                }
                                // $('#time').children().remove();      
                                // for(var i=0;i<book.length;i++){
                                //  if(book[i]!==0)
                                //      $('#time').append('<div style="display:inline-flex;">'+
                                //                              '<span class="custom-checkbox">'+
                                //                              '<input type="checkbox" class="checkbox" id="checkbox'+i+'" value="'+data[i].StartTime.substr(0,5)+' - '+data[i].EndTime.substr(0,5)+'" ></span>'+
                                //                              '<label for="checkbox'+i+'" class="inline">'+data[i].StartTime.substr(0,5)+' - '+data[i].EndTime.substr(0,5)+'</label>'+       
                                //                              '</div><br>');
                                // }
                                //console.log('book: ' + book);
                                //console.log('book2: ' + book2);
                                $('#time').children().remove();
                                var indexStart, indexEnd;
                                // $('#time').html('<table style="width:200px"><thead><th >Available Shift</th></thead><tbody id="bodyShift"></tbody></table>');
                                for (var i = sv.index; i >= 0; i--) {
                                    if (book[i] == 0) {
                                        indexStart = i + 1;
                                        break;
                                    } else indexStart = 0;
                                }
                                for (var i = sv.index; i < book2.length; i++) {
                                    if (book2[i] == 0) {
                                        indexEnd = i;
                                        break;
                                    } else indexEnd = book.length;
                                }
                                for (var i = indexStart; i < indexEnd; i++) {
                                    if (book[i] !== 0) {
                                        if (psv.time[0] == null) psv.time[0] = data[i].StartTime.substr(0, 5);
                                        psv.data.push(data[i]);
                                        $('#bodyShift').append('<tr><td>' + data[i].StartTime.substr(0, 5) + ' - ' + data[i].EndTime.substr(0, 5) + '</td></tr>');
                                        psv.time[1] = data[i].EndTime.substr(0, 5);
                                    } else if (book[i] == 0) break;
                                }
                                $('#time').html('<input type="text" class="hour" maxlength=2 style="width:40px;margin-right:5px"> : <input type="text" maxlength=2 class="hour" style="width:40px;margin:0px 5px"> - <input type="text" class="hour" maxlength=2 style="width:40px;margin:0px 5px"> : <input type="text" class="hour" maxlength=2 style="width:40px;margin:0px 5px">');
                                $('#time').css('margin-top','15px');
                                $(".hour").css('height', '25px');
                                $(".hour").keydown(function(e) {
                                    // Allow: backspace, delete, tab, escape, enter and .
                                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                                        // Allow: Ctrl+A
                                        (e.keyCode == 65 && e.ctrlKey === true) ||
                                        // Allow: home, end, left, right
                                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                                        // let it happen, don't do anything
                                        return;
                                    }
                                    // Ensure that it is a number and stop the keypress
                                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                                        e.preventDefault();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        // $(".custom-radio").children().fancyfields();
        
        // Commented on January 18, 2016
        // FC: KOMENG:2016011800-JANGTONI
        //$("#ddlRole").closest('p').after("<p id='acad'></p>");

        // START COMMENT HERE
        /*
        ajax = BM.ajax({
            url: BM.serviceUri + 'room/room/getAllName',
         
            type: 'POST',
            success: function(data) {
                var listOptions = [];
                for (i = 0; i < data.length; i++) {
                    listOptions.push(data[i].BinusID + ' - ' + data[i].Name);
                }
                $('#txtBinusian').removeAttr('disabled');
                $('#txtBinusian').val('');
                $('#txtBinusian').BMautocomplete({
                    dataset: listOptions
                });
                $('#txtBinusian').css('margin-left', '-1px');
                $('.autocomplete-list').css('position', 'inherit');
                $('.autocomplete-list').width('100%');
            }
        });
        $('#acad').append('<p id="txtBinusianID"><label>BinusianID - Name</label><input type="text" id="txtBinusian" value="loading..." disabled="disabled">');
        $("#ddlRole").change(function() {
            var value = $("#ddlRole").val();
            if (value == 2) {
                if ($('#acad').length > 0) {
                    $('#acad').remove();
                    $('#txtBinusianID').remove();
                }
                $("#ddlRole").closest('p').after("<p id='acad'><label>ACAD CAREER</label><span class='custom-combobox'><select id='ddlAcad' name='Acad'>" + "<option value'RS1'>RS1</option>" + "<option value'RS2'>RS2</option>" + "<option value'RS3'>RS3</option>" + "<option value'IS1'>IS1</option>" + "<option value'BBS'>BBS</option>" + "<option value'OS1'>OS1</option>" + "<option value'OS2'>OS2</option>" + "<option value'IF1'>IF1</option>" + "<option value'ND1'>ND1</option>" + "</select></span></p>");
                $('#ddlAcad').parent().data('has-init','no').binus_combobox();
                $('#acad').after('<p id="txtBinusianID"><label>BinusianID - Name</label><input type="text" id="txtBinusian" value="loading..." disabled="disabled"></p>');
                if (ajax) {
                    ajax.abort();
                }
                ajax = BM.ajax({
                    url: BM.serviceUri + 'room/room/getStudentName',
                    data: JSON.stringify({
                        AcadCareer: $("#ddlAcad").val()
                    }),
                    type: 'POST',
                    success: function(data) {
                        var listOptions = [];
                        for (i = 0; i < data.length; i++) {
                            listOptions.push(data[i].BINUSIANID + ' - ' + data[i].NAME);
                        }
                        $('#txtBinusian').removeAttr('disabled');
                        $('#txtBinusian').val('');
                        $('#txtBinusian').BMautocomplete({
                            dataset: listOptions
                        });
                    }
                });
                $("#ddlAcad").change(function() {
                    if ($('#txtBinusianID').length === 0) $('#acad').after('<p><label>BinusianID - Name</label><input type="text" id="txtBinusian" value="loading..." disabled="disabled"></p>');
                    else {
                        // $('#txtBinusian').remove();
                        $('#txtBinusianID').remove();
                        $('#acad').after('<p id="txtBinusianID"><label>BinusianID - Name</label><input type="text" id="txtBinusian" value="loading..." disabled="disabled"></p>');
                    }
                    if (ajax) {
                        ajax.abort();
                    }
                    ajax = BM.ajax({
                        url: BM.serviceUri + 'room/room/getStudentName',
                        data: JSON.stringify({
                            AcadCareer: $("#ddlAcad").val()
                        }),
                        type: 'POST',
                        success: function(data) {
                            var listOptions = [];
                            for (i = 0; i < data.length; i++) {
                                listOptions.push(data[i].BINUSIANID + ' - ' + data[i].NAME);
                            }
                            $('#txtBinusian').removeAttr('disabled');
                            $('#txtBinusian').val('');
                            $('#txtBinusian').BMautocomplete({
                                dataset: listOptions
                            });
                        }
                    });
                });
            } else {
                if ($('#acad').length > 0) {
                    $('#acad').remove();
                    $('#txtBinusianID').remove();
                }
                if (ajax) {
                    ajax.abort();
                }
                $("#ddlRole").closest('p').after("<p id='acad'></p>");
                $('#acad').after('<p id="txtBinusianID"><label>BinusianID - Name</label><input type="text" id="txtBinusian" value="loading..." disabled="disabled"></p>');
                ajax = BM.ajax({
                    url: BM.serviceUri + 'room/room/getLecturerAndStaffName',
                    type: 'POST',
                    data:JSON.stringify({
                        type:$("#ddlRole").val()
                    }),
                    success: function(data) {
                        var listOptions = [];
                        for (i = 0; i < data.length; i++) {
                            listOptions.push(data[i].BinusID + ' - ' + data[i].Name);
                        }
                        $('#txtBinusian').removeAttr('disabled');
                        $('#txtBinusian').val('');
                        $('#txtBinusian').BMautocomplete({
                            dataset: listOptions
                        });
                    }
                });
            }
        });
        /** END Command Here **/
 
        /* FC : KOMENG:2016011801-JANGTONI
        /*$("#ddlRole").change(function() {
            var value = $("#ddlRole").val();
            if(value ==2){
               $('#acadCareer').show();
            }else{
                $('#acadCareer').hide();
            }
        });
        /*
         */
        $('#btnSearchID').on('click', function(e){
            var backName = $('#txtBinusian').val();         
            // FC: JANGTONI2016011801-JANGTONI
            var alphaNum = /^([A-Za-z\.\,\ ]+)$/;
            // FIX: JANGTONI2016021001
            var numeric = /^([0-9]+|BN([0-9]+)|bn([0-9]+))$/;
            
            /*if (alphaNum.test($('#txtBinusian').val())){
                // do with name
                if ($('#txtBinusian').val().length >= 3){
                    BM.ajax({
                        url: BM.serviceUri + 'room/room/getBinusIDDetailByName',
                        type: 'POST',
                        data: JSON.stringify({
                            keyword: $('#txtBinusian').val(),
                            SearchMode: 1
                        }),
                        beforeSend: function(){
                            $('#txtBinusian').attr('disabled', 'disabled');
                        },
                        success: function(data){
                            if (data.length > 0){
                                var listOptions = [];
                                for(var i=0; i<data.length; i++){
                                    listOptions.push(data[i].BinusID + ' - ' + data[i].Name);
                                }
                                $('#txtBinusian').removeAttr('disabled');
                                $('#txtBinusian').val('');
                                $('#txtBinusian').BMautocomplete({
                                    dataset: listOptions;
                                });
                                /*$('#txtBinusian').autocomplete({
                                    source: data,
                                    select: function(e,d){
                                        $('#lblName').html('<p>' + d.item.Name + '</p>');
                                        $(this).val(d.item.BinusID);
                                        return false;
                                    }
                                });
                                $('#txtBinusian').autocomplete('enable');*//*
                                $('#txtBinusian').css('margin-left', '-1px');
                                $('.autocomplete-list').css('position', 'inherit');
                                $('.autocomplete-list').width('100%');
                                psv.Founded = true;
                            }else{
                                $('#txtBinusian').removeAttr('disabled');
                                $('#lblName').html('<p>No Person with name : ' + backName + '/' + $('#txtBinusian').val() +'</p>');
                                psv.Founded = false;
                            }
                        }
                    });
                    return;
                }else{
                    alert('Please insert at lease three characters!');
                    return;
                }
            }*/

            if (numeric.test($('#txtBinusian').val())){
                // do with num
                if ($('#txtBinusian').val().length >= 10){
                    BM.ajax({
                        url: BM.serviceUri + 'room/room/getBinusIDDetail',
                        type: 'POST',
                        data: JSON.stringify({
                            BinusID: $('#txtBinusian').val(),
                            SearchMode: 1       // Initialize Searching Mode, using like '%%' in query
                        }),
                        beforeSend: function(){
                            $('#txtBinusian').attr('disabled', 'disabled');
                        },
                        success: function(data){
                            if (data.length > 0){
                                $('#txtBinusian').removeAttr('disabled');
                                $('#lblName').html('<p>' + data[0].Name + '</p>');
                                psv.Founded = true;
                            }else{
                                $('#txtBinusian').removeAttr('disabled');
                                $('#lblName').html('<p>No person with BinusID : ' + $('#txtBinusian').val() + '</p>');
                                psv.Founded = false;
                            }
                        },
                        error: function(){
                            psv.Founded = false;
                            alert('Error fetching data from server');
                            return;
                        }
                    });
                }else{
                    alert('Please insert full Binusian ID!');
                    return;
                }
                return;
            // Uncomment below code if only use BinusianID
            }else{
                alert('Please insert valid Binusian ID!');
                return;
            }
            /*BM.ajax({
                url:BM.serviceUri+'room/room/getName',
                type:'POST',
                data:JSON.stringify({
                    Role:$("#ddlRole").val(),
                    ACAD:$('#ddlAcad').val(),
                    BinusID:$('#txtBinusian').val()
                }),
                success:function(data){
                    if(data.length>0)
                        $('#lblName').text(' - '+data[0].Name);
                }
            });*/
        });

        $('#btnSubmit').click(function() {
            psv.flag[0] = false;
            psv.flag[1] = false;
            var start = ("0" + $('.hour')[0].value.trim()).slice(-2) + ':' + ("0" + $('.hour')[1].value.trim()).slice(-2),
                end = ("0" + $('.hour')[2].value.trim()).slice(-2) + ':' + ("0" + $('.hour')[3].value.trim()).slice(-2);
            for (var i = 0; i < psv.data.length; i++) {
                if (i + 1 < psv.data.length) {
                    if (start >= psv.data[i].StartTime.substring(0, 5) && start < psv.data[i + 1].StartTime.substring(0, 5) && start < psv.data[i].EndTime.substring(0, 5)) {
                        psv.flag[0] = true;
                        break;
                    }
                } else {
                    if (start >= psv.data[i].StartTime.substring(0, 5) && start < psv.data[i].EndTime.substring(0, 5) && start < psv.data[i].EndTime.substring(0, 5)) {
                        psv.flag[0] = true;
                        break;
                    }
                }
            }
            for (var i = 0; i < psv.data.length; i++) {
                if (i + 1 < psv.data.length) {
                    if (end <= psv.data[i].EndTime.substring(0, 5) && end < psv.data[i + 1].StartTime.substring(0, 5) && end > psv.data[i].StartTime.substring(0, 5)) {
                        psv.flag[1] = true;
                        break;
                    }
                } else {
                    if (end <= psv.data[i].EndTime.substring(0, 5) && end > psv.data[i].StartTime.substring(0, 5)) {
                        psv.flag[1] = true;
                        break;
                    }
                }
            }
            if (sv.indexData[1] > 0) {
                // JANGTONI2016011803
                if ($('#txtBinusian').val().trim() !== '' && (psv.Founded !== 'undefined' || psv.Founded != false)) {
                    if($('#lblName').text().length>0){
                    // if ($('#txtBinusian').val().split(' - ')[1] != undefined) {
                        if ($.isNumeric($('#txtTelephone').val()) && $('#txtTelephone').val() != '') {
                            // JANGTONI20160307:FIX02 --BEGIN--
                            if ($('#txtDescription').val() != "" && $('#txtDescription').val().length > 0){
                                if (parseInt($('#txtPerson').val()) <= parseInt(sv.indexData[1]) && parseInt($('#txtPerson').val()) >= 0) {
                                    if ($('.hour')[0].value.trim() != '' && $('.hour')[1].value.trim() != '' && $('.hour')[2].value.trim() != '' && $('.hour')[3].value.trim() != '') {
                                        if ($('.hour')[0].value.trim() < 24 && $('.hour')[1].value.trim() < 60 && $('.hour')[2].value.trim() < 24 && $('.hour')[3].value.trim() < 60) {
                                            if (start >= psv.time[0] && start < psv.time[1]) {
                                                if (end > psv.time[0] && end <= psv.time[1]) {
                                                    if (psv.flag[0] && psv.flag[1]) {
                                                        if (start < end) {
                                                            //console.log($('#ddlEvent').val() + ' ' + $('#ddlRoomUsage').val()); return;
                                                            $(this).attr('disabled', 'disabled');
                                                            BM.ajax({
                                                                url: BM.serviceUri + 'room/room/insertRoomBookingTransaction',
                                                                type: 'POST',
                                                                data: JSON.stringify({
                                                                    FacilityID: sv.facilityid,
                                                                    MTGTYPE: $('#ddlRoomUsage').val(),
                                                                    MTGDATE: sv.date,
                                                                    StartTime: '1970-01-01 ' + start,
                                                                    EndTime: '1970-01-01 ' + end,
                                                                    Attendee: $('#txtPerson').val(),
                                                                    EventID: $('#ddlEvent').val(),
                                                                    BinusID: $('#txtBinusian').val().toUpperCase(),
                                                                    Notes: $('#txtNotes').val(),
                                                                    Description: $('#txtDescription').val(),
                                                                    Telephone: $('#txtTelephone').val(),
                                                                    Location: sv.location,
                                                                    Room: sv.room,  // added by Jeffry Angtoni on January 11, 2016
                                                                    LayoutID: '' //$('input[name=RoomLayout]:checked').val()
                                                                    //,   FC: JANGTONI201601106
                                                                }),
                                                                beforeSend: function(){
                                                                    $('#btnSubmit').css('opacity', 0);
                                                                    $('#btnSubmit').before('<div style="float: right;"><span id="imgLoading2" class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span></div>');
                                                                },
                                                                success: function(data) {
                                                                    if (data.return == '1') {
                                                                        // $(document).ajaxStop(function() {
                                                                        // $('#formAdd').empty().append('<h3>Success insert '+psv.success+' data</h3>');
                                                                        sv.loadTable();
                                                                        $.fancybox.close();
                                                                        // JANGTONI:1Cls8XOTzbZknkyJIAbroe3uZ2HHgPro 
                                                                        $.fancybox({
                                                                            content: $('#successWrap'),
                                                                            width: 500
                                                                        });
                                                                        // EOF::JANGTONI:1Cls8XOTzbZknkyJIAbroe3uZ2HHgPro 
                                                                        // });
                                                                    // FC: JANGTONI2016011501
                                                                    } else if (data.return == '2') {
                                                                        $('#failWrap').html('<h2 class="heading" style="margin:0px;">Failed</h3><p><span class="loader failed"><span class="indicator"></span><span class="progress-text">Others data with same date and time between this room time has been inserted into database.</span></span></p>');
                                                                        $.fancybox({
                                                                            content: $('#failWrap')
                                                                        });
                                                                    } else {
                                                                        //alert('Invalid Binusian ID');
                                                                        $.fancybox({
                                                                            content: $('#failWrap')
                                                                        });
                                                                    }
                                                                    $(this).removeAttr('disabled');
                                                                    $('#imgLoading2').remove();
                                                                    $('#btnSubmit').css('opacity', 1);
                                                                }
                                                            });
                                                        } else alert('Start Time must before End Time');
                                                    } else alert('Invalid Time');
                                                } else alert('End Time must between ' + psv.time[0] + ' and ' + psv.time[1]);
                                            } else alert('Start Time must between ' + psv.time[0] + ' and ' + psv.time[1]);
                                        } else alert('Wrong Time Format, Hour must less than 24 and Minute must less than 60');
                                    } else alert('Time field must be filled');
                                } else alert('total of person must less then or equals with max and more than 0');
                            } else alert('Description field must be filled!'); // -- END -- JANGTONI20160307:FIX02
                        } else alert('please filled Telephone field or Telephone is not number');
                    } else alert('Please select BINUSIANID - Name from autocomplete');
                } else alert('please filled BINUSIANID - Name field');
            } else alert('Room with 0 room capacity cannot be booked');
        });
        // $('#txtBinusian').val().split(' - ');
    }
};