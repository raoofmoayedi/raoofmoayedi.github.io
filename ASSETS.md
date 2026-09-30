# Visual assets

## October 1: teacher–student and robustness replacements

Both illustrations were created with the built-in image-generation tool, using `assets/privacy-sketch.webp` as the robot and rendering-style reference. The teacher–student scene is used on the robust-learning paper card. The noisy-view scene is used for the Robustness interest. They are conceptual editorial illustrations.

### teacher-student

Saved asset: `assets/teacher-student-robots.webp`

Final prompt:

Use case: illustration-story. Asset type: small illustration for a personal machine-learning research website. Input image 1 is STYLE AND ROBOT CHARACTER REFERENCE ONLY. Keep this exact visual family: adorable rounded white robot, navy oval eyes, little antenna, teal ear joints, small pencil tucked at its ear, delicate navy pencil outlines, soft textured colored-pencil and watercolor shading. Restrained teal, periwinkle and white, tiny warm amber accents. Landscape 3:2 composition, transparent background, delicate ground shadow only, entire subject within 8 percent clear margins. Readable at small website size. Warm, funny and charming, but not busy or generic stock clip art. No words, letters, equations, axes, logo, watermark, panel background, dark vignette or glow. This is a conceptual editorial illustration, not a quantitative scientific diagram. Subject: transferring robust knowledge from a teacher model to a smaller student. Make an intimate, delightful scene of TWO robots learning together: a larger knowledgeable robot kneels at the left, with a smaller eager student robot beside it on the right, about half its size. They share a low open sketchbook, angled toward the viewer. The teacher uses a small pencil to point out the outline of a teal cat in a picture dotted with a few amber noisy pixels; the smaller robot carefully traces the same recognizable cat in its own little notebook. The larger robot has a gentle encouraging expression and the student looks focused and happy, with one tiny foot lifted in concentration. Their gestures, shared example and exchanged glance must make the teaching relationship instantly clear. A few connected periwinkle and teal beads along the top edge of the shared book subtly suggest a neural model. Keep their bodies recognizable as robots from the reference, not ghost-like people. No classroom blackboard, no giant easel, no swirling sheets, no extra floating badges. The attention is on a bigger model helping a smaller one learn from a useful example.

### robustness

Saved asset: `assets/robustness-noisy-view.webp`

Final prompt:

Use case: illustration-story. Asset type: small illustration for a personal machine-learning research website. Input image 1 is STYLE AND ROBOT CHARACTER REFERENCE ONLY. Keep this exact visual family: adorable rounded white robot, navy oval eyes, little antenna, teal ear joints, small pencil tucked at its ear, delicate navy pencil outlines, soft textured colored-pencil and watercolor shading. Restrained teal, periwinkle and white, tiny warm amber accents. Landscape 3:2 composition, transparent background, delicate ground shadow only, entire subject within 8 percent clear margins. Readable at small website size. Warm, funny and charming, but not busy or generic stock clip art. No words, letters, equations, axes, logo, watermark, panel background, dark vignette or glow. This is a conceptual editorial illustration, not a quantitative scientific diagram. Subject: recognizing the same object despite an adversarially altered input. Design a fresh narrative scene, NOT two before-and-after cards and NOT a board with arrows or ticks. A little white robot sits on the left and calmly peers through a small upright translucent pane at a cute teal toy cat on the right. On that pane is a cluster of mischievous little amber square pixel speckles that partially distort and interrupt the VIEW of the cat, while its recognizable silhouette remains visible. One tiny square pixel character at the lower corner is playfully nudging a speckle, suggesting a deliberate perturbation. The robot's small thought bubble contains only a clean, simple teal cat silhouette, showing that it still recognizes the cat correctly. Make the pane clearly between the robot and the cat, with the toy cat visibly behind it and the thoughtful robot confidently focused on it. Keep the thought bubble small and integrated, no arrows, checkmarks, shields, umbrellas or generic weather metaphors. The transparent pane, toy cat, and robot should form one cohesive grounded scene, not an infographic. The robot has an endearing attentive expression. Prioritize a beautiful little story and a strong readable silhouette over technical detail.


## October 1: orbital identity and robot unlearning

The unlearning selector now uses `assets/unlearning-robot-aligned.webp`, created with the built-in image-generation tool. It features the same white robot as the other interest illustrations, selectively erasing a memory while retaining the others. All other research illustrations remain unchanged.

References: `assets/privacy-sketch.webp` (character and rendering style), `assets/unlearning-pencil-aligned.webp` (selective-erasure concept).

Final prompt:

Use case: illustration-story. Asset type: unlearning interest illustration for an academic machine-learning portfolio. Input image 1 is the ROBOT CHARACTER AND STYLE REFERENCE. Input image 2 is the CONCEPT REFERENCE: selective erasure of one connected memory, keeping the others. Create a fresh cohesive scene featuring the exact cute rounded white researcher robot from image 1: small navy oval eyes, short antenna, teal ear joints, a pencil tucked by its ear, hand-drawn navy pencil outlines and gentle colored-pencil/watercolor shading. The robot kneels at the left, holding a small ordinary periwinkle eraser and carefully erasing ONE highlighted purple memory card from a connected arrangement of four little picture cards on a low tabletop. A tiny part of the selected card's picture has become blank, with a few eraser crumbs nearby. The remaining three cards show intact simple botanical pictures and remain connected by thin navy threads with teal round joints. The relationship must read as selectively forgetting one item while retaining the others, not wiping the entire network or destroying the robot. Robot is the expressive central character, not an anthropomorphic eraser. A thoughtful kind expression and a tiny playful touch in its pose. Match the reference white robot and restrained teal/periwinkle palette exactly, small amber detail only. Sparse scene legible at small website size, landscape 3:2 composition, entire scene within 8 percent clear margins, transparent background with a delicate ground shadow only. No labels, text, equations, axes, logos, watermark, glow, frame, or large empty board. This is a conceptual editorial sketch, not a technical diagram.

The logo is a vector initial with an orbital line and a small satellite, saved in `assets/monogram.svg` and repeated in the header by `build.py`. The lowercase r outline uses the locally installed P052 Italic glyph (URW++, Copyright 2014 URW++ Design & Development); no runtime font dependency is added. The outer composition and color treatment are site-specific.


## September 30: requested style alignment

Five illustrations were edited or generated with the built-in image-generation tool and encoded as transparent WebP, without changing other illustration files. The robustness replacement is limited to the interest selector. Unlearning retains its original eraser and connected memory-card concept. PINN, sampling, and covariance assets are paper-card illustrations. These are conceptual editorial sketches, not quantitative diagrams.

### robustness

Saved asset: `assets/robustness-robot-aligned.webp`

References: `assets/privacy-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: small research website illustration. Match the supplied privacy-sketch STYLE REFERENCE: the same adorable rounded white robot with small navy oval eyes and teal joints, delicate navy pencil outlines, soft colored-pencil and watercolor shading, restrained teal and periwinkle with tiny amber accents. Hand drawn, warm, quietly funny, cohesive with the reference. This is a conceptual editorial sketch, not a precise technical diagram or quantitative chart. Landscape 3:2 canvas, transparent background, whole composition visible with about 8% clear margins, no background panel, no glow, no text, no equations, no logos, no watermark. Sparse composition readable at small card size. Input image 1 is STYLE AND CHARACTER REFERENCE ONLY. New subject: robustness to adversarial perturbations. A calm little robot tests two square picture cards side by side on a low easel: both contain the same simple teal leaf silhouette, but the second has a few tiny amber noise speckles and a mischievous tiny wind puff nudging its corner. The robot compares them with a short double-ended pointer. Above each card is the same small leaf-shaped result token with a discreet check, conveying that a small input change leaves the prediction unchanged. Make the input pair and unchanged output visibly connected, not scattered props. No shield or umbrella metaphor, no human teacher, no crystal domes. The robot has an attentive slight smile, robot same proportions and material as reference.

### unlearning

Saved asset: `assets/unlearning-pencil-aligned.webp`

References: `assets/unlearning-sketch.webp`, `assets/privacy-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: small research website illustration. Match the supplied privacy-sketch STYLE REFERENCE: the same adorable rounded white robot with small navy oval eyes and teal joints, delicate navy pencil outlines, soft colored-pencil and watercolor shading, restrained teal and periwinkle with tiny amber accents. Hand drawn, warm, quietly funny, cohesive with the reference. This is a conceptual editorial sketch, not a precise technical diagram or quantitative chart. Landscape 3:2 canvas, transparent background, whole composition visible with about 8% clear margins, no background panel, no glow, no text, no equations, no logos, no watermark. Sparse composition readable at small card size. Input image 1 is the EDIT TARGET; input image 2 is STYLE REFERENCE ONLY. Restyle image 1 ONLY. Preserve its wonderful exact concept and overall arrangement: the smiling periwinkle-and-white eraser character at left rubs out one selected purple memory card; four remaining botanical landscape memory cards stay intact, connected by navy cords and teal round nodes. Keep the eraser character, its pose, expression, the number of memory cards, their connected scrapbook arrangement, plant/landscape imagery and the selective erasure. Do NOT replace the eraser with a robot, do NOT change the concept, do NOT add props. Change only rendering to the finer navy pencil, soft watercolor washes, textured colored pencil and more dimensional white shading of input 2. Retain subtle pink cheeks and muted teal/periwinkle. Natural pencil crumbs by the one partly erased card. Preserve the clear intact connections elsewhere.

### pinn

Saved asset: `assets/pinn-robot-aligned.webp`

References: `assets/privacy-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: small research website illustration. Match the supplied privacy-sketch STYLE REFERENCE: the same adorable rounded white robot with small navy oval eyes and teal joints, delicate navy pencil outlines, soft colored-pencil and watercolor shading, restrained teal and periwinkle with tiny amber accents. Hand drawn, warm, quietly funny, cohesive with the reference. This is a conceptual editorial sketch, not a precise technical diagram or quantitative chart. Landscape 3:2 canvas, transparent background, whole composition visible with about 8% clear margins, no background panel, no glow, no text, no equations, no logos, no watermark. Sparse composition readable at small card size. Input image 1 is STYLE AND CHARACTER REFERENCE ONLY. New subject: physics-informed neural networks and residual curvature. One little robot scientist is adjusting a small neural-network instrument with three tiny layers of linked teal and periwinkle beads. The instrument is visibly connected by a short cable to a shallow wave tank on the right; a smooth teal mesh wave surface spans the tank. The robot holds a curved measuring template just above a short wiggly purple error ribbon beside the instrument; a small second, flatter error ribbon rests beside it, suggesting controlled residual curvature, separate from the physical wave. Make it a single connected tabletop experiment, with the network and physical wave the main legible relationship. The robot is examining a neural physical model, not ironing a sheet, not holding a paint roller. No human scientist. No floating unrelated objects or large dashboard. Three or four simple scene elements only.

### sampling

Saved asset: `assets/private-sampling-robot-aligned.webp`

References: `assets/privacy-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: small research website illustration. Match the supplied privacy-sketch STYLE REFERENCE: the same adorable rounded white robot with small navy oval eyes and teal joints, delicate navy pencil outlines, soft colored-pencil and watercolor shading, restrained teal and periwinkle with tiny amber accents. Hand drawn, warm, quietly funny, cohesive with the reference. This is a conceptual editorial sketch, not a precise technical diagram or quantitative chart. Landscape 3:2 canvas, transparent background, whole composition visible with about 8% clear margins, no background panel, no glow, no text, no equations, no logos, no watermark. Sparse composition readable at small card size. Input image 1 is STYLE AND CHARACTER REFERENCE ONLY. New subject: differentially private Gaussian multi-sampling. A tiny robot operates a charming compact bell-shaped sampling machine. A small closed input drawer on the left bears a tiny amber padlock and holds private record cards safely inside; above it is a translucent bell-shaped teal chamber suggesting a Gaussian distribution. On the right, a short spout produces several NEW teal and periwinkle sample marbles into a shallow tray. The robot gently counts the fresh batch with a little pencil, looking pleased. The connection between protected input drawer, bell-shaped chamber, and output spout must be obvious as ONE coherent machine. Keep the private records in the closed drawer; do not show original data being scooped or leaked from storage. No text, no actual plotted bell curve, no mathematical axes. Small friendly grounded scene, same robot character as reference.

### covariance

Saved asset: `assets/private-covariance-robot-aligned.webp`

References: `assets/privacy-sketch.webp`, `assets/covariance-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: small research website illustration. Match the supplied privacy-sketch STYLE REFERENCE: the same adorable rounded white robot with small navy oval eyes and teal joints, delicate navy pencil outlines, soft colored-pencil and watercolor shading, restrained teal and periwinkle with tiny amber accents. Hand drawn, warm, quietly funny, cohesive with the reference. This is a conceptual editorial sketch, not a precise technical diagram or quantitative chart. Landscape 3:2 canvas, transparent background, whole composition visible with about 8% clear margins, no background panel, no glow, no text, no equations, no logos, no watermark. Sparse composition readable at small card size. Input image 1 is STYLE AND ROBOT CHARACTER REFERENCE. Input image 2 is CONCEPT REFERENCE ONLY, replace its simplified humanoid characters with the little rounded robots of image 1. New subject: private covariance estimation across holders of different features. Two tiny white robots sit beside separate closed data folders: left folder periwinkle, right folder teal, each with a little amber padlock. Each keeps a slim feature table tucked inside its own folder. Between them, a third smaller robot carefully assembles a single small square mosaic of teal and periwinkle tiles on a low stand, representing the shared covariance estimate. Thin soft dotted paths carry only a few small summary tokens from each closed folder toward that common mosaic; full source tables stay with their holders. Keep one cohesive scene, readable symmetry and a few warmly funny expressions. The center mosaic should mix both colors, unlike two isolated halves. No human-like ghosts, no shield, no large charts or axes.


The research illustrations in assets were generated for this portfolio; their subjects and iteration history are documented below.

## Current hero illustrations

The five newer interests now use more topic-specific scenes while preserving the original robot, pencil outlines, watercolor texture, and navy, teal, and periwinkle palette. These are conceptual editorial illustrations, not quantitative charts or technical results. All five were created with the built-in image-generation tool using `assets/privacy-sketch.webp` as a style reference, then encoded as transparent WebP assets for the site.

| Interest | Current asset | Visible concept |
| --- | --- | --- |
| Privacy | `assets/privacy-sketch.webp` | Protected original data and similarly structured synthetic data |
| Unlearning | `assets/unlearning-robot-aligned.webp` | A robot selectively erases one memory while retaining the others |
| Robustness | `assets/robustness-noisy-view.webp` | A robot recognizes a cat despite pixel noise altering its view |
| Robust statistics | `assets/robust-statistics-aligned.webp` | A little robot marks the center of a cluster of observations while a distant outlier tugs at it. |
| Uncertainty quantification | `assets/uncertainty-aligned.webp` | A robot predicts a moving ball with a central trajectory and a widening fan of possible future positions. |
| Training dynamics | `assets/sgd-noisy-steps.webp` | Mini-batch sampling drives neural-network updates along a noisy path down a loss landscape. |
| LLM reasoning | `assets/llm-reasoning-paths.webp` | A robot reads a question, works through linked reasoning cards, checks a step, and produces an answer bubble. |
| Scientific deep learning | `assets/scientific-learning-aligned.webp` | A scientist robot connects a neural network to a fluid-flow experiment around a cylinder. |

The SGD card shares its mini-batch sketch with Training dynamics. The scientific-learning card retains its paper-specific illustration. Earlier hero-image versions are retained in the repository but are no longer used for these five selector topics.

### Final prompts for the current replacements

#### robust-statistics

Saved asset: `assets/robust-statistics-aligned.webp`

Use case: illustration-story. Create one replacement hero illustration for an academic machine-learning portfolio. Input image: STYLE AND ROBOT-CHARACTER REFERENCE ONLY. Preserve this exact appealing hand-drawn look: tiny rounded white robot, navy pencil outlines, visible colored-pencil/watercolor texture, restrained periwinkle and teal, a few warm amber details, expressive but tasteful. Keep the scene sparse and readable at small website size. Transparent background, landscape 3:2 canvas, entire subject visible with 10% clear margins, subtle ground shadow only, no glow or dark vignette. The new scene must visibly communicate the named research topic rather than a generic cute activity. This is conceptual editorial illustration, not a quantitative chart or precise scientific diagram: no data plots, axes, coordinates, numerical results, equations, logos, or watermark. Topic: ROBUST STATISTICS. Show a compact cluster of small teal observation tokens on a low circular research workbench, with a little upright estimate marker planted at the center. Far to the right, a conspicuous isolated amber observation token with a mischievous face pulls a loose elastic thread attached to the center marker. The marker stays upright in the main cluster. The robot uses a small measuring caliper to check the stable central estimate, looking calmly toward the noisy outlier. The main visual relationship must be unmistakable: clustered observations, one distant outlier, and a stable estimate. Do not use balancing scales, shields, or piles of crystals under a dome. No text.

#### uncertainty

Saved asset: `assets/uncertainty-aligned.webp`

Use case: illustration-story. Create one replacement hero illustration for an academic machine-learning portfolio. Input image: STYLE AND ROBOT-CHARACTER REFERENCE ONLY. Preserve this exact appealing hand-drawn look: tiny rounded white robot, navy pencil outlines, visible colored-pencil/watercolor texture, restrained periwinkle and teal, a few warm amber details, expressive but tasteful. Keep the scene sparse and readable at small website size. Transparent background, landscape 3:2 canvas, entire subject visible with 10% clear margins, subtle ground shadow only, no glow or dark vignette. The new scene must visibly communicate the named research topic rather than a generic cute activity. This is conceptual editorial illustration, not a quantitative chart or precise scientific diagram: no data plots, axes, coordinates, numerical results, equations, logos, or watermark. Topic: UNCERTAINTY QUANTIFICATION. A thoughtful robot observes a small teal ball just leaving a short tabletop ramp. In the air ahead of the real ball, show a single central suggested future trajectory and a translucent fan of possible future ball positions. The possibilities start close together and spread farther apart into the future, making an uncertain forecast visually explicit. The possible future balls should be pale ghost outlines, while the one observed ball is solid. The robot holds a small blank prediction card and points toward the translucent forecast envelope. Make this a charming physical prediction scene, not an axes-based chart. Do not show a cloud being measured, weather symbols, or a generic thought bubble. No text.

#### training-dynamics

Saved asset: `assets/training-dynamics-aligned.webp`

Use case: illustration-story. Create one replacement hero illustration for an academic machine-learning portfolio. Input image: STYLE AND ROBOT-CHARACTER REFERENCE ONLY. Preserve this exact appealing hand-drawn look: tiny rounded white robot, navy pencil outlines, visible colored-pencil/watercolor texture, restrained periwinkle and teal, a few warm amber details, expressive but tasteful. Keep the scene sparse and readable at small website size. Transparent background, landscape 3:2 canvas, entire subject visible with 10% clear margins, subtle ground shadow only, no glow or dark vignette. The new scene must visibly communicate the named research topic rather than a generic cute activity. This is conceptual editorial illustration, not a quantitative chart or precise scientific diagram: no data plots, axes, coordinates, numerical results, equations, logos, or watermark. Topic: TRAINING DYNAMICS. Show a small neural-network model as a freestanding rounded frame containing several layers of connected teal and periwinkle nodes. It rests on a tiny wheeled sled on a softly sketched bowl-shaped optimization surface. The robot stands beside it and adjusts one connection with a little tool. A short curved trail of update arrows descends toward the basin; two faint earlier ghost positions of the SAME neural-network frame along the trail reveal successive training states. Main visual: neural-network parameters being updated over training, with an optimization trajectory. Keep the network, robot, and curved update path large and clear. The surface is an illustrative sculpture, not a quantitative graph. Do not use hiking gear, a river, bridges, stepping stones, books, or a generic exercise scene. No text.

#### llm-reasoning

Saved asset: `assets/llm-reasoning-aligned.webp`

Use case: illustration-story. Create one replacement hero illustration for an academic machine-learning portfolio. Input image: STYLE AND ROBOT-CHARACTER REFERENCE ONLY. Preserve this exact appealing hand-drawn look: tiny rounded white robot, navy pencil outlines, visible colored-pencil/watercolor texture, restrained periwinkle and teal, a few warm amber details, expressive but tasteful. Keep the scene sparse and readable at small website size. Transparent background, landscape 3:2 canvas, entire subject visible with 10% clear margins, subtle ground shadow only, no glow or dark vignette. The new scene must visibly communicate the named research topic rather than a generic cute activity. This is conceptual editorial illustration, not a quantitative chart or precise scientific diagram: no data plots, axes, coordinates, numerical results, equations, logos, or watermark. Topic: LLM REASONING. Show the robot seated at a small desk working specifically with LANGUAGE. To its left is a speech bubble with the exact single word “Question”. In front of it are three overlapping paper reasoning cards with a few clean abstract handwriting strokes, connected in sequence by short pencil arrows. The robot holds a pencil and checks one intermediate card using a tiny teal check mark. To the right is its finished speech bubble with the exact single word “Answer”. A small connected-node language-model motif sits on the corner of the desk. The visual narrative is question → intermediate reasoning → checked answer. Preserve the cute thoughtful robot, but do not use puzzles, bridges, lightbulbs, or books as the main concept. Only the two words Question and Answer should be readable; all other strokes are illustrative lines, not invented gibberish.

#### scientific-learning

Saved asset: `assets/scientific-learning-aligned.webp`

Use case: illustration-story. Create one replacement hero illustration for an academic machine-learning portfolio. Input image: STYLE AND ROBOT-CHARACTER REFERENCE ONLY. Preserve this exact appealing hand-drawn look: tiny rounded white robot, navy pencil outlines, visible colored-pencil/watercolor texture, restrained periwinkle and teal, a few warm amber details, expressive but tasteful. Keep the scene sparse and readable at small website size. Transparent background, landscape 3:2 canvas, entire subject visible with 10% clear margins, subtle ground shadow only, no glow or dark vignette. The new scene must visibly communicate the named research topic rather than a generic cute activity. This is conceptual editorial illustration, not a quantitative chart or precise scientific diagram: no data plots, axes, coordinates, numerical results, equations, logos, or watermark. Topic: SCIENTIFIC DEEP LEARNING. Show the robot scientist beside a miniature transparent water channel containing a small cylinder. Teal flow ribbons divide around the cylinder and form a few gentle downstream swirls. Suspended just above the channel is a clear glass panel holding a simple layered neural network of connected teal and periwinkle nodes. Fine softly sketched links connect a few measured flow locations to the network panel, visibly joining PHYSICAL SYSTEM and LEARNING MODEL. The robot compares the flow experiment with the neural model using a tiny probe. The scientific apparatus and network must both be immediately recognizable, but this is a charming conceptual illustration rather than an exact fluid-simulation diagram. No ironing, rollers, crumpled fabric, books, formulas, or text.

## Research-specific sketches

Three separate built-in image-generation illustrations replace the original generic trio. Prompt direction: consistent sparse hand-drawn navy, periwinkle and teal editorial sketches on transparent backgrounds; no labels, formulas or empirical plots.

- privacy-sketch.webp: a small researcher inspects the geometry of protected original data and similarly shaped synthetic data.
- robustness-sketch.webp: a teacher model guides a smaller student while perturbations swirl around them, a metaphor for robust knowledge distillation.
- unlearning-sketch.webp: a friendly eraser selectively removes one memory card while preserving other connected cards, an illustration of a research interest.

These illustrations are visual metaphors, not technical diagrams or experimental results. All three files are served locally and selected through the research interest buttons.

## Illustrated research cards

The four research cards use privacy-sketch.webp, robustness-sketch.webp, scientific-sketch.webp and sampling-sketch.webp. The two additional original images were generated with the built-in image tool: a cheerful scientist rolling a crumpled residual surface smooth, and a statistician scooping sample marbles from a bell-shaped private-data jar. These are playful conceptual illustrations, not technical figures.

## SGD and covariance estimation — earlier iteration

Two additional built-in image-generation sketches complete the six-card research gallery:
- covariance-sketch.webp: two private feature holders and an analyst assembling a four-part matrix, a visual metaphor for covariance estimation with vertically partitioned data.
- sgd-sketch.webp: a little explorer follows small then larger stepping stones and avoids an unreliable shortcut, a visual metaphor for small-batch warmup and robustness to spurious correlations.

The prompts keep the navy, periwinkle and teal hand-drawn style and transparent backgrounds, without formulas or empirical charts. Both illustrations are conceptual rather than exact scientific diagrams.

## Expanded hero interest selector — first iteration

The original hero selector now has eight topics, each with its own image and caption. Privacy, Unlearning and Robustness retain their existing sketches. Training dynamics uses `assets/sgd-sketch.webp`; Scientific deep learning uses `assets/scientific-sketch.webp`. Robust statistics, Uncertainty quantification and LLM reasoning use three new companion illustrations, generated with the built-in image tool using `assets/privacy-sketch.webp` as a style reference. The separate research-interest cards have been removed.

The generated PNGs were encoded as local WebP assets at 1200 × 800, preserving transparency. The images remain conceptual metaphors, without equations, data charts, or empirical claims.

### robust-statistics

Saved asset: `assets/robust-statistics-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: a single research-interest sketch for the existing academic portfolio's image selector. The supplied image is a STYLE REFERENCE ONLY; create a completely different companion scene. Match its charming tiny white robot, thin navy pencil outlines, subtle colored-pencil/watercolor shading, periwinkle, pale blue and teal accents, abundant clear space, lightly sketched ground shadow. Transparent background, 3:2 landscape composition, complete unclipped figures, generous 10% margins. Cute, clever, hand-drawn, sparse, sophisticated. One coherent scene, no panels, text, labels, formulas, axes, logos, watermark, interface or background scenery. This is a playful conceptual metaphor, not an exact technical diagram. Subject: robust statistics. The little robot is carefully balancing a low tabletop scale. On one side a neat cluster of small smooth teal data pebbles is being weighed; one wildly oversized purple pebble has rolled off to the far side, and a tiny mischievous outlier pebble with a face bounces nearby. The robot calmly adjusts the scale with a pencil tucked behind its head. Convey stable estimation despite an unusual observation; whimsical and immediately different from the dome-and-magnifier reference.

### uncertainty

Saved asset: `assets/uncertainty-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: a single research-interest sketch for the existing academic portfolio's image selector. The supplied image is a STYLE REFERENCE ONLY; create a completely different companion scene. Match its charming tiny white robot, thin navy pencil outlines, subtle colored-pencil/watercolor shading, periwinkle, pale blue and teal accents, abundant clear space, lightly sketched ground shadow. Transparent background, 3:2 landscape composition, complete unclipped figures, generous 10% margins. Cute, clever, hand-drawn, sparse, sophisticated. One coherent scene, no panels, text, labels, formulas, axes, logos, watermark, interface or background scenery. This is a playful conceptual metaphor, not an exact technical diagram. Subject: uncertainty quantification. The little robot scientist uses a soft measuring ribbon around a translucent floating cloud containing three possible little teal-and-lavender droplets of different sizes. One hand holds a tiny clipboard with simple unmarked strokes; its curious face looks thoughtfully at the cloud. Two light dotted curved pencil arcs suggest a range of possibilities, without resembling any precise plot. Charming questioning pose, tiny question-shaped curl of antenna but no actual written question mark. The main visual is the robot gently measuring a cloud of possibilities.

### llm-reasoning

Saved asset: `assets/llm-reasoning-sketch.webp`

Final prompt:

Use case: illustration-story. Asset type: a single research-interest sketch for the existing academic portfolio's image selector. The supplied image is a STYLE REFERENCE ONLY; create a completely different companion scene. Match its charming tiny white robot, thin navy pencil outlines, subtle colored-pencil/watercolor shading, periwinkle, pale blue and teal accents, abundant clear space, lightly sketched ground shadow. Transparent background, 3:2 landscape composition, complete unclipped figures, generous 10% margins. Cute, clever, hand-drawn, sparse, sophisticated. One coherent scene, no panels, text, labels, formulas, axes, logos, watermark, interface or background scenery. This is a playful conceptual metaphor, not an exact technical diagram. Subject: language-model reasoning. The little robot sits cross-legged thoughtfully assembling three chunky interlocking puzzle pieces into a little arched bridge between two stacks of tiny books. Above its head are three small connected empty thought bubbles ending in a warm pale-yellow lightbulb. Keep books blank, puzzle shapes simple, no letters or numbers. The robot smiles as the final teal piece fits. Visual metaphor for building a chain of reasoning step by step, with a playful miniature engineering puzzle.

## Clearer SGD illustration

Current asset: `assets/sgd-minibatch-sketch.webp`, used in both the Training dynamics selector and the SGD research card. Generated with the built-in image tool using the previous training-dynamics sketch as a style reference. Transparent WebP, 1200 × 800.

The scene explicitly connects sampling a mini-batch, updating a neural network, and following an irregular sequence of parameter steps on a loss landscape. It is a qualitative illustration, not experimental data or a convergence guarantee.

Final prompt:

Use case: illustration-story. Create one clearer, more technically relevant conceptual illustration of STOCHASTIC GRADIENT DESCENT for an academic portfolio. The reference is STYLE AND ROBOT IDENTITY ONLY. Keep the same adorable white robot, navy hand-drawn pencil outlines, watercolor/colored-pencil texture, periwinkle and teal palette with small amber accents. Replace the entire scene; do not preserve the carts. Transparent background, 3:2 landscape, generous clear margins, no cropping, no dark vignette. Readable at a 500px-wide website card.
The scene should communicate this single causal story: sample a mini-batch → estimate an update for a neural network → take a noisy downhill parameter step.
On the left, a compact open tray holds many little sample cards with tiny abstract dot patterns. The seated robot has picked just THREE cards out of that larger collection and is feeding this small handful into a small upright neural-network panel with connected nodes. The selected handful is visually distinct from the full tray. Above this handful only, write the small legible label “mini-batch”.
On the right, occupying about half the composition, show a small sculpted bowl-shaped loss landscape with light contour strokes. A sequence of small teal parameter markers follows ONE visibly irregular, zigzagging path down the side toward the basin. Short arrowheads between consecutive markers make discrete gradient updates unmistakable. Include a little sideways wobble, not a smooth slide or a perfect straight path. A curved amber arrow from the neural-network panel points to one update on this path, tying the sampled data to the parameter step. On the rim of the landscape, write the small label “loss”.
This is a qualitative editorial sketch, not a quantitative scientific plot. No numeric axes, coordinates, empirical data, equations, guarantees of convergence, or exact technical diagram. No hiking, stepping stones, rivers, bridges, wheeled carts, large scenic mountains, or generic repair activity. Do not imply that larger batches mean larger steps. Keep the scene sparse: one robot, one dataset tray, the small selected batch and network panel, one loss basin and one update trail. The only text is “mini-batch” and “loss”.

## University marks (September 2026)

Locally hosted, unmodified university identifiers used beside the corresponding academic records. Original colours and aspect ratios are preserved.

- EPFL: https://rezaei-parham.github.io/images/experiences/optimized/epfl-160.webp
- University of Cambridge: https://www.cam.ac.uk/sites/default/files/styles/cke_media_resize_medium/public/university-cambridge-full-colour-preferred-logo-transparency-2362x491.png.webp?itok=8IjbTEtE
- Nanyang Technological University: https://www.logo.wine/a/logo/Nanyang_Technological_University/Nanyang_Technological_University-Logo.wine.svg
- Imperial College London: profile mark from the official GitHub organisation, https://avatars.githubusercontent.com/u/1220306?v=4
- Sharif University of Technology: https://rezaei-parham.github.io/images/experiences/optimized/sharif-160.webp
- Amirkabir University of Technology: https://raw.githubusercontent.com/AUT-CRLab/AUT-CRLab.github.io/master/images/aut.png

The marks remain the property of their respective institutions. They identify education and research affiliations, not sponsorship or endorsement.

## Site monogram

`assets/monogram.svg` and the matching inline header mark are an original vector drawing of a lowercase r with an open orbit. The header uses the active palette; the favicon uses the default dark colours. University assets are unchanged; CSS adjusts their compositing for light and dark surfaces.

## LLM reasoning and SGD replacements — October 2026

Generated with the built-in image-generation tool, using `assets/privacy-sketch.webp` as the robot/style reference. The selected images were encoded as transparent WebP assets for the site; original generated PNGs are retained in the workspace.

- LLM reasoning: `assets/llm-reasoning-paths.webp`. Branching speech-bubble notes distinguish a rejected path from a checked conclusion.
- SGD / training dynamics: `assets/sgd-noisy-steps.webp`. A robot consults sample cards while taking uneven downhill steps on a miniature loss landscape. Used in both the interest selector and the SGD research card.

### LLM reasoning prompt

Use case: illustration-story. Create a NEW replacement LLM REASONING illustration for an academic portfolio. The supplied image is a STYLE AND ROBOT CHARACTER reference only. Preserve the charming little white robot, thin navy pencil contours, watercolor and colored-pencil texture, periwinkle and teal with tiny warm amber accents. Change the scene completely. Transparent background, landscape 3:2 canvas, sparse composition that stays legible at 360 pixels wide. One robot, one coherent visual idea, generous clear margins.
The robot is a thoughtful little detective of language: seated at the left, pencil held against its chin, looking at a compact branching arrangement of FIVE speech-bubble-shaped note cards on a low tabletop easel to its right. Each card contains just two or three short handwritten-looking ink strokes, suggesting language, never readable text. The first bubble branches to two possible intermediate thoughts; one short wrong branch has a subtle crossed-out bubble and the robot's tiny eraser beside it. The successful branch links through another bubble to a final speech bubble with a clear small teal check mark. A slim teal pencil line traces only the checked reasoning route. The robot points its other hand at the checked conclusion, as if verifying that each step follows. Speech bubbles, branching alternatives, and checking a conclusion must be the dominant visual relationship. Use a little amber question mark only on the first card.
Avoid: literal English words such as Question or Answer, a generic neural-network ornament, piles of books, a generic lightbulb, glowing AI brains, dashboards, computer screens, numerals, equations, intricate diagrams, multiple panels, large arrows, busy background, watermark. Editorial conceptual sketch, not a quantitative or exact scientific diagram. Make it elegant, cute, lively, and substantially simpler than a flowchart.

### SGD prompt

Use case: illustration-story. Create a NEW replacement STOCHASTIC GRADIENT DESCENT sketch for an academic portfolio. Input image is STYLE AND ROBOT CHARACTER reference only. Match the adorable rounded white robot, navy hand-drawn pencil outlines, delicate colored-pencil/watercolor texture, periwinkle and teal plus tiny amber accents. Transparent background, landscape 3:2 canvas, unclipped subjects with clear margins. Highly readable at 360 pixels wide, just one robot and one miniature sculpted loss landscape.
The single scene: the little robot is taking a careful downhill step on the inside slope of a small, low, pale-lavender bowl-shaped landscape. It carries a tiny canvas satchel of data cards and holds THREE randomly selected sample cards, each with a different simple teal dot pattern, consulting these cards to choose its next step. Behind the robot, a short trail of five teal stepping markers with subtle pencil arrowheads visibly zigzags down the slope from a high rim. Ahead of the robot, only two more small markers continue toward a small amber target at the bottom of the bowl. The robot is mid-step, slightly off balance in a cute way, conveying noisy but purposeful updates. A few faint contour strokes follow the bowl's curved surface. Make the downhill direction and irregular successive steps unmistakable, without making the robot look like a hiker on a mountain. The robot and the bowl are roughly equally important; the bowl is low and wide, not a tall wall.
Avoid: text, mathematical equations, axes, numeric data, precise quantitative plots, network diagrams, separate data trays, big arrows between panels, full scenic mountains, multiple robots, bright glows, dashboards, smooth straight descent, parachutes, slides, rollercoasters. This is a qualitative editorial metaphor for mini-batch SGD, not a convergence claim or technical result. Charming and clear, restrained detail.

### SGD final targeted edit

Edit only the trail and background treatment of this SGD illustration. Keep the same robot, its three sample cards, satchel, pale lavender loss bowl, colors, pencil/watercolor style, and framing exactly. The current trail looks too straight: redraw the teal markers behind and ahead of the robot into a clearly irregular zigzag across the slope, alternating left and right as the path descends toward the amber bottom marker. Each successive step should still move downhill overall. Use only short, discreet pencil arrows between nearby markers. This is a qualitative editorial metaphor, no axes or equations. Remove the broad atmospheric halo or glow around the scene; leave only the object itself and a small pencil contact shadow under it. Actual transparent background, no opaque background, no vignette. Preserve generous clear margins and all existing objects.

## rm site mark and playful pointer

`assets/monogram.svg` and the inline header use a custom drawn lowercase **rm** signature, a small smile underline, and a four-point spark. These are original code-native vector assets. The optional pointer is a small orbiting character with two eyes, a hover reaction, and four brief click sparks. It keeps the native cursor and is disabled on coarse pointers and with reduced motion. Its preference is available in the Style menu and persists locally.
