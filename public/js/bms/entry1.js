var urlData = GetRequest();

function register() {
    $.ajax({
        type: "post",
        url: _HttpDomain + "/PayApi/OnlineAssessment",
        data: {
            pId: urlData.pId,
            collegeId: urlData.collegeId,
            name: urlData.name,
            mobile: urlData.mobile
        },
        dataType: 'json',
        cache: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if (data.Code == 1) {
                var isCharge = data.IsCharge;//是否收费
                var key = data.Data.Key;//加密信息
                var payUrl = data.Data.PayUrl;//支付宝支付地址
                var person = data.Data.Person;//考生信息
                var status = data.Data.Status;//0:未支付,1:已支付未考试,2:已考试

                action(isCharge,key,payUrl,person,status);
            }else{
                alert(data.Message);
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}

function action(isCharge,key,payUrl,person,status){
    //先不做支付
    location.href = _ExamUrl + '?pId='+person.PId+'&name='+person.Name+'&mobile='+person.Mobile+'&examNumberSN='+person.RandomCode+'&examRoomSN='+person.ExaminationRoomSnCode+'&encryptKey='+key;
}

function checkPay(personId){
    $.ajax({
        type: "get",
        url: _HttpDomain + "/PayApi/IsOnlinePaySuccessed",
        data: {
            personId: personId
        },
        dataType: 'json',
        cache: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if (data.Code == 1) {
                if(data.Data.isSigned){//已支付

                }else{//未支付

                }
            }else{
                alert(data.Message);
            }
        }
    });
}

$(function(){
    register();
});