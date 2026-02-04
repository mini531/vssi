// Helper to load HTML components
document.addEventListener("DOMContentLoaded", function () {
    const includes = document.querySelectorAll('[data-include]');
    const promises = [];

    includes.forEach(el => {
        const file = el.getAttribute('data-include');
        const promise = fetch(file)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok: ' + file);
                return response.text();
            })
            .then(data => {
                el.insertAdjacentHTML("afterend", data);
                el.remove();
            })
            .catch(err => {
                console.error('Error loading include:', file, err);
                el.innerHTML = '<div class="text-red-500 text-xs p-2">Error loading component</div>';
            });
        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        // Re-init Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // Dispatch event for page-specific initialization
        document.dispatchEvent(new Event('includes-loaded'));
    });
});
