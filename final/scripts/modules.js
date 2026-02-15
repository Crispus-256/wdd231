export async function getMentors(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

export function displayMentors(mentors, container) {
    container.innerHTML = ""; 
    mentors.forEach(mentor => {
        const card = document.createElement("section");
        card.className = "card";
        card.innerHTML = `
            <img src="${mentor.image}" alt="${mentor.name}" loading="lazy">
            <h3>${mentor.name}</h3>
            <p><strong>Area:</strong> ${mentor.area}</p>
            <p><strong>Experience:</strong> ${mentor.experience}</p>
            <p class="bio-preview">${mentor.bio}</p>
            <button class="view-details" data-id="${mentor.id}" aria-haspopup="dialog" aria-controls="mentor-details">Details</button>
        `;
        container.appendChild(card);
    });
}