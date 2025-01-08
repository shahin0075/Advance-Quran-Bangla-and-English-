document.addEventListener("DOMContentLoaded", async function () {
    const surahList = document.getElementById("surahList");
    const surahTitle = document.getElementById("surahTitle");
    const ayahText = document.getElementById("ayahText");
    const translationBn = document.getElementById("translationBn");
    const translationEn = document.getElementById("translationEn");

    try {
        // Fetch সূরার তথ্য
        const response = await fetch("index.json");
        const chapters = await response.json();

        // Dropdown-এ সূরা লোড করা
        surahList.innerHTML = "";
        chapters.forEach(chapter => {
            let option = document.createElement("option");
            option.value = chapter.link;
            option.textContent = `(${chapter.id}) ${chapter.translation}`;
            surahList.appendChild(option);
        });

        // সূরা পরিবর্তনের ইভেন্ট
        surahList.addEventListener("change", function () {
            loadSurah(this.value);
        });

        // ডিফল্ট সূরা লোড
        loadSurah(surahList.value);
    } catch (error) {
        console.error("ডাটা লোড করতে সমস্যা হয়েছে:", error);
    }

    async function loadSurah(url) {
        try {
            const bnResponse = await fetch("quran_bn.json");
            const enResponse = await fetch("quran_en.json");

            const bnData = await bnResponse.json();
            const enData = await enResponse.json();

            // ডাটা দেখানো
            surahTitle.textContent = bnData.name;
            ayahText.innerHTML = bnData.verses.map(ayah => `<p>${ayah.text}</p>`).join("");
            translationBn.innerHTML = bnData.verses.map(ayah => `<p>${ayah.translation}</p>`).join("");
            translationEn.innerHTML = enData.verses.map(ayah => `<p>${ayah.translation}</p>`).join("");
        } catch (error) {
            console.error("সূরা লোড করতে সমস্যা হয়েছে:", error);
        }
    }
});
