const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');

const kochiBody = `<h1>Diamond Jewellery in Kochi | Kirthi Diamonds</h1>
<p>Situated in the vibrant heart of Kerala's commercial capital, Kirthi Diamonds' Kochi boutique offers an exclusive sanctuary for those seeking investment-grade, bespoke diamond jewellery. Located conveniently at 34/572, By Pass Road, Palarivattom, our Kochi showroom is designed to provide a serene and unhurried environment, entirely focused on personalised consultations and artisanal creation. We believe that acquiring a natural diamond is a significant milestone, and our Kochi design team is dedicated to guiding you through every aspect of the 4Cs, certification, and custom setting designs.</p>
<p>Our Kochi boutique specializes in creating generational heirlooms, ranging from bespoke engagement rings and bridal masterpieces to timeless everyday luxury pieces. Every natural diamond exceeding 0.30 carats in our collection is strictly accompanied by independent certification from either the Gemological Institute of America (GIA) or the International Gemological Institute (IGI). Furthermore, every piece of gold jewellery is BIS-hallmarked for absolute purity. By focusing on a low-volume, meticulously crafted approach, our bench jewellers ensure that each setting maximizes the fire, brilliance, and longevity of the stone.</p>
<p>We invite you to experience our quiet luxury and commitment to ethical sourcing first-hand. Whether you are looking to design a unique bridal ensemble or searching for a brilliant solitaire, our experts in Kochi are ready to collaborate with you.</p>
<h2>Kochi Showroom Details</h2>
<address>
  <strong>Kirthi Diamonds Kochi</strong><br>
  34/572, By Pass Road, Palarivattom<br>
  Kochi, Kerala 682024<br>
  India<br>
  <a href="tel:+914842316688">Phone: +91 484 231 6688</a>
</address>
<p><strong>Opening Hours:</strong> Monday–Saturday 10:00 – 19:00 (Closed on Sundays)</p>
<p>To arrange a bespoke consultation with our diamond experts, please <a href="https://kirthidiamonds.com/contact">visit our contact page</a>.</p>`;

const calicutBody = `<h1>Diamond Jewellery in Calicut | Kirthi Diamonds</h1>
<p>Located in the historic and culturally rich city of Kozhikode, Kirthi Diamonds' Calicut boutique stands as a beacon of artisanal excellence and quiet luxury in northern Kerala. Situated at 61/11508A, Opposite Federal Bank in Puthiyara, our Calicut showroom invites patrons into a refined environment where the art of bespoke diamond jewellery can be experienced at a deliberate, relaxed pace. We reject the high-volume retail model in favour of one-on-one consultations, allowing our clients to deeply understand the craftsmanship and quality of their investments.</p>
<p>Our Calicut showroom presents a curated selection of GIA and IGI certified natural diamonds, seamlessly integrated into exquisite, custom-forged settings. Whether you desire a classic solitaire engagement ring, a complete bespoke bridal parure, or a unique modern statement piece, our dedicated design team in Calicut works closely with you to bring your vision to life. We maintain an uncompromising commitment to material transparency—every diamond is ethically sourced and rigorously graded, and all gold is BIS-hallmarked to guarantee absolute purity.</p>
<p>Driven by a passion for perfection, our master setters craft each piece to ensure optimal light return and structural durability, ensuring your jewellery becomes a cherished generational heirloom backed by our lifetime buyback and exchange guarantee.</p>
<h2>Calicut Showroom Details</h2>
<address>
  <strong>Kirthi Diamonds Calicut</strong><br>
  61/11508A, Opposite Federal Bank, Puthiyara<br>
  Kozhikode, Kerala 673004<br>
  India<br>
  <a href="tel:+914952725461">Phone: +91 495 272 5461</a>
</address>
<p><strong>Opening Hours:</strong> Monday–Saturday 10:00 – 19:00 (Closed on Sundays)</p>
<p>To arrange a bespoke consultation with our diamond experts, please <a href="https://kirthidiamonds.com/contact">visit our contact page</a>.</p>`;

s = s.replace(/fallbackBody: "<h1>Kirthi Diamonds Kochi Boutique.*?<\/p>"/g, `fallbackBody: \`${kochiBody}\``);
s = s.replace(/fallbackBody: "<h1>Kirthi Diamonds Calicut Boutique.*?<\/p>"/g, `fallbackBody: \`${calicutBody}\``);

fs.writeFileSync('server.ts', s);
console.log("Expanded kochi and calicut fallback bodies");
