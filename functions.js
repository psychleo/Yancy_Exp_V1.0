    // 定义函数
    // (0) addGroupFromButton
    function addGroupFromButton(data) {
        // compute variables from button-plugin response (for simple item)
        var group;
        data.response = parseInt(data.button_pressed) + 1 // raw: 0, 1, 2, ...
        group = parseInt(data.button_pressed) + 1
        alert(group)
    }
    // (1) addRespFromSurvey
    function addRespFromSurvey(data, parse_int = false) {
        // only for single response ('Q0' in survey-plugin responses)
        var resp = String(JSON.parse(data.responses).Q0)
        data.responses = resp
        data.response = (parse_int) ? resp.match(/\d+/) : resp
    }
    // (2) addRespFromButton
    function addRespFromButton(data) {
        // compute variables from button-plugin response (for simple item)
        data.response = parseInt(data.button_pressed) + 1 // raw: 0, 1, 2, ...
    }
    // (3) setSliderAttr
    function setSliderAttr(event = 'onmouseup') {
        document.getElementById('jspsych-html-slider-response-response').setAttribute(event, 'addSliderValue()')
    }
    // (4) addSliderValue
    function addSliderValue(element_id = 'slider-value') {
        document.getElementById(element_id).innerHTML = document.getElementById('jspsych-html-slider-response-response').value
        document.getElementById('jspsych-html-slider-response-next').disabled = false
    }
    // (5) timer
    function timer() {
        var second = document.getElementById('timer')
        var button = document.getElementsByClassName('jspsych-btn')[0]
        if (second != null) {
            if (second.innerHTML > 1) {
                second.innerHTML = second.innerHTML - 1
            } else {
                button.style='background-color:rgb(29,191,151)'
                button.innerHTML = `<span style="font: normal 20px 等线 color: white">继续</span>`
                button.disabled = false
                document.body.style.backgroundColor = 'black'
                document.body.style.backgroundColor = 'white'
            }
        }
    }