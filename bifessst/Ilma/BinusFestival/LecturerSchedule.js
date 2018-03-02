var toAppend;
var subView = {
    title: 'Set Lecturer Schedule',
    rel: 'content',
    onLoaded: function() {
        sv = this;
        sv.init();
        $(".breadcrumb ul").append('<li>Binus Festival</li>');
        $(".breadcrumb ul").append('<li>Set Lecturer Schedule</li>');
        $(".page-heading h1").html('Set Lecturer Schedule');
        window.document.title = this.title;
    },
    init: function() {
        window.document.title = sv.title;
        $('#contentTableDetail').hide();
        $('.save').hide();
        sv.loadTerm();
        sv.loadCampus();
        sv.loadTable();
        sv.autoCompleteData();
        $('.popmaster-custom-checkbox input[type="checkbox"]').fancyfields( 'bind', 'onCheckboxChange', function(input, isChecked){
            if(isChecked == true)
                $('.popmaster-custom-checkbox').addClass('on');
            else
                $('.popmaster-custom-checkbox').removeClass('on');
            $('#btnLoad').click();
         });
        $("#btnSearch").click(function(e) {
            sv.loadTable();
        });
        $("#btnSave").click(function(e) {
            sv.saveData();
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

    autoCompleteData: function () {
        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getLecturerByDepartment',
            data: JSON.stringify({
                Department: ''
            }),
            type: 'POST',
            success: function (data) {
                autoData = [];
                for (var i = 0; i < data.length; ++i) {
                    if (!jQuery.isEmptyObject(data[i].KDDSN) && !jQuery.isEmptyObject(data[i].INSTR_OFFICIAL_NM)) {
                        autoData.push(data[i].KDDSN.trim() + " - " + data[i].INSTR_OFFICIAL_NM.trim());
                    }
                }

                sv.addRowDataPopUp();
            }
        });
    },

    addRowDataPopUp: function () {
        var clone = $("#txtLecturerCode").clone(false, false);
        $($("#txtLecturerCode").parents(".iInput")).empty().append(clone);

        $("#txtLecturerCode").BMautocomplete({
            dataset: autoData
        });
    },
    loadTable: function() {
        var sv = this;
        $("#loaderTableDetail").css("display", "block");
        var filterData = {
            STRM: $('#ddlTerm').val(),
            KdKampus: $('#ddlCampus').val()
        };

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
                        $(".iCheck", e).html('<input type="checkbox" class="checkbox" ID="' + item.MsPublishSystemID + '">');
                        $(".iSystemName", e).text(item.SystemName);
                        $(".iGroupName", e).text(item.StudentParticipantGroupName);
                        $(".iTopic", e).text(item.Topic);
                        $(".iType", e).text(item.EventType);
                        $(".iDate", e).text(item.Date);
                        $(".iStartTime", e).text(item.StartTime);
                        $(".iEndTime", e).text(item.EndTime);
                        $(".iRoom", e).text(item.Room);
                        $(".iCampus", e).text(item.DESCR);
                        $(".iRoom", e).text(item.Room);
                        $(".iAction", e).html(
                                '<a><p class="icon icon-trash iDelete fancybox.ajax" style="cursor:pointer;" myID="' + item.MsPublishSystemID + '"></p></a>'
                                );
                        $('#tblDetail').find('tbody').append(e);

                        var sv = this;
                        $('.iDelete').unbind().click(function (e)
                        {
                            e.preventDefault();
                            var myID = $(this).attr('myID');

                            var filterData2 = {
                               ID: myID
                            };

                            if (confirm('Delete this topic attribute?')) {
                           
                                BM.ajax({
                                    type: 'post',
                                    url: BM.serviceUri + 'BinusFestival/DeleteTopicAttribute',
                                    data: JSON.stringify(filterData2),
                                    success : function(data) {
                                        if (data.status == "success") {
                                            alert("Delete Success");
                                            if ($.fn.dataTable.isDataTable('table#tblDetail')) {
                                                $('table#tblDetail').DataTable().destroy();
                                            } 
                                            $("#btnSearch").click();
                                        }
                                    }
                                });
                            }
                        });
                        
                    }

                    $('.save').show();
                }
                else
                {
                   $('#loaderTableDetail').hide();
                   $('.save').hide();
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
    },
    saveData: function() {
        var sv = this;
        var checkSelected =  $('input[class=checkbox]:checked').length;
        $("#btnSave").hide();
        $("#btnSave").before('<div style="text-align:center;margin-top:5%;list-style:none;" class="iSaveLoading iLoading"><img alt=""></img></div>');
        $('.iLoading').html($('<img alt="" />').attr('src', BM.baseUri + 'lecturer/images/loading.gif'));

        if(checkSelected == 0) {
            alert("Select Configuration first!");
            $(".iSaveLoading").remove();
            $("#btnSave").show();
        } else if($("#txtLecturerCode").val() == "") {
            alert("Please Select Lecturer!");
            $(".iSaveLoading").remove();
            $("#btnSave").show();
        } else {
            $('input[class=checkbox]:checked').each(function(){
                var DosenID = (($("#txtLecturerCode").val()).split("-"))[0].trim();
                var NamaDosen = $("#txtLecturerCode").val().substr(8);
                var Topic = $(this).closest('tr').find('td')[3].innerHTML;
                var ID = $(this).attr("ID");
                
                var filterData = {
                    ID: ID,
                    BinusianID: DosenID,
                    LecturerID: DosenID,
                    Lecturer: NamaDosen,
                    Topic: Topic
                };

                BM.ajax({
                    type: 'post',
                    url: BM.serviceUri + 'BinusFestival/AssignLecturer',
                    data: JSON.stringify(filterData),
                    success : function(data) {
                        if (data.status == "success") {
                            $(".iSaveLoading").remove();
                            $("#btnSave").show();
                            alert("Assigning Lecturer Success!");
                            $("#btnSearch").click();
                        }
                    }
                });
            });
        }
    }
};