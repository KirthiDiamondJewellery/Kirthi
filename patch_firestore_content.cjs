const https = require('https');

const data = {
  "fields": {
    "maisonDetails": {
      "stringValue": "Established in 2006 and built upon a family heritage in the diamond trade since 1975, Kirthi Diamonds operates as a premier bespoke diamond house dedicated to the preservation of high jewellery as an art form. From our main design atelier to our exclusive boutiques in Kochi and Calicut, we reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship. We believe that true luxury cannot be mass-produced; it requires time, intimacy, and an uncompromising focus on singular creations. By maintaining a strict limit on our monthly workshop output, we ensure that every creation receives the undivided attention of our master bench jewellers, who possess decades of specialized experience. This low-volume philosophy directly influences the setting outcomes of our jewellery. Rather than using automated assembly lines, our artisans hand-pull platinum wires and individually forge 18kt and 22kt BIS hallmarked gold mounts to fit the precise, unique physical characteristics of each certified diamond. This bespoke tailoring prevents the microscopic misalignments common in mass-produced items, resulting in settings that are not only remarkably durable but also designed to optimize light transmission. Our diamonds sit perfectly secure, catching and refracting light from every angle with maximum brilliance.\n\nAs an ethical diamond jewellery provider, every diamond above 0.30 carats is independently certified by the Gemological Institute of America (GIA) or the International Gemological Institute (IGI). Our relationship with our patrons is equally personal. We operate primarily by appointment, offering a slow-paced, advisory-led environment where clients collaborate directly with diamond specialists and designers. Every piece created under our roof is thoroughly documented and registered in our permanent archive, securing its provenance and ensuring it remains a cherished heirloom for generations. Through our transparent sourcing, GIA IGI certified diamonds Kerala, and legendary lifetime buyback policy, Kirthi Diamonds stands as a sanctuary of trust and artistic integrity in the world of luxury jewellery. Learn more about Kirthi Diamonds and our bespoke diamond house Kochi by scheduling a consultation today."
    },
    "archiveDescription": {
      "stringValue": "The story of Kirthi Diamonds is woven deeply into the fabric of time. Established as a bespoke diamond house in 2006, our roots trace back to a family diamond trade that began in 1975. This rich heritage forms the foundation of every masterpiece we create. We are not merely jewellers; we are custodians of a legacy that values uncompromising quality and enduring elegance over fleeting trends. From our exclusive boutiques in Kochi and Calicut, we have served discerning patrons who appreciate the subtle luxury of authentic craftsmanship. Our journey is defined by a steadfast commitment to transparency, demonstrated by our strict adherence to independent GIA and IGI certification for all our significant diamonds, and BIS Hallmarking for our gold settings. Because we operate on a bespoke, low-volume model, we preserve the intimacy of the traditional jeweller-patron relationship. Each piece in our archive represents a milestone—both for the client who commissioned it and for the artisan who forged it. We invite you to explore this heritage of brilliance.\n\nOur heritage diamond jewellery Kerala collections draw inspiration from traditional Kerala jewellery designs while incorporating the brilliance of modern diamond cuts. We specialize in creating heirloom diamond jewellery that can be passed down through generations. From antique diamond jewellery reinterpretations to contemporary masterpieces, our legacy diamond jewellers craft each piece with unparalleled dedication. Early in our founding family's history, securing the most ethically sourced, internally flawless diamonds required months of travel across global diamond capitals. That foundational commitment to excellence remains the hallmark of every Kirthi creation today. Experience the culmination of decades of expertise and artistic passion with Kirthi Diamonds."
    }
  }
};

const payload = JSON.stringify(data);

const options = {
  hostname: 'firestore.googleapis.com',
  port: 443,
  path: '/v1/projects/esoteric-portal-471501-t2/databases/ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764/documents/site_content/global?updateMask.fieldPaths=maisonDetails&updateMask.fieldPaths=archiveDescription',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response:', responseData);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
