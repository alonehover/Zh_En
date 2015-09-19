(function(win,$){

    win.utils = {
      trans: function(key,call){
        this.youdao(key,function(data){
            if (data === "erro" || data.errorCode > 0) {
                call("error");
            }else if(data.errorCode === 0){
                var html = '';
                if (data.basic) {
                  var basic = "";
                  for (var i = 0; i < data.basic.explains.length; i++) {
                    if(i == data.basic.explains.length -1){
                      basic += data.basic.explains[i];
                    }else {
                      basic += data.basic.explains[i] + ', ';
                    }
                  }
                  html += '<p>[有道词典]</p><p>'+ basic +'</p>';
                }
                html +='<p>[有道翻译]</p>';
                for (var j = 0; j < data.translation.length; j++) {
                  html += '<p>' + data.translation[j] + '</p>';
                }
                call(html);
            }
        });
      },
      youdao : function(key,call){
        $.ajax({
          url: "http://fanyi.youdao.com/openapi.do",
          type: 'GET',
          dataType: 'json',
          data: {
            keyfrom: 'yinwuxueshe',
            key: '1846905756',
            type: 'data',
            doctype: 'json',
            version: '1.1',
            q: key
          }
        })
        .done(function(result) {
          call(result);
        })
        .fail(function() {
          call('erro');
        });
      },
      baidu : function(){

      },
      biying : function(){

      }
    };
})(window,jQuery);
