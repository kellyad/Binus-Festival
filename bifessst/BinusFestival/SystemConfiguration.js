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
        $('#btnAddPopUp').click(function () {
                    
                    $('.failed').hide();
                    var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                    $('.iOption', c).append('<a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    $('#tableOfficialNotesPopUp tbody').append(c);
                    var d = $('#formparticipant .custom-combobox').clone();
                    $('.iPeriod ', c).append('<span id="ddlPeriodPopUp" data="'+$('#ddlPeriodPopUp option:selected').val()+'">'+$('#ddlPeriodPopUp option:selected').html()+'</span>');
                    $('.iOption .icon-trash').click(function(e){
                        e.preventDefault();

                        if ($('tbody').find('.dataPopUp').length == 1)
                        {
                            $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                            $('.failed').show();
                        }
                        else if($(".iPeriod", $(this).closest("tr")).find('.txtPeriod').attr('kdPeriod') == null)
                        {
                            $(this).closest('tr').remove();
                        }
                    });


                    $('.txtInstitution').keyup(function(key) {
                        this.value = this.value.toUpperCase();
                    });
                   
                    
                    
                    flag=1;
                });
        
        if (typeof BM.headPrefectConfiguration != "undefined") {
            sx.initFilter(BM.headPrefectConfiguration);
        }
       
    },
    loadPeriod : function() {
        $("#ddlPeriodPopUp").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriodPopUp').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/SystemHandler/getAllSystemPeriod",
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
                   sx.loadInit();
                });
               sx.loadInit();
            }
        });
    },
    loadInit: function() {
        var sx = this;
        BM.ajax({
            url : BM.serviceUri + "BifestController/SystemHandler/getSystemConfiguration",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriodPopUp option:selected').val() }),
            beforeSend: function(){
                        $('.dataPopUp').remove();
            },
            success: function(data){
                $.each(data, function(a, e) {
                    var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                    $('.iOption', c).append('<a target="_blank" href="'+BM.baseUri+"newstaff/#/event/binusfestival/ParticipantGroupConfiguration."+e.SystemID+'"class="icon icon-edit"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    var d = $('#formparticipant .custom-combobox').clone();
                    $('#ddlPeriodPopUp', d).val(e.STRM);
                    $('.iOfficialNotesID ', c).append(e.SystemID);
                    $('.iPeriod ', c).append(d);
                    $('.iSystem ',c).attr("data",e.SystemID);
                    $('.iSystem .txtSystem', c).val(e.SystemName);
                    $('.iStatus ', c).html("Saved");
                    $('#tableOfficialNotesPopUp tbody').append(c);
                    $('.iOption .icon-trash').click(function(e){
                        e.preventDefault();
     
                        if ($('tbody').find('.dataPopUp').length == 1)
                        {
                            $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                            $('.failed').show();
                        }
                        else if($(".iPeriod", $(this).closest("tr")).find('.txtPeriod').attr('kdPeriod') == null)
                        {
                            $(this).closest('tr').remove();
                        }
                    });
                     
                });
            }
        });
    },
    init: function() {
        var sx = this;
        sx.loadPeriod();
        $('#btnSave').click(function(){
            //sx.showLoading();
            $('#btnSave').attr("disabled","disabled");
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
                    url: BM.serviceUri + 'BifestController/SystemHandler/saveSystemConfiguration' ,
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
				
            $('#btnSave').removeAttr("disabled");
        });
   
    }
};