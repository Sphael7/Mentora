document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const searchInputEbook = document.getElementById('searchInputEbook'); // Input pencarian khusus di halaman E-book
    const searchButtonEbook = document.getElementById('searchButtonEbook'); // Tombol pencarian khusus di halaman E-book
    const ebookList = document.getElementById('ebookList');
    const noResultsMessage = document.getElementById('noResults');

    // Dapatkan semua kartu e-book (hanya akan ada di ID ebookList)
    let ebookCards = [];
    if (ebookList) { // Pastikan ebookList ada sebelum mencoba querySelectorAll
        ebookCards = ebookList.querySelectorAll('.ebook-card');
    }

    // Fungsi untuk menampilkan halaman yang dipilih dan menyembunyikan yang lain
    const showPage = (pageId) => {
        // Sembunyikan semua halaman
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none'; // Pastikan disembunyikan
        });

        // Tampilkan halaman yang diminta
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            activePage.style.display = 'block'; // Tampilkan halaman
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Gulir ke atas halaman

            // Perbarui URL browser tanpa memuat ulang halaman
            history.pushState({ page: pageId }, '', `#${pageId}`);

            // Perbarui judul dokumen
            let title = "Infinite Discussion of Academy";
            if (pageId === 'home') title = "Beranda - " + title;
            else if (pageId === 'ebooks') title = "E-Book - " + title;
            else if (pageId === 'about') title = "Tentang - " + title;
            else if (pageId === 'contact') title = "Kontak - " + title;
            document.title = title;
        }

        // Update kelas 'active' pada navigasi
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            }
        });

        // Khusus untuk halaman E-book: reset filter jika berpindah dari halaman lain,
        // atau jika user kembali ke halaman ebook dan ada search term
        if (pageId === 'ebooks' && searchInputEbook) {
            filterEbooks(); // Jalankan filter saat halaman ebook ditampilkan
        } else if (searchInputEbook) {
            // Reset input pencarian di halaman ebook jika berpindah dari halaman ebook
            searchInputEbook.value = '';
        }

        // Khusus untuk halaman Home: kosongkan input pencarian jika ada
        const searchInputHome = document.getElementById('searchInputHome');
        if (searchInputHome) {
            searchInputHome.value = '';
        }
    };

    // Event listener untuk klik navigasi
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah perilaku default link (menggulir atau memuat halaman baru)
            const pageId = item.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Event listener untuk tombol "Lihat E-Book" di home
    document.querySelectorAll('.feature-card .read-more-btn[data-page="ebooks"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('ebooks');
        });
    });


    // --- Fungsionalitas Pencarian (Hanya di halaman E-book) ---
    const filterEbooks = () => {
        // Hanya jalankan jika elemen pencarian E-book ada dan kartu e-book sudah diambil
        if (!searchInputEbook || !ebookList || ebookCards.length === 0) return;

        const searchTerm = searchInputEbook.value.toLowerCase().trim();
        let foundResults = false;

        ebookCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();
            const author = card.getAttribute('data-author') ? card.getAttribute('data-author').toLowerCase() : '';

            if (title.includes(searchTerm) || category.includes(searchTerm) || author.includes(searchTerm)) {
                card.style.display = 'flex';
                foundResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (foundResults) {
            noResultsMessage.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'block';
        }
    };

    if (searchInputEbook && searchButtonEbook) { // Pastikan elemen ada
        searchButtonEbook.addEventListener('click', filterEbooks);

        searchInputEbook.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                filterEbooks();
            } else if (searchInputEbook.value.trim() === '') {
                filterEbooks(); // Jika input kosong, tampilkan semua kartu lagi
            }
        });
    }

    // --- Fungsionalitas Pencarian di halaman Home (Tidak memfilter, hanya redirect/alert) ---
    const searchInputHome = document.getElementById('searchInputHome');
    const searchButtonHome = document.getElementById('searchButtonHome');

    if (searchInputHome && searchButtonHome) {
        searchButtonHome.addEventListener('click', (e) => {
            e.preventDefault();
            const searchTerm = searchInputHome.value.toLowerCase().trim();
            if (searchTerm) {
                // Di sini Anda bisa arahkan user ke halaman E-book dengan parameter pencarian
                // Untuk demo ini, kita hanya akan menampilkan alert atau langsung ke halaman ebook
                alert(`Mencari "${searchTerm}" di seluruh koleksi e-book.`);
                // Contoh: showPage('ebooks'); dan lalu otomatis filter di halaman ebooks (akan memerlukan sedikit lebih banyak logic)
                // Untuk kesederhanaan, saat ini hanya alert.
            } else {
                alert('Silakan masukkan kata kunci pencarian!');
            }
        });

        searchInputHome.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                searchButtonHome.click(); // Simulasikan klik tombol
            }
        });
    }


    // Optional: Tambahkan fungsionalitas untuk tombol "Baca Lebih Lanjut" di halaman E-book
    // Hanya tambahkan event listener jika ebookCards tidak kosong
    if (ebookCards.length > 0) {
        ebookCards.forEach(card => {
            const readMoreBtn = card.querySelector('.read-more-btn');
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', () => {
                    const title = card.getAttribute('data-title');
                    alert(`Anda akan membaca e-book: "${title}"\n(Fungsionalitas ini belum diimplementasikan sepenuhnya. Ini hanya demo.)`);
                });
            }
        });
    }

    // Tangani navigasi mundur/maju browser
    window.addEventListener('popstate', (event) => {
        const pageId = event.state ? event.state.page : 'home';
        showPage(pageId);
    });

    // Tampilkan halaman yang sesuai saat pertama kali dimuat (berdasarkan URL hash atau default ke home)
    const initialPage = window.location.hash ? window.location.hash.substring(1) : 'home';
    showPage(initialPage);
});