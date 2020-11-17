// 定义
const btn_html = "<p><button class='jspsych-btn' style='font: normal 20px 等线'>%choice%</button></p>";
const subID = jsPsych.randomization.randomID(8)
const btn_html_timer =
    `<style onload="tid=setInterval(timer, 1000)"></style>
     <button onclick="clearInterval(tid)" class="jspsych-btn" disabled=true >%choice%</button>`
const btn_html_timerreset =
    `<button onclick="clearInterval(tid)" class="jspsych-btn">%choice%</button>`

var tag_LR = `<div class="tag-left">按“D”键:<br/>是</div>
     <div class="tag-right">按“K”键:<br/>否</div>`
// 定义函数
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

// 导入刺激：视频和图片
var timeline = [];
// 正式实验
// 0 注意
var open_fullscreen = {
    type: 'fullscreen',
    fullscreen_mode: true,
    message: `
    <p style="font: 16pt 微软雅黑; text-align: left; line-height: 1.6em">
    <b>
    测验将在一个「全屏页面」开始，为确保最佳效果，请你：<br/>
    （1）在电脑上进行测验，并使用主流浏览器打开本网页<br/>
    &emsp;&emsp;（Chrome、Edge、Firefox、Safari等，不要用IE）<br/>
    （2）关掉电脑上其他正在运行的程序或将其最小化<br/>
    （3）将手机调至静音，并尽可能减少环境噪音干扰<br/>
    （4）在测验过程中不要退出全屏<br/>
    （5）务必认真作答<br/><br/>
    </b>
    如果你同意参与，并且清楚理解了上述要求，请点击开始：
    </p>`,
    button_label: '点击这里全屏开始',
    delay_after: 100
}

// 1 欢迎语
var welcome = {
    type: "html-keyboard-response",
    stimulus: `
    <p style="font: bold 32pt 微软雅黑; color: #B22222">
    欢迎参与我们的实验</p>
    <p style="font: 20pt 微软雅黑; color: black"><br/>
    <按空格键继续><br/>
    <b>实验过程中请勿退出全屏</b><br/><br/></p>
    <p style="font: 20pt 华文中宋; color: grey">
    北京师范大学 <br/>2020年</p>`,
};

// 2 输入个人信息
var Group = {
    type: "html-button-response",
    data: {
        varname: "Group"
    },
    stimulus: "您的组别",
    choices: ["1", "2"],
    button_html: btn_html,
    on_finish: function (data) {
        addRespFromButton(data);
    }
};
var ID = {
    type: "survey-html-form",
    data: {
        varname: "ID"
    },
    preamble: "您的实验编号",
    html: "<p><input name='Q0' type='number', required /></p>",
    button_label: "继续",
    on_finish: function (data) {
        addRespFromSurvey(data);
    }
};
var Sex = {
    type: "html-button-response",
    data: {
        varname: "Sex"
    },
    stimulus: "您的性别",
    choices: ["男", "女", "其他"],
    button_html: btn_html,
    on_finish: function (data) {
        addRespFromButton(data);
    }
};

var Age = {
    type: "survey-html-form",
    data: {
        varname: "Age"
    },
    preamble: "您的年龄",
    html: "<p><input name='Q0' type='number' placeholder='10~99'\
                min=10 max=99 oninput='if(value.length>2) value=value.slice(0,2)'\
                required /></p>",
    button_label: "继续",
    on_finish: function (data) {
        addRespFromSurvey(data);
    }
};
var Education = {
    type: 'survey-html-form',
    data: {
        varname: 'Education'
    },
    preamble: '您的受教育程度',
    html: `
    <p><select name="Q0" size=10>
    <option>1.硕士研究生及以上</option>
    <option>2.大学本科</option>
    <option>3.大学专科</option>
    <option>4.高中</option>
    <option>5.初中</option>
    <option>6.小学</option>
    <option>7.其他</option>
    </select></p>`,
    button_label: '继续',
    on_finish: function (data) {
        addRespFromSurvey(data)
    }
}
// demographics
var demographics = {
    timeline: [
        ID, Sex, Age, Education,
    ]
}
// (1)视频
var movie = ['Movie_Neutral/neutral1.mp4', 'Movie_Neutral/neutral2.mp4', 'Movie_Neutral/neutral3.mp4', 'Movie_Neutral/neutral4.mp4', 'Movie_Neutral/neutral5.mp4'
];
var movieSeconds = [5, 5, 5, 5, 5]
// 定义刺激矩阵,movielist= [1,2,3,4,5]([0,1,2,3,4]);
var movielist = new Array();
for (var i = 0; i < 5; i++) {
    movielist.push(i);
}
// 洗牌算法
// 对于一个有n个元素的数组，先将第n个数与前n - 1个数中的任意一个换位，然后将第n - 1个数与前n - 2个数中的任意一个换位，以此类推。
movielist.Shuffle = function () {
    var total = this.length;
    for (var j = total - 1; j > 0; j--) {
        // n-1 递减；Math.floor()用来向下取整；
        // Math.random()可以生成一个0-1之间的随机整数，即 0≤A<1
        // 因此Math.floor(Math.random() * j);一句是生成0到j - 1之间的随机整数。
        var index = Math.floor(Math.random() * j);
        // 将两个元素的值互换
        [this[j], this[index]] = [this[index], this[j]];
    }
    return this;
}
// movielist.Shuffle函数
movielist.Shuffle();
//     
var trial_stimuli = [];
for (var q = 0; q < movielist.length; q++) {
    trial_stimuli.push({
        mov: movie[movielist[q]]
    });
}

// (2)图片
// (2)-(1):IM组
var IMGIM = ["IMG_IM/IM1.bmp", "IMG_IM/IM2.bmp", "IMG_IM/IM3.bmp", "IMG_IM/IM4.bmp", "IMG_IM/IM5.bmp", "IMG_IM/IM6.bmp", "IMG_IM/IM7.bmp", "IMG_IM/IM8.bmp", "IMG_IM/IM9.bmp", "IMG_IM/IM10.bmp", "IMG_IM/IM11.bmp", "IMG_IM/IM12.bmp", "IMG_IM/IM13.bmp", "IMG_IM/IM14.bmp", "IMG_IM/IM15.bmp"];
// 定义刺激矩阵,movielist= [1,2,3,4,5…,15]([0,1,2,3,……,14]);
var IMGIMlist = new Array();
for (var i = 0; i < 15; i++) {
    IMGIMlist.push(i);
}
//
IMGIMlist.Shuffle = function () {
    var total = this.length;
    for (var j = total - 1; j > 0; j--) {
        // n-1 递减；Math.floor()用来向下取整；
        // Math.random()可以生成一个0-1之间的随机整数，即 0≤A<1
        // 因此Math.floor(Math.random() * j);一句是生成0到j - 1之间的随机整数。
        var index = Math.floor(Math.random() * j);
        // 将两个元素的值互换
        [this[j], this[index]] = [this[index], this[j]];
    }
    return this;
}
// movielist.Shuffle函数
IMGIMlist.Shuffle();

// (2)-(2):NO组
var IMGNO = ["IMG_NO/No1.bmp", "IMG_NO/No2.bmp", "IMG_NO/No3.bmp", "IMG_NO/No4.bmp", "IMG_NO/No5.bmp", "IMG_NO/No6.bmp", "IMG_NO/No7.bmp", "IMG_NO/No8.bmp", "IMG_NO/No9.bmp", "IMG_NO/No10.bmp"]
var IMGNOlist = new Array();
for (var i = 0; i < 10; i++) {
    IMGNOlist.push(i);
}
IMGNOlist.Shuffle = function () {
    var total = this.length;
    for (var j = total - 1; j > 0; j--) {
        var index = Math.floor(Math.random() * j);
        [this[j], this[index]] = [this[index], this[j]];
    }
    return this;
}
IMGNOlist.Shuffle();
//     
// (2)-(3):PE组
var IMGPE = ["IMG_PE/PE1.bmp", "IMG_PE/PE2.bmp", "IMG_PE/PE3.bmp", "IMG_PE/PE4.bmp", "IMG_PE/PE5.bmp", "IMG_PE/PE6.bmp", "IMG_PE/PE7.bmp", "IMG_PE/PE8.bmp", "IMG_PE/PE9.bmp", "IMG_PE/PE10.bmp", "IMG_PE/PE11.bmp", "IMG_PE/PE12.bmp", "IMG_PE/PE13.bmp", "IMG_PE/PE14.bmp", "IMG_PE/PE15.bmp"]
var IMGPElist = new Array();
for (var i = 0; i < 15; i++) {
    IMGPElist.push(i);
}
IMGPElist.Shuffle = function () {
    var total = this.length;
    for (var j = total - 1; j > 0; j--) {
        var index = Math.floor(Math.random() * j);
        [this[j], this[index]] = [this[index], this[j]];
    }
    return this;
}
IMGPElist.Shuffle();
//     
// 整合
var Block1 = [IMGPE[IMGPElist[0]], IMGPE[IMGPElist[1]], IMGPE[IMGPElist[2]], IMGIM[IMGIMlist[0]], IMGIM[IMGIMlist[1]], IMGIM[IMGIMlist[2]], IMGNO[IMGNOlist[0]], IMGNO[IMGNOlist[1]]];

var Block2 = [IMGPE[IMGPElist[3]], IMGPE[IMGPElist[4]], IMGPE[IMGPElist[5]], IMGIM[IMGIMlist[3]], IMGIM[IMGIMlist[4]], IMGIM[IMGIMlist[5]], IMGNO[IMGNOlist[2]], IMGNO[IMGNOlist[3]]];

var Block3 = [IMGPE[IMGPElist[6]], IMGPE[IMGPElist[7]], IMGPE[IMGPElist[8]], IMGIM[IMGIMlist[6]], IMGIM[IMGIMlist[7]], IMGIM[IMGIMlist[8]], IMGNO[IMGNOlist[4]], IMGNO[IMGNOlist[5]]];

var Block4 = [IMGPE[IMGPElist[9]], IMGPE[IMGPElist[10]], IMGPE[IMGPElist[11]], IMGIM[IMGIMlist[9]], IMGIM[IMGIMlist[10]], IMGIM[IMGIMlist[11]], IMGNO[IMGNOlist[6]], IMGNO[IMGNOlist[7]]];

var Block5 = [IMGPE[IMGPElist[12]], IMGPE[IMGPElist[13]], IMGPE[IMGPElist[14]], IMGIM[IMGIMlist[12]], IMGIM[IMGIMlist[13]], IMGIM[IMGIMlist[14]], IMGNO[IMGNOlist[8]], IMGNO[IMGNOlist[9]]];

// 每个block里试次随机，将PE、IM、NO打乱顺序；（横向随机）
var Blocklist = new Array();
for (var i = 0; i < 8; i++) {
    Blocklist.push(i);
}

Blocklist.Shuffle = function () {
    var total = this.length;
    for (var j = total - 1; j > 0; j--) {
        // n-1 递减；Math.floor()用来向下取整；
        // Math.random()可以生成一个0-1之间的随机整数，即 0≤A<1
        // 因此Math.floor(Math.random() * j);一句是生成0到j - 1之间的随机整数。
        var index = Math.floor(Math.random() * j);
        // 将两个元素的值互换
        [this[j], this[index]] = [this[index], this[j]];
    }
    return this;
}
// movielist.Shuffle函数
Blocklist.Shuffle();

//  形成随机后的每个Block；   
var B1_stimuli = [];
for (var q = 0; q < Blocklist.length; q++) {
    B1_stimuli.push({
        pic1: Block1[Blocklist[q]]
    });
}
var B2_stimuli = [];
for (var q = 0; q < Blocklist.length; q++) {
    B2_stimuli.push({
        pic2: Block2[Blocklist[q]]
    });
}
var B3_stimuli = [];
for (var q = 0; q < Blocklist.length; q++) {
    B3_stimuli.push({
        pic3: Block3[Blocklist[q]]
    });
}
var B4_stimuli = [];
for (var q = 0; q < Blocklist.length; q++) {
    B4_stimuli.push({
        pic4: Block4[Blocklist[q]]
    });
}
var B5_stimuli = [];
for (var q = 0; q < Blocklist.length; q++) {
    B5_stimuli.push({
        pic5: Block5[Blocklist[q]]
    });
}


// 3 实验部分
// 3.1 总指导语
var instructions = {
    type: "html-keyboard-response",
    stimulus: `
    <p style="font: 24pt 微软雅黑; color: black">
    在本实验中…… <br/>按任意键继续</p>`
};

// 3.2 Block1
// 3.2.1 情绪视频指导语
var instrucforEmotion = {
    type: "html-keyboard-response",
    stimulus: `<p style="font: 24pt 微软雅黑; color: black">
    接下来，你将会看到一个视频…… <br/>按任意键继续</p>`
};

// 3.2.2 注视点：500-1000ms随机
var fixation1 = {
    type: 'html-keyboard-response',
    stimulus: "+",
    choices: jsPsych.NO_KEYS,
    trial_duration: Math.floor(Math.random() * (1000 - 500 + 1) + 500),
}

// 3.2.3 情绪评分前测
var PreEmotion = {
    type: 'html-slider-response',
    data: {
        varname: 'PreEmotion'
    },
    on_load: function () {
        setSliderAttr()
    },
    stimulus: '你当前感受到的恐怖情绪程度如何？<br/>（1 = 丝毫没有感觉，9 = 感到非常恐怖）',
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    min: 1,
    max: 9,
    start: 5,
    prompt: '<b id="slider-value">_</b><br/><br/>',
    button_label: '继续',
    require_movement: true
}

// 3.2.4 播放恐怖视频
var choice1 =
    ['<span id="timer", style="color:rgb(0,0,0)">' + movieSeconds[movielist[0]] + '</span>秒后继续']
var movieplay1 = {
    type: 'video-button-response',
    sources: [movie[movielist[0]]], // 随机？
    prompt: '请戴上耳机，观看视频',
    choices: choice1,
    margin_vertical: '20px',
    autoplay: true,
    response_ends_trial: true,
    button_html: btn_html_timer
}
// 3.2.5 情绪评分后测
var PostEmotion = {
    type: 'html-slider-response',
    data: {
        varname: 'PostEmotion'
    },
    on_load: function () {
        setSliderAttr()
    },
    stimulus: '看完视频后，您当前感受到的恐怖情绪程度如何？<br/>（1 = 丝毫没有感觉，9 = 感到非常恐怖）',
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    min: 1,
    max: 9,
    start: 5,
    prompt: '<b id="slider-value">_</b><br/><br/>',
    button_label: '继续',
    require_movement: true
}
// 3.2.6 决策指导语
var instrucforDecision = {
    type: "html-keyboard-response",
    stimulus: `<p style="font: 24pt 微软雅黑; color: black">下面我们将阅读一段文字情境 <br/>假设您就是里面的主人翁，请以您自己的视角做出判断，判断没有对错之分 <br/>
        不要考虑太久，根据第一反应做出判断即可<br/>按任意键继续</p>`
};

// 3.2.7 决策过程
var fixation2 = {
    type: 'html-keyboard-response',
    stimulus: "+",
    choices: jsPsych.NO_KEYS,
    trial_duration: Math.floor(Math.random() * (500 - 200 + 1) + 200),
}
var test1 = {
    type: "image-keyboard-response",
    stimulus: jsPsych.timelineVariable("pic1"),
    choices: ['d', 'k'],
    prompt: tag_LR
}
var test_procedure = {
    timeline: [fixation2, test1],
    timeline_variables: B1_stimuli
}

// 3.2.8 情绪后测2
var PostEmotion2 = {
    type: 'html-slider-response',
    data: {
        varname: 'PostEmotion2'
    },
    on_load: function () {
        setSliderAttr()
    },
    stimulus: '看完视频后，您当前感受到的恐怖情绪程度如何？<br/>（1 = 丝毫没有感觉，9 = 感到非常恐怖）',
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    min: 1,
    max: 9,
    start: 5,
    prompt: '<b id="slider-value">_</b><br/><br/>',
    button_label: '继续',
    require_movement: true
}

// 3.2.9 休息时间
var rest = {
    type: 'html-button-response',
    stimulus: '<p>请休息10秒钟……</p>',
    choices: ['<span id="timer">10</span>秒后继续'],
    button_html: btn_html_timer,
    trial_duration: 10 * 1000
}
// 3.2.10 alert
var clock = {
    type: 'audio-button-response',
    stimulus: 'Sound/clock.m4a',
    choices: ['继续'],
    prompt: "<p>休息结束，请做好准备……</p>",
    button_html: btn_html_timerreset,
}
// 4 其他4个Block
// 4.1 Block2
var choice2 =
    ['<span id="timer", style="color:rgb(0,0,0)">' + movieSeconds[movielist[1]] + '</span>秒后继续']
var movieplay2 = {
    type: 'video-button-response',
    sources: [movie[movielist[1]]], // 随机？
    prompt: '请戴上耳机，观看视频',
    choices: choice2,
    margin_vertical: '20px',
    autoplay: true,
    response_ends_trial: true,
    button_html: btn_html_timer
}
var test2 = {
    type: "image-keyboard-response",
    stimulus: jsPsych.timelineVariable("pic2"),
    choices: ['d', 'k'],
    prompt: tag_LR
}
var test_procedure2 = {
    timeline: [fixation2, test2],
    timeline_variables: B2_stimuli
}
// 4.2 Block3
var choice3 =
    ['<span id="timer", style="color:rgb(0,0,0)">' + movieSeconds[movielist[2]] + '</span>秒后继续']
var movieplay3 = {
    type: 'video-button-response',
    sources: [movie[movielist[2]]], // 随机？
    prompt: '请戴上耳机，观看视频',
    choices: choice3,
    margin_vertical: '20px',
    autoplay: true,
    response_ends_trial: true,
    button_html: btn_html_timer
}
var test3 = {
    type: "image-keyboard-response",
    stimulus: jsPsych.timelineVariable("pic3"),
    choices: ['d', 'k'],
    prompt: tag_LR
}
var test_procedure3 = {
    timeline: [fixation2, test3],
    timeline_variables: B3_stimuli
}
// 4.3 Block4
var choice4 =
    ['<span id="timer", style="color:rgb(0,0,0)">' + movieSeconds[movielist[3]] + '</span>秒后继续']
var movieplay4 = {
    type: 'video-button-response',
    sources: [movie[movielist[3]]], // 随机？
    prompt: '请戴上耳机，观看视频',
    choices: choice4,
    margin_vertical: '20px',
    autoplay: true,
    response_ends_trial: true,
    button_html: btn_html_timer
}
var test4 = {
    type: "image-keyboard-response",
    stimulus: jsPsych.timelineVariable("pic4"),
    choices: ['d', 'k'],
    prompt: tag_LR
}
var test_procedure4 = {
    timeline: [fixation2, test4],
    timeline_variables: B4_stimuli
}
// 4.3 Block5
var choice5 =
    ['<span id="timer", style="color:rgb(240,240,240)">' + movieSeconds[movielist[4]] + '</span>秒后继续']
var movieplay5 = {
    type: 'video-button-response',
    sources: [movie[movielist[4]]], // 随机？
    prompt: '请戴上耳机，观看视频',
    choices: choice5,
    margin_vertical: '20px',
    autoplay: true,
    response_ends_trial: true,
    button_html: btn_html_timer
}
var test5 = {
    type: "image-keyboard-response",
    stimulus: jsPsych.timelineVariable("pic5"),
    choices: ['d', 'k'],
    prompt: tag_LR
}
var test_procedure5 = {
    timeline: [fixation2, test5],
    timeline_variables: B5_stimuli
}
// 5 整合Block
// 5.1 各个Block
var Test_Block1 = {
    timeline: [
        instrucforEmotion,
        fixation1,
        PreEmotion,
        movieplay1,
        PostEmotion,
        instrucforDecision,
        test_procedure,
        PostEmotion2,
        rest,
        clock,
    ]
}
var Test_Block2 = {
    timeline: [
        instrucforEmotion,
        fixation1,
        PreEmotion,
        movieplay2,
        PostEmotion,
        instrucforDecision,
        test_procedure2,
        PostEmotion2,
        rest,
        clock,
    ]
}
var Test_Block3 = {
    timeline: [
        instrucforEmotion,
        fixation1,
        PreEmotion,
        movieplay3,
        PostEmotion,
        instrucforDecision,
        test_procedure3,
        PostEmotion2,
        rest,
        clock,
    ]
}
var Test_Block4 = {
    timeline: [
        instrucforEmotion,
        fixation1,
        PreEmotion,
        movieplay4,
        PostEmotion,
        instrucforDecision,
        test_procedure4,
        PostEmotion2,
        rest,
        clock,
    ]
}
var Test_Block5 = {
    timeline: [
        instrucforEmotion,
        fixation1,
        PreEmotion,
        movieplay5,
        PostEmotion,
        instrucforDecision,
        test_procedure5,
        PostEmotion2,
    ]
}
// 
var Main_Timeline = [
    open_fullscreen,
    welcome,
    demographics,
    instructions,
    Test_Block1,
    Test_Block2,
    Test_Block3,
    Test_Block4,
    Test_Block5,
]

jsPsych.init({
    //前面的timeline是对象的属性名称，后面的timeline是我们定义的，是这个属性的具体值。
    timeline: Main_Timeline,
    use_webaudio: false,
    on_finish: function () {
        jsPsych.data.get().localSave('csv', `data_exp_Neutral_${subID}.csv`) // download from browser
        document.getElementById('jspsych-content').innerHTML += '实验结束，感谢您的参与！'
    }
})