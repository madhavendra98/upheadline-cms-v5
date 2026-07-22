import { db } from "./firebase-config.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// =====================
// Get News ID
// =====================

const params = new URLSearchParams(window.location.search);

const newsId = params.get("id");

const newsDetails = document.getElementById("newsDetails");

const relatedNews = document.getElementById("relatedNews");

if (!newsId) {

    newsDetails.innerHTML = "<h2>News Not Found</h2>";

} else {

    onValue(ref(db, "news"), (snapshot) => {

        if (!snapshot.exists()) {

            newsDetails.innerHTML = "<h2>No News Found</h2>";

            return;

        }

        const allNews = snapshot.val();

        const news = allNews[newsId];

        if (!news) {

            newsDetails.innerHTML = "<h2>News Not Found</h2>";

            return;

        }

        document.title = news.title + " | UPHeadline";

        const pageUrl = window.location.href;

        newsDetails.innerHTML = `

<img src="${news.image}" class="news-main-image">

${news.caption ? `
<div class="photo-caption">

📷 ${news.caption}

</div>
` : ""}

<div class="news-category">

${news.category || "Latest"}

</div>

<h1 class="news-title">

${news.title}

</h1>

<div class="news-meta">

👤 ${news.reporter || "UPHeadline"} |

📅 ${news.publishDate || ""}

</div>

<div class="news-content">

${news.description}

</div>

<div class="share-box">

<h3>Share News</h3>

<a class="wa"
target="_blank"
href="https://wa.me/?text=${encodeURIComponent(news.title+" "+pageUrl)}">

WhatsApp

</a>

<a class="fb"
target="_blank"
href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}">

Facebook

</a>

<a class="x"
target="_blank"
href="https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(news.title)}">

X

</a>

</div>

`;

        // =====================
        // Related News
        // =====================

        relatedNews.innerHTML = "";

        Object.entries(allNews).reverse().forEach(([id, item]) => {

            if (id === newsId) return;

            relatedNews.innerHTML += `

<a href="news.html?id=${id}"
style="text-decoration:none;color:#000;">

<div class="news-card">

<img src="${item.image}">

<div class="content">

<small style="color:red">

${item.category}

</small>

<h3>

${item.title}

</h3>

<p>

${(item.description || "")
.replace(/<[^>]*>/g,"")
.substring(0,100)}...

</p>

</div>

</div>

</a>

`;

        });

    });

}
