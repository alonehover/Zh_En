import './index.less';
import superagent from 'superagent';

(function() {
    const transDom = document.querySelector('#translate');

    function debounce(fn, wait, immediate) {
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

    function formatData(res) {
        let html = "";
        for (const key in res) {            
            switch (key) {
                case 'b':
                    if(res[key].data) {
                        html += `
                            <p>[百度翻译]</p>
                            <p>${res[key].data}</p>
                        `;
                    }
                    break;
                case 's':
                    if(res[key].data) {
                        html += `
                            <p>[搜狗翻译]</p>
                            <p>${res[key].data}</p>
                        `;
                    }
                    break;
                case 'y':
                    if(res[key].data) {
                        if(res[key].data.basic) {
                            html += '<p>[有道词典]</p>';
                            for (const basic of res[key].data.basic) {
                                html += `<div>${basic}</div>`;
                            }
                        }
    
                        html += `
                            <p>[有道翻译]</p>
                            <p>${res[key].data.translation}</p>
                        `;
                    }
                    break;
                default:
                    break;
            }
        }
        
        return html;
    }
    
    const trans = function(keyWord) {        
        superagent.post('/api/trans')
            .set('Content-Type', 'application/json; charset=utf-8')    
            .send({keywords: keyWord})
            .end((err, res) => {
                if(err) {
                    console.error(err);
                }

                transDom.innerHTML = formatData(res.body.data);
                transDom.style.display = "block";
            })
    };

    const input = document.getElementById("srTxt");
    input.addEventListener('keyup', debounce(e => {        
        const k = e.keyCode || e.which;
        const keyWord = input.value;
        if (k === 13 || keyWord.length >= 2) {
            trans(keyWord);
        } else if (keyWord.length === 0) {
            transDom.innerHTML = "";
            transDom.style.display = "none";
        }
    }, 800));

    window.onload = () => {
        document.getElementById("srTxt").focus();
    }
})();