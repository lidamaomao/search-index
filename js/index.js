const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

// https://www.baidu.com/s?wd=
// https://www.bing.com/search?q=

let searchType = "baidu";
let curCateIdx = 0;
let curCateData = null;
let data = [];
let pageStatus = "preview";

const searchMap = new Map();
searchMap.set("baidu", "https://www.baidu.com/s?wd=");
searchMap.set("bing", "https://www.bing.com/search?q=");

$$(".search-type-item").forEach(($item) => {
  $item.onclick = () => {
    $$(".search-type-item").forEach((item) => item.classList.remove("active"));
    $item.classList.add("active");
    searchType = $item.dataset.type;
  };
});

$("#search-icon").onclick = search;

$(".search-input input").onkeyup = (e) => {
  if (e.code === "Enter") search();
};

function search() {
  let url = searchMap.get(searchType) + $(".search-input input").value;
  console.log(url);
  const $link = document.createElement("a");
  $link.href = url;
  $link.target = "_blank";
  $link.click();
}

// const data = [
//   {
//     title: "常用网站",
//     data: [
//       {
//         name: "饥人谷",
//         url: "https://xiedaimala.com",
//       },
//       {
//         name: "V2EX",
//         url: "https://v2ex.com",
//       },
//     ],
//   },
//   {
//     title: "精品博客",
//     data: [
//       {
//         name: "阮一峰的网络日志",
//         url: "http://www.ruanyifeng.com/blog/",
//       },
//       {
//         name: "酷壳",
//         url: "http://coolshell.cn/",
//       },
//     ],
//   },
// ];
load();
render(data);

$(".icon-setting").onclick = () => {
  pageStatus = "setting";
  $("body").classList.remove("preview");
  $("body").classList.add("setting");
};

$(".icon-preview").onclick = () => {
  pageStatus = "preview";
  $("body").classList.remove("setting");
  $("body").classList.add("preview");
};

$(".icon-add").onclick = () => {
  $(".modal-category").classList.add("show");
};

$(".modal-category .btn.cancel").onclick = () => {
  $(".modal-category").classList.remove("show");
};

$(".modal-category .btn.confirm").onclick = () => {
  let title = $("#category").value;
  if (title === "") {
    alert("输入内容不能为空");
    return;
  }
  let obj = {
    title,
    data: [],
  };
  data.push(obj);
  render(data);
  save();
  $(".modal-category").classList.remove("show");
};

function render(data) {
  let websiteArr = data.map((objItem) => {
    const $websiteItem = document.createElement("div");
    $websiteItem.classList.add("websites-item");
    const $h2 = document.createElement("h2");
    $h2.append(objItem.title);
    const $iconSpan = document.createElement("span");
    $iconSpan.innerHTML = `<svg class="icon icon-delete" aria-hidden="true"><use xlink:href="#icon-shanchu"></use></svg><svg class="icon icon-xiugai" aria-hidden="true"><use xlink:href="#icon-xiugai"></use></svg>`;
    $h2.append($iconSpan);
    const $websitesList = document.createElement("ul");
    $websitesList.classList.add("websites-list");
    let $liArr = objItem.data.map((siteItem) => {
      const $li = document.createElement("li");
      $li.classList.add("tag");
      const $a = document.createElement("a");
      $a.setAttribute("href", siteItem.url);
      $a.setAttribute("target", "_blank");
      $a.innerText = siteItem.name;
      $li.innerHTML = `<svg class="icon icon-remove" aria-hidden="true"><use xlink:href="#icon-shanchu"></use></svg>`;
      $li.append($a);
      return $li;
    });
    const $li = document.createElement("li");
    $li.classList.add("icon-plus");
    $li.innerHTML = `<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianjia"></use></svg>`;
    $liArr.push($li);
    $websitesList.append(...$liArr);
    $websiteItem.append($h2, $websitesList);
    return $websiteItem;
  });
  $(".websites").innerHTML = "";
  $(".websites").append(...websiteArr);
}

$(".websites").onclick = (e) => {
  let $delete = e
    .composedPath()
    .find(
      ($node) => $node.classList && $node.classList.contains("icon-delete")
    );
  if ($delete) {
    let $result = e
      .composedPath()
      .filter(
        ($node) => $node.classList && $node.classList.contains("websites-item")
      );
    if ($result.length > 0) {
      let $item = $result[0];
      let index = [...$$(".websites-item")].indexOf($item);
      data.splice(index, 1);
      render(data);
      save();
    }
  }

  let $edit = e
    .composedPath()
    .find(
      ($node) => $node.classList && $node.classList.contains("icon-xiugai")
    );
  if ($edit) {
    let $result = e
      .composedPath()
      .filter(
        ($node) => $node.classList && $node.classList.contains("websites-item")
      );
    if ($result.length > 0) {
      let $item = $result[0];
      curCateIdx = [...$$(".websites-item")].indexOf($item);
      curCateData = data[curCateIdx].data;
      $(".modal-edit").classList.add("show");
      let value = $item.querySelector("h2").innerText;
      console.log(value);
      $("#edit").value = value;
    }
  }

  let $siteAddBtn = e
    .composedPath()
    .find(($node) => $node.classList && $node.classList.contains("icon-plus"));
  if ($siteAddBtn) {
    let $result = e
      .composedPath()
      .filter(
        ($node) => $node.classList && $node.classList.contains("websites-item")
      );
    let $item = $result[0];
    curCateIdx = [...$$(".websites-item")].indexOf($item);
    $(".modal-add").classList.add("show");
  }

  let $remove = e
    .composedPath()
    .find(
      ($node) => $node.classList && $node.classList.contains("icon-remove")
    );
  if ($remove) {
    let $tag = $remove.parentElement;
    let tagArr = [...$remove.parentElement.parentElement.children];
    let tagIndex = tagArr.indexOf($tag);
    console.log(tagIndex);
    let $result = e
      .composedPath()
      .filter(
        ($node) => $node.classList && $node.classList.contains("websites-item")
      );
    let $item = $result[0];
    curCateIdx = [...$$(".websites-item")].indexOf($item);
    data[curCateIdx].data.splice(tagIndex, 1);
    save();
    $tag.remove();
  }
};

$(".modal-edit .btn.confirm").onclick = () => {
  let title = $("#edit").value;
  if (title === "") {
    alert("输入内容不能为空");
    return;
  }
  let obj = {
    title,
    data: curCateData,
  };
  data[curCateIdx] = obj;
  render(data);
  save();
  $(".modal-edit").classList.remove("show");
};

$(".modal-edit .btn.cancel").onclick = () => {
  $(".modal-edit").classList.remove("show");
};

$(".modal-add .btn.cancel").onclick = () => {
  $(".modal-add").classList.remove("show");
};

$(".modal-add .btn.confirm").onclick = () => {
  let siteName = $("#site-name").value;
  let siteUrl = $("#site-url").value;
  if (siteName === "" || siteUrl === "") {
    alert("输入内容不能为空");
    return;
  }
  let obj = {
    name: siteName,
    url: siteUrl,
  };
  data[curCateIdx].data.push(obj);
  render(data);
  save();
  siteName = "";
  siteUrl = "";
  $(".modal-add").classList.remove("show");
};

function save() {
  localStorage.setItem("websites", JSON.stringify(data));
}

function load() {
  let storageData = localStorage.getItem("websites");
  if (storageData) {
    data = JSON.parse(storageData);
  } else {
    data = [];
  }
}
