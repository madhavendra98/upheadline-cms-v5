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
// ======================
// Show Published News
// ======================

const newsList = document.getElementById("newsList");

onValue(ref(db, "news"), (snapshot) => {

    if (!newsList) return;

    newsList.innerHTML = "";

    if (!snapshot.exists()) {

        newsList.innerHTML = `
        <div class="news-card">
            <h3>No News Published</h3>
        </div>`;
        return;
    }

    const data = snapshot.val();

    Object.entries(data).reverse().forEach(([id, news]) => {

        newsList.innerHTML += `

<div class="news-card">

<img src="${news.image}" alt="">

<div class="news-content">

<span style="color:red;font-weight:bold">
${news.category}
</span>

<h3>${news.title}</h3>

<p>

👤 ${news.reporter || "UPHeadline"}

</p>

<p>

📸 ${news.caption || ""}

</p>

<p>

${news.description.replace(/<[^>]*>/g,"").substring(0,180)}...

</p>

<button onclick="editNews('${id}')">

✏ Edit

</button>

<button
onclick="deleteNews('${id}')"
style="background:#d32f2f">

🗑 Delete

</button>

</div>

</div>

`;

    });

});

// ======================
// Delete News
// ======================

import {
remove,
update
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

window.deleteNews = async function(id){

if(!confirm("Delete this news?"))

return;

await remove(ref(db,"news/"+id));

alert("Deleted Successfully");

}

// ======================
// Edit News
// ======================

window.editNews = async function(id){

const title=prompt("News Title");

if(title==null) return;

const reporter=prompt("Reporter");

if(reporter==null) return;

const caption=prompt("Photo Caption");

if(caption==null) return;

await update(ref(db,"news/"+id),{

title,

reporter,

caption

});

alert("Updated");

}

// ======================
// Search News
// ======================

window.searchNews=function(){

const keyword=document
.getElementById("search")
.value
.toLowerCase();

const cards=document
.querySelectorAll(".news-card");

cards.forEach(card=>{

if(card.innerText
.toLowerCase()
.includes(keyword))

card.style.display="block";

else

card.style.display="none";

});

}
// ======================
// Save Breaking News
// ======================

window.saveBreakingNews = async function () {

    const text = document
        .getElementById("breakingNews")
        .value
        .trim();

    if (!text) {

        alert("Breaking News लिखें");

        return;

    }

    await set(ref(db, "settings"), {

        breakingNews: text

    });

    alert("✅ Breaking News Saved");

};

// ======================
// Load Breaking News
// ======================

const breakingInput =
document.getElementById("breakingNews");

if (breakingInput) {

    onValue(ref(db, "settings"), (snapshot) => {

        if (!snapshot.exists()) return;

        const data = snapshot.val();

        if (data.breakingNews) {

            breakingInput.value =
            data.breakingNews;

        }

    });

}

// ======================
// Dashboard Live Counter
// ======================

onValue(ref(db,"news"),(snapshot)=>{

if(!snapshot.exists()) return;

const news=Object.values(snapshot.val());

document.getElementById("totalNews").innerText=news.length;

document.getElementById("featuredNews").innerText=

news.filter(n=>n.featured).length;

document.getElementById("breakingCount").innerText=

news.filter(n=>n.breaking).length;

});

// ======================
// Total Images Counter
// ======================

const imageCounter=document.getElementById("totalImages");

if(imageCounter){

onValue(ref(db,"news"),(snapshot)=>{

if(!snapshot.exists()){

imageCounter.innerText=0;

return;

}

const news=Object.values(snapshot.val());

imageCounter.innerText=

news.filter(n=>n.image).length;

});

}

// ======================
// Auto Image Preview
// ======================

const imageFile=document.getElementById("imageFile");

if(imageFile){

imageFile.addEventListener("change",function(e){

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(ev){

const preview=document.getElementById("preview");

if(preview){

preview.src=ev.target.result;

preview.style.display="block";

}

}

reader.readAsDataURL(file);

});

}

// ======================
// Clear Form
// ======================

window.clearForm=function(){

document.getElementById("title").value="";

document.getElementById("reporter").value="";

document.getElementById("caption").value="";

document.getElementById("seoTitle").value="";

document.getElementById("seoDescription").value="";

document.getElementById("tags").value="";

document.getElementById("featured").checked=false;

document.getElementById("breaking").checked=false;

document.getElementById("imageFile").value="";

window.quill.setContents([]);

}

// ======================

console.log("✅ UPHeadline CMS V5 Loaded Successfully");
