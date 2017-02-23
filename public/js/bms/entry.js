function register(collegeId, name, mobile, remark) {
    $.ajax({
        type: "post",
        url: "/api/PayApi/OnlineAssessment",
        data: {
            pId: 0,
            collegeId: collegeId,
            name: name,
            mobile: mobile,
            remark: remark
        },
        dataType: 'json',
        cache: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if (data.Code == 1) {
                var isCharge = data.IsCharge; //是否收费
                var key = data.Data.Key; //加密信息
                var payUrl = data.Data.PayUrl; //支付宝支付地址
                var person = data.Data.Person; //考生信息
                var status = data.Data.Status; //0:未支付,1:已支付未考试,2:已考试

                action(isCharge, key, payUrl, person, status);
            } else {
                alert(data.Message);
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

function action(isCharge, key, payUrl, person, status) {
    //先不做支付
    location.href = _ExamUrl + '?pId=' + person.PId + '&name=' + person.Name + '&mobile=' + person.Mobile + '&examNumberSN=' + person.RandomCode + '&examRoomSN=' + person.ExaminationRoomSnCode + '&encryptKey=' + key;
}

function checkPay(personId) {
    $.ajax({
        type: "get",
        url: "/api/PayApi/IsOnlinePaySuccessed",
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
                if (data.Data.isSigned) { //已支付

                } else { //未支付

                }
            } else {
                alert(data.Message);
            }
        }
    });
}

$(function() {
    $('#btn_Start').click(function() {
        var name = $.trim($('#txt_Name').val());
        var mobile = $.trim($('#txt_Mobile').val());
        var remark = $.trim($('#txt_Remark').val());

        if (!name) {
            $('#lbl_Name').addClass('error').text('请填写姓名');
            $('#txt_Name').addClass('error');
            return;
        }
        if (!mobile) {
            $('#lbl_Mobile').addClass('error').text('请填写手机号');
            $('#txt_Mobile').addClass('error');
            return;
        } else if (!checkMobile(mobile)) {
            $('#lbl_Mobile').addClass('error').text('请填写手机号');
            $('#txt_Mobile').addClass('error');
            return;
        }
        if (!remark) {
            $('#lbl_Remark').addClass('error').text('请填写分店信息');
            $('#txt_Remark').addClass('error');
            return;
        }

        register(_collegeId, name, mobile, remark);
    });
    $('#txt_Name').focus(function() {
        $('#lbl_Name').removeClass('error');
        $('#txt_Name').removeClass('error');
    });
    $('#txt_Mobile').focus(function() {
        $('#lbl_Mobile').removeClass('error');
        $('#txt_Mobile').removeClass('error');
    });
    $('#txt_Remark').focus(function() {
        $('#lbl_Remark').removeClass('error');
        $('#txt_Remark').removeClass('error');
    });
});

function checkMobile(mobile) {

    if (mobile.length != 11) {
        return false;
    }

    //判断是否都是数字
    var r = /^\d{11}$/;
    var mobileCheck = r.test(mobile);

    if (!mobileCheck) {
        return false;
    }

    //判断手机号开头是否正确
    var arrYD = [134, 135, 136, 137, 138, 139, 147, 150, 151, 158, 159, 157, 154, 152, 178, 188, 187, 182, 183, 184, 1705, 1703, 1706];
    var arrLT = [130, 131, 132, 155, 156, 185, 186, 145, 175, 176, 1707, 1708, 1709, 1718, 1719];
    var arrDX = [133, 153, 189, 180, 181, 1700, 177, 173, 1701, 1702];

    var arr = arrYD.concat(arrLT, arrDX);

    var left3 = parseInt(mobile.substr(0, 3));
    var left4 = parseInt(mobile.substr(0, 4));

    if (arr.indexOf(left3) === -1 && arr.indexOf(left4) === -1) {
        mobileCheck = false;
    }

    return mobileCheck;

}