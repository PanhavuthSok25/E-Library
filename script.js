document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#lawTableBody");

    if (!tableBody) {
        console.error("Error: Table body (#lawTableBody) not found.");
        return;
    }

    const searchFields = {
        id: document.querySelector("#searchId"),
        title: document.querySelector("#searchTitle"),
        type: document.querySelector("#searchType"),
        date: document.querySelector("#searchDate"),
        khmer: document.querySelector("#searchKhmer"),
        english: document.querySelector("#searchEnglish"),
        globalSearch: document.querySelector("#globalSearch")
    };

    // Merge both static data + uploaded files
    let allData = [];
    Object.values(pageData).forEach(page => allData.push(...page));

    const uploaded = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    uploaded.forEach((file, index) => {
        allData.push({
            id: "U-" + (index + 1), // give uploaded items a fake id
            title: file.title,
            type: file.category,
            date: file.date,
            khmer: file.khmerLink,
            english: file.englishLink || "" // if you add english upload later
        });
    });

    function getCurrentPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf("/") + 1) || "index.html";
    }

    function loadData(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6'>No data available</td></tr>";
            return;
        }

        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.type}</td>
                <td>${formatDate(item.date)}</td>
                <td><a href="${item.khmer}" target="_blank" download>Khmer</a></td>
                <td>${item.english ? `<a href="${item.english}" target="_blank" download>English</a>` : "-"}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function search() {
        let idQuery = searchFields.id?.value.trim().toLowerCase() || "";
        let titleQuery = searchFields.title?.value.trim().toLowerCase() || "";
        let typeQuery = searchFields.type?.value.trim().toLowerCase() || "";
        let dateQuery = searchFields.date?.value.trim().toLowerCase() || "";
        let khmerQuery = searchFields.khmer?.value.trim().toLowerCase() || "";
        let englishQuery = searchFields.english?.value.trim().toLowerCase() || "";
        let globalQuery = searchFields.globalSearch?.value.trim().toLowerCase() || "";

        let results = allData.filter(item => {
            return (!idQuery || item.id.toString().includes(idQuery)) &&
                (!titleQuery || item.title.toLowerCase().includes(titleQuery)) &&
                (!typeQuery || item.type.toLowerCase().includes(typeQuery)) &&
                (!dateQuery || item.date.toLowerCase().includes(dateQuery)) &&
                (!khmerQuery || item.khmer.toLowerCase().includes(khmerQuery)) &&
                (!englishQuery || item.english.toLowerCase().includes(englishQuery));
        });

        if (globalQuery) {
            results = results.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(globalQuery)
                )
            );
        }

        loadData(results);
    }

    Object.keys(searchFields).forEach(key => {
        if (searchFields[key]) {
            searchFields[key].addEventListener("input", search);
        }
    });

    const currentPage = getCurrentPage();
    if (pageData[currentPage]) {
        loadData(allData);
    }
});

// Reuse your date formatter
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return isNaN(date) ? dateStr : date.toLocaleDateString(undefined, options);
}
