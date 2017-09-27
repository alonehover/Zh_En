(function (win, $) {
	win.utils = {
		trans: function (key) {
			const youdao = this.youdao(key)
			// const bing = this.bing(key)
			return Promise.all([youdao]);
		},
		youdao: function (key) {
			return new Promise((resolve, reject) => {
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
				.done(function (yd) {
					if (yd === "error" || yd.errorCode > 0) {
						reject("error")
					} else if (yd.errorCode === 0) {
						var html = '';
						if (yd.basic) {
							var basic = "";
							for (var i = 0; i < yd.basic.explains.length; i++) {
								if (i == yd.basic.explains.length - 1) {
									basic += yd.basic.explains[i];
								} else {
									basic += yd.basic.explains[i] + '<br/>';
								}
							}
							html += '<p>[有道词典]</p><p>' + basic + '</p>';
						}
						html += '<p>[有道翻译]</p>';
						for (var j = 0; j < yd.translation.length; j++) {
							html += '<p>' + yd.translation[j] + '</p>';
						}
						resolve(html);
					}
				})
				.fail(function () {
					reject("error")
				});
			})
		},
		baidu: function (key, call) {
			return new Promise((resolve, reject) => {
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
				.done(function (result) {
					if (result.error_code) {
						reject("error");
					} else {
						var html = '<p>[百度翻译]</P>';
						for (var i = 0; i < result.trans_result.length; i++) {
							html += '<p>' + result.trans_result[i].dst + '</p>';
						}
						resolve(html);
					}
				})
				.fail(function () {
					reject("error");
				});
			})
		},
		bing: function (key) {
			return new Promise((resolve, reject) => {
				$.ajax({
					url: '/bing',
					type: 'GET',
					data: {
						q: key
					}
				}).done(res => {
					if(res) {
						var html = '<p>[必应翻译]</P>';
						html = html + res.replace(/<\/?a[^>]*?>/ig, "")
						resolve(html);
					}else {
						resolve("");
					}
				})
			})
		},
		debounce: function(fn, wait, immediate) {
			let timeout
			let args
			let context
			let timestamp
			let result

			const later = function later() {
				const last = +(new Date()) - timestamp

				if (last < wait && last >= 0) {
					timeout = setTimeout(later, wait - last)
				} else {
					timeout = null
					if (!immediate) {
						result = fn.apply(context, args)
						if (!timeout) {
							context = args = null
						}
					}
				}
			}

			return function debounced() {
				context = this
				args = arguments
				timestamp = +(new Date())

				const callNow = immediate && !timeout
				if (!timeout) {
					timeout = setTimeout(later, wait)
				}

				if (callNow) {
					result = fn.apply(context, args)
					context = args = null
				}

				return result
			}
		}
	};
})(window, jQuery);
