
const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");
const profileForm = document.getElementById("profileForm");
const message = document.getElementById("message");

// Preview the selected profile picture
profileImage.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        if (!file.type.startsWith("image/")) {
            message.textContent = "Please select an image.";
            return;
        }

        const imageURL = URL.createObjectURL(file);
        profilePreview.src = imageURL;
        message.textContent = "";
    }
});

// Handle profile form submission
profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const hobbies = document.getElementById("hobbies").value.trim();

    if (!name || !hobbies) {
        message.textContent = "Please complete all fields.";
        return;
    }

    message.textContent =
        "Profile information captured successfully!";

    console.log({
        name: name,
        hobbies: hobbies
    });
});
