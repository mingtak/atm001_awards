var new_list = null;
var fridays = ['20170127', '20170203', '20170210', '20170217'];

var vm = new Vue({
    el: '#vue',

    data: {
        test:"測試",
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

            for(var i=0; i<3; i+=1){
                weightCount = 0;
                award = getRandomInt(1, total);
                alert('抽到的號碼: ' + award);

                for(var j=0; j<new_list.length; j+=1){
                    weightCount += new_list[j]['weight'];
//                    alert('抽獎:' + weightCount);
                    if( weightCount == award ){
                        i7Awards.push(new_list[j]);
                        
                        alert('i7Awards: ' + i7Awards + ' , 第幾個中獎: ' + j);
                    };
                };
            };

//            alert('i7Awards: ' + i7Awards);


        },

        cash_prize: function() {
            var list_1 = getData('HLATM_1.csv');
            var list_2 = getData('HLATM_2.csv');
            new_list = weighted(list_1, list_2);
            var total = totalWeight(new_list);


        },
    },
});


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
