import { db } from "./firebase-config.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// =========================
// Live Date
// =========================

const liveDate = document.getElementById("liveDate");

if (liveDate) {

    liveDate.innerHTML = new Date().toLocaleString("hi-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}

// =========================
// Breaking News
// =========================

const breaking = document.getElementById("breakingNews");

onValue(ref(db, "settings"), (snapshot) => {

    if (!snapshot.exists()) return;

    const data = snapshot.val();

    if (breaking && data.breakingNews) {

        breaking.innerHTML = data.breakingNews;

    }

});

// =========================
// Load News
// =========================

const heroNews = document.getElementById("heroNews");
const sideNews = document.getElementById("sideNews");
const latestNews = document.getElementById("latestNews");

onValue(ref(db, "news"), (snapshot) => {

    if (!snapshot.exists()) return;

    const news = Object.entries(snapshot.val()).reverse();

    if (heroNews) heroNews.innerHTML = "";
    if (sideNews) sideNews.innerHTML = "";
    if (latestNews) latestNews.innerHTML = "";

    news.forEach(([id, item], index) => {

        // Hero News
        if (index === 0 && heroNews) {

            heroNews.innerHTML = `
                <a href="news.html?id=${id}" style="text-decoration:none;color:#000;">

                    <img src="${item.image}"
                    style="width:100%;height:420px;object-fit:cover;">

                    <div style="padding:20px">

                        <span style="color:red;font-weight:bold;">
                        ${item.category}
                        </span>

                        <h2>${item.title}</h2>

                        <p>
                        ${item.description.replace(/<[^>]*>/g,"").substring(0,180)}...
                        </p>

                    </div>

                </a>
            `;

            return;

        }

        // Side News
        if (index > 0 && index < 5 && sideNews) {

            sideNews.innerHTML += `
                <a href="news.html?id=${id}" style="text-decoration:none;color:#000">

                    <div class="news-card">

                        <img src="${item.image}">

                        <div class="content">

                            <h3>${item.title}</h3>

                        </div>

                    </div>

                </a>
            `;

        }

        // Latest News
        if (latestNews) {

            latestNews.innerHTML += `
                <a href="news.html?id=${id}" style="text-decoration:none;color:#000">

                    <div class="news-card">

                        <img src="${item.image}">

                        <div class="content">

                            <small style="color:red">
                            ${item.category}
                            </small>

                            <h3>${item.title}</h3>

                            <p>

                            ${item.description.replace(/<[^>]*>/g,"").substring(0,120)}...

                            </p>

                        </div>

                    </div>

                </a>
            `;

        }

    });

});
