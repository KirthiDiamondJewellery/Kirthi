const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace the generic res.send(indexHtml) with a replacement logic
const newLogic = `
      } catch (err) {
        console.error("Error fetching SSR data:", err);
      }
      
      // Inject specific content for /methodology and /pages/exchange-policy to replace the generic seo-links
      if (req.path === '/methodology') {
        const methodologyHtml = \`
        <div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">
          <main>
            <h1>The Kirthi Methodology</h1>
            <p>Our process is defined by an uncompromising commitment to artisanal, low-volume production. Unlike mass-manufactured commercial jewellery that relies on rapid, high-volume automated casting and generic setting templates, we restrict our studio to a handful of bespoke creations per month.</p>
            <h2>Rough Selection</h2>
            <p>The process begins with the rigorous selection of rough stones, prioritizing inherent clarity and potential light return. We rely on independent grading from world-renowned institutes, including the GIA and IGI, ensuring that every significant diamond meets our exacting standards before it even reaches the bench.</p>
            <h2>Cutting & Polishing</h2>
            <p>Our master artisans then undertake the delicate process of cutting and polishing, calculating angles and facets to maximize the stone's natural fire and scintillation.</p>
            <h2>Bespoke Setting</h2>
            <p>Once the diamond achieves its optimal brilliance, the setting is individually engineered. Rather than using pre-cast, standardized mounts, our bench jewellers hand-pull platinum wires and forge BIS-hallmarked 18kt and 22kt gold to perfectly accommodate the unique physical characteristics of the chosen stone.</p>
            <h2>Precision Craftsmanship</h2>
            <p>This bespoke tailoring prevents microscopic misalignments, ensuring that the diamond sits perfectly secure while capturing and refracting light from every angle.</p>
            <h2>Final Inspection</h2>
            <p>The final stage is a rigorous quality control inspection, after which the piece is registered in our permanent archive. We specifically champion the use of precision burs, alongside traditional jadai and intricate nakashi work as our specific setting techniques, honoring ancient craftsmanship with modern precision.</p>
          </main>
        </div>
        \`;
        indexHtml = indexHtml.replace(/<!-- SEO_LINKS_START -->[\\s\\S]*?<!-- SEO_LINKS_END -->/, methodologyHtml);
      } else if (req.path === '/pages/exchange-policy') {
        const exchangeHtml = \`
        <div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">
          <main>
            <h1>Buyback & Exchange Policy</h1>
            <p>At Kirthi Diamonds, every acquisition is considered a lifelong asset. We provide a fully transparent, guaranteed buyback and exchange programme for all certified diamond jewellery purchased at our Kochi or Calicut boutiques.</p>
            <h2>Diamond Exchange Values</h2>
            <table>
              <tr><th>Timeframe</th><th>Exchange Value (against new jewellery)</th><th>Cash Buyback Value</th></tr>
              <tr><td>Within 12 Months</td><td>100% of prevailing diamond value</td><td>90% of prevailing diamond value</td></tr>
              <tr><td>After 12 Months</td><td>100% of prevailing diamond value</td><td>85% of prevailing diamond value</td></tr>
            </table>
            <h2>Gold Exchange Values</h2>
            <table>
              <tr><th>Purity</th><th>Exchange Value</th><th>Cash Buyback Value</th></tr>
              <tr><td>22kt Gold</td><td>100% of prevailing market rate</td><td>95% of prevailing market rate</td></tr>
              <tr><td>18kt Gold</td><td>100% of prevailing market rate</td><td>95% of prevailing market rate</td></tr>
            </table>
            <h2>Terms and Conditions</h2>
            <p>Evaluations are based on the current market value of the diamond on the day of exchange. The original GIA or IGI certification and Kirthi Diamonds invoice must be presented. Jewellery must pass our quality inspection to ensure it has not been altered by third-party jewellers.</p>
          </main>
        </div>
        \`;
        indexHtml = indexHtml.replace(/<!-- SEO_LINKS_START -->[\\s\\S]*?<!-- SEO_LINKS_END -->/, exchangeHtml);
      }

      res.send(indexHtml);
    });
`;

content = content.replace(/} catch \(err\) {[\s\S]*?res\.send\(indexHtml\);\n    }\);/, newLogic);
fs.writeFileSync('server.ts', content);
