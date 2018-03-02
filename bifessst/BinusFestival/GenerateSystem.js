var sx, prms = '';
var tempDetail = [];
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
    onLoaded: function(arg)
    {
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        sx = this;
        prms = BM.popupparam;
        sx.init();
        $('#btnExport').click(function () {
            sx.ExportToExcel();
        });
        $('#btnGenerate').click(function () {
                    $('#hidden').show();
                //     $('.failed').hide();
                //     var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                //     $('.iOption', c).append('<a class="icon icon-trash"  style="cursor:pointer;"></a>');
                //     $('#tableOfficialNotesPopUp tbody').append(c);
                //     var d = $('#formparticipant .custom-combobox').clone();
                //     $('.iPeriod ', c).append('<span id="ddlPeriodPopUp" data="'+$('#ddlPeriodPopUp option:selected').val()+'">'+$('#ddlPeriodPopUp option:selected').html()+'</span>');
                //     $('.iOption .icon-trash').click(function(e){
                //         e.preventDefault();
                // //      if ($('tbody').find('.dataPopUp').length == 1)
                //    //      {
                //    //       $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                //             // $('.failed').show();
                //    //      }
                //    //      else if($('.iOrderBy').find('.txtOrderBy').attr('kdOrderBy') == null)
                //    //      {
                //    //       $(this).closest('tr').remove();
                //    //      }
                //         //$(this).closest('tr').remove();
                //         if ($('tbody').find('.dataPopUp').length == 1)
                //         {
                //             $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                //             $('.failed').show();
                //         }
                //         else if($(".iPeriod", $(this).closest("tr")).find('.txtPeriod').attr('kdPeriod') == null)
                //         {
                //             $(this).closest('tr').remove();
                //         }
                //     });


                //     $('.txtInstitution').keyup(function(key) {
                //         this.value = this.value.toUpperCase();
                //     });
            BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/GenerateData",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriodPopUp option:selected').val() , SystemID: $('#ddlSystemPopUp option:selected').val() }),
            beforeSend: function(){
                
            },
            success: function(data){
                if(data[0].Status=="Success"){
                        alert("Data Generated Successfully");
                }
                else if (data[0].Status=="Failed"){
                var Join ='<table><th>SystemName</th><th>Topic</th><th>Difference</th>';
                    $.each(data, function(a, e) {
                            Join+= '<tr><td>'+e.SystemName + '</td> <td>'+e.Topic + '</td> <td>' + e.Beda + 'Orang' + '</td></tr>';
                        })
                    Join +='</table>'
                    BM.message({
                        targetid : '#popup-message',
                        title : 'Conflict!',
                        message : 'Binus Festival System Have Conflicted!'+'</br>'+Join,
                        width : '1000px',
                        button : ['OK']
                    },
                    function(result){
                        if(result == "OK")
                        {
                            $.fancybox.close();
                        }
                            // sx.loadInit();
                            // $('#txtNewInstructor').val('');
                            // $('#txtReason').val('');
                    });
                }
                    $('#hidden').hide();
            }
            });
                });
        
        if (typeof BM.headPrefectConfiguration != "undefined") {
            sx.initFilter(BM.headPrefectConfiguration);
        }
      
    },
    loadPeriod : function() {
        $("#ddlPeriodPopUp").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriodPopUp').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllSystemPeriod",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(data){
                $('#loaderPeriodPopUp').hide();
                $('#ddlPeriodPopUp').empty();
                if(data.length) {
                    tempData = data;
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].STRM+"'>"+data[i].DESCR+"</option>";
                        $("#ddlPeriodPopUp").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlPeriodPopUp").append(option);
                }
                $("#ddlPeriodPopUp").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlPeriodPopUp").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlPeriodPopUp').change(function(){
                   sx.loadSystem();
                });
               sx.loadSystem();
            }
        });
    },
    loadSystem : function() {
        $("#ddlSystemPopUp").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderSystemPopUp').show();
        BM.ajax({
            url : BM.serviceUri + "staff/HeadPrefect_Configuration/getSystemConfiguration",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriodPopUp option:selected').val() }),
         
            success: function(data){
                $('#loaderSystemPopUp').hide();
                $('#ddlSystemPopUp').empty();
                if(data.length) {
                    tempData = data;
                        option = "<option value='"+""+"'>"+"ALL"+"</option>";
                        $("#ddlSystemPopUp").append(option);
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].SystemID+"'>"+data[i].SystemName+"</option>";
                        $("#ddlSystemPopUp").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlSystemPopUp").append(option);
                }
                $("#ddlSystemPopUp").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlSystemPopUp").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlSystemPopUp').change(function(){
                   //sx.loadInit();
                });
               //sx.loadInit();
            }
        });
    },
    publishData : function() {
        var sx = this;
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/PublishData",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriodPopUp option:selected').val() , SystemID: $('#ddlSystemPopUp option:selected').val() }),
         
            success: function(data){
              alert("data has been published");
            }
        });
    },
    unpublishData : function() {
        var sx = this;
       BM.ajax({
            url : BM.serviceUri + "BinusFestival/UnpublishData",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriodPopUp option:selected').val() , SystemID: $('#ddlSystemPopUp option:selected').val() }),
         
            success: function(data){
              alert("data has been published");
            }
        });
    },
    loadInit: function() {
        $('#tableOfficialNotesPopUp').show();
        $('#btnGenerate').show();
        var sx = this;
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllGenerateData",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriodPopUp option:selected').val() , SystemID: $('#ddlSystemPopUp option:selected').val() }),
            beforeSend: function(){
                $('#btnSearch').attr("disabled",true);
                $('.dataPopUp').remove();
                $('.dataPopUpLoading').remove();
                $('.dataAvailable').remove();
         $('#tableOfficialNotesPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                 $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
            },
            success: function(data){
                $('#btnPublish').hide();
                $('#btnUnpublish').hide();
                if(data.length==0){
                $('#tableOfficialNotesPopUp tbody').append('<tr class="dataAvailable"><td colspan="24" style="text-align:center;">data was not available</td></tr>');
               } $.each(data, function(a, e) {
                    var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                    $('.iOption', c).append('<a target="_blank" href="'+BM.baseUri+"newstaff/#/event/binusfestival/konfigurasiSystem."+e.SystemID+'"class="icon icon-edit"  style="cursor:pointer;"></a>');
                    // var d = $('#formparticipant .custom-combobox').clone();
                    // $('#ddlPeriodPopUp', d).val(e.STRM);
                    // $('.iOfficialNotesID ', c).append(e.SystemID);
                    // $('.iPeriod ', c).append(d);
                    $('.iSystem ',c).attr("data",e.SystemName);
                    $('.iSystem ', c).html(e.SystemName);
                    //$('.iMandatory ', c).html(e.Mandatory);
                    $('.iStatus ', c).html((e.Status=="data has been conflicted ")?e.Status+" in "+e.kampus:e.Status);
                    if(e.Status=='data has not been published'){$('#btnPublish').show();}
                      if(e.Status=='data has been published'){$('#btnUnpublish').show();}
                    $('#tableOfficialNotesPopUp tbody').append(c);
              
                     
                });
                $('#btnSearch').attr("disabled",false);

                $('.dataPopUpLoading').remove();
            }
        });

    },
    init: function() {
        var sx = this;
        sx.loadPeriod();
        $('#btnPublish').click(function(){
            sx.publishData();
        })
        $('#btnUnpublish').click(function(){
            sx.unpublishData();
        })
        $('#btnSearch').click(function(){
            sx.loadInit();
        })
        $('#btnSave').click(function(){
            //sx.showLoading();
                var detail = [];
                $.each($('.dataPopUp'), function() {
                    var tempObj = {};
                    tempObj.dataID = ($(this).find('.iOfficialNotesID').html() == "")? "0" : $(this).find('.iOfficialNotesID').html();
                    tempObj.System = $(this).find('.txtSystem').val();
                    tempObj.Period = ($(this).find('#ddlPeriodPopUp').val() == ""  )?$('#ddlPeriodPopUp option:selected').val():$(this).find('#ddlPeriodPopUp').val();
                    console.log(tempObj.System);
                    console.log(tempObj.Period);
                    if(tempObj.System!=''){
                        detail.push(tempObj);
                    }
                });
                var configuration ={
                    "detail": detail
                }
                BM.ajax({   
                    type: 'POST',
                    url: BM.serviceUri + 'staff/HeadPrefect_Configuration/create_configurationfest' ,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(configuration),
                    beforeSend: function() {
                       // sx.showLoading();
                    },
                    success: function(data) {
                        //sx.hideLoading();
                        console.log(data[0].status);
                        if (data[0].status == 'success') {
                            alert("Data Saved");
                            $('.dataPopUp').remove();
                            sx.loadInit();
                            
                        } else {
                           // sx.hideLoading();
                           // alert(data.message);
                        }
                    }
                });
        });
    },
    ExportToExcel : function() {
        var sx = this;
        var data = {};
                            data['Main'] = "GenerateSchedule";
                            data['Period'] = $('#ddlPeriodPopUp option:selected').val();
                            data['SystemID'] = $('#ddlSystemPopUp option:selected').val();
                           
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