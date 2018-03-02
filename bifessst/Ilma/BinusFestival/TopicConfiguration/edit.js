var psv, option, Institution, Campus, Acad_Career, STRM, BinusianID, LecturerID, Lecturer;
var prms = '';
var popupSubView = {
    title: 'Edit Topic Attribute',
    onLoaded : function(arg)
    {
        var psv = this;
        prms = BM.popupparam;
        psv.init();
    },
    init: function () {
        var psv = this;
        $('#txtDate').datepicker({
            defaultDate: new Date(prms.Date)
        });
        $('#txtDate').val(prms.Date);
        $('#txtTopic').val(prms.Topic);
        $('#txtStartTime').val(prms.StartTime);
        $('#txtEndTime').val(prms.EndTime);
        $('#oldRoom').text(prms.Room);

        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getEventTypes',
            type: 'GET',
            success: function (data) {
                for(var i=0 ; i < data.length ; i++) {
                    option = "<option value='"+ data[i].EvenTypeId+"'>" + data[i].EventType +"</option>";
                    $("#ddlEventType").append(option);
                    $("#ddlEventType option:selected").val(prms.Event);
                }
            }
        });

        $(document).unbind().on('click', '#btnSubmit', function() {
            psv.saveData();
        });

    },
    saveData: function() {
        var psv = this;
        var filterData = {
            MsPublishSystemId: prms.ID,
            Topic: $('#txtTopic').val(),
            EventType: $("#ddlEventType").val(),
            Date: $('#txtDate').val(),
            StartTime: $('#txtStartTime').val(),
            EndTime: $('#txtEndTime').val(),
            Room: $('#txtRoom').val()
        };
        $("#btnSubmit").hide();
        $("#btnSubmit").before('<div style="text-align:center;margin-top:5%;list-style:none;" class="iAssignmentLoading iLoading"><img alt=""></img></div>');
        $('.iLoading').html($('<img alt="" />').attr('src', BM.baseUri + 'lecturer/images/loading.gif'));

        
        BM.ajax({
            type: 'post',
            url: BM.serviceUri + 'BinusFestival/EditTopicAttribute',
            data: JSON.stringify(filterData),
            success : function(data) {
                if (data.status == "success") {
                    $(".iAssignmentLoading").remove();
                    $("#btnSubmitMaterial").show();
                    alert("Edit Success!");
                    $.fancybox.close();
                    psv.parent.loadTable();
                }
            }
        });
    }
};