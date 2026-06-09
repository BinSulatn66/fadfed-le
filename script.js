window.onerror = function(msg, url, lineNo, columnNo, error) {
    var diag = document.getElementById("error-diag");
    if (diag) {
        diag.style.display = "block";
        diag.innerHTML = "Error: " + msg + " at " + lineNo + ":" + columnNo;
    }
    return false;
};

window.onload = function() {
    var input = document.getElementById("input");
    var btn = document.getElementById("btn");
    var res = document.getElementById("response");
    var histDiv = document.getElementById("history");

    var history = [];
    var storageOK = false;

    try {
        var test = "t";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        storageOK = true;
    } catch (e) {}

    if (storageOK) {
        try {
            var data = localStorage.getItem("fadfed_v2");
            if (data) history = JSON.parse(data);
        } catch (e) {}
    }

    function save() {
        if (!storageOK) return;
        try {
            localStorage.setItem("fadfed_v2", JSON.stringify(history));
        } catch (e) {}
    }

    function render() {
        histDiv.innerHTML = "";
        var now = new Date().getTime();
        var day = 24 * 60 * 60 * 1000;
        var clean = [];

        for (var i = history.length - 1; i >= 0; i--) {
            var item = history[i];
            if (now - item.t < day) {
                clean.push(item);
                var div = document.createElement("div");
                div.className = "card";
                div.innerHTML = "<div>" + item.v + "</div><div style='color:#fbbf24'>بوك: " + item.r + "</div>";
                var rem = Math.floor((day - (now - item.t)) / 60000);
                var t = document.createElement("div");
                t.className = "timer";
                t.innerHTML = "تدمير بعد " + rem + " دقيقة";
                div.appendChild(t);
                histDiv.appendChild(div);
            }
        }
        history = clean.reverse();
        save();
    }

    btn.onclick = function() {
        var val = input.value.trim();
        if (!val) return;
        btn.disabled = true;
        res.style.display = "block";
        res.innerHTML = "بوك يفكر...";

        setTimeout(function() {
            var r = "أقول قم بس قم ونم، الهواجيس هذه ما بتسدد فاتورة جوالك بكرا هههههه";
            res.innerHTML = "بوك: " + r;
            history.push({v: val, r: r, t: new Date().getTime()});
            save();
            render();
            input.value = "";
            btn.disabled = false;
        }, 1000);
    };

    render();
    setInterval(render, 60000);
};