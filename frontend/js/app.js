document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("error-message");
    const modelsGrid = document.getElementById("models-grid");

    const API_URL = "http://localhost:3000/api";

    const motorcycles = {
        TVS: [
            { name: "Apache RTR 200", type: "Deportiva", price: "$14.990.000", image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80" },
            { name: "Raider 125", type: "Urbana", price: "$9.490.000", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80" },
            { name: "NTORQ 125", type: "Scooter", price: "$10.990.000", image: "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=900&q=80" }
        ],
        Victory: [
            { name: "Venom 250", type: "Street", price: "$13.990.000", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80" },
            { name: "Bomber 250", type: "Naked", price: "$15.490.000", image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80" },
            { name: "One 125", type: "Urbana", price: "$8.990.000", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80" }
        ],
        Kymco: [
            { name: "Agility 125", type: "Scooter", price: "$10.290.000", image: "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=900&q=80" },
            { name: "Like 125", type: "Scooter premium", price: "$12.790.000", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80" },
            { name: "X-Town 300", type: "Maxi scooter", price: "$25.990.000", image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80" }
        ],
        Benelli: [
            { name: "TNT 150i", type: "Street", price: "$11.990.000", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80" },
            { name: "TRK 502", type: "Adventure", price: "$34.990.000", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80" },
            { name: "Leoncino 500", type: "Scrambler", price: "$29.990.000", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80" }
        ],
        Kawasaki: [
            { name: "Ninja 400", type: "Deportiva", price: "$34.990.000", image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80" },
            { name: "Z400", type: "Naked", price: "$31.990.000", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80" },
            { name: "Versys 650", type: "Touring", price: "$42.990.000", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80" }
        ],
        Zontes: [
            { name: "200U1", type: "Supermoto", price: "$15.990.000", image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80" },
            { name: "T1 350", type: "Adventure", price: "$24.990.000", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80" },
            { name: "R1 125", type: "Urbana", price: "$10.490.000", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80" }
        ]
    };

    function renderModels(brand) {
        if (!modelsGrid) {
            return;
        }

        const models = motorcycles[brand] || [];
        const title = document.getElementById("models-title");
        const description = document.getElementById("models-description");

        if (title) title.textContent = `Motos ${brand}`;
        if (description) description.textContent = `Modelos destacados de ${brand} disponibles para conocer y reservar.`;

        modelsGrid.innerHTML = models.map((motorcycle) => `
            <article class="model-card">
                <div class="model-image" style="background-image: url('${motorcycle.image}')"></div>
                <div class="model-content">
                    <span class="model-type">${motorcycle.type}</span>
                    <h4>${motorcycle.name}</h4>
                    <strong>${motorcycle.price}</strong>
                    <button type="button">Ver moto</button>
                </div>
            </article>
        `).join("");
    }

    if (modelsGrid) {
        const brandLinks = document.querySelectorAll(".brand-link");
        const brandCards = document.querySelectorAll(".brand-card[data-brand]");

        const selectBrand = (brand) => {
            brandLinks.forEach((link) => {
                link.classList.toggle("active", link.dataset.brand === brand);
            });
            renderModels(brand);
            const modelosSection = document.getElementById("modelos");
            if (modelosSection) {
                modelosSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };

        brandLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                selectBrand(link.dataset.brand);
            });
        });

        brandCards.forEach((card) => {
            card.addEventListener("click", () => selectBrand(card.dataset.brand));
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectBrand(card.dataset.brand);
                }
            });
        });

        renderModels("TVS");
    }

    // Lógica para Login conectada al Backend
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "" || password === "") {
                showError("Por favor, completa todos los campos.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Credenciales inválidas");
                }

                alert("¡Inicio de sesión exitoso!");
                window.location.href = "dashboard.html";
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Lógica para Registro conectada al Backend
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (name === "" || email === "" || password === "") {
                showError("Todos los campos son obligatorios.");
                return;
            }

            if (password.length < 6) {
                showError("La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error en el registro");
                }

                alert("¡Registro exitoso! Redirigiendo al login...");
                window.location.href = "index.html";
            } catch (error) {
                showError(error.message);
            }
        });
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
            setTimeout(() => {
                errorMessage.style.display = "none";
            }, 3000);
        }
    }
});