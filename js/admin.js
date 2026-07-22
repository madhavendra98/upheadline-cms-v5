import { db } from "./firebase-config.js";

import {
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ======================
// ImgBB API Key
// ======================

const IMGBB_KEY = "YOUR_IMGBB_API_KEY";

// ======================
// Dashboard Counter
// ======================

const totalNews = document.getElementById("totalNews");
const featuredNews = document.getElementById("featuredNews");
const breakingCount = document.getElementById("breakingCount");

onValue(ref(db, "news"), (snapshot) => {

    if (!snapshot.exists()) return;

    const data = snapshot.val();

    const list = Object.values(data);

    totalNews.innerText = list.length;

    featuredNews.innerText =
        list.filter(n => n.featured).length;

    breakingCount.innerText =
        list.filter(n => n.breaking).length;

});

// ======================
// Publish News
// ======================

window.publishNews = async function () {

    const title = document.getElementById("title").value.trim();

    const reporter = document.getElementById("reporter").value.trim();

    const category = document.getElementById("category").value;

    const caption = document.getElementById("caption").value.trim();

    const seoTitle = document.getElementById("seoTitle").value.trim();

    const seoDescription =
        document.getElementById("seoDescription").value.trim();

    const tags =
        document.getElementById("tags").value.trim();

    const featured =
        document.getElementById("featured").checked;

    const breaking =
        document.getElementById("breaking").checked;

    const description =
        window.quill.root.innerHTML;

    const file =
        document.getElementById("imageFile").files[0];

    if (!title || !description) {

        alert("Title और Description भरें");

        return;

    }

    let image = "images/noimage.jpg";

    // Upload Image

    if (file) {

        const formData = new FormData();

        formData.append("image", file);

        const response = await fetch(
            "https://api.imgbb.com/1/upload?key=" + IMGBB_KEY,
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (result.success) {

            image = result.data.url;

        }

    }

    // Save News

    await push(ref(db, "news"), {

        title,

        reporter,

        category,

        caption,

        image,

        description,

        featured,

        breaking,

        seoTitle,

        seoDescription,

        tags,

        publishDate: new Date().toLocaleString("hi-IN"),

        timestamp: Date.now()

    });

    alert("✅ News Published Successfully");

    location.reload();

};
