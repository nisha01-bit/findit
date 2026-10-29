const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const tabs = document.querySelectorAll(".tab");
const itemGrid = document.getElementById("itemGrid");
const itemCount = document.getElementById("itemCount");
const emptyMessage = document.getElementById("emptyMessage");

let selectedType = "all";

function filterItems() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  let visibleCount = 0;

  document.querySelectorAll(".item-card").forEach((card) => {
    const type = card.dataset.type;
    const itemCategory = card.dataset.category;
    const searchText =
      `${card.dataset.search} ${card.querySelector("h3").textContent} ${card.querySelector(".item-meta").textContent}`.toLowerCase();

    const matchesKeyword = searchText.includes(keyword);
    const matchesType = selectedType === "all" || type === selectedType;
    const matchesCategory = category === "all" || itemCategory === category;

    const visible = matchesKeyword && matchesType && matchesCategory;
    card.hidden = !visible;

    if (visible) visibleCount++;
  });

  itemCount.textContent = `${visibleCount} item${visibleCount === 1 ? "" : "s"}`;
  emptyMessage.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterItems);
searchBtn.addEventListener("click", filterItems);
categoryFilter.addEventListener("change", filterItems);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedType = tab.dataset.type;

    tabs.forEach((button) => button.classList.remove("active"));
    tab.classList.add("active");

    filterItems();
  });
});

// Show a basic item details preview.
itemGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".details-btn");
  if (!button) return;

  alert(
    "Item: " +
      button.dataset.item +
      "\n\nThis is a demo preview. We will build a full details page next.",
  );
});

// Create a temporary item card from the form.
const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");

postForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("itemName").value.trim();
  const type = document.getElementById("itemType").value;
  const category = document.getElementById("itemCategory").value;
  const location = document.getElementById("itemLocation").value.trim();
  const description = document.getElementById("itemDescription").value.trim();

  if (!name || !location || !description) {
    postMessage.textContent = "Please fill in all required fields.";
    return;
  }

  const card = document.createElement("article");
  card.className = "item-card";
  card.dataset.type = type;
  card.dataset.category = category;
  card.dataset.search = `${name} ${location} ${description}`.toLowerCase();

  const image = document.createElement("div");
  image.className = "item-image lavender";

  const emoji = document.createElement("span");
  emoji.textContent =
    category === "books"
      ? "📚"
      : category === "electronics"
        ? "🎧"
        : category === "id-cards"
          ? "🪪"
          : "🎒";

  const status = document.createElement("span");
  status.className = `status ${type}`;
  status.textContent = type === "lost" ? "Lost" : "Found";

  image.append(emoji, status);

  const content = document.createElement("div");
  content.className = "item-content";

  const categoryLabel = document.createElement("span");
  categoryLabel.className = "category";
  categoryLabel.textContent = category.replace("-", " ").toUpperCase();

  const heading = document.createElement("h3");
  heading.textContent = name;

  const descriptionText = document.createElement("p");
  descriptionText.textContent = description;

  const locationText = document.createElement("div");
  locationText.className = "item-meta";
  locationText.textContent = "📍 " + location;

  const footer = document.createElement("div");
  footer.className = "item-footer";

  const dateText = document.createElement("span");
  dateText.textContent =
    "📅 " +
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const detailsButton = document.createElement("button");
  detailsButton.className = "details-btn";
  detailsButton.dataset.item = name;
  detailsButton.textContent = "View details ↗";

  footer.append(dateText, detailsButton);
  content.append(categoryLabel, heading, descriptionText, locationText, footer);
  card.append(image, content);
  itemGrid.prepend(card);

  postForm.reset();
  selectedType = "all";
  categoryFilter.value = "all";
  searchInput.value = "";

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.type === "all");
  });

  filterItems();
  postMessage.textContent =
    "Your item was added to this demo page! It is not saved permanently yet.";

  document.getElementById("items").scrollIntoView({ behavior: "smooth" });
});

filterItems();
