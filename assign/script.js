let notices = [
    { title: "React Workshop", category: "Education", text: "Learn to build modern web apps.", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee", liked: false },
    { title: "Weekly Fitness", category: "Health", text: "Join our community workout sessions.", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438", liked: false }
];

function renderBoard(data = notices) {
    const board = document.getElementById("noticeBoard");
    board.innerHTML = "";
    data.forEach((notice) => {
        const masterIndex = notices.indexOf(notice);
        board.innerHTML += `
        <div class="col-md-6">
            <div class="card notice-card shadow-sm">
                <img src="${notice.img || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="Notice">
                <div class="card-body">
                    <span class="badge ${getBadgeClass(notice.category)} mb-2">${notice.category}</span>
                    <h6 class="fw-bold">${notice.title}</h6>
                    <p class="small text-muted mb-3">${notice.text}</p>
                    <div class="d-flex justify-content-between align-items-center border-top pt-2">
                        <i class="fa-heart ${notice.liked ? 'fa-solid active text-danger' : 'fa-regular'} like-btn" onclick="toggleLike(${masterIndex})"></i>
                        <button class="delete-btn" onclick="deleteNotice(${masterIndex})"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
    });
    updateStats();
}

async function handleFormSubmit() {
    const title = document.getElementById("formTitle").value;
    const category = document.getElementById("formCategory").value;
    const text = document.getElementById("formText").value;
    const urlInput = document.getElementById("formImgUrl").value;
    const fileInput = document.getElementById("formFile").files[0];

    let finalImg = urlInput || "https://via.placeholder.com/400x200?text=Community+Notice";

    // If a file is uploaded, convert it to a Base64 string
    if (fileInput) {
        finalImg = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(fileInput);
        });
    }

    if (title && text) {
        notices.unshift({ title, category, text, liked: false, img: finalImg });
        const modalEl = document.getElementById('addNoticeModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
        resetForm();
        renderBoard();
    }
}

function getBadgeClass(cat) {
    if(cat === 'Education') return 'bg-primary';
    if(cat === 'Health') return 'bg-success';
    return 'bg-warning text-dark';
}

function toggleLike(idx) { 
    notices[idx].liked = !notices[idx].liked; 
    renderBoard(); 
}

function deleteNotice(idx) { 
    notices.splice(idx, 1); 
    renderBoard(); 
}

function handleSearch() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    const filtered = notices.filter(n => n.title.toLowerCase().includes(term) || n.text.toLowerCase().includes(term));
    renderBoard(filtered);
}

function filterByCategory(type, el) {
    document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    renderBoard(type === 'all' ? notices : notices.filter(n => n.category === type));
}

function updateStats() {
    document.getElementById("totalLikes").innerText = notices.filter(n => n.liked).length;
    document.getElementById("count-all").innerText = notices.length;
    ['Education', 'Health', 'Event'].forEach(cat => {
        const countEl = document.getElementById(`count-${cat}`);
        if(countEl) countEl.innerText = notices.filter(n => n.category === cat).length;
    });
}

function resetForm() {
    document.getElementById("formTitle").value = "";
    document.getElementById("formText").value = "";
    document.getElementById("formImgUrl").value = "";
    document.getElementById("formFile").value = "";
}

// Initial Call
renderBoard();