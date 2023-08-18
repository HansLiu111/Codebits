
const addButton = document.getElementById("addButton");
const snippetInput = document.getElementById("snippetInput");
const snippetTitleInput = document.getElementById("snippetTitleInput");
const snippetTagsInput = document.getElementById("snippetTagsInput");
const snippetNav = document.getElementById("snippetNav");
const tagNav = document.getElementById("tagNav");
const selectedSnippet = document.getElementById("selectedSnippet");

const tagFilterContainer = document.getElementById("tagFilterContainer");

// Load saved snippets from local storage when the app starts
const savedSnippets = JSON.parse(localStorage.getItem("codebitsSnippets")) || [];
let snippets = savedSnippets;

function renderSelectedSnippet(snippet) {
    selectedSnippet.innerHTML = `<pre class="snippet-code"><code>${snippet}</code></pre>`;
    hljs.highlightAll();
}

function populateTagFilter() {
    const allTags = snippets.flatMap(snippet => snippet.tags);
    const uniqueTags = [...new Set(allTags)];

    tagFilterContainer.innerHTML = uniqueTags.map(tag => `
        <button class="tag-button">${tag}</button>
    `).join("");

    // Add event listeners to tag buttons
    const tagButtons = document.querySelectorAll(".tag-button");
    tagButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedTag = button.textContent;
            const filteredSnippets = selectedTag ? snippets.filter(snippet => snippet.tags.includes(selectedTag)) : snippets;
            renderSnippetList(filteredSnippets);
        });
    });
}

function renderSnippetList(snippetArray = snippets) {
    snippetNav.innerHTML = "";
    snippetArray.forEach((snippet, index) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${snippet.title} [${snippet.tags.join(", ")}]`; // Display tags

        const deleteIcon = document.createElement("span");
        deleteIcon.className = "snippet-delete-icon";
        deleteIcon.innerHTML = "&times;";
        deleteIcon.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteSnippet(index);
            renderSnippetList();
            clearSelectedSnippet();
            saveSnippetsToLocalStorage(); // Save after deletion
        });

        listItem.dataset.id = index;
        listItem.appendChild(deleteIcon);
        snippetNav.appendChild(listItem);
        populateTagFilter();
    });
}


function deleteSnippet(snippetId) {
    snippets.splice(snippetId, 1);
}

function clearSelectedSnippet() {
    selectedSnippet.innerHTML = "";
    snippetTitleInput.value = "";
    snippetInput.value = "";
    snippetTagsInput.value = ""; // Clear tags input
}

function saveSnippetsToLocalStorage() {
    localStorage.setItem("codebitsSnippets", JSON.stringify(snippets));
}

// Render saved snippets when the app starts
renderSnippetList();

addButton.addEventListener("click", () => {
    const snippetText = snippetInput.value;
    const snippetTitle = snippetTitleInput.value;
    const snippetTags = snippetTagsInput.value.split(",").map(tag => tag.trim()); // Split and trim tags
    if (snippetText && snippetTitle) {
        snippets.push({ title: snippetTitle, code: snippetText, tags: snippetTags });
        renderSnippetList();
        saveSnippetsToLocalStorage();
        clearSelectedSnippet();
    }
});

snippetNav.addEventListener("click", (event) => {
    const snippetId = event.target.dataset.id;
    if (snippetId !== undefined) {
        renderSelectedSnippet(snippets[snippetId].code);
    }
});

snippetNav.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const snippetId = event.target.dataset.id;
    if (snippetId !== undefined) {
        deleteSnippet(snippetId);
        renderSnippetList();
        saveSnippetsToLocalStorage(); // Save after deletion
    }
});
