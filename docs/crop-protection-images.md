# Crop Protection Image Workflow

Image records are separate from crop, organism, stage, and product data. This lets one picture be added, replaced, or hidden without changing identification or recommendation records.

## Catalog

The image catalog is `src/data/crop-protection/images.json`.

Every image record has:

```text
subject type
subject ID: organism stage, product, ingredient, crop, symptom, or look-alike
role: primary, detail, comparison, package front/back, label, or damage
display order
alt text
status: planned or available
path when available
```

`planned` produces an explicit image gap. It is useful because it tells editors exactly what photo is needed while keeping the stage guide usable.

## Asset Layout

When a record becomes available, place the image beneath `public/crop-protection/images/`:

```text
public/crop-protection/images/
  organisms/
    asian-citrus-psyllid/
      egg-primary.webp
      nymph-early-detail.webp
      nymph-late-detail.webp
      adult-primary.webp
      damage-primary.webp
  products/
    sml-spike-thiamethoxam-25-wg/
      package-front.webp
      package-back.webp
    sml-cypro-profenofos-40-cypermethrin-4-ec/
      package-front.webp
      package-back.webp
```

Then update its catalog record:

```json
{
  "status": "available",
  "path": "/crop-protection/images/organisms/asian-citrus-psyllid/adult-primary.webp"
}
```

The validation script rejects `available` records with no path and rejects records pointing at unknown stages, organisms, or products.

## What To Capture

For every pest or mite:

```text
egg
early immature stage
late immature stage
adult
host-plant damage
healthy plant comparison
beneficial or look-alike comparison
```

For diseases:

```text
early symptom
developed symptom
severe symptom
affected plant part
healthy comparison
common look-alike
```

For weeds:

```text
seedling
vegetative plant
flowering plant
seed head
root or rhizome when diagnostic
crop-context image
```

For products:

```text
package front
package back
label or leaflet page showing composition and directions
```

Package photos help a farmer identify a product, but a readable current label remains the source for directions and restrictions.

## Future License Fields

License, attribution, origin, contributor consent, and EXIF-removal fields are deliberately deferred. When we add publishing or upload support, they must be mandatory for public images. Until then, use `planned` slots and place only reviewed project assets in `public/`.
