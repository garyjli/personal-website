const box = document.querySelector(".box");
// 3 columns for computer, 2 columns for mobile. Only calculated on page load, not dynamic.
let numColumns = window.matchMedia("(min-width: 769px)").matches ? 3 : 1;
const columns = [];
// [0, 0, 0] or [0]
const columnHeights = new Array(numColumns).fill(0);
let currentIndex = 0;

// Disables the right-click menu on the page
document.addEventListener("contextmenu", (event) => event.preventDefault());

// array of strings which represent the images' filenames
const imgFilenames = [];
for (let i = 1; i <= 43; i++) {
	imgFilenames.push(`a${i}.jpeg`);
}
for (let i = 1; i <= 41; i++) {
	imgFilenames.push(`b${i}.jpeg`);
}

// writes the HTML to make columns
// for each column, this writes: <div class="dream"> </div>
for (let i = 0; i < numColumns; i++) {
	const col = document.createElement("div");
	col.classList.add("dream");
	columns.push(col);
	box.appendChild(col);
}

const artworks = [
	{
		title: "Untitled",
		dimensions: "? x ? centimeters"
	}
]

// recursive function that loads each image sequentially in the gallery
function loadNextImage() {
	// base case
	if (currentIndex >= imgFilenames.length) return;

	const imgName = imgFilenames[currentIndex];

	// images-div contains the img and hover-text
	const imagesDiv = document.createElement("div");
	imagesDiv.classList.add("images-div");

	const img = document.createElement("img");
	// data-src to store the image URL until it needs to be loaded
	img.setAttribute("data-src", `images/${imgName}`);
	img.style.objectFit = "contain";
	img.onclick = () => openModal(`images/${imgName}`);

	imagesDiv.appendChild(img);

	// add imagesDiv to shortest column
	const minIndex = columnHeights.indexOf(Math.min(...columnHeights));
	columns[minIndex].appendChild(imagesDiv);

	// create hover-text
	const textOverlay = document.createElement("div");
	textOverlay.classList.add("hover-text");
	textOverlay.innerHTML = "Title: ?<br> Price: ?";

	imagesDiv.appendChild(textOverlay);

	// imagesDiv.addEventListener("touchstart", () => {
	// 	img.style.filter = "brightness(50%)";
	// 	textOverlay.style.opacity = "1";
	// });

	// imagesDiv.addEventListener("touchend", () => {
	// 	img.style.filter = "brightness(100%)";
	// 	textOverlay.style.opacity = "0";
	// });

	// create hover-text
	const artworkInfo = document.createElement("div");
	artworkInfo.classList.add("artwork-info");
	artworkInfo.innerHTML = "<strong>Title</strong><br> ? x ? centimeters, oil (?) on canvas, 2024 (?)";

	imagesDiv.appendChild(artworkInfo);

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// load image when it enters viewport
					const image = entry.target;
					image.src = image.getAttribute("data-src");
					image.onload = () => {
						// add animation after image is loaded
						// image.classList.add("fade-in");

						// get height of image and update column heights
						requestAnimationFrame(() => {
							const renderedHeight = image.offsetHeight;
							columnHeights[minIndex] += renderedHeight;
							console.log(`Image: ${imgName}, Height: ${renderedHeight}px`);
							currentIndex++;
							setTimeout(loadNextImage, 20);
						});
					};

					// stop observing after loading image
					observer.unobserve(image);
				}
			});
		},
		{
			rootMargin: "100px",
		}
	);

	// start observing image
	observer.observe(img);
}

loadNextImage();

function openModal(imgSrc) {
	const modal = document.querySelector(".modal");
	const modalImage = document.getElementById("modalImage");
	
	// modal.classList.remove("closing");
	modal.style.display = "block";
	modalImage.src = imgSrc;
}

function closeModal() {
	const modal = document.querySelector(".modal");
	const modalImage = document.getElementById("modalImage");

	modal.classList.add("closing");
	
	setTimeout(() => {
		modal.classList.remove("closing");
		modal.style.display = "none";
	}, 250); // needs to be slightly faster than the modalClose animation time
}
