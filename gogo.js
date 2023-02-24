rendererOptions = {
    draggable: true,
    preserveViewport: false
}
var directionsDisplay =
new google.maps.DirectionsRenderer(rendererOptions);
var directionsService =
new google.maps.DirectionsService();
var map;
var markers = [];

function initialize() {
var zoom = 7;
var mapTypeId = google.maps.MapTypeId.ROADMAP
var opts = {
    zoom: zoom,
    mapTypeId: mapTypeId
}
map = new google.maps.Map
    (document.getElementById("map"), opts);
directionsDisplay.setMap(map);
google.maps.event.addListener(directionsDisplay,
    'directions_changed', function () {
    })
UserDestination = window.prompt("目的地を入力してください", "成瀬");
getPosition(UserDestination);
}

//ルート検索用関数
function calcRoute(start, end) {
var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.DirectionsUnitSystem.METRIC,
    optimizeWaypoints: true,
    avoidHighways: false,
    avoidTolls: false
};
directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(response);
    // コンビニ検索
    searchConvenienceStores(response.routes[0].overview_path);
    }
});
}

// コンビニ検索関数
function searchConvenienceStores(path) {
var service = new google.maps.places.PlacesService(map);
for (var i = 0; i < path.length; i++) {
    service.nearbySearch({
    location: path[i],
    radius: 50,
    type: ['convenience_store']
    }, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var j = 0; j < results.length; j++) {
        createMarker(results[j]);
        }
    }
    });
}
}

// マーカー作成関数
function createMarker(place) {
var marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    title: place.name
});
markers.push(marker);
}

// Geolocation APIに対応している
if (navigator.geolocation) {
alert("この端末では位置情報が取得できます");
// Geolocation APIに対応していない
} else {
alert("この端末では位置情報が取得できません");
}

// 現在地取得処理
function getPosition(UserDestination) {
navigator.geolocation.getCurrentPosition(
    // 取得成功した場合
    function (position) {
    alert("緯度:" + position.coords.latitude + ",経度" + position.coords.longitude);
    var idoInput = position.coords.latitude;
    var keidoInput = position.coords.longitude;
    //入力した緯度・経度を取得します。
    //緯度・経度をLatLngクラスに変換します。
    var latLngInput = new google.maps.LatLng(idoInput, keidoInput);

    //Google Maps APIのジオコーダを使います。
    var geocoder = new google.maps.Geocoder();

    //ジオコーダのgeocodeを実行します。
    //第１引数のリクエストパラメータにlatLngプロパティを設定します。
    //第２引数はコールバック関数です。取得結果を処理します。
    geocoder.geocode(
        {
        latLng: latLngInput
        },
        function (results, status) {

        var address = "";

        if (status == google.maps.GeocoderStatus.OK) {
            //取得が成功した場合

            //住所を取得します。
            address = results[0].formatted_address;

        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
            alert("住所が見つかりませんでした。");
        } else if (status == google.maps.GeocoderStatus.ERROR) {
            alert("サーバ接続に失敗しました。");
        } else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
            alert("リクエストが無効でした。");
        } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            alert("リクエストの制限回数を超えました。");
        } else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
            alert("サービスが使えない状態でした。");
        } else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
            alert("原因不明のエラーが発生しました。");
        }

        //住所の結果表示をします。
        document.getElementById('addressOutput').value = address;
        calcRoute(address,UserDestination);
        });
    },
    // 取得失敗した場合
    function (error) {
    switch (error.code) {
        case 1: //PERMISSION_DENIED
        alert("位置情報の利用が許可されていません");
        break;
        case 2: //POSITION_UNAVAILABLE
        alert("現在位置が取得できませんでした");
        break;
        case 3: //TIMEOUT
        alert("タイムアウトになりました");
        break;
        default:
        alert("その他のエラー(エラーコード:" + error.code + ")");
        break;
    }
    }

);

}
