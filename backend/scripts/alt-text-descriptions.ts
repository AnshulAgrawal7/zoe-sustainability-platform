// PROTOTYPE DATA — English BASE alt texts for the imported "What's New" feed
// images (VBM Kokkali Facebook posts), keyed by the image's storagePath
// (posts/<folder>/<filename>). Consumed by generate-alt-texts.ts, which
// translates each EN base into DE and EL via DeepL.
//
// Authoring rules (WCAG 2.1 AA):
//   - Describe ONLY what is visibly in the frame.
//   - NEVER guess identities ("probably the mayor"). If unclear, stay neutral
//     ("a person at a lectern").
//   - NO framing phrases ("image of…", "photo showing…").
//   - Keep it concise (~125 characters is a good target).
//   - An empty string "" marks a DELIBERATELY decorative image (no informational
//     value) — the generator then writes empty alt in every language, which is
//     the correct empty-alt behaviour (not an omission).
export const ALT_TEXTS_EN: Record<string, string> = {
  // === Folder 1 — Tom Cat school celebration ===
  'posts/1/718868772_27393930713575534_6116781412463713105_n.jpg':
    'A woman and a young boy in a blue cap smile outdoors in front of a palm tree.',
  'posts/1/719491590_27393933383575267_6247825975125994327_n.jpg':
    'Children crowd around a person in a large orange-and-white cat costume outside a school building.',
  'posts/1/719742111_27393935643575041_2283764133042903669_n.jpg':
    'Children gather around the cat mascot beneath the red "Spyridoula Kokkali" language-centre sign.',
  'posts/1/720524399_27393937880241484_5363212568080658131_n.jpg':
    'A person in a cat mascot costume stands in a doorway with arms outstretched; a girl watches in the paved courtyard.',
  'posts/1/720564601_27393929586908980_1831541207516626184_n.jpg':
    'Group photo of children and two adults on outdoor stone steps, with the cat mascot standing behind them.',

  // === Folder 2 — Tom Cat show invitation (poster) ===
  'posts/2/717616609_27372637192371553_4535609076574400092_n.jpg':
    'Invitation poster for "Tom Cat\'s Show" on Tuesday 9 June at 17:00, with a cartoon cat, balloons and cupcakes.',

  // === Folder 3 — World Environment Day message (infographic) ===
  'posts/3/717339940_27345276298440976_2344784171332334861_n.jpg':
    "World Environment Day infographic (5 June 2026) with a woman's portrait, recycling figures and photos of wetlands, a beach cleanup, a waterfall and dolphins.",

  // === Folder 4 — World Environment Day beach cleanup (sea-turtle awareness) ===
  'posts/4/716051833_27343744805260792_4511121593645576786_n.jpg':
    'Children in yellow hi-vis vests collect litter on a sandy beach, with an adult and coastal hills behind.',
  'posts/4/717289084_27343740168594589_4731507227251853663_n.jpg':
    'A woman in a hi-vis vest takes a selfie on the beach, with people in vests gathered on the sand behind her.',
  'posts/4/717863181_27343734958595110_825674144525416258_n.jpg':
    'Children in hi-vis vests and adults pose on the beach holding up blue worksheets, with the sea and cliffs behind.',
  'posts/4/718161160_27343754501926489_6853181853127924987_n.jpg':
    'A woman on a beach lounger shows a marine-life leaflet to a boy in a hi-vis vest; a man stands nearby and boats are on the sea behind.',

  // === Folder 5 — "Strawberry Day" (Healthy Little Eaters) ===
  'posts/5/714670906_27321800020788604_1482429968163137298_n.jpg':
    'Potted strawberry plants and ribbon-tied jars of red jam, with a "Strawberry" worksheet in front and bee-and-daisy wall decorations.',
  'posts/5/715324497_27321792947455978_738613793129114727_n.jpg':
    "Many children's hands reach toward a tray of potted strawberry plants on a table, with ribbon-tied jars nearby.",
  'posts/5/715391450_27321788817456391_1500752934700102135_n.jpg':
    'Children and a teacher gather around classroom tables with strawberry seedlings, craft supplies and worksheets; a bookshelf is behind.',

  // === Folder 6 — ERT3 visit to the Klimatia waterfalls ===
  'posts/6/712085711_27304708529164420_2714267749262400036_n.jpg':
    'A person in a blue jacket crouches beside a small rocky stream surrounded by vegetation.',
  'posts/6/712469529_27304709345831005_6650207214820289641_n.jpg':
    'Three adults stand talking outdoors on a paved courtyard with trees behind them.',
  'posts/6/713243755_27304713259163947_7055103157613897887_n.jpg':
    'Three adults pose on rocks in a wooded gorge with a small waterfall behind them.',
  'posts/6/713471080_27304717255830214_3445335593459622128_n.jpg':
    'An old pickup truck on a grassy dirt track in forested hills, with a person standing in its bed.',
  'posts/6/713844106_27304707082497898_6652503175124858709_n.jpg':
    'Five adults pose for a group selfie in a wooded area beside a stream.',

  // === Folder 7 — Attica Green Expo (honorary distinction) ===
  'posts/7/708715471_27279076755060931_2093624330009733189_n.jpg':
    'A marching band in blue uniforms with brass instruments and three men in suits at the Municipality of Northern Corfu exhibition stand.',
  'posts/7/709326254_27279064418395498_3800492904185497067_n.jpg':
    'People in formal suits pose at an indoor expo, with someone in traditional costume in the foreground.',
  'posts/7/709729098_27279061848395755_3701186990543528832_n.jpg':
    'A man in a suit and a woman in a white blazer holding a glass award stand in front of a "Green Panels" wall.',
  'posts/7/710059026_27279058718396068_2672808997914181909_n.jpg':
    'A woman speaks at an "Attica Green Expo" lectern, with a "Green Panels" title slide on the screen behind.',
  'posts/7/710252576_27279058111729462_5906351358993698351_n.jpg':
    'A man in a suit and a woman in a white blazer pose at the Municipality of Northern Corfu exhibition stand.',
  'posts/7/710481855_27279056408396299_3036840514539420098_n.jpg':
    'Six people stand on a stage in front of a large "Green Panels" sign.',
  'posts/7/710591809_27279055141729759_7393843342822421619_n.jpg':
    'A group in business attire pose on a red-carpet gangway boarding a boat at dusk.',
  'posts/7/710602856_27279058441729429_1124573617625010820_n.jpg':
    'A large group of people, including a marching band and someone in traditional costume, pose on stage at the Attica Green Expo.',
  'posts/7/710755096_27279074208394519_3529946300166544382_n.jpg':
    'An empty Municipality of Northern Corfu exhibition booth with a glass table, chairs, a photo wall and a reception counter.',
  'posts/7/710756103_27279055998396340_3234356493086266810_n.jpg':
    'Three people pose at the Corfu exhibition booth; one holds a decorated band drum.',
  'posts/7/710827559_27279073275061279_2495514996271470623_n.jpg':
    'Three people hold glass awards on a stage in front of a circular green emblem.',
  'posts/7/711802722_27279057845062822_7016987122867115654_n.jpg':
    'Four people stand behind the Corfu booth counter displaying a model boat and a glass award.',
  'posts/7/712153118_27279062021729071_2277715956869652839_n.jpg':
    'Seven people in business attire pose together at the Municipality of Northern Corfu exhibition stand.',
  'posts/7/712623689_27279054958396444_722613938402073880_n.jpg':
    'A woman stands beside a green leaf mascot and a waste-bin mascot in a yellow cap at a recycling-themed stand.',
  'posts/7/713125542_27279054728396467_507717948539715085_n.jpg':
    'Three people in suits pose in front of the Municipality of Northern Corfu photo backdrop.',
  'posts/7/713929162_27279058118396128_6792730533243570502_n.jpg':
    'Two people stand on either side of a costumed battery mascot in yellow boots at the Corfu stand.',

  // === Folder 8 — Green Panel moderation at the Attica Green Expo ===
  'posts/8/707967162_27236412725994001_3987817765367027406_n.jpg':
    'A woman speaks at the "Attica Green Expo" lectern, with the Green Panels title slide on the screen above.',
  'posts/8/708878344_27236413475993926_7199367534601344704_n.jpg':
    'Seven people in business attire pose together in front of a large "Green Panels" wall.',
  'posts/8/709006426_27236413945993879_175074476762067986_n.jpg':
    'A woman speaks at the "Attica Green Expo" lectern, with a title slide above and a seated audience in front.',
  'posts/8/709269486_27236413119327295_6965316125711462055_n.jpg':
    'Six people stand on a stage in front of a large "Green Panels" sign.',

  // === Folder 9 — "Spring in a Bottle" (Healthy Little Eaters) ===
  'posts/9/705892998_27198480909787183_2866735582664359649_n.jpg':
    'Illustrated "Spring in a Bottle 2026" label by Healthy Little Eaters, with cartoon fruit, flowers, butterflies and a flower-filled jar.',
  'posts/9/706664057_27198480929787181_456385639192164500_n.jpg':
    'A person trims potted geraniums and a sunflower outdoors, with a woven basket of cut flowers nearby.',
  'posts/9/707499159_27198477436454197_363786028834928743_n.jpg':
    'A table with empty jars, a basket of cut flowers, ribbon spools and printed "Spring in a Bottle" tags.',
  'posts/9/707523243_27198477729787501_3401468666458216002_n.jpg':
    "A child's hands trim a potted purple petunia with scissors on a windowsill.",
  'posts/9/707523633_27198481603120447_3181220947032686058_n.jpg':
    'Small glass jars filled with water and flower petals, tied with ribbons and "Spring in a Bottle 2026" tags.',
  'posts/9/707826889_27198480849787189_1999533516768769498_n.jpg':
    'A woman, a teacher and a group of children hold small decorated jars in a classroom with marine-themed posters and a woven turtle.',

  // === Folder 10 — Greek Red Cross Corfu branch elections ===
  'posts/10/705663492_27187089947592946_9163873098093984526_n.jpg':
    'Six adults pose together indoors in front of a tiled wall.',

  // === Folder 11 — ECPE (Michigan Proficiency) exams ===
  'posts/11/705298495_27183904507911490_4548761522115974417_n.jpg':
    'A woman in a red blazer poses with seven teenage students holding papers in a lobby.',

  // === Folder 12 — 7th "Anna Mouzakitis" preventive-medicine campaign ===
  'posts/12/704048812_27174997188802222_9001060387573872282_n.jpg':
    'A volunteer in a red Red Cross vest hands a leaflet to a woman outside a pharmacy.',
  'posts/12/704882459_27174998002135474_5911273524499575815_n.jpg':
    'Two people seen from behind wearing Hellenic Red Cross shirts inside a shop.',
  'posts/12/705053528_27174997908802150_2600357768116772205_n.jpg':
    'Three women read pink informational leaflets at an outdoor café table, with a town square behind.',
  'posts/12/705061633_27174996662135608_9209461390108101021_n.jpg':
    'A table with orange and yellow sun hats, brochures, sunscreen tubes and stacks of leaflets.',
  'posts/12/705088248_27174998348802106_3174237715642392757_n.jpg':
    'A large group, some in medical coats and Red Cross uniforms, pose on the steps of the Municipality of Northern Corfu building.',
  'posts/12/705088248_27174998348802106_3174237715642392757_n (1).jpg':
    'A large group, some in medical coats and Red Cross uniforms, pose on the steps of the Municipality of Northern Corfu building.',
  'posts/12/705454364_27187058610929413_8762323602230748213_n.jpg':
    'Two women stand beside a "Φάρος Ζωής" bone-marrow donor banner and a table at a clinic entrance.',
  'posts/12/706317267_27174996672135607_1402910386435665147_n.jpg':
    'Close-up of printed skin-check information sheets on a table, with an orange hat and a pen.',
  'posts/12/706868467_27174996968802244_1260018718329924352_n.jpg':
    'Seven adults stand beside an awareness pull-up banner outdoors in a square, with hills behind.',

  // === Folder 13 — Thinali school marine-protection initiative ===
  'posts/13/703891781_27162961370005804_7664106214606091261_n.jpg':
    "Children's hands around two woven trays — one of colourful crocheted sea-creature trinkets, one of seashells.",
  'posts/13/704086675_27162960460005895_8815254904034173330_n.jpg':
    'Adults and children pose outdoors by a Municipality of Northern Corfu banner and a table with baskets and bottles.',
  'posts/13/704732387_27162960033339271_6404208942481119803_n.jpg':
    'A group of women and children gather inside a café near its display cases.',
  'posts/13/704751763_27162960050005936_5011834613609337522_n.jpg':
    'Children queue inside a café while a woman serves from behind the counter.',
  'posts/13/704947153_27162960823339192_816965589926298757_n.jpg':
    'A woven basket of small organza gift bags holding crocheted trinkets, each with a printed tag.',
  'posts/13/704993535_27162961280005813_7197765685897179403_n.jpg':
    'A large group of children and several adults pose in an office with framed pictures, icons and a Greek flag.',
  'posts/13/705185994_27162960650005876_2908596688829042694_n.jpg':
    'Many organza gift bags with crocheted trinkets and printed tags laid out on a green surface.',
  'posts/13/705269884_27162961576672450_8065384637312426646_n.jpg':
    'Children gather around classroom baskets of crocheted trinkets and seashells, filling organza gift bags.',
  'posts/13/705692923_27162960030005938_6667829295865401740_n.jpg':
    'A man, a woman and several children talk on a paved street corner with shops behind.',
  'posts/13/706198619_27162962090005732_2970923997842566247_n.jpg':
    'A woman holds a basket on a café terrace as children and seated guests look on.',

  // === Folder 14 — discovery of a new waterfall ===
  'posts/14/700070342_27106404042328204_164842383833232213_n.jpg':
    'A shallow stream flows through woodland over a muddy bed, with a tree and fallen leaves.',
  'posts/14/700625850_27106406012328007_7765697941871019918_n.jpg':
    'A woman in a beige gilet crouches in dense woodland, touching the foliage.',
  'posts/14/701437120_27106404168994858_102303513285935444_n.jpg':
    'A small waterfall cascades into a pool in a wooded gorge.',
  'posts/14/701465723_27106403368994938_9095445208588379685_n.jpg':
    'Water slides down a moss-edged rock face into a clear green pool.',
  'posts/14/701586166_27106403418994933_1858105500945508067_n.jpg':
    'A waterfall feeds a green pool in a gorge, with mossy branches overhanging.',
  'posts/14/701890538_27106405555661386_5452216660804260428_n.jpg':
    'A small stream runs through a tangle of bare branches in woodland.',

  // === Folder 15 — Oncology conference at the Ionian Academy ===
  'posts/15/700483383_27088235880811687_3250147912904935743_n.jpg':
    'Conference poster for "Modern Treatment Approaches in Oncology II", 15–16 May 2026 at the Ionian Academy, Corfu, with abstract molecular artwork.',
  'posts/15/700927947_27088236774144931_4040666058281659362_n.jpg':
    'Seven people pose in a row in a wood-floored room beside a conference banner screen.',
  'posts/15/701658109_27088235900811685_947330774400418104_n.jpg':
    'Three people pose for a close-up selfie indoors.',

  // === Folder 16 — "Bees & Honey Day" (Healthy Little Eaters) ===
  'posts/16/695629362_27024645450504064_781303306474538412_n.jpg':
    'A woven basket of silicone wristbands printed with bees, honeycomb and daisies.',
  'posts/16/696728627_27024649183837024_878567786146081862_n.jpg':
    'A woven basket full of small labelled jars of honey.',
  'posts/16/696778897_27024641127171163_2399424540874740002_n.jpg':
    'Two boys work on worksheets at a classroom table beside baskets of honey jars and bee-themed wristbands.',
  'posts/16/696945206_27024643253837617_7739020029392388240_n.jpg':
    'A woven basket of small wooden honey dippers.',
  'posts/16/697123212_27024651950503414_8722180722434217585_n.jpg':
    'Children draw and write along classroom tables with coloured pens and small plant baskets, bee-and-daisy wall décor behind.',
  'posts/16/697179335_27024635730505036_3395753444692094053_n.jpg':
    'A woman stands behind four boys at a classroom table with honeycomb-and-bee wall décor and gift bags on the table.',
  'posts/16/697179335_27024635730505036_3395753444692094053_n (1).jpg':
    'A woman stands behind four boys at a classroom table with honeycomb-and-bee wall décor and gift bags on the table.',
  'posts/16/697312247_27024638573838085_3183349620395908425_n.jpg':
    'A spiral-bound "Bees & Honey Day" worksheet by Healthy Little Eaters with a bee photo, lying on grass.',
  'posts/16/697312247_27024638573838085_3183349620395908425_n (1).jpg':
    'A spiral-bound "Bees & Honey Day" worksheet by Healthy Little Eaters with a bee photo, lying on grass.',

  // === Folder 17 — Vocational High School students' educational visit ===
  'posts/17/690336045_27001214839513792_2620649071831888543_n.jpg':
    'A woman in a hi-vis vest talks with a group of teenagers on a gravel area beside a road.',
  'posts/17/690664600_27001112379524038_9137294556567213021_n.jpg':
    'A woman in a hi-vis vest leads a group of teenagers along a tree-lined dirt path.',
  'posts/17/690664600_27001112379524038_9137294556567213021_n (1).jpg':
    'A woman in a hi-vis vest leads a group of teenagers along a tree-lined dirt path.',
  'posts/17/690685673_27001111726190770_4389431925476188021_n.jpg':
    'A woman in a Municipality of Northern Corfu hi-vis vest speaks with teenagers at a roadside, a man standing nearby.',
  'posts/17/692533841_27001112439524032_4345993257217594117_n.jpg':
    'Six adults stand on a dirt path with dense greenery behind; one wears a hi-vis vest.',
  'posts/17/694678450_27001114676190475_7880948687945538418_n.jpg':
    'Teenagers gather around a woman in front of an outdoor information board in a green natural area.',
  'posts/17/695799680_27001113729523903_7366996460114354153_n.jpg':
    'Teenagers and a woman in a hi-vis vest cross a concrete path by the sea, with a litter bin in the foreground.',
  'posts/17/696209848_27001114136190529_6159503784840408540_n.jpg':
    'A group of teenagers pose for a photo by a lagoon, with hills behind.',
  'posts/17/696229564_27001113132857296_2575754274832561070_n.jpg':
    'A group of teenagers and adults pose in front of an old stone ruined building.',

  // === Folder 18 — appliance-recycling anniversary event (top-6 recognition) ===
  'posts/18/688838295_26979288685039741_5706554472578861196_n.jpg':
    'A man and a woman pose at an indoor event in front of a screen showing an aerial forest view.',
  'posts/18/689981695_26979288225039787_8114541556435067700_n.jpg':
    'A presentation slide titled "In the age of electricity" with the appliance-recycling logo and a collage of historical black-and-white photos.',
  'posts/18/690668425_26979315171703759_8706566682632770064_n.jpg':
    'Audience members watch a screen showing "1,400,000,000 drink cans" over an image of crushed aluminium cans.',
  'posts/18/691432623_26979288515039758_8353307518391080636_n.jpg':
    'A man speaks at a lectern in front of a screen showing a filmstrip of historical appliance images.',
  'posts/18/692212073_26979289628372980_7089972758300367044_n.jpg':
    'A man and a woman pose in an empty conference hall with rows of white chairs and presentation screens behind.',

  // === Folder 19 — meeting at the Ministry of Shipping ===
  'posts/19/690897386_26965223883112888_2645192181607702461_n.jpg':
    'A woman and a man pose in an office between Greek and naval flags, with framed paintings of Corfu behind.',

  // === Folder 20 — 7th "Anna Mouzakitis" preventive-medicine action (poster) ===
  'posts/20/686184416_26940301308938479_7857486979324170492_n.jpg':
    'Poster for the 7th "Anna Mouzakitis" preventive-medicine action, 22–24 May 2026 at the Acharavi clinic, with a blue awareness ribbon and partner logos.',

  // INSERT ENTRIES ABOVE THIS LINE
};
