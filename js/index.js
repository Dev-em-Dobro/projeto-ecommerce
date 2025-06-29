MicroModal.init();

document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.querySelector('[data-micromodal-trigger="modal-1"]');
    const modal = document.getElementById('modal-1');

    cartButton.addEventListener('click', () => {
        MicroModal.show('modal-1');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            MicroModal.close('modal-1');
        }
    });
});