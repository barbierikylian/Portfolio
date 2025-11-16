document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  setupFormValidation();
  setupSkillHoverEffects();
  updateTime(); // Appel initial pour afficher l'heure
  setInterval(updateTime, 1000); // Mettre à jour l'heure toutes les secondes

  // Écouteur d'événements pour le défilement
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY; // Position de défilement
    const banner = document.querySelector(".banner"); // Sélectionne la bannière

    // Applique la transformation en fonction de la position de défilement
    banner.style.transform = "translateY(${scrollPosition * 0.5}px)"; // Ajuste le facteur (0.5) pour modifier l'intensité de l'effet

    // Vérifie si la bannière est complètement défilée
    if (scrollPosition > banner.offsetHeight) {
      // Fait défiler vers la section de mini présentation
      const miniPresentation = document.getElementById("mini-presentation");
      miniPresentation.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Animations pour les sections
function initAnimations() {
  const sections = document.querySelectorAll(".section-box");
  const options = {
    root: null,
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Validation du formulaire
function setupFormValidation() {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    if (validateEmail(email) && name.trim() !== "" && message.trim() !== "") {
      alert("Formulaire soumis avec succès !");
      form.reset();
    } else {
      alert("Veuillez remplir tous les champs correctement.");
    }
  });
}

// Effets de survol pour les compétences
function setupSkillHoverEffects() {
  const skillBoxes = document.querySelectorAll(".skill-box");

  skillBoxes.forEach((box) => {
    box.addEventListener("mouseover", () => {
      box.style.transform = "scale(1.1)";
      box.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)"; // Ombre ajoutée
    });

    box.addEventListener("mouseout", () => {
      box.style.transform = "scale(1)";
      box.style.boxShadow = "none"; // Supprime l'ombre
    });
  });
}

// Affiche le bouton de retour en haut quand on scrolle
const backToTopButton = document.getElementById("backToTopButton");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

// Fonction pour faire défiler vers le haut de la page
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Fonction pour envoyer l'email
function sendMail() {
  // Récupérer les valeurs des champs
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();

  // Vérification des champs
  if (name === "" || email === "" || message === "") {
    alert("Tous les champs sont requis. Veuillez remplir chaque champ.");
    return; // Arrêter l'envoi si les champs ne sont pas tous remplis
  }

  // Validation de l'adresse e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Veuillez entrer une adresse e-mail valide.");
    return; // Arrêter l'envoi si l'e-mail est invalide
  }

  // Paramètres pour EmailJS
  let params = {
    name: name,
    email: email,
    message: message,
  };

  // Envoi de l'email
  emailjs
    .send("service_i6syx6e", "template_ky10udl", params)
    .then(() => {
      alert("Email envoyé avec succès !");
      alert(
        "Vous recevrez également une copie de cet Email. Si vous ne le voyez pas dans votre boîte de réception, merci de vérifier vos courriers indésirables."
      );
      document.getElementById("contactForm").reset(); // Réinitialiser le formulaire après envoi
    })
    .catch((error) => {
      alert("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
      console.error("Erreur :", error);
    });
}
// projects.js
// Ce script relie automatiquement chaque projet de ton portfolio
// à son dépôt GitHub (et à la démo GitHub Pages si elle existe).

(async function () {
  const els = document.querySelectorAll(".gh-links");

  // Fonction utilitaire pour récupérer les infos du dépôt via l'API GitHub
  async function getRepo(slug) {
    const res = await fetch(`https://api.github.com/repos/${slug}`);
    if (!res.ok) return null;
    return res.json();
  }

  // Création d’un bouton avec un style homogène
  function makeBtn(href, text) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = text;
    a.className = "btn-gh";
    return a;
  }

  // Boucle sur tous les éléments .gh-links dans ton HTML
  for (const el of els) {
    const slug = el.getAttribute("data-repo"); // ex: "barbierikylian/Portfolio"
    if (!slug) continue;

    // Bouton "Voir le code" toujours présent
    const repoUrl = `https://github.com/${slug}`;
    el.appendChild(makeBtn(repoUrl, "Voir le code"));

    // Recherche d'une éventuelle démo (GitHub Pages ou homepage)
    try {
      const repo = await getRepo(slug);
      if (repo) {
        // 1️⃣ Si "homepage" est défini dans le repo → on l’utilise
        if (repo.homepage && repo.homepage.trim().length > 0) {
          el.appendChild(makeBtn(repo.homepage, "Démo"));
        }
        // 2️⃣ Sinon si GitHub Pages est activé → lien par défaut
        else if (repo.has_pages) {
          const demo = `https://${repo.owner.login}.github.io/${repo.name}`;
          el.appendChild(makeBtn(demo, "Démo"));
        }

        // 3️⃣ (Optionnel) Infos complémentaires : stars + langage + date maj
        const meta = document.createElement("span");
        meta.className = "gh-meta";
        const lang = repo.language ? ` • ${repo.language}` : "";
        meta.textContent = `⭐ ${repo.stargazers_count}${lang} • maj ${new Date(
          repo.updated_at
        ).toLocaleDateString()}`;
        el.appendChild(meta);
      }
    } catch (e) {
      console.warn("Erreur lors du chargement du dépôt :", slug, e);
    }
  }
})();
