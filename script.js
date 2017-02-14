var new_list = null;
var fridays = ['20170127', '20170203', '20170210', '20170217'];

var vm = new Vue({
    el: '#vue',

    data: {
        i7Awards: [],
        cashAwards: [],
    },

    methods: {
        // iphone7 prize
        i7_prize: function() {
            var list_1 = getData('HLATM_1.csv');
            var list_2 = getData('HLATM_2.csv');
            new_list = weighted(list_1, list_2);
            var total = totalWeight(new_list);

            i7Awards = [];
//            alert('total: ' + total);

            for(var i=0; true; i+=1){
                if(i7Awards.length == 3){
                    break;
                };

                weightCount = 0;
                award = getRandomInt(1, total);
                console.log('抽到的號碼: ' + award);

                for(var j=0; j<new_list.length; j+=1){
                    weightCount += new_list[j]['weight'];
//                    alert('抽獎:' + weightCount);
                    if( award > (weightCount - new_list[j]['weight']) && award <= weightCount ){
                        // 檢查是否重覆中獎
                        if( i7Awards.length == 0 ){
                            i7Awards.push(new_list[j]);
                            console.log('i7Awards: ' + i7Awards + ' ,1 第幾個中獎: ' + j);
                            break;
                        };

                        alreadyAward = false;
                        for(var k=0; k<i7Awards.length; k+=1){
                            console.log(k + ': ' +new_list[j]['BankId'] + ' ' + i7Awards[k]['BankId'] + ' ' + new_list[j]['AcctId'] + ' ' + i7Awards[k]['AcctId'])
                            if(new_list[j]['BankId'] == i7Awards[k]['BankId'] && new_list[j]['AcctId'] == i7Awards[k]['AcctId']){
                                console.log('這個中過了: ' + j);
                                alreadyAward = true;
                                break;
                            }
                        };
                        if(! alreadyAward){
                            i7Awards.push(new_list[j]);
                            console.log('i7Awards: ' + i7Awards + ' ,2 第幾個中獎: ' + j);
                        };
                        break;
                    };
                };
            };
            console.log('最後結果: ' + i7Awards);
            vm.i7Awards = showList(i7Awards);
        },

// 全家禮券
        cash_prize: function() {
            var list_1 = getData('HLATM_1.csv');
            var list_2 = getData('HLATM_2.csv');
            new_list = weighted(list_1, list_2);
            var total = totalWeight(new_list);

            cashAwards = [];
//            alert('total: ' + total);

            for(var i=0; true; i+=1){
                if(cashAwards.length == 830){
                    break;
                };

                weightCount = 0;
                award = getRandomInt(1, total);
                console.log('抽到的號碼: ' + award);

                for(var j=0; j<new_list.length; j+=1){
                    weightCount += new_list[j]['weight'];

                    if( award > (weightCount - new_list[j]['weight']) && award <= weightCount ){
                        cashAwards.push(new_list[j]);
                        console.log('cashAwards: ' + cashAwards + ' ,3 第幾個中獎: ' + j);
                        break;
                    };
                    continue;
                };
            };
            console.log('全家禮券最後結果: ' + cashAwards);
            vm.cashAwards = showList(cashAwards);


        },
    },
});


// show list, 回傳中獎名單(array)
var showList = function(awards){
    result = []
    for(var i=0; i<awards.length; i+=1){
        result.push('銀行代碼:' + awards[i]['BankId'] + ', 帳號後5碼:' + awards[i]['AcctId'] + ', 電話號碼:' + awards[i]['PhoneNo'] + ', Email:' + awards[i]['Email'] + ', 姓名:' + awards[i]['UsrName']);
    };
    return result
};

// 計算總權重
var totalWeight = function(list){
    var total = 0
    for(var i=0; i<list.length; i+=1){
        total += list[i]['weight'];
    };
    return total;
};

// 計算加權
var weighted = function(list_1, list_2){
    for(var i=0; i<list_2.length; i+=1){
        bankId_2 = list_2[i]['BankId'];
        acctId_2 = list_2[i]['AcctId'];
        createTime_2 = list_2[i]['CreateTime'];

        for(var j=0; j<list_1.length; j+=1){
            bankId_1 = list_1[j]['BankId'];
            acctId_1 = list_1[j]['AcctId'];

            // 檢查有無權重
            if(!('weight' in list_1[j])){
                list_1[j]['weight'] = 0;
//                alert(list_1[j]['weight']);
            }

            // 計算加權

            if((bankId_2 == bankId_1) && (acctId_2 == acctId_1)){
                if(fridays.indexOf(createTime_2.slice(0,8)) >= 0){
                    list_1[j]['weight'] += 2;
                }else{
                    list_1[j]['weight'] += 1;
                };
//                alert('bingo, ' + bankId_2 + acctId_2 + ',' + list_1[j]['weight']);
            }

        };
    };
    return list_1;
}


// Read CSV file and get data
var getData = function(filename){
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "text",
        async:false,
        success: function(data) {
            var csv = new CSV(data, {header: true, cast:false});
            list = csv.parse();
        },
    });
    return list;
};


// 亂數抽獎，範圍 min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
