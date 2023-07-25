function toggle() {
    const vertical1 = document.getElementById("vertical-1");
    const vertical2 = document.getElementById("vertical-2");
    const myLinks = document.getElementById("myLinks");

    if (vertical1.classList.contains("collapsed")) {
        vertical1.classList.remove("collapsed");
        myLinks.style.display = "block"; // Show the links
        vertical2.classList.remove("expanded");
    } else {
        vertical1.classList.add("collapsed");
        myLinks.style.display = "none"; // Hide the links
        vertical2.classList.add("expanded");
    }
}
