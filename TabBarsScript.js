//Скрипт служит для функционирования TabBar с сохранением состояния в localStorage
var isFading = true; //Определяет, должен-ли контент появляться постепенно.
var fadeTime = 300; //Определяет время появления контента (in ms) 
var contentDivPrefix = "tabBar1_contDiv";
var tabsCount = 7;

//Добавление возможности сохранения состояния вкладок в LocalStorage
//Состояние конкретного TabBar-а планируется хранить в виде: key="tb[tabbarnumber]"   item=[activetabindex]
//Так как активной в данном TabBar-е может быть только одна вкладка, то достаточно хранить сосстояние, содержащее
//только идентификатор TabBara в качестве ключа, и индекс активной вкладки в качестве значения.
//Т.е. состояние TabBar-а с номером 1, в котором активна вкладка с индексом 3, будет выглядеть так: key="tb1"   item="3".
//id div-а, соответствующего TabBar-у с номером 1, должен иметь вид: <div id="tb1">
//id div-а, соответствующего tab-у с индексом 3, должен иметь вид: <div id="tb1_tab3">
//========================================================================================================================

//Проверка доступности localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be presenteverything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

window.onload = function () {
    restoreStateFromLS('tb1');
};

function restoreStateFromLS(tabbarid) {
    
    if (storageAvailable('localStorage')) {//Проверка доступности localStorage
        // Код, который выполняется, если localStorage доступно
        //Так как при первой загрузке должна активизироваться первая вкладка (с индеком 0), то
        //проверяем localStorage на присутствие ранее сохраненных состояний с ключом "tb1"
        var item = localStorage.getItem(tabbarid);
        if ((item === null) || (item === "undefined")) {    //Если хранилище пустое
            var startitem = "0";
            localStorage.setItem(tabbarid, startitem);      //то присваиваем признак активности вкладке с индексом 0 и сохраняем состояние. key="tb1"   item="0"
            changeStateFromLS(tabbarid + "_" + "tab0");//"tb1_tab0"
        } else {
        //Если  в хранилище уже есть состояния с нужным ключом, то применяем его 
        changeStateFromLS(tabbarid + "_" + "tab" + item);
        }
    }else {
        // Код, который выполняется, если localStorage недоступно
    }
}

function changeStateFromLS(tabid) {

    var tabbarid = tabid.slice(0, 3); //"tb1_tab3"->"tb1"
    var item = localStorage.getItem(tabbarid);//После первой загрузки: key="tb1"  item="0". После клика на tab 3: key="tb1"  item="3"

    var activeTabNumber = getTabNumber(tabid);// "tb1_tab3"->"3"
    localStorage.setItem(tabbarid, activeTabNumber);//Сохраняем состояние key="tb1"   item="3".
    
    var tabbarnumber = getTabBarNumber(tabbarid.toString());//"tb1"->"1"

    var tab = (document.all) ? document.all(tabid.toString()) : document.getElementById(tabid);//Находим вкладку по id
    tab.className = "ATab" + tabbarnumber.toString();//Делаем активной

    var content = (document.all) ? document.all(contentDivPrefix + item.toString()) : document.getElementById(contentDivPrefix + item.toString());//Находим контент по id "tabBar1_contDiv0"
    content.className = "AContent" + tabbarnumber;//Делаем активным



    //var nid = stringIdTonumber(elemID);

    //    for (var i = 0; i < tabscount; i++) {
    //        if (i == nid) {
    //            setTabStateInLS(tabbarnumber, numberIdToStringId(tabprefix, i), "1");
    //        } else {
    //            setTabStateInLS(tabbarnumber, numberIdToStringId(tabprefix, i), "0");
    //        }
    //    }
    //    setContent(tabbarnumber, tabscount, tabprefix, divprefix);
}



    //Ищет tab, который нужно сделать активным, и присваивает ему стиль активной вкладки
    function setActiveTab(tabbarnumber, item) {
        var tabid = "tb" + tabbarnumber.toString() + "_" + "tab" + item.toString();//Вычисляем id вкладки
        var tab = (document.all) ? document.all(tabid) : document.getElementById(tabid);//Находим вкладку по id
        tab.className = "ATab" + tabbarnumber.toString();
    }
    //Ищет content, который нужно сделать активным, и присваивает ему стиль активного контента
    function setActiveContent(tabbarnumber, item) {
        var content = (document.all) ? document.all(divprefix + item.toString()) : document.getElementById(divprefix + item.toString());
        if (isFading) { fade(divprefix + item.toString(), 100, 0, fadeTime); }
        content.className = "AContent" + tabbarnumber.toString();
    }

    //Получение номеров TabBar-а и tab-а из ключа key, который сохраняется в localStorage
    function getTabBarNumber(key) {
        return key[key.length - 1];//tb1 -> 1
    }
    //Получение индекса tab-а из его id
    function getTabNumber(tabid) {
        return tabid[tabid.length - 1];////tb1_tab3 -> 3
    }

    //Получение Key из id tab-а
    function getKeyFromId(tabid) {
        return tabid.slice(0, 7);
    }

    //Сохранение состояния вкладки, по которой кликнули, в localStorage
    //Так как при клике на tab-е должно устанавливаться и сохраняться активное состояние, 
    //то элементу с этим id присваиваем состояние "1". Т.е. вызовы д.б. saveState(tabid, "1")
    function saveState(tabid, state) {//tabid="tb1_tab3" 
        var key = getKeyFromId(tabid);//key="tb1_tab3" 
        localStorage.setItem(key, state);//"tb1_tab3", "1"
    }

    function getState(tabid) {
        localStorage.getItem(tabid);
    }

    function getTabStateFromLS(tabbarnumber, tabprefix, i) {
        var tab = (document.all) ? document.all(tabprefix + i.toString()) : document.getElementById(tabprefix + i.toString());
        var state = "0";//Так как localStorage принимает параметры только в строковом виде, то обозначаем неактивное состояние вкладки как "0", а активное как "1" 
        if (tab.className == 'ATab' + i.toString()) {
            state = "1";
        } else { state = "0" };
        return state;
    }
    //==========================================================================================


    function stringIdTonumber(stringId) {
        stringId = stringId.slice(stringId.length - 4); //tabBar0_tab0 --> tab0
        var pos = stringId.length - 1;
        return parseInt(stringId.charAt(pos), 10);//10-основание счисления числовой строки. Всегда используем 10, т.к. применяем десятичную систему счисления
    }

    function numberIdToStringId(tabprefix, numberId) {
        return tabprefix + numberId.toString();
    }


    function getTabState(tabbarnumber, tabprefix, i){
        var tab = (document.all) ? document.all(tabprefix + i.toString()) : document.getElementById(tabprefix + i.toString());
        var state = false;
        if (tab.className == 'ATab' + i.toString()) {
            state = true;
        } else { state = false };
        return state;
    }

    function setTabState(tabbarnumber, sid, state) {
        var tab = (document.all) ? document.all(sid) : document.getElementById(sid);  
        if (state == true) {
            tab.className = "ATab" + tabbarnumber.toString();
        } else {
            tab.className = "ITab" + tabbarnumber.toString();
        }
    }

    // getTabState(1, 'tabBar1_tab', 0)

    function changeState(tabbarnumber, tabscount, elemID, tabprefix, divprefix) {
        var nid = stringIdTonumber(elemID);
        for (var i = 0; i < tabscount; i++) {
            if (i == nid) {
                setTabState(tabbarnumber, numberIdToStringId(tabprefix, i), true);
            } else {
                setTabState(tabbarnumber, numberIdToStringId(tabprefix, i), false);
            }
        }
        setContent(tabbarnumber, tabscount, tabprefix, divprefix);
    }

    function setContent(tabbarnumber, tabscount, tabprefix, divprefix) {
        for (var i = 0; i < tabscount; i++) {
            var tab = (document.all) ? document.all(tabprefix + i.toString()) : document.getElementById(tabprefix + i.toString());
            if (tab.className == ("ITab" + tabbarnumber.toString())) {
                var div = (document.all) ? document.all(divprefix + i.toString()) : document.getElementById(divprefix + i.toString());
                if (isFading) { fade(divprefix + i.toString(), 100, 0, fadeTime); }

                div.className = "IContent" + tabbarnumber.toString();
            } else {
                var div1 = (document.all) ? document.all(divprefix + i.toString()) : document.getElementById(divprefix + i.toString());
                if (isFading) { fade(divprefix + i.toString(), 0, 100, fadeTime); }
                div1.className = "AContent" + tabbarnumber.toString();
            }
        }
    }

    function setOpacity(eID, opacityLevel) {
        var eStyle = document.getElementById(eID).style;
        eStyle.opacity = opacityLevel / 100;
        eStyle.filter = 'alpha(opacity=' + opacityLevel + ')';
    }

    function fade(eID, startOpacity, stopOpacity, duration) {
        var speed = Math.round(duration / 100);
        var timer = 0;
        if (startOpacity < stopOpacity) {
            for (var i = startOpacity; i <= stopOpacity; i++) {
                setTimeout("setOpacity('" + eID + "'," + i + ")", timer * speed);
                timer++;
            }
            return;
        }
        for (var i = startOpacity; i >= stopOpacity; i--) {
            setTimeout("setOpacity('" + eID + "'," + i + ")", timer * speed);
            timer++;
        }
    }