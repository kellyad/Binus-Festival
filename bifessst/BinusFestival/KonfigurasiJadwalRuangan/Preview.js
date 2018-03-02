var popupSubView = {
	title: 'Popup Message - Binusmaya',
	onLoaded: function(param) {
		BM.ajax({
            url: BM.serviceUri + "BinusFestival/GetShiftPreview",
            data: JSON.stringify({'Topic': BM.filter.Topic,
        	'StartDate' : BM.filter.StartDate,
        	'EndDate' : BM.filter.EndDate,
        	'StartTime' : BM.filter.StartTime,
        	'EndTime' : BM.filter.EndTime,
        	'ShiftDuration' : BM.filter.ShiftDuration,
        	'PostDuration' : BM.filter.PostDuration
        }),
            type: "POST",
            async: false,
            dataType: "json",
            beforeSend: function() {
               
                $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
                $('#loadingpopup').show();
            },
            success: function(result) {
                
		$("#PopupMessage").text("masuk");
            }
        });
		$("#btnClosePopup").off('click').click(function(e){
			// e.preventDefault();
			// //sv.loadStatus();
			// $.fancybox.close();
		});
	}
};