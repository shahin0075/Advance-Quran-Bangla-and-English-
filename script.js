document.addEventListener("DOMContentLoaded", function () {
    const surahList = document.getElementById("surah-list");
    const surahContent = document.getElementById("surah-content");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // ডার্ক মোড টগল ফাংশন
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    }

    // লোড হলে ডার্ক মোড চেক করা
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", toggleDarkMode);

    // সূরার তালিকা লোড করা
    fetch("index.json")
        .then(response => response.json())
        .then(data => {
            surahList.innerHTML = ""; // পুরাতন তালিকা মুছে ফেলা
            data.forEach(surah => {
                const surahItem = document.createElement("div");
                surahItem.classList.add("surah-item");
                surahItem.innerHTML = `<strong>${surah.id}. ${surah.translation}</strong> (${surah.total_verses} আয়াত)`;
                surahItem.addEventListener("click", () => loadSurah(surah.id, surah.translation));
                surahList.appendChild(surahItem);
            });

            // লাস্ট রিড সূরা লোড করা
            const lastRead = localStorage.getItem("lastRead");
            if (lastRead) {
                const lastReadSurah = JSON.parse(lastRead);
                loadSurah(lastReadSurah.id, lastReadSurah.name, lastReadSurah.verse);
            }
        });

    // সূরা লোড ফাংশন
    function loadSurah(id, name, lastVerse = 1) {
        Promise.all([
            fetch(`quran_bn.json`).then(res => res.json()),
            fetch(`quran_en.json`).then(res => res.json())
        ]).then(([bnData, enData]) => {
            surahContent.innerHTML = `<h2>${name}</h2>`;
            bnData[id - 1].verses.forEach((verse, index) => {
                const ayahElement = document.createElement("div");
                ayahElement.classList.add("ayah");
                ayahElement.innerHTML = `
                    <p class="arabic">${verse.arabic}</p>
                    <p class="bangla">${verse.translation}</p>
                    <p class="english">${enData[id - 1].verses[index].translation}</p>
                `;
                surahContent.appendChild(ayahElement);
            });

            // লাস্ট রিড সূরা সংরক্ষণ
            localStorage.setItem("lastRead", JSON.stringify({ id, name, verse: lastVerse }));
        });
    }
});
