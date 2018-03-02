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
    loadAutoComplete: function()
    {
        psv= this;
               // var autoData = [];
                $("#txtParticipantName").BMautocomplete({
                    dataset: autoData
                });
    },
    onLoaded: function(arg) {
       psv = this;
            // BM.ajax({
            // url: BM.serviceUri + "loginAs/Student/getAutoCompleteNameBinusian",
            // type: "POST",
            // beforeSend: function() { $('#wait').show();},
            // complete: function() { $('#wait').hide(); },
            // success: function(data) {
            //     var autoData = [];
            //     for(var i = 0; i < data.length; i++) autoData.push(data[i].BINUSIANID.trim()+ ' - ' + data[i].BINUSIANNAME.trim());
            //     $("#txtParticipantName").BMautocomplete({
            //         dataset: autoData
            //     });
            // }
            //   });
            $("#txtParticipantName").BMautocomplete({
                    dataset: autoData
                });
            $(window).keydown(function(event){
                if(event.keyCode == 13) {
                  event.preventDefault();
                  return false;
                }
              });
            psv.init();
            var copy = $('#ddlCampus').clone().removeAttr('id').css('display', '').attr('id','ddlCampusPop');
           //$('#ddlCampus').remove();
           $('#ddlCampusPopUp').after(copy);
           $('#loaderCampusPopUp').hide();
            $("#ddlCampusPop").closest(".custom-combobox").find(".combobox-label").remove();
            $("#ddlCampusPop").closest(".custom-combobox").data("has-init","no").binus_combobox();
             
             $('#btnSave').click(function(){
                 BM.ajax({
                url: BM.serviceUri + "BinusFestival/insertParticipantData",
                type: "POST",
                data: JSON.stringify({
                        BinusianID:$('#txtParticipantName').val().split(' - ')[0],
                        Campus:$("#ddlCampusPop").val(),
                        Topic:$("#ddlTopicPop").val(),
                        Date:$("#ddlDatePop").val(),
                        Room:$(" #ddlRoomPop").val(),
                        Time:$(" #ddlTimePop").val()
                    }),
                beforeSend: function() { $('#submitLoading').show();},
                complete: function() { $('#submitLoading').hide(); },
                success: function(data) {
                   $(this).attr('disabled', false);
                    console.log(data[0]);
                    if(data[0].Result== "Success") {
                        BM.message({
                            targetid : '#popup-message',
                            title : 'Congratulations!',
                            message : 'Participant Schedule Assigned successfully!',
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
                    else if(data[0].Result == "Failed"){
                        var Join ='<table><th>SystemName</th><th>StudentParticipantGroupName</th><th>Topic</th><th>Date</th><th>Time</th><th>Room</th><th>Campus</th>';
                        $.each(data, function(a, e) {
                                Join+= '<tr><td>'+e.SystemName + '</td> <td>' + e.StudentParticipantGroupName + '</td> <td>' + e.Topic + '</td> <td>' + e.Date + '</td> <td>' + e.Time + '</td> <td>'+ e.Room + '</td> <td>' + e.Descr+'</tr>';
                            })
                        Join +='</table>'
                        BM.message({
                            targetid : '#popup-message',
                            title : 'Conflict!',
                            message : 'Student Schedule Conflict -'+$('#txtParticipantName').val().split(' - ')[0]+'!'+'</br>'+Join,
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
             });
            
             

       
    },
     init: function() {
         psv = this;
        //$(".datepicker" ).datepicker( {dateFormat: "yy-mm-dd"});
        psv.loadTopic();
        
        
    },
    loadTopic: function(){
         psv = this;
        for(i=0 ; i < tempTopicDetail.length ; i++){
                option = "<option value='"+tempTopicDetail[i].Topic+"'>"+tempTopicDetail[i].Topic+"</option>";
                $("#ddlTopicPop").append(option);
            }
           $('#loaderTopicPop').hide();
                $("#ddlTopicPop").closest(".custom-combobox").find(".combobox-label").remove();
                $(" #ddlTopicPop").closest(".custom-combobox").data("has-init","no").binus_combobox();
           $('#ddlTopicPop').change(function(){
                    psv.loadDate();
                });
           psv.loadDate();
    },
    loadDate: function(){
         psv = this;
               $('#loaderDatePop').show();
                $('#ddlDatePop').empty();
       for(i=0 ; i < tempDateDetail.length ; i++){
              if($("#ddlTopicPop").val() ==tempDateDetail[i].Topic ){
                option = "<option value='"+tempDateDetail[i].StartDate+"'>"+tempDateDetail[i].DateStart+"</option>";
                $("#ddlDatePop").append(option);
             }
            }
           $('#loaderDatePop').hide();
                $("#ddlDatePop").closest(".custom-combobox").find(".combobox-label").remove();
                $(" #ddlDatePop").closest(".custom-combobox").data("has-init","no").binus_combobox();
             $('#ddlAcademicInstitution').change(function(){
                    psv.loadRoom();
                });
             psv.loadRoom();
    },
    loadRoom: function(){
         psv = this;
               $('#loaderRoomPop').show();
                $('#ddlRoomPop').empty();
         for(i=0 ; i < tempRoomDetail.length ; i++){
              if($("#ddlTopicPop").val() ==tempRoomDetail[i].Topic && $("#ddlDatePop").val() ==tempRoomDetail[i].StartDate  ){
                option = "<option value='"+tempRoomDetail[i].Room+"'>"+tempRoomDetail[i].Room+"</option>";
                $("#ddlRoomPop").append(option);
             }
            }
           $('#loaderRoomPop').hide();
                $("#ddlRoomPop").closest(".custom-combobox").find(".combobox-label").remove();
                $(" #ddlRoomPop").closest(".custom-combobox").data("has-init","no").binus_combobox();
             $('#ddlRoomPop').change(function(){
                    psv.loadTime();
                }); 
             psv.loadTime();
    },
    loadTime: function(){
         psv = this;
               $('#loaderTimePop').show();
                $('#ddlTimePop').empty();
        for(i=0 ; i < tempTimeDetail.length ; i++){
              if($("#ddlTopicPop").val() ==tempTimeDetail[i].Topic && $("#ddlDatePop").val() ==tempTimeDetail[i].StartDate && $("#ddlRoomPop").val() ==tempTimeDetail[i].Room  ){
                option = "<option value='"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"'>"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"</option>";
                $("#ddlTimePop").append(option);
             }
            }
           $('#loaderTimePop').hide();
                $("#ddlTimePop").closest(".custom-combobox").find(".combobox-label").remove();
                $(" #ddlTimePop").closest(".custom-combobox").data("has-init","no").binus_combobox();
              $('#ddlTimePop').change(function(){
                    psv.loadCapacity();
                });      
                psv.loadCapacity();
    },
   loadCapacity : function() {
        psv = this;
    for(i=0 ; i < tempDetail.length ; i++){
        if($("#ddlTopicPop").val() ==tempDetail[i].Topic &&  $("#ddlDatePop").val() ==tempDetail[i].StartDate && $("#ddlRoomPop").val() ==tempDetail[i].Room && $("#ddlTimePop").val() ==(tempDetail[i].TimeStart +' - '+tempDetail[i].TimeEnd)){
           $('#AssignedCapacityPop ').html(tempDetail[i].Total +'/'+((tempDetail[i].Capacity=='-1')?'Infinite(-)':tempDetail[i].Capacity));
                     }
                        }
    }
};