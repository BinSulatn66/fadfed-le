(function() {
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

        var historyItems = [];
        var storageOK = false;

        try {
            var testKey = "t";
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            storageOK = true;
        } catch (e) {
            // Silently fail for private mode
        }

        if (storageOK) {
            try {
                var data = localStorage.getItem("fadfed_v2");
                if (data) {
                    historyItems = JSON.parse(data);
                }
            } catch (e) {
                historyItems = [];
            }
        }

        function save() {
            if (!storageOK) return;
            try {
                localStorage.setItem("fadfed_v2", JSON.stringify(historyItems));
            } catch (e) {}
        }

        function render() {
            if (!histDiv) return;
            histDiv.innerHTML = "";
            var now = new Date().getTime();
            var day = 24 * 60 * 60 * 1000;
            var clean = [];

            for (var i = historyItems.length - 1; i >= 0; i--) {
                var item = historyItems[i];
                if (now - item.t < day) {
                    clean.push(item);
                    var div = document.createElement("div");
                    div.className = "card";
                    
                    var ventText = document.createElement("div");
                    ventText.appendChild(document.createTextNode(item.v));
                    
                    var roastText = document.createElement("div");
                    roastText.style.color = "#fbbf24";
                    roastText.appendChild(document.createTextNode("بوك: " + item.r));
                    
                    div.appendChild(ventText);
                    div.appendChild(roastText);
                    
                    var rem = Math.floor((day - (now - item.t)) / 60000);
                    var t = document.createElement("div");
                    t.className = "timer";
                    t.appendChild(document.createTextNode("تدمير بعد " + rem + " دقيقة"));
                    
                    div.appendChild(t);
                    histDiv.appendChild(div);
                }
            }
            historyItems = clean.reverse();
            save();
        }

        if (btn) {
            btn.onclick = function() {
                var val = input.value.trim();
                if (!val) return;
                btn.disabled = true;
                if (res) {
                    res.style.display = "block";
                    res.innerHTML = "بوك يفكر...";
                }

                setTimeout(function() {
                    var r = "أقول قم بس قم ونم، الهواجيس هذه ما بتسدد فاتورة جوالك بكرا هههههه";
                    if (res) {
                        res.innerHTML = "";
                        res.appendChild(document.createTextNode("بوك: " + r));
                    }
                    historyItems.push({v: val, r: r, t: new Date().getTime()});
                    save();
                    render();
                    if (input) input.value = "";
                    btn.disabled = false;
                }, 1000);
            };
        }

        render();
        setInterval(render, 60000);
    };
})();