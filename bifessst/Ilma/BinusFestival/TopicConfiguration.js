var toAppend;
var subView = {
    title: 'Topic Configuration',
    rel: 'content',
    onLoaded: function() {
        sv = this;
        sv.init();
        $(".breadcrumb ul").append('<li>Binus Festival</li>');
        $(".breadcrumb ul").append('<li>Topic Configuration</li>');
        $(".page-heading h1").html('Other Configuration');
        window.document.title = this.title;
    },
    init: function() {
        window.document.title = sv.title;
        $('#contentTableDetail').hide();
        sv.loadTerm();
        sv.loadCampus();
        sv.loadTable();
        $("#btnSearch").click(function(e) {
            sv.loadTable();
        });
    },
    loadTerm: function(){
        $("#ddlTerm").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderTerm').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getTermPeriodNoCompact",
            type: "POST",
            success: function(data){
                //console.log(data);
                $('#loaderTerm').hide();
                $("#ddlTerm").empty();
                for(i=0 ; i < data.length ; i++){
                    var item = data[i];
                    $("#ddlTerm").append("<option value='"+item.STRM+"'>"+item.DESCR+"</option>");
                }

                $("#ddlTerm").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlTerm").closest(".custom-combobox").data("has-init","no").binus_combobox();
            }
        });
    },
    loadCampus: function(){
        $("#ddlCampus").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCampus').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getCampus",
            type: "POST",
            datatype: "json",

            success: function(data){
                $('#loaderCampus').hide();
                $("#ddlCampus").empty();
                for(i=0 ; i < data.length ; i++){

                    option = "<option value='" + data[i].CAMPUS + "'>" + data[i].DESCR + "</option>";
                    $("#ddlCampus").append(option);
                }

                $("#ddlCampus").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlCampus").closest(".custom-combobox").data("has-init","no").binus_combobox();

                
            }
        });
    },
    loadTable: function() {
        $("#loaderTableDetail").css("display", "block");
        var filterData = {
            STRM: $('#ddlTerm').val(),
            KdKampus: $('#ddlCampus').val()
        };

        console.log(filterData);

        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getTopicConfiguration',
            type: 'POST',
            dataType: 'json',
            yourContententType: 'application/json;charset=utf-8',
            beforeSend: function () {
                $('table#tblDetail').closest('.freeze-pane').hide();
                if ($.fn.dataTable.isDataTable('table#tblDetail')) {
                    $('table#tblDetail').DataTable().destroy();
                } 
                $('.cTemplate').remove();
                $('#contentTableDetail').hide();
                $('#loaderTableDetail').show();
            },
            data: JSON.stringify(filterData),
            success: function (data) {

                if (data.length > 0) {
                    $('#contentTableDetail').show();
                    $('#loaderTableDetail').hide();

                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var e = $('table#tblTemplateDetail').find('tr.looptemplate').clone().removeClass('looptemplate').addClass('cTemplate').css('display', '');
                        $(".iSystemName", e).text(item.SystemName);
                        $(".iGroupName", e).text(item.StudentParticipantGroupName);
                        $(".iTopic", e).text(item.Topic);
                        $(".iType", e).text(item.EventType);
                        $(".iDate", e).text(item.Date);
                        $(".iStartTime", e).text(item.StartTime);
                        $(".iEndTime", e).text(item.EndTime);
                        $(".iDuration", e).text(item.ShiftDuration + " Minutes");
                        $(".iRoom", e).text(item.Room);
                        $(".iAction", e).html(
                                '<a><p class="icon icon-edit iEdit fancybox.ajax" style="cursor:pointer;" myID="' + item.MsPublishSystemID + '"  Event="' + item.EventTypeId + '"></p></a>'
                                );
                        $('#tblDetail').find('tbody').append(e);

                        var sv = this;
                        $('.iEdit').unbind().click(function (e)
                        {
                            e.preventDefault();
                            var myID = $(this).attr('myID');
                            var eventID = $(this).attr('Event');
                            var Topic = $(this).closest('tr').find('.iTopic').text();
                            var CurrRoom = $(this).closest('tr').find('.iRoom').text();
                            var StartTime = $(this).closest('tr').find('.iStartTime').text();
                            var EndTime = $(this).closest('tr').find('.iEndTime').text();
                            var Type = $(this).closest('tr').find('.iType').text();
                            var Date = $(this).closest('tr').find('.iDate').text();
                            BM.popupparam = {
                                ID: myID,
                                Topic: Topic,
                                Room: CurrRoom,
                                StartTime: StartTime,
                                EndTime: EndTime,
                                Type: Type,
                                Event: eventID,
                                Date: Date
                            };
                            location.href = '#/BinusFestival/TopicConfiguration#edit';
                        });
                        
                    }
                }
                else
                {
                   $('#loaderTableDetail').hide();
                }

                $('table#tblDetail').closest('.freeze-pane').show();
                $('table#tblDetail').parent().binus_freeze_pane({
                    fixed_left  : 0,     // default 1
                    fixed_right : 0,     // default 0
                    fixedHeader: true,
                    height: 600,
                    ajax: true,
                    collapse: true,
                    paging: true,
                    bFilter: true,
                    bLengthChange : false,
                    autoWidth : false,
                    bAutoWidth : false,
                    columnDefs: [{target: [10], orderable: false}]
                });
            }
        });
    }
};