function getSlug(cat) {
    if (!cat) return "";
    return cat
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]+/g, "-")    // Replace spaces/non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, "");        // Trim hyphens
}

console.log(getSlug('Ficheros N° 3'));
