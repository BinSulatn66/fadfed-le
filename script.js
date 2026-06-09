(function() {
    var ventInput = document.getElementById('ventInput');
    var submitBtn = document.getElementById('submitBtn');
    var typingIndicator = document.getElementById('typing-indicator');
    var responseContainer = document.getElementById('response-container');
    var responseText = document.getElementById('responseText');
    var historySection = document.getElementById('historySection');
    var historyList = document.getElementById('historyList');

    var history = [];

    // Initialize History
    try {
        var stored = localStorage.getItem('fadfed_history');
        if (stored) {
            history = JSON.parse(stored);
        }
    } catch (e) {
        console.log('LocalStorage unavailable, using in-memory state');
    }

    function cleanupHistory() {
        var now = Date.now();
        var oneDay = 24 * 60 * 60 * 1000;
        var modified = false;
        
        history = history.filter(function(item) {
            var keep = (now - item.timestamp) < oneDay;
            if (!keep) modified = true;
            return keep;
        });

        if (modified) saveHistory();
        renderHistory();
    }

    function saveHistory() {
        try {
            localStorage.setItem('fadfed_history', JSON.stringify(history));
        } catch (e) {}
    }

    function formatTimeRemaining(timestamp) {
        var now = Date.now();
        var diff = (24 * 60 * 60 * 1000) - (now - timestamp);
        if (diff <= 0) return 'تدمير الآن';
        
        var hours = Math.floor(diff / (1000 * 60 * 60));
        var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return 'تدمير ذاتي بعد ' + hours + ' ساعة و ' + mins + ' دقيقة';
        }
        return 'تدمير ذاتي بعد ' + mins + ' دقيقة';
    }

    function renderHistory() {
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }

        historySection.style.display = 'block';
        historyList.innerHTML = '';

        // Show newest first
        for (var i = history.length - 1; i >= 0; i--) {
            var item = history[i];
            var card = document.createElement('div');
            card.className = 'history-card';
            
            var ventDiv = document.createElement('div');
            ventDiv.className = 'vent-content';
            ventDiv.innerText = item.vent;
            
            var roastDiv = document.createElement('div');
            roastDiv.className = 'roast-content';
            roastDiv.innerText = 'بوك: ' + item.roast;
            
            var timerSpan = document.createElement('span');
            timerSpan.className = 'self-destruct-timer';
            timerSpan.innerText = '⏳ ' + formatTimeRemaining(item.timestamp);
            
            card.appendChild(ventDiv);
            card.appendChild(roastDiv);
            card.appendChild(timerSpan);
            historyList.appendChild(card);
        }
    }

    var roasts = {
        money: [
            "أقول قم بس قم ونم، الهواجيس هذه ما بتسدد فاتورة جوالك بكرا هههههه",
            "طفران؟ وش الجديد.. الرصيد 1.5 ريال وتفكر في PIF؟ رح نم بس",
            "تطلب تمويل من الـ VC وأنت حتى حق علبة موية ما عندك؟ كثر منها",
            "خذلك سلفة من مخدتك أبرك لك من هالسوالف"
        ],
        nicotine: [
            "خلصت الـ Desert وقمت تفضفض؟ رح اطلب لك وحدة ثانية وريحنا",
            "النيكوتين لاعب في حسبتك.. رح نم وخل الهواجيس لأهلها",
            "تدور نيكوتين في نص الليل؟ هذا اللي ناقصنا والله"
        ],
        general: [
            "أقول قم بس قم ونم، الهواجيس هذي ما بتسدد فاتورة جوالك بكرا هههههه",
            "فضفض فضفض.. جالس أسمعك وأضحك عليك بنفس الوقت",
            "ترا محد مهتم، رح نم وبكرا يحلها ألف حلال",
            "هواجيس الليل هذي علاجها الفراش وبس.. فارقنا",
            "جالس تسولف لي وأنت تدري إني بجحدك بكرا؟"
        ]
    };

    submitBtn.onclick = function() {
        var text = ventInput.value.trim();
        if (!text) return;

        submitBtn.disabled = true;
        responseContainer.style.display = 'none';
        typingIndicator.style.display = 'block';

        var delay = 1500 + (Math.random() * 2000);

        setTimeout(function() {
            var selectedRoast = "";
            var lowerText = text.toLowerCase();

            if (lowerText.indexOf("طفران") !== -1 || lowerText.indexOf("فلوس") !== -1 || lowerText.indexOf("وظيفة") !== -1 || lowerText.indexOf("رصيد") !== -1) {
                selectedRoast = roasts.money[Math.floor(Math.random() * roasts.money.length)];
            } else if (lowerText.indexOf("نيكوتين") !== -1 || lowerText.indexOf("دزرت") !== -1 || lowerText.indexOf("desert") !== -1 || lowerText.indexOf("سجائر") !== -1) {
                selectedRoast = roasts.nicotine[Math.floor(Math.random() * roasts.nicotine.length)];
            } else {
                selectedRoast = roasts.general[Math.floor(Math.random() * roasts.general.length)];
            }

            typingIndicator.style.display = 'none';
            responseText.innerText = selectedRoast;
            responseContainer.style.display = 'block';
            
            // Add to History
            history.push({
                vent: text,
                roast: selectedRoast,
                timestamp: Date.now()
            });
            saveHistory();
            renderHistory();

            ventInput.value = "";
            submitBtn.disabled = false;
        }, delay);
    };

    // Initial Load
    cleanupHistory();
    // Refresh timers every minute
    setInterval(cleanupHistory, 60000);
})();