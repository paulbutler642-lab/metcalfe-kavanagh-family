const app = document.getElementById('app')

app.innerHTML = `
<section class="about-page">
  <div class="wrap about-wrap">
    <header class="about-heading">
      <span class="about-kicker">The Metcalfe &amp; Kavanagh Family</span>
      <h1>About &amp; Contact</h1>
      <p>A family archive created to research, preserve and share our history.</p>
    </header>

    <article class="about-card">
      <h2>About This Site</h2>
      <p>Welcome, and thank you for dropping by.</p>
      <p>I created this site primarily because I wanted to research the lives of my mother’s parents, <strong>William Metcalfe and Mary Kavanagh</strong>, along with their extended families and ancestors. As the research grew, I wanted somewhere that could bring everything together — official historical records alongside family stories, memories, photographs and documents.</p>
      <p>A great deal of care has gone into making sure that the people and records presented here are genuinely connected to our family. Historical research can be surprisingly easy to get wrong, particularly when people share similar names. Even Google and AI searches can return convincing-looking results that actually belong to a completely different person.</p>
      <p>For that reason, I created a cross-checking system specifically for this site. Rather than relying on a name alone, records can be compared against other known information such as dates, locations, parents, spouses, siblings and other family connections before they are treated as verified evidence.</p>
      <p><a href="/?view=evidence"><strong>Read how evidence is verified and labelled on this site →</strong></a></p>
      <p>So come on in and have a look around. Explore the family tree, browse the records, photographs and stories, and please <a href="/?view=visitors"><strong>sign the Visitors’ Book</strong></a>. I would love to see old familiar names as well as new ones.</p>
      <p>Perhaps you are a relative, a descendant of one of the families recorded here, an old family friend, or have some other connection to the Metcalfe or Kavanagh families. Hopefully you will discover something new about your own relations while you are here.</p>
      <p class="about-emphasis">Above all, I wanted to <strong>record and preserve their fascinating history so that future generations can explore it.</strong></p>
    </article>

    <article class="about-card about-contribute">
      <h2>Help Build the Family Archive</h2>
      <p>There is a <a href="/?view=gallery"><strong>Photos &amp; Documents</strong></a> section where visitors can contribute photographs, documents and other pieces of family history. If you have something that belongs in the archive, please consider sharing it.</p>
      <p>This site will ultimately be as good as the contributions made to it. If you know other relatives or people who may have photographs, documents, stories or memories to share, please pass the site on to them. Together we can build something very special and preserve material that might otherwise eventually be lost.</p>
      <p>I already have many more discoveries and updates waiting to be added over the coming weeks, so please check back regularly for new records, photographs and stories.</p>
    </article>

    <article class="about-card about-dedication">
      <div class="dedication-copy">
        <h2>In Memory of My Mum</h2>
        <div class="dedication-rule"><span></span><b>❧</b><span></span></div>
        <p>Lastly, I would like to dedicate this site to my beloved mum, <strong>Catherine Metcalfe</strong>.</p>
        <p>Mum was always proud to call herself a <strong>Metcalfe</strong>, and it feels fitting that the history of the family she was so proud of can now be preserved and shared here for generations to come.</p>
        <p class="dedication-thanks">Thank you for visiting.</p>
        <p class="about-signature">— Paul</p>
      </div>
      <div class="dedication-bouquet" aria-hidden="true">
        <svg viewBox="0 0 250 330" role="img">
          <g fill="none" stroke="#66845d" stroke-width="5" stroke-linecap="round"><path d="M125 260C120 205 105 150 92 72"/><path d="M126 260C137 196 151 145 171 70"/><path d="M124 260C119 190 128 125 132 45"/><path d="M124 260C103 205 77 171 55 123"/><path d="M128 260C149 211 178 181 201 136"/></g>
          <g fill="#718e66" opacity=".9"><ellipse cx="82" cy="142" rx="16" ry="34" transform="rotate(-48 82 142)"/><ellipse cx="161" cy="130" rx="16" ry="35" transform="rotate(47 161 130)"/><ellipse cx="103" cy="103" rx="13" ry="29" transform="rotate(-52 103 103)"/><ellipse cx="177" cy="91" rx="13" ry="30" transform="rotate(50 177 91)"/><ellipse cx="68" cy="184" rx="14" ry="30" transform="rotate(-62 68 184)"/><ellipse cx="190" cy="179" rx="14" ry="31" transform="rotate(62 190 179)"/></g>
          <g fill="#78a5d8" stroke="#5d8fc8" stroke-width="1.5">
            <g transform="translate(92 72)"><ellipse rx="14" ry="28" transform="rotate(0) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(72) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(144) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(216) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(288) translate(0 -19)"/><circle r="8" fill="#d5a52c" stroke="none"/></g>
            <g transform="translate(132 48) scale(.8)"><ellipse rx="14" ry="28" transform="translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(72) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(144) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(216) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(288) translate(0 -19)"/><circle r="8" fill="#d5a52c" stroke="none"/></g>
            <g transform="translate(171 82) scale(.9)"><ellipse rx="14" ry="28" transform="translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(72) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(144) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(216) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(288) translate(0 -19)"/><circle r="8" fill="#d5a52c" stroke="none"/></g>
            <g transform="translate(58 128) scale(.72)"><ellipse rx="14" ry="28" transform="translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(72) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(144) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(216) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(288) translate(0 -19)"/><circle r="8" fill="#d5a52c" stroke="none"/></g>
            <g transform="translate(137 126) scale(1.05)"><ellipse rx="14" ry="28" transform="translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(72) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(144) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(216) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(288) translate(0 -19)"/><circle r="8" fill="#d5a52c" stroke="none"/></g>
            <g transform="translate(198 139) scale(.72)"><ellipse rx="14" ry="28" transform="translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(72) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(144) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(216) translate(0 -19)"/><ellipse rx="14" ry="28" transform="rotate(288) translate(0 -19)"/><circle r="8" fill="#d5a52c" stroke="none"/></g>
          </g>
          <g fill="#91b7df" stroke="#6c99c9" stroke-width="2"><path d="M125 239C92 217 65 215 58 235c20 20 43 24 67 10z"/><path d="M127 239c34-23 62-23 70-3-21 22-45 25-70 10z"/><path d="M118 247c-11 28-14 48-8 68l18-51z"/><path d="M135 247c15 27 21 46 17 67l-25-50z"/></g>
          <circle cx="126" cy="242" r="10" fill="#6d98c8"/>
        </svg>
        <div class="bouquet-rule"><span></span><b>❧</b><span></span></div>
        <div class="always-hearts">Always in our hearts</div>
      </div>
    </article>

    <section class="about-contact">
      <div>
        <span class="about-kicker">Get in touch</span>
        <h2>Have something to share?</h2>
        <p>Have a family connection, story, correction, photograph, document or information to share? I’d love to hear from you.</p>
        <p><small>Please also feel free to contact me with suggestions, improvements or edits for the site. If you spot something that could be corrected or made better, I’d be very happy to hear from you.</small></p>
      </div>
      <div class="contact-actions">
        <a class="contact-button" href="https://wa.me/353871275548?text=Hi%20Paul%2C%20I%27m%20contacting%20you%20about%20the%20Metcalfe%20%26%20Kavanagh%20family%20history%20website." target="_blank" rel="noopener">WhatsApp Paul</a>
        <a class="contact-button" href="mailto:paul.butler642@hotmail.com?subject=Metcalfe%20%26%20Kavanagh%20Family%20History">✉ Email Paul</a>
      </div>
    </section>
  </div>
</section>`

const mobileMenu = document.getElementById('mobileMenu')
document.getElementById('menuButton').onclick = () => mobileMenu.classList.toggle('open')
document.getElementById('bottomMenu').onclick = (e) => {
  e.preventDefault()
  mobileMenu.classList.toggle('open')
  scrollTo({ top: 0, behavior: 'smooth' })
}
