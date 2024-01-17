const imageUploader = document.getElementById("imageUploader");
const gallery = document.getElementById("gallery");

imageUploader.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add("gallery-item");
            img.draggable = true;
            addDragAndDropListeners(img);
            addZoomClickListener(img);
            gallery.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
});

function addDragAndDropListeners(element) {
    element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData("text/plain", e.target.src);
        e.dataTransfer.effectAllowed = "move";
        // Make the image semi-transparent while dragging
        e.target.style.opacity = "0.6";
    });

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedSrc = e.dataTransfer.getData("text/plain");
        const draggedImg = document.querySelector(`img[src="${draggedSrc}"]`);
        const dropTargetImg = e.target;

        swapImages(gallery, draggedImg, dropTargetImg);

        // Reset opacity after dropping
        draggedImg.style.opacity = "1";
    });

    element.addEventListener('dragend', (e) => {
        // Reset opacity when dragging ends
        e.target.style.opacity = "1";
    });
}

function addZoomClickListener(element) {
    element.addEventListener('click', handleImageClick);
}

function handleImageClick(e) {
    // Create an overlay div for displaying the zoomed image
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.style.display = "block";
    document.body.appendChild(overlay);

    // Clone the clicked image and add zoomed image styling
    const zoomedImage = e.target.cloneNode();
    zoomedImage.classList.add("zoomed-image");
    overlay.appendChild(zoomedImage);

    // Add a click event listener on the overlay to close the zoomed image
    overlay.addEventListener("click", function () {
        // Remove the overlay when clicked
        overlay.remove();
    });
}

function swapImages(container, dragged, target) {
    const containerChildren = Array.from(container.children);
    // console.log(containerChildren)
    const draggedIndex = containerChildren.indexOf(dragged);
    const targetIndex = containerChildren.indexOf(target);

    if (draggedIndex !== -1 && targetIndex !== -1) {
        container.insertBefore(dragged, targetIndex > draggedIndex ? target.nextSibling : target);
    }
}
