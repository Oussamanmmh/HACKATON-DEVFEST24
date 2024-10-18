const slugify = require('slugify');

// Reusable function to generate slug
const generateSlug = async function (doc, model) {
  if (doc.isModified('name.en')) {
     console.log("name.en");
    let baseSlug = slugify(doc.name.en, {
      lower: true,
      strict: true,
      trim: true,
    });

    let newSlug = baseSlug;
    let suffix = 1;

    // Check if a product with the same slug already exists
    let slugExists = await model.findOne({ slug: newSlug });

    // Append a number to make the slug unique if it already exists
    while (slugExists) {
      newSlug = `${baseSlug}-${suffix}`;
      slugExists = await model.findOne({ slug: newSlug });
      suffix++;
    }

    // Set the unique slug
    
    console.log(newSlug);
    doc.slug = newSlug;

  } 
};

module.exports = generateSlug;
