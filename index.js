// 値格納用変数定義
var alpha = 0,
    beta = 0,
    gamma = 0,
    xa = 0,
    ya = 0,
    za = 0,
    xg = 0,
    yg = 0,
    zg = 0;

// イベントリスナー登録　ジャイロセンサ
window.addEventListener('deviceorientation', (event) => {
    alpha = event.alpha; // z軸
    beta = event.beta; // x軸
    gamma = event.gamma; // y軸
}, false);

// イベントリスナー登録　加速度センサ
window.addEventListener('devicemotion', (event) => {
    // 加速度
    xa = event.acceleration.x;
    ya = event.acceleration.y;
    za = event.acceleration.z;

    // 重力加速度
    xg = event.accelerationIncludingGravity.x;
    yg = event.accelerationIncludingGravity.y;
    zg = event.accelerationIncludingGravity.z;
}, false);

// 四捨五入関数
const orgRound = (value, base) => Math.round(value * base) / base

// 画面への表示
function displayData() {
    $('#gyroValues .alpha span:first').html(orgRound(alpha, 100))
    $('#gyroValues .beta span:first').html(orgRound(beta, 100))
    $('#gyroValues .gamma span:first').html(orgRound(gamma, 100))
    $('#accelerationValues .xa span:first').html(orgRound(xa, 100))
    $('#accelerationValues .ya span:first').html(orgRound(ya, 100))
    $('#accelerationValues .za span:first').html(orgRound(za, 100))
    $('#accelerationGravityValues .xg span:first').html(orgRound(xg, 100))
    $('#accelerationGravityValues .yg span:first').html(orgRound(yg, 100))
    $('#accelerationGravityValues .zg span:first').html(orgRound(zg, 100))
}

// リアルタイムで値を表示
const timer = window.setInterval(() => {
    displayData();
}, 0);


// データ範囲
var rangeGyro = [-180, 360];
var rangeAcceleration = [-50, 50];
var rangeAccelerationGravity = [-50, 50];

// 初期データ
var dataGyro = [{
    label: 'alpha',
    range: rangeGyro,
    values: []
}, {
    label: 'beta',
    range: rangeGyro,
    values: []
}, {
    label: 'gamma',
    range: rangeGyro,
    values: []
}, ];
var dataAcceleration = [{
    label: 'xa',
    range: rangeAcceleration,
    values: []
}, {
    label: 'ya',
    range: rangeAcceleration,
    values: []
}, {
    label: 'za',
    range: rangeAcceleration,
    values: []
}, ];
var dataAccelerationGravity = [{
    label: 'xg',
    range: rangeAccelerationGravity,
    values: []
}, {
    label: 'yg',
    range: rangeAccelerationGravity,
    values: []
}, {
    label: 'zg',
    range: rangeAccelerationGravity,
    values: []
}, ];

// グラフに表示させる時間の書式
const timeFormat = d => moment(d * 1000).format('HH:mm:ss');

// 初期化
const chartGyro = $('#chartGyro').epoch({
    type: 'time.line',
    data: dataGyro,
    axes: ['bottom', 'left', 'right'],
    range: {
        left: rangeGyro,
        right: rangeGyro
    },
    queueSize: 1,
    windowSize: 50,
    ticks: {
        time: 15,
        right: 12,
        left: 12
    },
    tickFormats: {
        bottom: timeFormat,
        left: (d) => (d).toFixed(0),
        right: (d) => (d).toFixed(0),
    },
});
const chartAcceleration = $('#chartAcceleration').epoch({
    type: 'time.line',
    data: dataAcceleration,
    axes: ['bottom', 'left', 'right'],
    range: { //軸の範囲
        left: rangeAcceleration,
        right: rangeAcceleration,
    },
    queueSize: 1,
    windowSize: 50,
    ticks: {
        time: 15,
        right: 15,
        left: 15
    },
    tickFormats: {
        bottom: timeFormat,
        left: (d) => (d).toFixed(2),
        right: (d) => (d).toFixed(2),
    },
});
const chartAccelerationGravity = $('#chartAccelerationGravity').epoch({
    type: 'time.line',
    data: dataAccelerationGravity,
    axes: ['bottom', 'left', 'right'],
    range: { //軸の範囲
        left: rangeAccelerationGravity,
        right: rangeAccelerationGravity,
    },
    queueSize: 1,
    windowSize: 50,
    ticks: {
        time: 15,
        right: 15,
        left: 15
    },
    tickFormats: {
        bottom: timeFormat,
        left: (d) => (d).toFixed(2),
        right: (d) => (d).toFixed(2),
    },
});

// リアルタイム表示処理
window.setInterval(() => {
    chartGyro.push(
        [{
            time: Date.now() / 1000,
            y: alpha,
        }, {
            time: Date.now() / 1000,
            y: beta,
        }, {
            time: Date.now() / 1000,
            y: gamma,
        }, ],
    );
    chartAcceleration.push(
        [{
            time: Date.now() / 1000,
            y: xa,
        }, {
            time: Date.now() / 1000,
            y: ya,
        }, {
            time: Date.now() / 1000,
            y: za,
        }, ],
    );
    chartAccelerationGravity.push(
        [{
            time: Date.now() / 1000,
            y: xg,
        }, {
            time: Date.now() / 1000,
            y: yg,
        }, {
            time: Date.now() / 1000,
            y: zg,
        }, ],
    );
}, 1000);

// デバイスへの許可
const deviceMotionRequest = () => {
    if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission()
            .then((permissionState) => {
                permissionState = 'granted';
                alert(permissionState);

            })
            .catch(console.error);
    } else {
        alert('DeviceMotionEvent.requestPermissionが見つかりません');
    }
}