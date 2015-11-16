(function(win,$){
    win.utils = {
      trans: function(key,call){
        utils.youdao(key,function(yd){
            if (yd === "error" || yd.errorCode > 0) {
                utils.baidu(key,function(bd){
                    if (bd=== "error") {
                      call("暂无翻译");
                    }else {
                      call(bd);
                    }
                });
            }else if(yd.errorCode === 0){
                var html = '';
                if (yd.basic) {
                  var basic = "";
                  for (var i = 0; i < yd.basic.explains.length; i++) {
                    if(i == yd.basic.explains.length -1){
                      basic += yd.basic.explains[i];
                    }else {
                      basic += yd.basic.explains[i] + '<br/>';
                    }
                  }
                  html += '<p>[有道词典]</p><p>'+ basic +'</p>';
                }
                html +='<p>[有道翻译]</p>';
                for (var j = 0; j < yd.translation.length; j++) {
                  html += '<p>' + yd.translation[j] + '</p>';
                }
                call(html);
            }
        });
      },
      youdao : function(key,call){
        $.ajax({
          url: "http://fanyi.youdao.com/openapi.do",
          type: 'GET',
          dataType: 'jsonp',
          data: {
            keyfrom: 'yinwuxueshe',
            key: '1846905756',
            type: 'data',
            doctype: 'jsonp',
            version: '1.1',
            q: key
          }
        })
        .done(function(result) {
          call(result);
        })
        .fail(function() {
          call('error');
        });
      },
      baidu : function(key,call){
        call('baidu');
        $.ajax({
          url: 'http://openapi.baidu.com/public/2.0/bmt/translate',
          type: 'GET',
          dataType: 'jsonp',
          data: {
            from: 'auto',
            to: 'auto',
            client_id: 'yrjjArCI8RRHXvy8hSOz1lMq',
            q: key
          }
        })
        .done(function(result) {
          if(result.error_code){
            call("error");
          }else {
            var html = '<p>[百度翻译]</P>';
            for (var i = 0; i < result.trans_result.length; i++) {
              html += '<p>'+ result.trans_result[i].dst +'</p>';
            }
            call(html);
          }
        })
        .fail(function() {
          call("error");
        });
      },
      biying : function(){

      }
    };
})(window,jQuery);
