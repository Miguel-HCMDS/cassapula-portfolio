let index = 0;

function moveCarousel(direction) {
  const track = document.getElementById("carouselTrack");
  const items = track.children;
  const itemHeight = items[0].offsetHeight;

  index += direction;

  if (index < 0) {
    index = items.length - 1;
  } else if (index >= items.length) {
    index = 0;
  }

  track.style.transform = `translateY(-${index * itemHeight}px)`;
}

/*🡻🡻🡻Navbar logic🡻🡻🡻*/

const navbar = document.getElementById('navbar');
const hero = document.querySelector('.hero');

if (navbar && hero && window.innerWidth > 768) {
  const navObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        navbar.classList.add('is-visible');
      } else {
        navbar.classList.remove('is-visible');
      }
    },
    {
      rootMargin: "-80px 0px 0px 0px"
    }
  );

  navObserver.observe(hero);
}

/*🡻🡻🡻slide animation🡻🡻🡻*/

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // run once
      }
    });
  },
  {
    threshold: 0.35 // reveal when 25% visible
  }
);

document.querySelectorAll('.reveal-right').forEach(el => {
  observer.observe(el);
});

/*🡻🡻🡻WHATSAPP FORM LOGIC🡻🡻🡻*/

function sendWhatsApp(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const project = document.getElementById("project").value;
  const message = document.getElementById("message").value.trim();

  const text =
`Nome: ${name}
Email: ${email}
WhatsApp: ${phone}
Projeto: ${project}

Mensagem:
${message}`;

  const whatsappNumber = "5541984133481";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
}