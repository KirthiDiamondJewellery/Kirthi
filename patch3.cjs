const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
code = code.replace(/<MultiImageGallery\s*images=\{item\[key\] \|\| \[\]\}\s*onImagesChange=\{\(vals\) => handleUpdate\(index, key, vals\)\}\s*heroImage=\{item\.image \|\| ''\}\s*onHeroChange=\{\(val\) => handleUpdate\(index, 'image', val\)\}\s*arMode=\{arMode\}\s*\/>/g, 
`<MultiImageGallery 
                          images={item[key] || []}
                          heroImage={item.image || ''}
                          onChange={(vals, val) => {
                            if (typeof setItems === 'function') {
                              setItems(prev => {
                                const newItems = [...prev];
                                newItems[index] = { ...newItems[index], [key]: vals, image: val };
                                return newItems;
                              });
                            } else if (typeof onChange === 'function') {
                              const newItems = [...items];
                              newItems[index] = { ...newItems[index], [key]: vals, image: val };
                              onChange(newItems);
                            }
                          }}
                          arMode={arMode}
                       />`);
fs.writeFileSync('src/components/AdminView.tsx', code);
