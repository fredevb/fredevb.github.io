const SHARE_BASE_URL = 'https://fredevb.github.io/rolereveal/';
const DEFAULT_REVEAL_LINE = 'Blend in, ask smart questions, and stay hidden.';

const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('[data-target]');
const createForm = document.getElementById('create-form');
const playerCountInput = document.getElementById('player-count');
const qrOutput = document.getElementById('qr-output');
const createHint = document.getElementById('create-hint');
const playerNumberInput = document.getElementById('player-number');
const scanHint = document.getElementById('scan-hint');
const toast = document.getElementById('toast');
const shareStringField = document.getElementById('share-string');
const gameSelect = document.getElementById('game-select');
const optionsBtn = document.getElementById('options');
const copyShareBtn = document.getElementById('copy-share');
const manualStringInput = document.getElementById('manual-string');
const manualApplyBtn = document.getElementById('apply-manual');
const pasteStringBtn = document.getElementById('paste-string');
const scanQrBtn = document.getElementById('scan-qr');
const codeTimestamp = document.getElementById('code-timestamp');
const hostRevealBtn = document.getElementById('host-reveal');
const viewQrBtn = document.getElementById('view-qr');
const homeNavBtn = document.getElementById('home-nav');
const revealCard = document.getElementById('reveal-card');
const revealOverlay = document.getElementById('reveal-overlay');
const revealRole = document.getElementById('reveal-role');
const revealType = document.getElementById('reveal-type');
const revealTitle = document.getElementById('reveal-title');
const revealLocation = document.getElementById('reveal-location');
const revealExtra = document.getElementById('reveal-extra');
const revealMeta = document.getElementById('reveal-meta');
const revealInfoBtn = document.getElementById('reveal-info-btn');
const viewReferenceBtn = document.getElementById('view-reference');
const referenceSheet = document.getElementById('reference-sheet');
const referenceBackdrop = document.getElementById('reference-backdrop');
const closeReferenceBtn = document.getElementById('close-reference');
const referenceList = document.getElementById('reference-list');
const sheetTitle = document.getElementById('sheet-title');
const sheetHint = document.getElementById('sheet-hint');
const playAgainBtn = document.getElementById('play-again');
const gameTitle = document.getElementById('game-title');
const overlayPrompt = document.getElementById('reveal-overlay-text');
const infoDialog = document.getElementById('info-dialog');
const infoBackdrop = document.getElementById('info-backdrop');
const openInfoBtn = document.getElementById('open-info');
const closeInfoBtn = document.getElementById('close-info');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmBackdrop = document.getElementById('confirm-backdrop');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmCancelBtn = document.getElementById('confirm-cancel');
const confirmAcceptBtn = document.getElementById('confirm-accept');
const qrDialog = document.getElementById('qr-dialog');
const qrBackdrop = document.getElementById('qr-backdrop');
const closeQrBtn = document.getElementById('close-qr');
const scanDialog = document.getElementById('scan-dialog');
const scanBackdrop = document.getElementById('scan-backdrop');
const closeScanBtn = document.getElementById('close-scan');
const optionsSheet = document.getElementById('options-sheet');
const optionsBackdrop = document.getElementById('options-backdrop');
const closeOptionsBtn = document.getElementById('close-options');
const themeSelect = document.getElementById('theme-select');
const optionsTitle = document.getElementById('options-title');
const optionsHint = document.getElementById('options-hint');
const themeLabel = document.getElementById('theme-label');
const detailDialog = document.getElementById('detail-dialog');
const detailBackdrop = document.getElementById('detail-backdrop');
const closeDetailBtn = document.getElementById('close-detail');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.getElementById('detail-description');
const detailDefinition = document.getElementById('detail-definition');
const detailTrivia = document.getElementById('detail-trivia');

let qrInstance = null;
let currentGamePayload = null;
let html5QrCode = null;
let activePlayerNumber = null;
let scanning = false;
let latestAssignment = null;
let latestDetailPayload = null;
const dismissedEntries = new Set();
let currentSeed = null;
let roundNumber = 1;
let currentGameKey = 'spyfall';
let activeScreenId = 'screen-home';
let pendingConfirmAction = null;
let currentReferenceDataset = [];

const addListener = (element, eventName, handler) => {
    if (!element || typeof handler !== 'function') {
        return;
    }
    element.addEventListener(eventName, handler);
};

const addClick = (element, handler) => {
    addListener(element, 'click', handler);
};

const SPYFALL_LOCATIONS = [
    {
        name: 'Pirate Ship',
        description: 'The crew expects you to act natural while sailing rough waters.',
        definition: 'A vessel manned by pirates who engage in robbery and violence at sea. Historically, these ships were often fast and heavily armed, operating outside the law to capture merchant vessels and plunder their cargo.',
        roles: ['Captain', 'First Mate', 'Cook', 'Boatswain', 'Navigator', 'Cabin Boy']
    },
    {
        name: 'Space Station',
        description: 'Zero gravity makes even the smallest tasks suspicious.',
        definition: 'A spacecraft capable of supporting a human crew in orbit for an extended period of time. It lacks major propulsion or landing systems. Stations must have docking ports to allow other spacecraft to dock to transfer crew and supplies.',
        roles: ['Commander', 'Engineer', 'Communications Officer', 'Astrophysicist', 'Pilot', 'Medic']
    },
    {
        name: 'Casino',
        description: 'Chips are flying and someone is counting cards.',
        definition: 'A facility for certain types of gambling. Casinos are often built near or combined with hotels, resorts, restaurants, retail shopping, cruise ships, and other tourist attractions. Some casinos are also known for hosting live entertainment, such as stand-up comedy, concerts, and sports.',
        roles: ['Dealer', 'Security', 'High Roller', 'Bartender', 'Manager', 'Entertainer']
    },
    {
        name: 'Submarine',
        description: 'No one leaves until the mission is done.',
        definition: 'A watercraft capable of independent operation underwater. It differs from a submersible, which has more limited underwater capability. Submarines are referred to as "boats" rather than "ships" irrespective of their size.',
        roles: ['Captain', 'Sonar Tech', 'Engineer', 'Cook', 'Navigator', 'Diver']
    },
    {
        name: 'Movie Studio',
        description: 'Lights, camera, covert ops on every take.',
        definition: 'A location where a motion picture or television program is filmed. It can be a studio soundstage or a location in the real world. Sets are often constructed specifically for the production and can be highly detailed to simulate reality.',
        roles: ['Director', 'Lead Actor', 'Stunt Double', 'Camera Operator', 'Makeup Artist', 'Producer']
    },
    {
        name: 'Polar Station',
        description: 'Snow, ice, and a stranger among you.',
        definition: 'A research station located in the Arctic region. These stations are used for scientific research, including climate change, glaciology, and biology. Life in these stations is characterized by extreme cold, isolation, and long periods of darkness or daylight.',
        roles: ['Researcher', 'Medic', 'Pilot', 'Chef', 'Mechanic', 'Radio Operator']
    },
    {
        name: 'Amusement Park',
        description: 'Crowds everywhere; anyone could be the spy.',
        definition: 'An amusement park that bases its structures and attractions around a central theme, often featuring multiple areas with different themes. They provide elaborate attractions, rides, and other events for entertainment.',
        roles: ['Ride Operator', 'Mascot', 'Vendor', 'Security', 'Manager', 'Photographer']
    },
    {
        name: 'Castle',
        description: 'Keep your cover while the court watches.',
        definition: 'A type of fortified structure built in Europe and the Middle East during the Middle Ages by nobility. Castles served as private residences of lords or nobles, as well as centers of administration and military power.',
        roles: ['King', 'Queen', 'Knight', 'Cook', 'Jester', 'Guard']
    },
    {
        name: 'Airplane',
        description: 'Cruising at 30,000 feet with nowhere to hide.',
        definition: 'A commercial flight that travels between two different countries. These flights often involve long distances, crossing multiple time zones, and require passengers to go through customs and immigration.',
        roles: ['Pilot', 'Co-Pilot', 'Flight Attendant', 'Passenger', 'Air Marshal', 'Mechanic']
    },
    {
        name: 'Rock Concert',
        description: 'Sound check never ends for the spy.',
        definition: 'A location used to host live music performances. Venues range from small clubs and coffeehouses to large arenas and stadiums. The acoustics and layout are designed to enhance the listening experience for the audience.',
        roles: ['Headliner', 'Guitarist', 'Drummer', 'Sound Tech', 'Security', 'Stage Manager']
    },
    {
        name: 'Hospital',
        description: 'Sirens, stretchers, and controlled chaos behind swinging doors.',
        definition: 'A medical treatment facility specializing in emergency medicine, the acute care of patients who present without prior appointment. It provides initial treatment for a broad spectrum of illnesses and injuries, some of which may be life-threatening.',
        roles: ['Chief Surgeon', 'Triage Nurse', 'Paramedic', 'Admissions Clerk', 'Radiologist', 'Pharmacist']
    },
    {
        name: 'Police Station',
        description: 'Interrogation rooms buzz while phones keep ringing.',
        definition: 'A geographical area patrolled by a police force, or the building that serves as the headquarters for that force. It houses holding cells, interrogation rooms, and administrative offices.',
        roles: ['Detective', 'Patrol Officer', 'Desk Sergeant', 'CSI Tech', 'Lieutenant', 'Records Clerk']
    },
    {
        name: 'University',
        description: 'Lecture halls and libraries hide plenty of whispers.',
        definition: 'The grounds and buildings of a university or college. It typically includes libraries, lecture halls, residence halls, student centers, and dining halls, creating a self-contained community for students and faculty.',
        roles: ['Professor', 'Dean', 'Student', 'Librarian', 'Coach', 'Security Guard']
    },
    {
        name: 'Hotel',
        description: 'Bellhops juggle luggage while VIPs slip through quietly.',
        definition: 'The entrance hall of a high-end hotel. It is designed to impress guests with its architecture and decor, serving as a central meeting point and providing access to the hotel\'s amenities.',
        roles: ['Concierge', 'Bellhop', 'Guest', 'Bartender', 'Manager', 'Housekeeper']
    },
    {
        name: 'Restaurant',
        description: 'Pans clang and orders fly out rapid-fire.',
        definition: 'The area in a restaurant where food is prepared and cooked. It is a high-pressure environment organized into stations, such as the grill, sauté, and prep stations, to ensure efficiency during service.',
        roles: ['Head Chef', 'Sous Chef', 'Line Cook', 'Dishwasher', 'Server', 'Food Critic']
    },
    {
        name: 'Desert',
        description: 'An unlikely watering hole surrounded by dunes.',
        definition: 'A fertile area in a desert or semi-desert environment. Oases provide habitat for animals and humans and are often centered around a spring or well. They have been critical for trade and transportation routes in arid regions.',
        roles: ['Guide', 'Merchant', 'Nomad', 'Guard', 'Water Bearer', 'Traveler']
    },
    {
        name: 'Spa',
        description: 'Relaxing massages and cucumber water.',
        definition: 'A location where mineral-rich spring water (and sometimes seawater) is used to give medicinal baths. Spa towns or spa resorts (including hot springs resorts) typically offer various health treatments, which are also known as balneotherapy.',
        roles: ['Masseuse', 'Receptionist', 'Guest', 'Yoga Instructor', 'Cleaner', 'Manager']
    },
    {
        name: 'Newsroom',
        description: 'Deadlines loom as anchors prep for the live broadcast.',
        definition: 'The central place where journalists—reporters, editors, and producers—work to gather news to be published in a newspaper or online or broadcast on radio or television.',
        roles: ['Anchor', 'Producer', 'Camera Operator', 'Editor', 'Intern', 'Field Reporter']
    },
    {
        name: 'Tech Startup',
        description: 'Open office energy with too many whiteboards.',
        definition: 'A workspace or community designed to foster the growth of new technology companies. These hubs often feature open-plan offices, shared resources, and a culture of innovation and collaboration.',
        roles: ['Founder', 'Engineer', 'Product Manager', 'Investor', 'Designer', 'HR Lead']
    },
    {
        name: 'Cruise Ship',
        description: 'Buffets, pool parties, and nowhere to run.',
        definition: 'The open-air levels of a cruise ship where passengers can relax, swim, and enjoy the view. These decks often feature pools, bars, and entertainment areas.',
        roles: ['Captain', 'Cruise Director', 'Lifeguard', 'Tourist', 'Chef', 'Entertainer']
    },
    {
        name: 'Ski Resort',
        description: 'Chairlifts creak while snowboarders swap stories.',
        definition: 'A resort developed for skiing, snowboarding, and other winter sports. In Europe, most ski resorts are towns or villages in or adjacent to a ski area, while in North America, they are often purpose-built destination resorts.',
        roles: ['Lift Operator', 'Ski Patrol', 'Instructor', 'Rental Clerk', 'Guest', 'Barista']
    },
    {
        name: 'Beach',
        description: 'Umbrellas, frozen drinks, and a salty breeze.',
        definition: 'A bar located on or near a beach. They are popular tourist destinations, offering drinks and sometimes food in a relaxed, open-air setting with views of the ocean.',
        roles: ['Bartender', 'Lifeguard', 'DJ', 'Tourist', 'Server', 'Fisherman']
    },
    {
        name: 'City Hall',
        description: 'Public hearings clash with backroom deals.',
        definition: 'The headquarters of a city\'s administration and usually houses the city or town council, its associated departments, and their employees. It is also the base of the mayor of a city, town, borough, county, or shire.',
        roles: ['Mayor', 'Clerk', 'Council Member', 'Lobbyist', 'Reporter', 'Protester']
    },
    {
        name: 'Fashion Show',
        description: 'Flashbulbs pop as models sprint backstage.',
        definition: 'A narrow, usually flat platform that runs into an auditorium or between sections of an outdoor seating area, used by models to demonstrate clothing and accessories during a fashion show.',
        roles: ['Designer', 'Model', 'Photographer', 'Stylist', 'Makeup Artist', 'Buyer']
    },
    {
        name: 'Art Museum',
        description: 'Priceless art hangs while alarms stay armed.',
        definition: 'A room or building for the display or sale of works of art. Museums are institutions that care for (conserve) a collection of artifacts and other objects of artistic, cultural, historical, or scientific importance.',
        roles: ['Curator', 'Docent', 'Security Guard', 'Visitor', 'Art Restorer', 'Collector']
    },
    {
        name: 'Train Station',
        description: 'Arrivals board flickers while commuters rush by.',
        definition: 'A railway facility or area where trains regularly stop to load or unload passengers or freight. It generally consists of at least one track-side platform and a station building (depot) providing such ancillary services as ticket sales, waiting rooms, and baggage/freight service.',
        roles: ['Conductor', 'Ticket Agent', 'Vendor', 'Commuter', 'Tourist', 'Security Officer']
    },
    {
        name: 'Farmer\'s Market',
        description: 'Fresh produce and friendly chatter hide hushed talks.',
        definition: 'A physical retail marketplace intended to sell foods directly by farmers to consumers. Farmers\' markets may be indoors or outdoors and typically consist of booths, tables, or stands where farmers sell their fruits, vegetables, meats, cheeses, and sometimes prepared foods and beverages.',
        roles: ['Farmer', 'Baker', 'Florist', 'Chef', 'Health Inspector', 'Customer']
    },
    {
        name: 'Construction Site',
        description: 'Steel beams rise alongside clouds of dust.',
        definition: 'A piece of land where construction work is being carried out. The term also includes the buildings or infrastructure being constructed or renovated.',
        roles: ['Foreman', 'Crane Operator', 'Electrician', 'Architect', 'Safety Inspector', 'Laborer']
    },
    {
        name: 'Stadium',
        description: 'Crowd roars while the clock ticks down.',
        definition: 'A venue for association football (soccer) matches. It typically consists of a field of play surrounded by a tiered structure designed to allow spectators to stand or sit and view the game.',
        roles: ['Striker', 'Coach', 'Goalkeeper', 'Referee', 'Fan', 'Vendor']
    },
    {
        name: 'Jungle Expedition',
        description: 'Humidity, wildlife, and mysterious field notes.',
        definition: 'A temporary or semi-permanent settlement established in a jungle environment for scientific research. Researchers study the local flora, fauna, and ecosystem dynamics.',
        roles: ['Lead Scientist', 'Medic', 'Guide', 'Botanist', 'Security', 'Photographer']
    },
];

const SPYFALL_SCI_FI_LOCATIONS = [
    {
        name: 'Orbital Outpost',
        description: 'Cargo shuttles dock while the planet spins below.',
        definition: 'A space station positioned in orbit around a planet. It serves as a hub for transport, research, and commerce. Shuttles constantly dock and undock, transferring cargo and personnel while the planet rotates silently below.',
        roles: ['Station Commander', 'Docking Chief', 'EVA Specialist', 'Comms Officer', 'Hydroponics Lead', 'Security Drone Tech']
    },
    {
        name: 'Terraforming Lab',
        description: 'Atmosphere processors hum while scientists rewrite the sky.',
        definition: 'A facility dedicated to the process of modifying a planet\'s atmosphere, temperature, surface topography or ecology to be similar to the environment of Earth to make it habitable for Earth-like life.',
        roles: ['Chief Scientist', 'Terraforming Engineer', 'Drone Pilot', 'Geologist', 'Data Analyst', 'Hazard Tech']
    },
    {
        name: 'Colony Dropship',
        description: 'Cryo pods line the hull en route to a new world.',
        definition: 'A spacecraft designed to transport colonists and equipment from orbit to a planet\'s surface. These massive vessels are often equipped with cryo-pods to sustain passengers during long interstellar journeys.',
        roles: ['Pilot', 'Navigator', 'Quartermaster', 'Security Officer', 'Med-Bot Specialist', 'Cryo Tech']
    },
    {
        name: 'Holo Casino',
        description: 'Aliens gamble with light and probability hacks.',
        definition: 'A gambling establishment that utilizes holographic technology to create immersive gaming experiences. Players can wager on virtual races, card games with shifting rules, and games of pure chance manipulated by quantum algorithms.',
        roles: ['Dealer', 'Probability Hacker', 'Floor Manager', 'Android Concierge', 'Celebrity Gambler', 'Security']
    },
    {
        name: 'Lunar Mining Camp',
        description: 'Helium-3 rigs operate under a black sky.',
        definition: 'An extraction facility located on the Moon. These camps are established to mine valuable resources such as Helium-3, which is used for nuclear fusion. The environment is harsh, with low gravity and no atmosphere.',
        roles: ['Foreman', 'Miner', 'Rover Mechanic', 'Surveyor', 'Cook', 'AI Safety Monitor']
    },
    {
        name: 'Time Relay Station',
        description: 'Couriers sync timelines before stepping through gates.',
        definition: 'A facility that manages and monitors time travel operations. Couriers and agents pass through these stations to sync their chronometers before embarking on missions to different points in history.',
        roles: ['Chronologist', 'Gate Operator', 'Customs Officer', 'Quantum Engineer', 'Archivist', 'Security Detail']
    },
    {
        name: 'Galactic Senate',
        description: 'Diplomats float between negotiation chambers.',
        definition: 'The governing body of an interstellar alliance. Representatives from thousands of star systems gather here to debate laws, negotiate treaties, and resolve disputes. The chambers are designed to accommodate species of all shapes and sizes.',
        roles: ['Ambassador', 'Interpreter', 'Lobbyist', 'Security Marshal', 'Archivist', 'Press Liaison']
    },
    {
        name: 'Biodome Sanctuary',
        description: 'Alien wildlife thrives under shimmering glass.',
        definition: 'A large, enclosed structure containing a self-sustaining ecosystem. These domes are often used to preserve endangered alien species or to create habitable environments on hostile worlds.',
        roles: ['Caretaker', 'Biologist', 'Ranger', 'Drone Pilot', 'Docent', 'Geneticist']
    },
    {
        name: 'Asteroid Prison',
        description: 'Rocky cells orbit endlessly in deep space.',
        definition: 'A high-security penitentiary built into or on an asteroid. The isolation of deep space makes escape nearly impossible. Inmates are often put to work mining the asteroid for resources.',
        roles: ['Warden', 'Guard Drone Tech', 'Inmate', 'Supply Pilot', 'Warden Assistant', 'Cook']
    },
    {
        name: 'Quantum Research Array',
        description: 'Lattice of labs probing probability itself.',
        definition: 'A collection of laboratories and sensors dedicated to the study of quantum mechanics and probability. Experiments here often involve manipulating the fabric of reality itself.',
        roles: ['Lead Physicist', 'Lab Tech', 'Security Marshal', 'AI Ethics Officer', 'Statistician', 'Janitor Bot']
    },
    {
        name: 'Stargate Terminal',
        description: 'Travelers queue for wormhole departures.',
        definition: 'A transportation hub where travelers use wormhole technology to instantaneously travel between distant star systems. The terminal is a bustle of activity with customs checks and departures.',
        roles: ['Gate Controller', 'Traveler', 'Customs Agent', 'Mechanic', 'Vendor', 'Tour Guide']
    },
    {
        name: 'Deep-Space Salvage Tug',
        description: 'Crew hauls derelicts before pirates swoop in.',
        definition: 'A specialized vessel designed to recover derelict spacecraft and debris from deep space. These ships are rugged and equipped with powerful grappling arms and cutting lasers.',
        roles: ['Captain', 'Salvage Diver', 'Engineer', 'Scanner Operator', 'Quartermaster', 'Security Drone Pilot']
    },
    {
        name: 'Nebula Observatory',
        description: 'Glass domes track swirling cosmic storms.',
        definition: 'An astronomical observatory positioned near or within a nebula. The location offers a unique vantage point for studying star formation and cosmic dust clouds.',
        roles: ['Astronomer', 'Intern', 'Maintenance Bot', 'Navigator', 'Communications Lead', 'Docent']
    },
    {
        name: 'Android Assembly Plant',
        description: 'Conveyor belts stamp minds into chrome bodies.',
        definition: 'A factory where androids and robots are manufactured. The assembly lines are highly automated, with precision arms assembling complex circuitry and synthetic skin.',
        roles: ['Plant Manager', 'Programmer', 'Quality Inspector', 'Safety Officer', 'Logistics Lead', 'Union Rep']
    },
    {
        name: 'Alien Bazaar',
        description: 'Gravity pockets hold stalls from a thousand worlds.',
        definition: 'A marketplace located on a space station or neutral planet where traders from various species gather to sell their wares. It is a place where one can find rare items, exotic foods, and illicit goods.',
        roles: ['Smuggler', 'Trader', 'Translator', 'Bounty Hunter', 'Street Performer', 'Pickpocket']
    },
    {
        name: 'Warp Drive Test Range',
        description: 'Prototype engines roar beside containment shields.',
        definition: 'A designated area of space used for testing experimental faster-than-light propulsion systems. The area is heavily monitored to contain any potential spatial anomalies.',
        roles: ['Test Pilot', 'Engineer', 'Safety Marshal', 'Data Analyst', 'Mechanic', 'Investor']
    },
    {
        name: 'Cyberpunk Mega-Tower',
        description: 'Neon-lit spire holding entire city blocks inside.',
        definition: 'A massive skyscraper that functions as a self-contained city. These towers are often stratified by social class, with the wealthy living in the upper levels and the poor in the lower levels.',
        roles: ['Netrunner', 'Security Contractor', 'Elevator Attendant', 'Street Vendor', 'Corporate Exec', 'Courier']
    },
    {
        name: 'Undersea Dome City',
        description: 'Pressure locks keep alien waters outside.',
        definition: 'A city constructed on the ocean floor of an alien world. The city is protected by a transparent dome that withstands the immense pressure of the deep ocean.',
        roles: ['Admiral', 'Marine Biologist', 'Glasswright', 'Hydroponics Farmer', 'Tourist', 'Customs Agent']
    },
    {
        name: 'Radiation Shield Bunker',
        description: 'Sensors hum as storms batter the planet surface.',
        definition: 'A fortified shelter designed to protect inhabitants from lethal radiation storms. These bunkers are essential for survival on planets with weak magnetic fields or active stars.',
        roles: ['Commander', 'Dosimetry Officer', 'Medic', 'Technician', 'Scout', 'Cook']
    },
    {
        name: 'Dyson Ring Maintenance Rig',
        description: 'Gigantic panels soak sunlight while crews weld seams.',
        definition: 'A mobile platform used to repair and maintain a Dyson Ring, a massive megastructure that encircles a star to harvest its energy. The scale of the structure is immense.',
        roles: ['Foreman', 'Welder', 'Robot Wrangler', 'Pilot', 'Logistics Officer', 'Inspector']
    },
    {
        name: 'Drone Carrier Hangar',
        description: 'Swarm bays buzz as pilots program attack vectors.',
        definition: 'The flight deck and storage area of a carrier ship dedicated to drone warfare. The hangar is a hive of activity as drones are rearmed, refueled, and programmed for their next mission.',
        roles: ['Commander', 'Drone Pilot', 'Mechanic', 'Data Officer', 'Deck Chief', 'Intel Analyst']
    },
    {
        name: 'Cryostasis Vault',
        description: 'Frosty pods line silent catwalks.',
        definition: 'A storage facility for cryo-pods containing people in suspended animation. These vaults are often found on colony ships or in deep-space outposts.',
        roles: ['Cryo Tech', 'Security Guard', 'Archivist', 'Maintenance Bot', 'Quartermaster', 'Doctor']
    },
    {
        name: 'Gravity Arena',
        description: 'Switchable gravity keeps competitors guessing.',
        definition: 'A sports stadium where the gravity can be manipulated. This allows for unique and physically demanding sports that would be impossible in a standard gravity environment.',
        roles: ['Announcer', 'Athlete', 'Coach', 'Betting Broker', 'Medic', 'Engineer']
    },
    {
        name: 'Martian Desert Colony',
        description: 'Red dust storms slam into prefab domes.',
        definition: 'A settlement on the surface of Mars. The colony consists of pressurized habitats and greenhouses designed to sustain life in the harsh Martian environment.',
        roles: ['Governor', 'Terraforming Tech', 'Hydroponics Farmer', 'Miner', 'Teacher', 'Security']
    },
    {
        name: 'AI Tribunal Chamber',
        description: 'Sentient algorithms debate human appeals.',
        definition: 'A court where artificial intelligences serve as judges. These tribunals are often used to resolve complex legal cases that require impartial and rapid data processing.',
        roles: ['Advocate', 'Judge AI', 'Clerk', 'Defendant', 'Archivist', 'Bailiff Bot']
    },
    {
        name: 'Smuggler Asteroid Cantina',
        description: 'Low gravity watering hole for shady deals.',
        definition: 'A bar and meeting place for criminals and outlaws, hidden within an asteroid field. It is a place to find work, trade information, and avoid the authorities.',
        roles: ['Bartender', 'Fence', 'Pirate', 'Undercover Marshal', 'Musician', 'Shuttle Pilot']
    },
    {
        name: 'Solar Sail Cruiser',
        description: 'Miles of fabric shimmer while steering thrusters whisper.',
        definition: 'A spacecraft propelled by the pressure of sunlight on large, reflective sails. These vessels are slow but fuel-efficient and are often used for luxury cruises.',
        roles: ['Captain', 'Navigator', 'Rigging Tech', 'Passenger', 'Chef', 'Security']
    },
    {
        name: 'Plasma Refinery',
        description: 'Magnetic funnels tame star-hot fuel streams.',
        definition: 'An industrial facility that processes plasma fuel for starships. The refining process involves handling extremely hot and volatile materials.',
        roles: ['Chief Engineer', 'Coolant Specialist', 'Control Room Operator', 'Inspector', 'Guard', 'Logistics Pilot']
    },
    {
        name: 'Meteor Defense Platform',
        description: 'Railguns track debris before it hits home.',
        definition: 'A weaponized station designed to destroy incoming meteors and asteroids before they can impact a planet or colony.',
        roles: ['Commander', 'Targeting Officer', 'Sensor Analyst', 'Gunner', 'Technician', 'Janitor Bot']
    },
    {
        name: 'Time Tourism Terminal',
        description: 'Chrononauts grab souvenirs before re-entering the stream.',
        definition: 'A departure point for tourists traveling to the past. Strict rules are in place to prevent travelers from altering the timeline.',
        roles: ['Guide', 'Historian', 'Ticket Agent', 'Security', 'Traveler', 'Mechanic']
    }
];

const SPYFALL_WORLD_LANDMARKS = [
    {
        name: 'Eiffel Tower',
        description: 'Tourists crowd the elevators for a view of Paris.',
        definition: 'A wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. It is a global cultural icon of France and one of the most recognizable structures in the world.',
        roles: ['Elevator Operator', 'Tourist', 'Pickpocket', 'Security Guard', 'Souvenir Seller', 'Proposal Photographer']
    },
    {
        name: 'Great Wall of China',
        description: 'Stone steps stretch endlessly over the mountains.',
        definition: 'A series of fortifications that were built across the historical northern borders of ancient Chinese states and Imperial China as protection against various nomadic groups from the Eurasian Steppe.',
        roles: ['Tour Guide', 'Hiker', 'Historian', 'Vendor', 'Restoration Worker', 'Guard']
    },
    {
        name: 'Statue of Liberty',
        description: 'Ferries drop off visitors to climb the pedestal.',
        definition: 'A colossal neoclassical sculpture on Liberty Island in New York Harbor within New York City. The copper statue, a gift from the people of France to the people of the United States, was designed by French sculptor Frédéric Auguste Bartholdi and its metal framework was built by Gustave Eiffel.',
        roles: ['Park Ranger', 'Ferry Captain', 'Tourist', 'Gift Shop Clerk', 'Security', 'Maintenance Worker']
    },
    {
        name: 'Pyramids of Giza',
        description: 'Camels rest in the shadow of ancient stone tombs.',
        definition: 'The Giza Pyramid Complex, also called the Giza Necropolis, is the site on the Giza Plateau in Greater Cairo, Egypt that includes the Great Pyramid of Giza, the Pyramid of Khafre, and the Pyramid of Menkaure, along with their associated pyramid complexes and the Great Sphinx of Giza.',
        roles: ['Camel Handler', 'Archaeologist', 'Tourist', 'Vendor', 'Police Officer', 'Guide']
    },
    {
        name: 'Taj Mahal',
        description: 'White marble reflects in the long pool at sunrise.',
        definition: 'An ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh, India. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.',
        roles: ['Gardener', 'Photographer', 'Tourist', 'Security Guard', 'Guide', 'Cleaner']
    },
    {
        name: 'Colosseum',
        description: 'Ruined arches surround the old gladiator arena.',
        definition: 'An oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, despite its age.',
        roles: ['Tour Guide', 'History Student', 'Ticket Taker', 'Restorer', 'Tourist', 'Actor in Costume']
    },
    {
        name: 'Machu Picchu',
        description: 'Mist clears to reveal ruins on a mountain peak.',
        definition: 'A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-metre (7,970 ft) mountain ridge. It is located in the Cusco Region, Urubamba Province, Machupicchu District.',
        roles: ['Llama Herder', 'Hiker', 'Guide', 'Park Warden', 'Archaeologist', 'Train Conductor']
    },
    {
        name: 'Grand Canyon',
        description: 'Red rocks drop a mile down to the river.',
        definition: 'A steep-sided canyon carved by the Colorado River in Arizona, United States. The Grand Canyon is 277 miles (446 km) long, up to 18 miles (29 km) wide and attains a depth of over a mile (6,093 feet or 1,857 meters).',
        roles: ['Rafting Guide', 'Hiker', 'Geologist', 'Helicopter Pilot', 'Park Ranger', 'Tourist']
    },
    {
        name: 'Sydney Opera House',
        description: 'White sails gleam above the busy harbor.',
        definition: 'A multi-venue performing arts centre in Sydney. Located on the banks of the Sydney Harbour, it is widely regarded as one of the world\'s most famous and distinctive buildings and a masterpiece of 20th-century architecture.',
        roles: ['Opera Singer', 'Usher', 'Lighting Tech', 'Tourist', 'Ticket Agent', 'Cleaner']
    },
    {
        name: 'Christ the Redeemer',
        description: 'A giant statue overlooks the beaches of Rio.',
        definition: 'An Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil, created by French sculptor Paul Landowski and built by Brazilian engineer Heitor da Silva Costa, in collaboration with French engineer Albert Caquot.',
        roles: ['Tram Operator', 'Tourist', 'Priest', 'Souvenir Vendor', 'Maintenance Worker', 'Photographer']
    },
    {
        name: 'Stonehenge',
        description: 'Massive stones stand in a circle on a grassy plain.',
        definition: 'A prehistoric monument on Salisbury Plain in Wiltshire, England, two miles (3 km) west of Amesbury. It consists of an outer ring of vertical sarsen standing stones, each around 13 feet (4.0 m) high, seven feet (2.1 m) wide, and weighing around 25 tons, topped by connecting horizontal lintel stones.',
        roles: ['Druid', 'Security Guard', 'Archaeologist', 'Bus Driver', 'Tourist', 'Sheep Farmer']
    },
    {
        name: 'Mount Everest Base Camp',
        description: 'Yellow tents cluster on the moving glacier.',
        definition: 'Two base camps on opposite sides of Mount Everest: South Base Camp is in Nepal at an altitude of 5,364 metres (17,598 ft), while North Base Camp is in Tibet, China at 5,150 metres (16,900 ft).',
        roles: ['Sherpa', 'Climber', 'Expedition Leader', 'Doctor', 'Cook', 'Porter']
    },
    {
        name: 'Niagara Falls',
        description: 'Mist soaks everyone on the boat deck.',
        definition: 'A group of three waterfalls at the southern end of Niagara Gorge, spanning the border between the province of Ontario in Canada and the state of New York in the United States.',
        roles: ['Boat Captain', 'Tourist in Poncho', 'Casino Dealer', 'Border Agent', 'Hotel Clerk', 'Daredevil']
    },
    {
        name: 'The Louvre',
        description: 'Crowds gather around a small painting of a smiling woman.',
        definition: 'The world\'s most-visited museum, and a historic monument in Paris, France. It is the home of some of the best-known works of art, including the Mona Lisa and the Venus de Milo.',
        roles: ['Art Curator', 'Security Guard', 'Art Student', 'Ticket Checker', 'Tourist', 'Restorer']
    },
    {
        name: 'Times Square',
        description: 'Neon billboards flash day and night.',
        definition: 'A major commercial intersection, tourist destination, entertainment center, and neighborhood in the Midtown Manhattan section of New York City, at the junction of Broadway and Seventh Avenue.',
        roles: ['Street Performer', 'Police Officer', 'Broadway Actor', 'Tourist', 'News Ticker Operator', 'Hot Dog Vendor']
    },
    {
        name: 'Venice Canals',
        description: 'Gondolas glide past old sinking buildings.',
        definition: 'The canals of Venice, Italy, which serve as the function of roads. The city is built on a group of 118 small islands that are separated by canals and linked by over 400 bridges.',
        roles: ['Gondolier', 'Vaporetto Driver', 'Tourist', 'Mask Seller', 'Local Resident', 'Waiter']
    },
    {
        name: 'The White House',
        description: 'Reporters shout questions on the lawn.',
        definition: 'The official residence and workplace of the president of the United States. It is located at 1600 Pennsylvania Avenue NW in Washington, D.C., and has been the residence of every U.S. president since John Adams in 1800.',
        roles: ['President', 'Secret Service Agent', 'Press Secretary', 'Gardener', 'Chef', 'Journalist']
    },
    {
        name: 'Buckingham Palace',
        description: 'Guards in tall hats stand perfectly still.',
        definition: 'The London residence and administrative headquarters of the monarch of the United Kingdom. Located in the City of Westminster, the palace is often at the centre of state occasions and royal hospitality.',
        roles: ['Royal Guard', 'Queen/King', 'Tourist', 'Household Staff', 'Gardener', 'Police Officer']
    },
    {
        name: 'The Acropolis',
        description: 'Marble columns stand watch over Athens.',
        definition: 'An ancient citadel located on a rocky outcrop above the city of Athens and contains the remains of several ancient buildings of great architectural and historic significance, the most famous being the Parthenon.',
        roles: ['Archaeologist', 'Restoration Architect', 'Tourist', 'Ticket Seller', 'Guide', 'Stray Cat']
    },
    {
        name: 'Petra',
        description: 'A temple carved directly into the red rock face.',
        definition: 'A historic and archaeological city in southern Jordan. It is adjacent to the mountain of Jabal Al-Madbah, in a basin surrounded by mountains forming the eastern flank of the Arabah valley running from the Dead Sea to the Gulf of Aqaba.',
        roles: ['Bedouin Guide', 'Camel Owner', 'Archaeologist', 'Tourist', 'Souvenir Seller', 'Donkey Handler']
    },
    {
        name: 'Burj Khalifa',
        description: 'Elevators shoot up to the world’s highest deck.',
        definition: 'A skyscraper in Dubai, United Arab Emirates. It is the world\'s tallest building. With a total height of 829.8 m (2,722 ft) and a roof height (excluding antenna, but including a 244 m spire) of 828 m (2,717 ft), the Burj Khalifa has been the tallest structure and building in the world since its topping out in 2009.',
        roles: ['Window Cleaner', 'Concierge', 'Tourist', 'Resident', 'Security', 'Elevator Tech']
    },
    {
        name: 'Golden Gate Bridge',
        description: 'Fog rolls over the giant orange towers.',
        definition: 'A suspension bridge spanning the Golden Gate, the one-mile-wide (1.6 km) strait connecting San Francisco Bay and the Pacific Ocean. The structure links the U.S. city of San Francisco, California—the northern tip of the San Francisco Peninsula—to Marin County.',
        roles: ['Bridge Painter', 'Toll Collector', 'Cyclist', 'Tourist', 'Suicide Patrol', 'Engineer']
    },
    {
        name: 'Disney World',
        description: 'Families wait in line for a photo with a mouse.',
        definition: 'An entertainment resort complex in Bay Lake and Lake Buena Vista, Florida, United States, near the cities of Orlando and Kissimmee. Opened on October 1, 1971, the resort is owned and operated by Disney Parks, Experiences and Products.',
        roles: ['Character Actor', 'Ride Operator', 'Janitor', 'Excited Kid', 'Stressed Parent', 'Security']
    },
    {
        name: 'Hollywood Walk of Fame',
        description: 'Tourists look down to find their favorite stars.',
        definition: 'A historic landmark which consists of more than 2,700 five-pointed terrazzo and brass stars embedded in the sidewalks along 15 blocks of Hollywood Boulevard and three blocks of Vine Street in Hollywood, California.',
        roles: ['Street Performer', 'Tourist', 'Celebrity Impersonator', 'Shop Owner', 'Cleaner', 'Paparazzi']
    },
    {
        name: 'The Vatican',
        description: 'Crowds gather in the square for a blessing.',
        definition: 'An independent city-state enclaved within Rome, Italy. The Vatican City State, also known simply as the Vatican, became independent from Italy with the Lateran Treaty (1929), and it is a distinct territory under "full ownership, exclusive dominion, and sovereign authority and jurisdiction" of the Holy See.',
        roles: ['Pope', 'Swiss Guard', 'Cardinal', 'Tourist', 'Nun', 'Museum Guide']
    },
    {
        name: 'Central Park',
        description: 'Joggers and carriages share the winding paths.',
        definition: 'An urban park in New York City, between the Upper West Side and Upper East Side neighborhoods of Manhattan. It was the first landscaped park in the United States.',
        roles: ['Jogger', 'Carriage Driver', 'Hot Dog Vendor', 'Tourist', 'Musician', 'Birdwatcher']
    },
    {
        name: 'Great Barrier Reef',
        description: 'Divers explore colorful coral below the surface.',
        definition: 'The world\'s largest coral reef system composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometres (1,400 mi) over an area of approximately 344,400 square kilometres (133,000 sq mi).',
        roles: ['Scuba Instructor', 'Marine Biologist', 'Tourist', 'Boat Captain', 'Conservationist', 'Fish']
    },
    {
        name: 'Santorini',
        description: 'Blue-domed churches overlook the sparkling sea.',
        definition: 'An island in the southern Aegean Sea, about 200 km (120 mi) southeast of Greece\'s mainland. It is the largest island of a small, circular archipelago, which bears the same name and is the remnant of a volcanic caldera.',
        roles: ['Hotel Manager', 'Donkey Driver', 'Tourist', 'Bride', 'Photographer', 'Waiter']
    },
    {
        name: 'Amazon Rainforest',
        description: 'Thick canopy hides wildlife and winding rivers.',
        definition: 'A moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 km2 (2,700,000 sq mi), of which 5,500,000 km2 (2,100,000 sq mi) are covered by the rainforest.',
        roles: ['Indigenous Guide', 'Biologist', 'Logger', 'River Boat Pilot', 'Photographer', 'Explorer']
    },
    {
        name: 'Las Vegas Strip',
        description: 'Lights dazzle as fountains dance to music.',
        definition: 'A stretch of South Las Vegas Boulevard in Clark County, Nevada, that is known for its concentration of resort hotels and casinos. The Strip is approximately 4.2 miles (6.8 km) in length, located immediately south of the Las Vegas city limits in the unincorporated towns of Paradise and Winchester.',
        roles: ['Dealer', 'Showgirl', 'Tourist', 'Bartender', 'Security', 'Street Performer']
    }
];

const SPYFALL_SWITZERLAND_LOCATIONS = [
    { name: 'ETH Main Building', description: 'Dome towers over the Polyterrasse.', definition: 'The main building of ETH Zurich, designed by Gottfried Semper. It is a historic landmark and the heart of the university.', roles: ['Rector', 'Tourist', 'Professor', 'Student', 'Security', 'Cleaner'] },
    { name: 'Polyterrasse', description: 'Students eat lunch with a view of the city.', definition: 'The large terrace in front of the ETH Main Building, offering a panoramic view of Zurich. It is a popular meeting spot for students.', roles: ['Student', 'Tourist', 'Skater', 'Security', 'Food Truck Vendor', 'Professor'] },
    { name: 'CAB Building', description: 'Computer science students code in the basement.', definition: 'A building on the ETH Zentrum campus, known for housing the Department of Computer Science (D-INFK).', roles: ['CS Student', 'TA', 'Professor', 'Janitor', 'Security', 'Lost Visitor'] },
    { name: 'Student Project House', description: '3D printers hum and ideas take shape.', definition: 'A creative space for students to work on their own projects, equipped with workshops and makerspaces.', roles: ['Maker', 'Mentor', 'Student', 'Visitor', 'Staff', 'Investor'] },
    { name: 'bQm Bar', description: 'Beers flow after a long day of lectures.', definition: 'A popular student bar located directly under the Polyterrasse. It is a social hub for students to relax.', roles: ['Bartender', 'Drunk Student', 'Alumni', 'DJ', 'Bouncer', 'Professor'] },
    { name: 'ASVZ Gym', description: 'Sweat and weights in the sports center.', definition: 'The Academic Sports Association Zurich (ASVZ) offers sports facilities and classes for students and staff.', roles: ['Trainer', 'Bodybuilder', 'Student', 'Yoga Instructor', 'Receptionist', 'Cleaner'] },
    { name: 'Polybahn', description: 'Red funicular climbs the steep hill.', definition: 'A funicular railway in Zurich that connects the Central square with the Polyterrasse. It is a quick way to get to the university.', roles: ['Driver', 'Commuter', 'Student', 'Tourist', 'Ticket Inspector', 'Maintenance Worker'] },
    { name: 'Zurich HB', description: 'Trains arrive from all over Switzerland.', definition: 'Zurich Main Station, the largest railway station in Switzerland. It is a major transport hub.', roles: ['Conductor', 'Commuter', 'Tourist', 'Shop Assistant', 'Police Officer', 'Busker'] },
    { name: 'Langstrasse', description: 'Neon lights and nightlife buzz.', definition: 'A street in Zurich known for its nightlife, bars, and multicultural atmosphere. It is a popular destination for students on weekends.', roles: ['Partygoer', 'Police Officer', 'Bartender', 'Kebab Vendor', 'Resident', 'Tourist'] },
    { name: 'Lake Zurich', description: 'Boats drift on the calm water.', definition: 'A large lake extending southeast of the city of Zurich. In summer, it is a popular spot for swimming and picnicking.', roles: ['Swimmer', 'Boat Captain', 'Sunbather', 'Police', 'Ice Cream Seller', 'Duck Feeder'] },
    { name: 'Uetliberg', description: 'Hikers look down on the fog.', definition: 'The local mountain of Zurich, offering a panoramic view of the entire city and the lake.', roles: ['Hiker', 'Mountain Biker', 'Tourist', 'Restaurant Staff', 'Train Driver', 'Paraglider'] },
    { name: 'Google Zurich', description: 'Slides and free food in the Hurlimann Areal.', definition: 'Google\'s largest engineering center in Europe, located in Zurich. It is known for its unique office design.', roles: ['Software Engineer', 'Product Manager', 'Intern', 'Chef', 'Security', 'Recruiter'] },
    { name: 'CERN', description: 'Particles collide in the underground ring.', definition: 'The European Organization for Nuclear Research, located near Geneva. It houses the Large Hadron Collider.', roles: ['Physicist', 'Engineer', 'Tour Guide', 'Intern', 'Security', 'Director'] },
    { name: 'Technopark', description: 'Startups pitch ideas in glass offices.', definition: 'A technology park in Zurich that houses numerous startups and technology companies.', roles: ['Founder', 'Investor', 'Developer', 'Receptionist', 'Consultant', 'Intern'] },
    { name: 'Lecture Hall', description: 'Professor scribbles on the blackboard.', definition: 'A large room used for instruction, typically at a college or university. Rows of seats face a stage or podium.', roles: ['Professor', 'Sleeping Student', 'Note Taker', 'Latecomer', 'Guest Lecturer', 'Tech Support'] },
    { name: 'Computer Lab', description: 'Screens glow in the dim light.', definition: 'A room equipped with computers for student use. It is often used for practical exercises and exams.', roles: ['Student', 'TA', 'Sysadmin', 'Gamer', 'Cleaner', 'Professor'] },
    { name: 'Server Room', description: 'Fans whir and lights blink.', definition: 'A room devoted to the continuous operation of computer servers. It is air-conditioned and secure.', roles: ['Sysadmin', 'Technician', 'Security', 'Hacker', 'Cleaner', 'Manager'] },
    { name: 'Hackathon', description: 'Energy drinks and code sprints.', definition: 'An event where computer programmers and others collaborate intensively on software projects.', roles: ['Hacker', 'Organizer', 'Sponsor', 'Judge', 'Mentor', 'Pizza Delivery Guy'] },
    { name: 'Mensa Polyterra', description: 'Trays clatter in the lunch line.', definition: 'One of the main student cafeterias at ETH Zurich, serving thousands of meals a day.', roles: ['Chef', 'Cashier', 'Student', 'Dishwasher', 'Professor', 'Visitor'] },
    { name: 'ETH Store', description: 'Hoodies and textbooks on display.', definition: 'The official store of ETH Zurich, selling merchandise, books, and stationery.', roles: ['Salesperson', 'Student', 'Tourist', 'Alumni', 'Manager', 'Stock Clerk'] },
    { name: 'Alumni Lounge', description: 'Graduates network over coffee.', definition: 'A meeting place for alumni of the university, often used for networking events.', roles: ['Alumni', 'Bartender', 'Student', 'Professor', 'Event Planner', 'Donor'] },
    { name: 'Tram Station', description: 'Blue trams rattle through the streets.', definition: 'A stop for the Zurich tram network, which is the backbone of public transport in the city.', roles: ['Driver', 'Passenger', 'Ticket Inspector', 'Tourist', 'Commuter', 'Old Lady'] },
    { name: 'Coop', description: 'Students grab sandwiches between classes.', definition: 'A Swiss supermarket chain. The store near the university is a popular spot for lunch.', roles: ['Cashier', 'Student', 'Shopper', 'Security', 'Shelf Stocker', 'Manager'] },
    { name: 'D-INFK Office', description: 'Admin staff handle paperwork.', definition: 'The administrative office of the Department of Computer Science.', roles: ['Secretary', 'Student', 'Professor', 'Head of Department', 'IT Support', 'Visitor'] },
    { name: 'Vision Lab', description: 'Cameras track movement.', definition: 'A research laboratory focused on computer vision and image processing.', roles: ['Researcher', 'PhD Student', 'Subject', 'Professor', 'Engineer', 'Visitor'] },
    { name: 'Robotics Arena', description: 'Drones fly and robots walk.', definition: 'A facility for testing and demonstrating mobile robots and drones.', roles: ['Roboticist', 'Pilot', 'Student', 'Professor', 'Safety Officer', 'Spectator'] },
    { name: 'Quantum Lab', description: 'Lasers cool atoms to absolute zero.', definition: 'A lab dedicated to research in quantum information and computing.', roles: ['Physicist', 'PhD Student', 'Engineer', 'Professor', 'Lab Manager', 'Visitor'] },
    { name: 'Underground Tunnels', description: 'Pipes and cables run beneath the campus.', definition: 'A network of service tunnels connecting the buildings of the university.', roles: ['Maintenance Worker', 'Explorer', 'Security', 'Rat', 'Engineer', 'Ghost'] },
    { name: 'Library', description: 'Silence reigns among the stacks.', definition: 'The main library of the university, a place for quiet study and research.', roles: ['Librarian', 'Student', 'Researcher', 'Security', 'Cleaner', 'Bookworm'] },
    { name: 'Coffee Machine', description: 'The lifeline of the department.', definition: 'A vending machine or coffee station that provides caffeine to tired students and staff.', roles: ['Addict', 'Technician', 'Student', 'Professor', 'Cleaner', 'Queue Jumper'] }
];

const SPYFALL_HISTORICAL_ERAS_LOCATIONS = [
    { name: 'Jurassic Jungle', description: 'Giant ferns hide roaring beasts.', definition: 'A prehistoric jungle from the Jurassic period, dominated by dinosaurs and giant plants.', roles: ['T-Rex', 'Paleontologist', 'Time Traveler', 'Velociraptor', 'Herbivore', 'Egg Thief'] },
    { name: 'Ice Age Cave', description: 'Fire flickers against frozen walls.', definition: 'A shelter used by early humans during the last glacial period. Outside, mammoths roam the tundra.', roles: ['Caveman', 'Gatherer', 'Hunter', 'Shaman', 'Wolf', 'Time Traveler'] },
    { name: 'Ancient Egypt', description: 'Slaves haul stones for the pharaoh.', definition: 'The construction site of the Great Pyramids of Giza. The sun beats down on the desert sand.', roles: ['Pharaoh', 'Slave', 'Architect', 'Priest', 'Scribe', 'Time Traveler'] },
    { name: 'Roman Colosseum', description: 'Crowds cheer for blood and sand.', definition: 'The famous amphitheater in Rome where gladiators fought to the death for the entertainment of the masses.', roles: ['Gladiator', 'Emperor', 'Spectator', 'Lion', 'Guard', 'Senator'] },
    { name: 'Viking Village', description: 'Longships dock in the misty fjord.', definition: 'A settlement of Norse seafarers. Warriors prepare for a raid while farmers tend to their fields.', roles: ['Jarl', 'Shieldmaiden', 'Blacksmith', 'Farmer', 'Raider', 'Monk'] },
    { name: 'Medieval Castle', description: 'Knights joust in the courtyard.', definition: 'A fortified residence of a noble during the Middle Ages. It is a center of power and defense.', roles: ['King', 'Queen', 'Knight', 'Jester', 'Peasant', 'Spy'] },
    { name: 'Renaissance Studio', description: 'Paint smells mix with marble dust.', definition: 'The workshop of a master artist in Florence during the Renaissance. Masterpieces are being created.', roles: ['Master Artist', 'Apprentice', 'Model', 'Patron', 'Sculptor', 'Time Traveler'] },
    { name: 'French Revolution', description: 'The guillotine falls in the square.', definition: 'Paris during the Reign of Terror. The streets are filled with angry mobs and revolutionary fervor.', roles: ['Executioner', 'Noble', 'Revolutionary', 'Peasant', 'Soldier', 'Spy'] },
    { name: 'Wild West Saloon', description: 'Piano plays as a brawl breaks out.', definition: 'A bar in the American frontier. Cowboys, outlaws, and gamblers gather to drink and play cards.', roles: ['Sheriff', 'Bartender', 'Outlaw', 'Piano Player', 'Cowboy', 'Gambler'] },
    { name: 'Industrial Factory', description: 'Steam whistles blow and gears grind.', definition: 'A textile mill during the Industrial Revolution. Workers toil long hours in dangerous conditions.', roles: ['Foreman', 'Child Laborer', 'Owner', 'Mechanic', 'Inspector', 'Unionizer'] },
    { name: 'Titanic Deck', description: 'Iceberg looms in the dark water.', definition: 'The deck of the RMS Titanic on its maiden voyage. Passengers enjoy the luxury before disaster strikes.', roles: ['Captain', 'Musician', 'Wealthy Passenger', 'Stowaway', 'Crew Member', 'Lookout'] },
    { name: 'WWI Trenches', description: 'Mud and barbed wire stretch for miles.', definition: 'The front lines of the First World War. Soldiers wait for the whistle to go over the top.', roles: ['Soldier', 'Medic', 'General', 'Messenger', 'Sniper', 'Rat'] },
    { name: 'Roaring Twenties', description: 'Jazz plays in a smoky speakeasy.', definition: 'An illegal bar during the Prohibition era. Flappers dance and gangsters make deals.', roles: ['Gangster', 'Flapper', 'Bartender', 'Musician', 'Police Officer', 'Bootlegger'] },
    { name: 'WWII Bunker', description: 'Sirens wail as bombs fall above.', definition: 'An underground shelter during the Blitz. Civilians huddle together while the city burns.', roles: ['Soldier', 'Civilian', 'Nurse', 'Radio Operator', 'Spy', 'General'] },
    { name: 'Moon Landing', description: 'One small step for man.', definition: 'The surface of the Moon on July 20, 1969. Astronauts plant the flag while the world watches.', roles: ['Astronaut', 'Mission Control', 'Alien', 'Cameraman', 'President', 'Conspiracy Theorist'] },
    { name: 'Woodstock', description: 'Mud, music, and peace signs.', definition: 'The famous music festival in 1969. Hippies gather for three days of peace and music.', roles: ['Musician', 'Hippie', 'Security', 'Dealer', 'Fan', 'Time Traveler'] },
    { name: 'Berlin Wall', description: 'Hammers chip away at the concrete.', definition: 'The fall of the Berlin Wall in 1989. East and West Germans celebrate the reunification.', roles: ['Guard', 'Protester', 'Reporter', 'Tourist', 'Politician', 'Student'] },
    { name: 'Dot Com Office', description: 'Nerf guns and inflated stock prices.', definition: 'A startup office during the dot-com bubble. Young millionaires code and party.', roles: ['CEO', 'Programmer', 'Investor', 'Receptionist', 'Pizza Guy', 'Bankruptcy Lawyer'] },
    { name: 'Salem Witch Trials', description: 'Accusations fly in the courtroom.', definition: 'Salem, Massachusetts in 1692. Hysteria grips the town as people are accused of witchcraft.', roles: ['Judge', 'Accuser', 'Witch', 'Priest', 'Villager', 'Sheriff'] },
    { name: 'Gold Rush Camp', description: 'Pans sift through the river mud.', definition: 'A mining camp in California during the Gold Rush. Prospectors dream of striking it rich.', roles: ['Prospector', 'Merchant', 'Sheriff', 'Thief', 'Saloon Girl', 'Banker'] },
    { name: 'Pirate Ship', description: 'Jolly Roger flies from the mast.', definition: 'A ship sailing the Caribbean during the Golden Age of Piracy. The crew hunts for treasure.', roles: ['Captain', 'Quartermaster', 'Gunner', 'Cook', 'Prisoner', 'Parrot'] },
    { name: 'Samurai Dojo', description: 'Swords clash in the courtyard.', definition: 'A training ground for samurai in feudal Japan. Honor and discipline are paramount.', roles: ['Sensei', 'Student', 'Daimyo', 'Ninja', 'Servant', 'Blacksmith'] },
    { name: 'Aztec Temple', description: 'Sun god demands a sacrifice.', definition: 'A temple in Tenochtitlan. Priests perform rituals to ensure the sun rises.', roles: ['High Priest', 'Warrior', 'Victim', 'Emperor', 'Commoner', 'Time Traveler'] },
    { name: 'Prohibition Distillery', description: 'Moonshine drips into jars.', definition: 'A hidden operation producing illegal alcohol. The air smells of yeast and danger.', roles: ['Bootlegger', 'Driver', 'Police Officer', 'Chemist', 'Gangster', 'Lookout'] },
    { name: 'Victorian London', description: 'Fog swirls around gas lamps.', definition: 'The streets of London in the 19th century. Carriages rattle over cobblestones.', roles: ['Detective', 'Doctor', 'Street Urchin', 'Lady', 'Chimney Sweep', 'Killer'] },
    { name: 'Space Race Control', description: 'Rockets launch on the screens.', definition: 'Mission Control during the height of the Space Race. Engineers race to beat the Soviets.', roles: ['Director', 'Engineer', 'Astronaut', 'Scientist', 'General', 'Janitor'] },
    { name: 'Disco Floor', description: 'Mirror ball spins over dancers.', definition: 'A nightclub in the 1970s. The music is loud and the fashion is flashy.', roles: ['DJ', 'Dancer', 'Bouncer', 'Bartender', 'Celebrity', 'Manager'] },
    { name: 'Y2K Party', description: 'Counting down to the apocalypse.', definition: 'New Year\'s Eve 1999. People party while worrying about computers crashing.', roles: ['Partygoer', 'IT Guy', 'Doomsayer', 'DJ', 'Bartender', 'Time Traveler'] },
    { name: 'Stone Age Camp', description: 'Flint sparks a fire.', definition: 'A temporary camp of hunter-gatherers. Tools are made from stone and bone.', roles: ['Hunter', 'Gatherer', 'Elder', 'Child', 'Wolf', 'Shaman'] },
    { name: 'Mars Colony', description: 'Red dust covers the domes.', definition: 'A future settlement on Mars. Humans terraform the planet to make it habitable.', roles: ['Colonist', 'Scientist', 'Robot', 'Doctor', 'Engineer', 'Martian'] }
];

const SPYFALL_COUNTRIES_LOCATIONS = [
    { name: 'United States', description: 'Land of the free and home of the brave.', definition: 'A country primarily located in North America.', roles: ['President', 'Cowboy', 'Hollywood Star', 'Tech Mogul', 'Fast Food Worker', 'Tourist'] },
    { name: 'China', description: 'The Great Wall stretches for miles.', definition: 'A country in East Asia.', roles: ['Emperor', 'Panda Keeper', 'Factory Worker', 'Tea Master', 'Calligrapher', 'Tourist'] },
    { name: 'India', description: 'Spices fill the air in bustling markets.', definition: 'A country in South Asia.', roles: ['Bollywood Star', 'Yoga Guru', 'Cricket Player', 'Spice Merchant', 'Tech Support', 'Tourist'] },
    { name: 'Brazil', description: 'Samba rhythms echo through the streets.', definition: 'The largest country in South America.', roles: ['Soccer Player', 'Samba Dancer', 'Amazon Guide', 'Beach Vendor', 'Carnival Queen', 'Tourist'] },
    { name: 'Russia', description: 'Snow covers the Red Square.', definition: 'The largest country in the world.', roles: ['Cosmonaut', 'Ballet Dancer', 'Spy', 'Oligarch', 'Hockey Player', 'Tourist'] },
    { name: 'Japan', description: 'Cherry blossoms fall on ancient temples.', definition: 'An island country in East Asia.', roles: ['Samurai', 'Anime Artist', 'Sushi Chef', 'Sumo Wrestler', 'Geisha', 'Tourist'] },
    { name: 'Germany', description: 'Oktoberfest tents are full of cheer.', definition: 'A country in Central Europe.', roles: ['Beer Brewer', 'Car Engineer', 'Philosopher', 'Soccer Fan', 'Scientist', 'Tourist'] },
    { name: 'United Kingdom', description: 'Big Ben chimes in the fog.', definition: 'A country in Northwest Europe.', roles: ['Royal Guard', 'Punk Rocker', 'Detective', 'Tea Drinker', 'Banker', 'Tourist'] },
    { name: 'France', description: 'The Eiffel Tower sparkles at night.', definition: 'A country in Western Europe.', roles: ['Chef', 'Fashion Designer', 'Mime', 'Artist', 'Sommelier', 'Tourist'] },
    { name: 'Italy', description: 'Gondolas glide through narrow canals.', definition: 'A country in Southern Europe.', roles: ['Pizza Maker', 'Opera Singer', 'Fashion Model', 'Gladiator', 'Pope', 'Tourist'] },
    { name: 'Canada', description: 'Maple syrup flows in the snowy woods.', definition: 'A country in North America.', roles: ['Hockey Player', 'Lumberjack', 'Mountie', 'Maple Farmer', 'Comedian', 'Tourist'] },
    { name: 'Australia', description: 'Kangaroos hop across the outback.', definition: 'A sovereign country comprising the mainland of the Australian continent.', roles: ['Surfer', 'Outback Guide', 'Zookeeper', 'Miner', 'Rugby Player', 'Tourist'] },
    { name: 'Mexico', description: 'Mariachi bands play in the plaza.', definition: 'A country in the southern portion of North America.', roles: ['Luchador', 'Mariachi Musician', 'Taco Vendor', 'Artist', 'Archaeologist', 'Tourist'] },
    { name: 'Spain', description: 'Flamenco dancers stomp to the guitar.', definition: 'A country in Southwestern Europe.', roles: ['Matador', 'Flamenco Dancer', 'Soccer Star', 'Chef', 'Architect', 'Tourist'] },
    { name: 'South Korea', description: 'K-Pop blasts from neon skyscrapers.', definition: 'A country in East Asia.', roles: ['K-Pop Idol', 'Gamer', 'Tech CEO', 'Kimchi Maker', 'Fashionista', 'Tourist'] },
    { name: 'Indonesia', description: 'Temples rise from the jungle mist.', definition: 'A country in Southeast Asia.', roles: ['Bali Dancer', 'Volcano Guide', 'Coffee Farmer', 'Surfer', 'Puppeteer', 'Tourist'] },
    { name: 'Turkey', description: 'Bazaars are filled with colorful rugs.', definition: 'A transcontinental country located mainly on the Anatolian Peninsula.', roles: ['Carpet Seller', 'Kebab Chef', 'Whirling Dervish', 'Historian', 'Barber', 'Tourist'] },
    { name: 'Saudi Arabia', description: 'Oil rigs pump in the desert heat.', definition: 'A country in Western Asia.', roles: ['Oil Sheik', 'Camel Racer', 'Falconer', 'Pilgrim', 'Merchant', 'Tourist'] },
    { name: 'Argentina', description: 'Tango dancers embrace in the street.', definition: 'A country in the southern half of South America.', roles: ['Tango Dancer', 'Gaucho', 'Soccer Legend', 'Steak Chef', 'Winemaker', 'Tourist'] },
    { name: 'South Africa', description: 'Lions roam the savannah parks.', definition: 'The southernmost country in Africa.', roles: ['Safari Guide', 'Rugby Player', 'Diamond Miner', 'Surfer', 'Winemaker', 'Tourist'] },
    { name: 'Egypt', description: 'Pyramids stand tall against the sky.', definition: 'A transcontinental country spanning the northeast corner of Africa.', roles: ['Pharaoh', 'Archaeologist', 'Camel Driver', 'Belly Dancer', 'Scuba Diver', 'Tourist'] },
    { name: 'Nigeria', description: 'Afrobeats play in the busy markets.', definition: 'A country in West Africa.', roles: ['Nollywood Actor', 'Musician', 'Oil Worker', 'Market Trader', 'Soccer Player', 'Tourist'] },
    { name: 'Pakistan', description: 'Mountains reach high into the clouds.', definition: 'A country in South Asia.', roles: ['Cricket Player', 'Truck Artist', 'Mountaineer', 'Textile Merchant', 'Chef', 'Tourist'] },
    { name: 'Iran', description: 'Persian rugs cover the bazaar floors.', definition: 'A country in Western Asia.', roles: ['Carpet Weaver', 'Poet', 'Pistachio Farmer', 'Architect', 'Historian', 'Tourist'] },
    { name: 'Thailand', description: 'Golden temples shine in the sun.', definition: 'A country in Southeast Asia.', roles: ['Muay Thai Fighter', 'Street Food Vendor', 'Monk', 'Elephant Mahout', 'Massage Therapist', 'Tourist'] },
    { name: 'Vietnam', description: 'Motorbikes swarm the busy streets.', definition: 'A country in Southeast Asia.', roles: ['Pho Chef', 'Rice Farmer', 'Tailor', 'Coffee Brewer', 'Fisherman', 'Tourist'] },
    { name: 'Poland', description: 'Castles stand on the river banks.', definition: 'A country in Central Europe.', roles: ['Pianist', 'Miner', 'Vodka Distiller', 'Scientist', 'Dumpling Maker', 'Tourist'] },
    { name: 'Ukraine', description: 'Sunflowers bloom in the vast fields.', definition: 'A country in Eastern Europe.', roles: ['Wheat Farmer', 'Boxer', 'IT Specialist', 'Musician', 'Chef', 'Tourist'] },
    { name: 'Colombia', description: 'Coffee beans dry in the mountain sun.', definition: 'A country in South America.', roles: ['Coffee Farmer', 'Salsa Dancer', 'Cyclist', 'Flower Grower', 'Artist', 'Tourist'] },
    { name: 'Greece', description: 'White ruins overlook the blue sea.', definition: 'A country in Southeast Europe.', roles: ['Philosopher', 'Fisherman', 'Olive Farmer', 'Statue Sculptor', 'Ship Captain', 'Tourist'] }
];

const SPYFALL_THEMES = {
    standard: {
        key: 'standard',
        label: 'Standard',
        dataset: SPYFALL_LOCATIONS,
        hint: 'Classic Spyfall mix of everyday locations.'
    },
    countries: {
        key: 'countries',
        label: 'Countries',
        dataset: SPYFALL_COUNTRIES_LOCATIONS,
        hint: 'Around the world in 30 locations.'
    },
    scifi: {
        key: 'scifi',
        label: 'Sci-Fi',
        dataset: SPYFALL_SCI_FI_LOCATIONS,
        hint: 'Futuristic settings among stars and stations.'
    },
    landmarks: {
        key: 'landmarks',
        label: 'World Landmarks',
        dataset: SPYFALL_WORLD_LANDMARKS,
        hint: 'Famous sites from the Eiffel Tower to the Taj Mahal.'
    },
    switzerland: {
        key: 'switzerland',
        label: 'Switzerland (ETH)',
        dataset: SPYFALL_SWITZERLAND_LOCATIONS,
        hint: 'Locations for ETH Zurich CS students.'
    },
    historical: {
        key: 'historical',
        label: 'Historical Eras',
        dataset: SPYFALL_HISTORICAL_ERAS_LOCATIONS,
        hint: 'Time travel from the Jurassic to the Y2K party.'
    }
};

const CHAMELEON_ANIMALS_WORDS = [
    { name: 'Tiger', description: 'Striped jungle hunter moving in silence.', definition: 'The largest living cat species, native to Asia. It is recognizable by its dark vertical stripes on orange-brown fur with a lighter underside. Tigers are apex predators, primarily preying on ungulates such as deer and wild boar.' },
    { name: 'Penguin', description: 'Tuxedo swimmer waddling on ice.', definition: 'A group of aquatic flightless birds. They live almost exclusively in the Southern Hemisphere, with only one species, the Galápagos penguin, found north of the Equator. Highly adapted for life in the water, penguins have countershaded dark and white plumage and flippers for swimming.' },
    { name: 'Kangaroo', description: 'Powerful hopper with a pouch.', definition: 'A marsupial from the family Macropodidae. Kangaroos are indigenous to Australia and New Guinea. The Australian government estimates that 42.8 million kangaroos lived within the commercial harvest areas of Australia in 2019.' },
    { name: 'Octopus', description: 'Eight-armed escape artist under the sea.', definition: 'A soft-bodied, eight-limbed mollusc of the order Octopoda. The order consists of some 300 species and is grouped within the class Cephalopoda with squids, cuttlefish, and nautiloids. Like other cephalopods, the octopus is bilaterally symmetric with two eyes and a beak.' },
    { name: 'Dolphin', description: 'Playful ocean mammal using sonar clicks.', definition: 'An aquatic mammal within the infraorder Cetacea. Dolphin species belong to the families Delphinidae (the oceanic dolphins), Platanistidae (the Indian river dolphins), Iniidae (the New World river dolphins), Pontoporiidae (the La Plata dolphin), and the extinct Lipotidae (baiji or Chinese river dolphin).' },
    { name: 'Owl', description: 'Night predator with silent wings.', definition: 'Birds from the order Strigiformes, which includes over 200 species of mostly solitary and nocturnal birds of prey typified by an upright stance, a large, broad head, binocular vision, binaural hearing, sharp talons, and feathers adapted for silent flight.' },
    { name: 'Elephant', description: 'Massive memory-keeper with tusks.', definition: 'The largest living land animals. Three living species are currently recognised: the African bush elephant, the African forest elephant, and the Asian elephant. They are the only surviving members of the family Elephantidae and the order Proboscidea.' },
    { name: 'Panda', description: 'Bamboo-munching black-and-white bear.', definition: 'Also known as the giant panda, a bear species endemic to China. It is characterised by its bold black-and-white coat and rotund body. The name "giant panda" is sometimes used to distinguish it from the red panda, a neighboring musteloid.' },
    { name: 'Snake', description: 'Slithering reptile with a venomous bite.', definition: 'Elongated, legless, carnivorous reptiles of the suborder Serpentes. Like all other squamates, snakes are ectothermic, amniote vertebrates covered in overlapping scales.' },
    { name: 'Giraffe', description: 'Long-necked browser towering above trees.', definition: 'A large African hoofed mammal belonging to the genus Giraffa. It is the tallest living terrestrial animal and the largest ruminant on Earth. Traditionally, giraffes were thought to be one species, Giraffa camelopardalis, with nine subspecies.' },
    { name: 'Lion', description: 'Savannah ruler with a thunderous roar.', definition: 'A large cat of the genus Panthera native to Africa and India. It has a muscular, deep-chested body, short, rounded head, round ears, and a hairy tuft at the end of its tail. It is sexually dimorphic; adult male lions are larger than females and have a prominent mane.' },
    { name: 'Gorilla', description: 'Gentle giant of the primate world.', definition: 'Herbivorous, predominantly ground-dwelling great apes that inhabit the tropical forests of equatorial Africa. The genus Gorilla is divided into two species: the eastern gorillas and the western gorillas, and either four or five subspecies.' },
    { name: 'Frog', description: 'Amphibian jumper catching flies.', definition: 'A diverse and largely carnivorous group of short-bodied, tailless amphibians composing the order Anura. The oldest fossil "proto-frog" appeared in the early Triassic of Madagascar, but molecular clock dating suggests their origins may extend further back to the Permian, 265 million years ago.' },
    { name: 'Polar Bear', description: 'Arctic powerhouse roaming frozen seas.', definition: 'A hypercarnivorous bear whose native range lies largely within the Arctic Circle, encompassing the Arctic Ocean, its surrounding seas and surrounding land masses. It is the largest extant bear species, as well as the largest extant land carnivore.' },
    { name: 'Shark', description: 'Ocean predator with rows of teeth.', definition: 'A group of elasmobranch fish characterized by a cartilaginous skeleton, five to seven gill slits on the sides of the head, and pectoral fins that are not fused to the head. Modern sharks are classified within the clade Selachimorpha (or Selachii) and are the sister group to the rays.' },
    { name: 'Flamingo', description: 'Pink-legged balancer posing in lagoons.', definition: 'A type of wading bird in the family Phoenicopteridae, the only bird family in the order Phoenicopteriformes. Four flamingo species are distributed throughout the Americas, including the Caribbean, and two species are native to Africa, Asia, and Europe.' }
];

const CHAMELEON_VIDEO_GAME_WORDS = [
    { name: 'Tetris', description: 'Stack falling shapes to clear lines.', definition: 'A tile-matching puzzle video game created by Soviet software engineer Alexey Pajitnov in 1984. Players must rotate and arrange falling tetrominoes to create complete lines, which then disappear.' },
    { name: 'Minecraft', description: 'Blocky sandbox of mining and crafting.', definition: 'A sandbox video game developed by Mojang Studios. Players explore a blocky, procedurally generated 3D world with infinite terrain, and may discover and extract raw materials, craft tools and items, and build structures or earthworks.' },
    { name: 'The Legend of Zelda', description: 'Green-clad hero saving Hyrule.', definition: 'A high-fantasy action-adventure video game franchise created by Japanese game designers Shigeru Miyamoto and Takashi Tezuka. It centers on the various incarnations of Link, a courageous young man, and Princess Zelda, as they fight to save the magical land of Hyrule from Ganon.' },
    { name: 'Mario Kart', description: 'Kart racing with shells and bananas.', definition: 'A series of go-kart-style racing video games developed and published by Nintendo as a spin-off from its Super Mario series. Players compete in go-kart races while using various power-up items to hinder opponents or gain advantages.' },
    { name: 'Fortnite', description: 'Battle royale with flashy builds.', definition: 'An online video game developed by Epic Games. It is best known for its Battle Royale mode, where up to 100 players fight to be the last person standing, building fortifications to defend themselves.' },
    { name: 'Among Us', description: 'Find the impostor aboard the ship.', definition: 'A multiplayer social deduction game developed and published by Innersloth. Players take on the roles of Crewmates, working to complete tasks, while one or more Impostors try to sabotage the ship and kill the Crewmates without being discovered.' },
    { name: 'Animal Crossing', description: 'Chill island life with talking neighbors.', definition: 'A social simulation video game series developed and published by Nintendo. In the games, the player character is a human who lives in a village inhabited by various anthropomorphic animals, carrying out various activities such as fishing, bug catching, and fossil hunting.' },
    { name: 'Portal', description: 'Blue and orange door puzzle science.', definition: 'A puzzle-platform game developed by Valve. It features a series of puzzles that must be solved by teleporting the player\'s character and simple objects using "the Aperture Science Handheld Portal Device", a device that can create inter-spatial portals between two flat planes.' },
    { name: 'Stardew Valley', description: 'Farming and friendships in Pelican Town.', definition: 'A simulation role-playing video game developed by Eric "ConcernedApe" Barone. Players take the role of a character who takes over their deceased grandfather\'s dilapidated farm in a place known as Stardew Valley.' },
    { name: 'Skyrim', description: 'Dragonborn shouts echo across snowy peaks.', definition: 'An action role-playing video game developed by Bethesda Game Studios. It is the fifth main installment in The Elder Scrolls series. The game\'s main story revolves around the player character, the Dragonborn, on their quest to defeat Alduin the World-Eater, a dragon who is prophesied to destroy the world.' },
    { name: 'Super Mario Bros.', description: 'Platforming plumber saving the princess.', definition: 'A platform game developed and published by Nintendo. The successor to the 1983 arcade game Mario Bros. and the first in the Super Mario series of platformers, it stars Mario and his brother Luigi as they travel through the Mushroom Kingdom to rescue Princess Toadstool from Bowser.' },
    { name: 'Pac-Man', description: 'Dot-munching maze runner avoiding ghosts.', definition: 'A maze action game developed and released by Namco in 1980. The player controls Pac-Man, who must eat all the dots inside an enclosed maze while avoiding four colored ghosts. Eating large flashing dots called "Power Pellets" causes the ghosts to turn blue, allowing Pac-Man to eat them for bonus points.' },
    { name: 'Pokemon', description: 'Catch creatures and battle to be champ.', definition: 'A Japanese media franchise managed by The Pokémon Company. The franchise centers on fictional creatures called "Pokémon", which humans, known as Pokémon Trainers, catch and train to battle each other for sport.' },
    { name: 'Call of Duty', description: 'Blockbuster military firefights worldwide.', definition: 'A first-person shooter video game franchise published by Activision. Starting out in 2003, it first focused on games set in World War II. Over time, the series has seen games set in the midst of the Cold War, futuristic worlds, and outer space.' },
    { name: 'Halo', description: 'Space marines battling the Covenant.', definition: 'A military science fiction media franchise managed by 343 Industries. The series centers on an interstellar war between humanity and an alliance of aliens known as the Covenant. The Master Chief, a cybernetically enhanced human supersoldier, is the main protagonist.' },
    { name: 'League of Legends', description: 'Five-on-five lane pushing arena brawls.', definition: 'A multiplayer online battle arena (MOBA) video game developed and published by Riot Games. In the game, two teams of five players battle in player-versus-player combat, each team occupying and defending their own half of the map.' }
];

const CHAMELEON_TV_SHOWS_WORDS = [
    { name: 'Game of Thrones', description: 'Dragons, ice zombies, and iron chairs.', definition: 'A fantasy drama television series created by David Benioff and D. B. Weiss for HBO. It is an adaptation of A Song of Ice and Fire, a series of fantasy novels by George R. R. Martin, the first of which is A Game of Thrones.' },
    { name: 'Friends', description: 'Six New Yorkers drinking coffee at Central Perk.', definition: 'An American television sitcom created by David Crane and Marta Kauffman. The show revolves around six friends in their 20s and 30s who live in Manhattan, New York City.' },
    { name: 'The Office', description: 'Paper company employees staring at the camera.', definition: 'A mockumentary sitcom television series that depicts the everyday work lives of office employees in the Scranton, Pennsylvania, branch of the fictional Dunder Mifflin Paper Company.' },
    { name: 'Breaking Bad', description: 'Chemistry teacher cooking blue crystal.', definition: 'A crime drama television series created and produced by Vince Gilligan. It tells the story of Walter White, an underpaid, overqualified, and dispirited high school chemistry teacher who is struggling with a recent diagnosis of stage-three lung cancer.' },
    { name: 'Stranger Things', description: 'Kids on bikes fighting monsters from the Upside Down.', definition: 'A science fiction horror drama television series created by the Duffer Brothers. Set in the 1980s in the fictional town of Hawkins, Indiana, the series centers on the investigation into the disappearance of a young boy amid supernatural events.' },
    { name: 'The Simpsons', description: 'Yellow family causing chaos in Springfield.', definition: 'An American animated sitcom created by Matt Groening for the Fox Broadcasting Company. The series is a satirical depiction of American life, epitomized by the Simpson family, which consists of Homer, Marge, Bart, Lisa, and Maggie.' },
    { name: 'SpongeBob SquarePants', description: 'A sponge living in a pineapple under the sea.', definition: 'An American animated comedy television series created by marine science educator and animator Stephen Hillenburg for Nickelodeon. The series chronicles the adventures and endeavors of the title character and his aquatic friends in the fictional underwater city of Bikini Bottom.' },
    { name: 'Squid Game', description: 'Deadly playground games for a cash prize.', definition: 'A South Korean survival drama television series created by Hwang Dong-hyuk. The series revolves around a contest where 456 players, all of whom are in deep financial debt, risk their lives to play a series of deadly children\'s games.' },
    { name: 'The Crown', description: 'Royal family drama behind palace doors.', definition: 'A historical drama television series about the reign of Queen Elizabeth II. It covers the Queen\'s life from her wedding in 1947 to the early 21st century, exploring the political rivalries and romance of Queen Elizabeth II\'s reign.' },
    { name: 'Grey\'s Anatomy', description: 'Doctors falling in love and saving lives.', definition: 'A medical drama television series that focuses on the personal and professional lives of surgical interns, residents, and attendings at the fictional Seattle Grace Hospital.' },
    { name: 'The Mandalorian', description: 'Bounty hunter protecting a small green alien.', definition: 'A space Western television series created by Jon Favreau for the streaming service Disney+. It is the first live-action series in the Star Wars franchise, set five years after the events of Return of the Jedi.' },
    { name: 'Black Mirror', description: 'Dystopian tech tales that make you think.', definition: 'A British anthology television series created by Charlie Brooker. Individual episodes explore a diversity of genres, but most are set in near-future dystopias with science fiction technology—a type of speculative fiction.' },
    { name: 'Sherlock', description: 'Modern detective solving crimes in London.', definition: 'A British mystery crime drama television series based on Sir Arthur Conan Doyle\'s Sherlock Holmes detective stories. Created by Steven Moffat and Mark Gatiss, it stars Benedict Cumberbatch as Sherlock Holmes and Martin Freeman as Doctor John Watson.' },
    { name: 'The Walking Dead', description: 'Survivors fighting zombies and each other.', definition: 'A post-apocalyptic horror drama television series based on the comic book series of the same name by Robert Kirkman, Tony Moore, and Charlie Adlard. The series features a large ensemble cast as survivors of a zombie apocalypse.' },
    { name: 'Seinfeld', description: 'A show about nothing and everything.', definition: 'An American sitcom created by Larry David and Jerry Seinfeld. It stars Seinfeld as a fictionalized version of himself and focuses on his personal life with a handful of friends and acquaintances, including best friend George Costanza, friend and former girlfriend Elaine Benes, and neighbor across the hall Cosmo Kramer.' },
    { name: 'Doctor Who', description: 'Time traveler in a blue police box.', definition: 'A British science fiction television programme produced by the BBC since 1963. The programme depicts the adventures of a Time Lord called the Doctor, an extraterrestrial being who appears to be human. The Doctor explores the universe in a time-travelling space ship called the TARDIS.' }
];

const CHAMELEON_WEATHER_WORDS = [
    { name: 'Sunshine', description: 'Bright clear day perfect for shades.', definition: 'A weather condition where the sky is clear or mostly clear of clouds, allowing direct sunlight to reach the ground. It is often associated with high pressure systems and warm temperatures.' },
    { name: 'Thunderstorm', description: 'Dark clouds booming with lightning.', definition: 'A storm characterized by the presence of lightning and its acoustic effect on the Earth\'s atmosphere, known as thunder. Thunderstorms are usually accompanied by strong winds and heavy rain.' },
    { name: 'Blizzard', description: 'Whiteout winds burying everything in snow.', definition: 'A severe snowstorm characterized by strong sustained winds of at least 56 km/h (35 mph) and lasting for a prolonged period of time—typically three hours or more. The ground blizzard is a weather condition where snow is not falling but loose snow on the ground is lifted and blown by strong winds.' },
    { name: 'Rain', description: 'Water falling from gray clouds.', definition: 'Liquid water in the form of droplets that have condensed from atmospheric water vapor and then become heavy enough to fall under gravity. Rain is a major component of the water cycle and is responsible for depositing most of the fresh water on the Earth.' },
    { name: 'Heat Wave', description: 'Sweltering days where pavement sizzles.', definition: 'A period of excessively hot weather, which may be accompanied by high humidity, especially in oceanic climate countries. While definitions vary, a heat wave is usually measured relative to the usual weather in the area and relative to normal temperatures for the season.' },
    { name: 'Hailstorm', description: 'Ice pellets hammering rooftops.', definition: 'A form of solid precipitation. It is distinct from ice pellets, though the two are often confused. It consists of balls or irregular lumps of ice, each of which is called a hailstone. Hail is possible within most thunderstorms as it is produced by cumulonimbus clouds.' },
    { name: 'Fog', description: 'Low clouds hiding the horizon.', definition: 'A visible aerosol consisting of tiny water droplets or ice crystals suspended in the air at or near the Earth\'s surface. Fog can be considered a type of low-lying cloud usually resembling stratus, and is heavily influenced by nearby bodies of water, topography, and wind conditions.' },
    { name: 'Rainbow', description: 'Colorful arc after a passing shower.', definition: 'A meteorological phenomenon that is caused by reflection, refraction and dispersion of light in water droplets resulting in a spectrum of light appearing in the sky. It takes the form of a multicoloured circular arc.' },
    { name: 'Hurricane', description: 'Spiraling giant churning ocean water.', definition: 'A tropical cyclone is a rapidly rotating storm system characterized by a low-pressure center, a closed low-level atmospheric circulation, strong winds, and a spiral arrangement of thunderstorms that produce heavy rain.' },
    { name: 'Tornado', description: 'Whirling funnel touching down with fury.', definition: 'A violently rotating column of air that is in contact with both the surface of the Earth and a cumulonimbus cloud or, in rare cases, the base of a cumulus cloud. It is often referred to as a twister, whirlwind or cyclone.' },
    { name: 'Snow', description: 'Gentle flakes swirling in the air.', definition: 'Precipitation in the form of flakes of crystalline water ice that falls from clouds. Since snow is composed of small ice particles, it is a granular material. It has an open and therefore soft, white, and fluffy structure, unless subjected to external pressure.' },
    { name: 'Ice', description: 'Frozen water making surfaces slippery.', definition: 'Water frozen into a solid state. Depending on the presence of impurities such as particles of soil or bubbles of air, it can appear transparent or a more or less opaque bluish-white color.' },
    { name: 'Dust Storm', description: 'Sand-filled gusts blotting out the sun.', definition: 'A meteorological phenomenon common in arid and semi-arid regions. Dust storms arise when a gust front or other strong wind blows loose sand and dirt from a dry surface.' },
    { name: 'Monsoon', description: 'Seasonal burst of tropical downpours.', definition: 'A seasonal change in the direction of the prevailing, or strongest, winds of a region. Monsoons cause wet and dry seasons throughout much of the tropics. Monsoons are most often associated with the Indian Ocean.' },
    { name: 'Lightning', description: 'Single bolt cracking across the sky.', definition: 'A sudden electrostatic discharge that occurs during a thunderstorm. This discharge can occur between two clouds, between a cloud and the air, or between a cloud and the ground.' },
    { name: 'Clouds', description: 'Gray blanket blocking the sunshine.', definition: 'A visible mass of condensed water vapor floating in the atmosphere, typically high above the ground. Clouds are a key part of the Earth\'s water cycle.' }
];

const CHAMELEON_KITCHEN_WORDS = [
    { name: 'Cutting Board', description: 'Wooden slab for slicing veggies.', definition: 'A durable board on which to place material for cutting. The kitchen cutting board is commonly used in preparing food; other types exist for cutting raw materials such as leather or plastic. Kitchen cutting boards are often made of wood or plastic.' },
    { name: 'Chef Knife', description: 'Sharp multitasker for chopping anything.', definition: 'A cutting tool used in food preparation. The chef\'s knife was originally designed primarily to slice and disjoint large cuts of beef. Today it is the primary general-utility knife for most western cooks.' },
    { name: 'Mixing Bowl', description: 'Big bowl ready for batter.', definition: 'A deep bowl that is particularly well suited for mixing ingredients together in. These come in many materials, such as stainless steel, ceramic, glass, and plastic.' },
    { name: 'Whisk', description: 'Wire loops whipping air into eggs.', definition: 'A cooking utensil which can be used to blend ingredients smooth or to incorporate air into a mixture, in a process known as whisking or whipping. Most whisks consist of a long, narrow handle with a series of wire loops joined at the end.' },
    { name: 'Blender', description: 'Countertop tornado for smoothies.', definition: 'A kitchen and laboratory appliance used to mix, crush, purée or emulsify food and other substances. A stationary blender consists of a blender container with a rotating metal blade at the bottom, powered by an electric motor that is located in the base.' },
    { name: 'Measuring Cup', description: 'Shows ounces so recipes work.', definition: 'A kitchen utensil used primarily to measure the volume of liquid or bulk solid cooking ingredients such as flour and sugar, especially for volumes from about 50 mL (2 fl oz) upwards.' },
    { name: 'Spatula', description: 'Flexible flipper scraping every drop.', definition: 'A broad, flat, flexible blade used to mix, spread and lift material including foods, drugs, plaster and paints. In the kitchen, it is used to lift and flip food items during cooking, such as pancakes and fillets.' },
    { name: 'Oven Mitt', description: 'Heat-proof glove saving fingertips.', definition: 'An insulated glove or mitten worn in the kitchen to easily protect the wearer\'s hand from hot objects such as ovens, stoves, cookware, etc. They are similar to pot-holders.' },
    { name: 'Cast-Iron Skillet', description: 'Heavy pan that keeps sizzling.', definition: 'A frying pan made of cast iron. Cast-iron skillets are valued for their heat retention properties and can be used for frying, searing, baking, and braising. They require seasoning to maintain a non-stick surface.' },
    { name: 'Rolling Pin', description: 'Cylinder flattening dough evenly.', definition: 'A cylindrical food preparation utensil used to shape and flatten dough. Two styles of rolling pin are found: rollers and rods. Roller types consists of a thick cylinder with small handles at each end; rod type rolling pins are usually thin tapered batons.' },
    { name: 'Colander', description: 'Hole-filled bowl draining pasta.', definition: 'A bowl-shaped kitchen utensil with holes in it used for draining food such as pasta or rice. A colander is also used to rinse vegetables. The perforated nature of the colander allows liquid to drain through while retaining the solids inside.' },
    { name: 'Toaster', description: 'Pop-up heater for crispy bread.', definition: 'A small electric kitchen appliance designed to expose various types of sliced bread to radiant heat, browning the bread so it becomes toast.' },
    { name: 'Coffee Maker', description: 'Morning savior brewing hot bean juice.', definition: 'A cooking appliance used to brew coffee. While there are many different types of coffee makers using several different brewing principles, in the most common devices, coffee grounds are placed into a paper or metal filter inside a funnel, which is set over a glass or ceramic coffee pot, a cooking pot in the kettle family.' },
    { name: 'Grater', description: 'Metal wall shredding cheese clouds.', definition: 'A kitchen utensil used to grate foods into fine pieces. The modern grater was invented by François Boullier in the 1540s, originally to grate cheese.' },
    { name: 'Microwave', description: 'Box that heats leftovers in seconds.', definition: 'An electric oven that heats and cooks food by exposing it to electromagnetic radiation in the microwave frequency range. This induces polar molecules in the food to rotate and produce thermal energy in a process known as dielectric heating.' },
    { name: 'Dishwasher', description: 'Machine army blasting away grime.', definition: 'A machine for cleaning dishware and cutlery automatically. Unlike manual dishwashing, which relies largely on physical scrubbing to remove soiling, the mechanical dishwasher cleans by spraying hot water, typically between 45 and 75 °C (110 and 170 °F), at the dishes.' }
];

const CHAMELEON_BODY_PARTS_WORDS = [
    { name: 'Heart', description: 'Pumps blood with steady rhythm.', definition: 'A muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system. The pumped blood carries oxygen and nutrients to the body, while carrying metabolic waste such as carbon dioxide to the lungs.' },
    { name: 'Brain', description: 'Control center full of ideas.', definition: 'An organ that serves as the center of the nervous system in all vertebrate and most invertebrate animals. It is located in the head, usually close to the sensory organs for senses such as vision.' },
    { name: 'Nose', description: 'Smell detector right in the middle.', definition: 'A protuberance in vertebrates that houses the nostrils, or nares, which receive and expel air for respiration alongside the mouth. Behind the nose are the olfactory mucosa and the sinuses.' },
    { name: 'Stomach', description: 'Digestive pouch growling for snacks.', definition: 'A muscular, hollow organ in the gastrointestinal tract of humans and many other animals, including several invertebrates. The stomach has a dilated structure and functions as a vital digestive organ.' },
    { name: 'Hands', description: 'Five-fingered tools for everything.', definition: 'A prehensile, multi-fingered appendage located at the end of the forearm or forelimb of primates such as humans, chimpanzees, monkeys, and lemurs. A few other vertebrates such as the koala are often described as having "hands" instead of paws on their front limbs.' },
    { name: 'Feet', description: 'Balance boards carrying every step.', definition: 'The anatomical structure for locomotion and bearing weight found at the lower end of the leg. It is found in many vertebrates. It is the terminal portion of a limb which bears weight and allows locomotion.' },
    { name: 'Eyes', description: 'See-all lenses blinking nonstop.', definition: 'Organs of the visual system. They provide animals with vision, the ability to receive and process visual detail, as well as enabling several photoresponse functions that are independent of vision.' },
    { name: 'Ears', description: 'Sound catchers shaped like shells.', definition: 'The organ of hearing and, in mammals, balance. In mammals, the ear is usually described as having three parts—the outer ear, the middle ear and the inner ear.' },
    { name: 'Knees', description: 'Leg hinges that crease when crouching.', definition: 'A joint in the middle of the leg that connects the thigh with the lower leg. It is the largest joint in the human body and is a modified hinge joint, which permits flexion and extension as well as slight internal and external rotation.' },
    { name: 'Elbows', description: 'Arm joints perfect for sharp turns.', definition: 'The visible joint between the upper and lower parts of the arm. It includes prominent landmarks such as the olecranon (the bony tip of the elbow), the elbow pit, and the lateral and medial epicondyles.' },
    { name: 'Shoulders', description: 'Upper anchors where backpacks rest.', definition: 'The part of the body where the arm attaches to the torso. It is made up of three bones: the clavicle (collarbone), the scapula (shoulder blade), and the humerus (upper arm bone).' },
    { name: 'Mouth', description: 'Gateway for food and words.', definition: 'In human anatomy, the mouth is the first portion of the alimentary canal that receives food and produces saliva. The oral mucosa is the mucous membrane epithelium lining the inside of the mouth.' },
    { name: 'Tongue', description: 'Taste tester covered in buds.', definition: 'A muscular organ in the mouth of most vertebrates that manipulates food for mastication and is used in the act of swallowing. It has importance in the digestive system and is the primary organ of taste in the gustatory system.' },
    { name: 'Teeth', description: 'Bite squad crunching every snack.', definition: 'Hard, calcified structures found in the jaws (or mouths) of many vertebrates and used to break down food. Some animals, particularly carnivores, also use teeth for hunting or for defensive purposes.' },
    { name: 'Skin', description: 'Protective layer sensing touch.', definition: 'The layer of usually soft, flexible outer tissue covering the body of a vertebrate animal, with three main functions: protection, regulation, and sensation.' },
    { name: 'Hair', description: 'Strands growing from the scalp.', definition: 'A protein filament that grows from follicles found in the dermis. Hair is one of the defining characteristics of mammals. The human body, apart from areas of glabrous skin, is covered in follicles which produce thick terminal and fine vellus hair.' }
];

const CHAMELEON_SUPERHERO_WORDS = [
    { name: 'Superman', description: 'Man of Steel flying with a red cape.', definition: 'A superhero who appears in American comic books published by DC Comics. He was created by writer Jerry Siegel and artist Joe Shuster. Superman was born on the planet Krypton and was sent to Earth as a baby by his parents moments before Krypton was destroyed.' },
    { name: 'Batman', description: 'Dark Knight fighting crime in Gotham.', definition: 'A superhero appearing in American comic books published by DC Comics. The character was created by artist Bob Kane and writer Bill Finger. Batman is the secret identity of Bruce Wayne, a wealthy American playboy, philanthropist, and industrialist who resides in Gotham City.' },
    { name: 'Spider-Man', description: 'Friendly neighborhood hero spinning webs.', definition: 'A superhero appearing in American comic books published by Marvel Comics. Created by writer-editor Stan Lee and artist Steve Ditko, he first appeared in the anthology comic book Amazing Fantasy #15 (August 1962) in the Silver Age of Comic Books.' },
    { name: 'Iron Man', description: 'Billionaire genius in a high-tech suit.', definition: 'A superhero appearing in American comic books published by Marvel Comics. The character was co-created by writer and editor Stan Lee, developed by scripter Larry Lieber, and designed by artists Don Heck and Jack Kirby. The character is a wealthy American business magnate, playboy, and ingenious scientist.' },
    { name: 'Captain America', description: 'Super soldier with an unbreakable shield.', definition: 'A superhero appearing in American comic books published by Marvel Comics. Created by cartoonists Joe Simon and Jack Kirby, the character first appeared in Captain America Comics #1 (cover dated March 1941) from Timely Comics, a predecessor of Marvel Comics.' },
    { name: 'Hulk', description: 'Green giant smashing everything in sight.', definition: 'A superhero appearing in American comic books published by Marvel Comics. Created by writer Stan Lee and artist Jack Kirby, the character first appeared in the debut issue of The Incredible Hulk (May 1962). In his comic book appearances, the character is both the Hulk, a green-skinned, hulking and muscular humanoid possessing a vast degree of physical strength, and his alter ego Dr. Robert Bruce Banner.' },
    { name: 'Thor', description: 'God of Thunder wielding a mighty hammer.', definition: 'A superhero appearing in American comic books published by Marvel Comics. The character, which is based on the Norse deity of the same name, is the Asgardian god of thunder who possesses the enchanted hammer, Mjolnir, which grants him the ability to fly and manipulate weather.' },
    { name: 'Wonder Woman', description: 'Amazon warrior with a lasso of truth.', definition: 'A superheroine appearing in American comic books published by DC Comics. The character is a founding member of the Justice League. The character is a warrior princess of the Amazons (based on the Amazons of Greek mythology) and is known in her homeland as Princess Diana of Themyscira.' },
    { name: 'Deadpool', description: 'Wisecracking mercenary who breaks the fourth wall.', definition: 'A superhero appearing in American comic books published by Marvel Comics. Created by artist/writer Rob Liefeld and writer Fabian Nicieza, the character first appeared in The New Mutants #98 (cover-dated Feb. 1991).' },
    { name: 'Wolverine', description: 'Mutant with healing powers and metal claws.', definition: 'A superhero appearing in American comic books published by Marvel Comics, mostly in association with the X-Men. He is a mutant who possesses animal-keen senses, enhanced physical capabilities, a powerful regenerative ability known as a healing factor, and three retractable claws in each hand.' },
    { name: 'Black Panther', description: 'King of Wakanda protecting his nation.', definition: 'A superhero appearing in American comic books published by Marvel Comics. The character was created by writer-editor Stan Lee and artist-co-plotter Jack Kirby. The character\'s real name is T\'Challa, and he is depicted as the king and protector of the fictional African nation of Wakanda.' },
    { name: 'The Flash', description: 'Fastest man alive running through time.', definition: 'The name of several superheroes appearing in American comic books published by DC Comics. Created by writer Gardner Fox and artist Harry Lampert, the original Flash first appeared in Flash Comics #1 (cover date January 1940). All incarnations of the Flash possess "super speed", which includes the ability to run, move, and think extremely fast.' },
    { name: 'Aquaman', description: 'King of the ocean talking to fish.', definition: 'A superhero appearing in American comic books published by DC Comics. Created by Paul Norris and Mort Weisinger, the character debuted in More Fun Comics #73 (November 1941). Initially a backup feature in DC\'s anthology titles, Aquaman later starred in several volumes of a solo comic book series.' },
    { name: 'Catwoman', description: 'Agile burglar walking the line between good and bad.', definition: 'A character appearing in American comic books published by DC Comics, commonly in association with Batman. Created by Bill Finger and Bob Kane, she made her debut as "the Cat" in Batman #1 (spring 1940).' },
    { name: 'Robin', description: 'The Boy Wonder fighting alongside Batman.', definition: 'The alias of several superheroes appearing in American comic books published by DC Comics. The character is originally created by Bob Kane, Bill Finger, and Jerry Robinson, to serve as a junior counterpart to the superhero Batman.' },
    { name: 'Ant-Man', description: 'Hero who shrinks to the size of an insect.', definition: 'The name of several superheroes appearing in books published by Marvel Comics. Created by Stan Lee, Larry Lieber and Jack Kirby, Ant-Man\'s first appearance was in Tales to Astonish #27 (January 1962).' }
];

const CHAMELEON_PHILOSOPHY_WORDS = [
    { name: 'Stoicism', description: 'Calmly accept what you cannot control.', definition: 'A school of Hellenistic philosophy founded by Zeno of Citium in Athens in the early 3rd century BC. It teaches that virtue, the highest good, is based on knowledge; the wise live in harmony with the divine Reason that governs nature, and are indifferent to the vicissitudes of fortune and to pleasure and pain.' },
    { name: 'Utilitarianism', description: 'Greatest good for the greatest number.', definition: 'A family of normative ethical theories that prescribe actions that maximize happiness and well-being for all affected individuals. Although different varieties of utilitarianism admit different characterizations, the basic idea behind all of them is to in some sense maximize utility, which is often defined in terms of well-being or related concepts.' },
    { name: 'Existentialism', description: 'Create meaning in a silent universe.', definition: 'A form of philosophical inquiry that explores the problem of human existence and centers on the lived experience of the thinking, feeling, acting individual. In the view of the existentialist, the individual\'s starting point has been called "the existential angst" (or dread, anxiety, or anguish), or a sense of disorientation, confusion, or dread in the face of an apparently meaningless or absurd world.' },
    { name: 'Dualism', description: 'Mind and body as separate realms.', definition: 'A view in the philosophy of mind that mental phenomena are, in some respects, non-physical, or that the mind and body are distinct and separable. In the philosophy of mind, dualism is the theory that the mental and the physical – or mind and body or mind and brain – are, in some sense, radically different kinds of thing.' },
    { name: 'Empiricism', description: 'Knowledge grows from sensory experience.', definition: 'A theory that states that knowledge comes only or primarily from sensory experience. It is one of several views of epistemology, along with rationalism and skepticism. Empiricism emphasizes the role of empirical evidence in the formation of ideas, rather than innate ideas or traditions.' },
    { name: 'Determinism', description: 'Every event locked by prior causes.', definition: 'The philosophical view that all events are determined completely by previously existing causes. Deterministic theories throughout the history of philosophy have sprung from diverse and sometimes overlapping motives and considerations.' },
    { name: 'Nihilism', description: 'Belief that nothing has inherent meaning.', definition: 'A philosophy, or family of views within philosophy, that rejects generally accepted or fundamental aspects of human existence, such as objective truth, knowledge, morality, values or meaning. Different nihilist positions hold variously that human values are baseless, that life is meaningless, that knowledge is impossible, or that some set of entities do not exist.' },
    { name: 'Humanism', description: 'Human dignity and reason at the center.', definition: 'A philosophical stance that emphasizes the value and agency of human beings, individually and collectively. The meaning of the term humanism has fluctuated according to the successive intellectual movements which have identified with it.' },
    { name: 'Idealism', description: 'Reality built from ideas more than matter.', definition: 'The group of metaphysical philosophies that assert that reality, or reality as humans can know it, is fundamentally mental, mentally constructed, or otherwise immaterial. Epistemologically, idealism manifests as a skepticism about the possibility of knowing any mind-independent thing.' },
    { name: 'Absurdism', description: 'Life is chaotic, laugh anyway.', definition: 'The philosophical theory that existence in general is absurd. This implies that the world lacks meaning or a higher purpose and is not fully intelligible by reason. The term "absurd" also has a more specific sense in the context of absurdism: it refers to a conflict or a discrepancy between two things but there are several debates about the exact nature of these two things.' },
    { name: 'Pragmatism', description: 'Truth judged by practical results.', definition: 'A philosophical tradition that considers words and thought as tools and instruments for prediction, problem solving, and action, and rejects the idea that the function of thought is to describe, represent, or mirror reality. Pragmatists contend that most philosophical topics—such as the nature of knowledge, language, concepts, meaning, belief, and science—are all best viewed in terms of their practical uses and successes.' },
    { name: 'Hedonism', description: 'Pleasure sits at the top priority.', definition: 'A school of thought that argues that the pursuit of pleasure and intrinsic goods are the primary or most important goals of human life. A hedonist strives to maximize net pleasure (pleasure minus pain).' },
    { name: 'Social Contract', description: 'Society runs on shared agreements.', definition: 'In moral and political philosophy, the social contract is a theory or model that originated during the Age of Enlightenment and usually concerns the legitimacy of the authority of the state over the individual. Social contract arguments typically posit that individuals have consented, either explicitly or tacitly, to surrender some of their freedoms and submit to the authority (of the ruler, or to the decision of a majority) in exchange for protection of their remaining rights or maintenance of the social order.' },
    { name: 'Free Will', description: 'Ability to choose despite constraints.', definition: 'The capacity of agents to choose between different possible courses of action unimpeded. Free will is closely linked to the concepts of moral responsibility, praise, guilt, sin, and other judgements which apply only to actions that are freely chosen.' },
    { name: 'Moral Relativism', description: 'Right and wrong depend on context.', definition: 'The view that moral judgments are true or false only relative to some particular standpoint (for instance, that of a culture or a historical period) and that no standpoint is uniquely privileged over all others. It has often been associated with other claims about morality: notably, the thesis that different cultures often exhibit radically different moral values; the denial that there are universal moral values shared by every human society; and the insistence that we should refrain from passing moral judgments on beliefs and practices characteristic of cultures other than our own.' },
    { name: 'Virtue Ethics', description: 'Character traits define good living.', definition: 'A class of normative ethical theories which treat the concept of moral virtue as central to ethics. Virtue ethics are usually contrasted with two other major approaches in normative ethics, consequentialism and deontology, which make the goodness of outcomes of an action (consequentialism) and the concept of moral duty (deontology) central.' }
];

const CHAMELEON_PROFESSIONS_WORDS = [
    { name: 'Doctor', description: 'Stethoscope around the neck, saving lives.', definition: 'A medical professional who practices medicine, which is concerned with promoting, maintaining or restoring health through the study, diagnosis, prognosis and treatment of disease, injury, and other physical and mental impairments.' },
    { name: 'Teacher', description: 'Grading papers and leading the class.', definition: 'A person who helps students to acquire knowledge, competence or virtue. Informally the role of teacher may be taken on by anyone (e.g. when showing a colleague how to perform a specific task).' },
    { name: 'Police Officer', description: 'Badge, uniform, and keeping the peace.', definition: 'A warranted law employee of a police force. In most countries, "police officer" is a generic term not specifying a particular rank. In some, the use of the rank "officer" is legally reserved for military personnel.' },
    { name: 'Firefighter', description: 'Rushing into burning buildings with a hose.', definition: 'A rescuer extensively trained in firefighting, primarily to extinguish hazardous fires that threaten life, property and the environment as well as to rescue people and animals from dangerous situations.' },
    { name: 'Chef', description: 'White hat, sharp knives, and tasty food.', definition: 'A trained professional cook and tradesman who is proficient in all aspects of food preparation, often focusing on a particular cuisine. The word "chef" is derived from the term chef de cuisine (French for the director or head of a kitchen).' },
    { name: 'Pilot', description: 'Flying high in the cockpit.', definition: 'A person who controls the flight of an aircraft by operating its directional flight controls. Some other aircrew members, such as navigators or flight engineers, are also considered aviators, because they are involved in operating the aircraft\'s navigation and engine systems.' },
    { name: 'Artist', description: 'Paint, canvas, and creative vision.', definition: 'A person engaged in an activity related to creating art, practicing the arts, or demonstrating an art. The common usage in both everyday speech and academic discourse refers to a practitioner in the visual arts only.' },
    { name: 'Scientist', description: 'Lab coat, test tubes, and experiments.', definition: 'A person who conducts scientific research to advance knowledge in an area of interest. Scientists are motivated by a curiosity about the world and a desire to understand how it works.' },
    { name: 'Astronaut', description: 'Floating in zero gravity in a spacesuit.', definition: 'A person trained, equipped, and deployed by a human spaceflight program to serve as a commander or crew member aboard a spacecraft. Although generally reserved for professional space travelers, the terms are sometimes applied to anyone who travels into space.' },
    { name: 'Farmer', description: 'Driving a tractor and tending to crops.', definition: 'A person engaged in agriculture, raising living organisms for food or raw materials. The term usually applies to people who do some combination of raising field crops, orchards, vineyards, poultry, or other livestock.' },
    { name: 'Judge', description: 'Gavel in hand, ruling in the courtroom.', definition: 'A person who presides over court proceedings, either alone or as a part of a panel of judges. The powers, functions, method of appointment, discipline, and training of judges vary widely across different jurisdictions.' },
    { name: 'Athlete', description: 'Training hard to win the big game.', definition: 'A person who competes in one or more sports that involve physical strength, speed or endurance. The use of the term in several sports, such as golf or auto racing, becomes a controversial issue.' },
    { name: 'Musician', description: 'Playing instruments or singing on stage.', definition: 'A person who plays a musical instrument or is musically talented. Anyone who composes, conducts, or performs music may be referred to as a musician.' },
    { name: 'Actor', description: 'Performing a role on stage or screen.', definition: 'A person who portrays a character in a performance (also known as an actress in the case of a female). The actor performs "in the flesh" in the traditional medium of the theatre or in modern media such as film, radio, and television.' },
    { name: 'Writer', description: 'Typing stories and creating worlds.', definition: 'A person who uses written words in different styles and techniques to communicate ideas. Writers produce different forms of literary art and creative writing such as novels, short stories, books, poetry, plays, screenplays, teleplays, songs, and essays.' },
    { name: 'Carpenter', description: 'Sawing wood and building structures.', definition: 'A skilled trade and a craft in which the primary work performed is the cutting, shaping and installation of building materials during the construction of buildings, ships, timber bridges, concrete formwork, etc.' }
];

const CHAMELEON_CELEBRITIES_WORDS = [
    { name: 'Elon Musk', description: 'Tech tycoon launching rockets and tweeting.', definition: 'A business magnate and investor. He is the founder, CEO, and Chief Engineer at SpaceX; angel investor, CEO, and Product Architect of Tesla, Inc.; founder of The Boring Company; and co-founder of Neuralink and OpenAI.' },
    { name: 'Bill Gates', description: 'Microsoft founder who wants to save the world.', definition: 'An American business magnate, software developer, investor, author, and philanthropist. He is a co-founder of Microsoft, along with his late childhood friend Paul Allen.' },
    { name: 'Steve Jobs', description: 'Apple visionary in a black turtleneck.', definition: 'An American business magnate, industrial designer, investor, and media proprietor. He was the chairman, chief executive officer (CEO), and co-founder of Apple Inc.' },
    { name: 'Mark Zuckerberg', description: 'Social media mogul connecting the world.', definition: 'An American media magnate, internet entrepreneur, and philanthropist. He is known for co-founding the social media website Facebook and its parent company Meta Platforms, of which he is the chairman, chief executive officer, and controlling shareholder.' },
    { name: 'Jeff Bezos', description: 'Amazon boss delivering everything A to Z.', definition: 'An American entrepreneur, media proprietor, investor, computer engineer, and commercial astronaut. He is the founder, executive chairman and former president and CEO of Amazon.' },
    { name: 'Michael Jackson', description: 'King of Pop moonwalking on stage.', definition: 'An American singer, songwriter, and dancer. Dubbed the "King of Pop", he is regarded as one of the most significant cultural figures of the 20th century.' },
    { name: 'Taylor Swift', description: 'Pop icon writing songs about exes.', definition: 'An American singer-songwriter. Her discography spans multiple genres, and her narrative songwriting—often inspired by her personal life—has received critical praise and widespread media coverage.' },
    { name: 'Cristiano Ronaldo', description: 'Soccer superstar scoring goals worldwide.', definition: 'A Portuguese professional footballer who plays as a forward for and captains the Portugal national team. He is widely regarded as one of the greatest players of all time.' },
    { name: 'Lionel Messi', description: 'Argentine wizard with a magical left foot.', definition: 'An Argentine professional footballer who plays as a forward for Ligue 1 club Paris Saint-Germain and captains the Argentina national team. He is widely regarded as one of the greatest players of all time.' },
    { name: 'Kim Kardashian', description: 'Reality queen breaking the internet.', definition: 'An American media personality, socialite, and businesswoman. She first gained media attention as a friend and stylist of Paris Hilton, but received wider notice after the release of a 2007 sex tape.' },
    { name: 'Beyoncé', description: 'Queen Bey ruling the music industry.', definition: 'An American singer, songwriter, and businesswoman. Known as "Queen Bey", she has been widely recognized for her boundary-pushing artistry and vocal prowess.' },
    { name: 'Leonardo DiCaprio', description: 'Movie star fighting for the climate.', definition: 'An American actor and film producer. Known for his work in biopics and period films, he is the recipient of numerous accolades, including an Academy Award, a British Academy Film Award, and three Golden Globe Awards.' },
    { name: 'Dwayne Johnson', description: 'The Rock cooking up action movies.', definition: 'An American actor, businessman, and former professional wrestler. Widely regarded as one of the greatest professional wrestlers of all time, he was integral to the development and success of the World Wrestling Federation (WWF, now WWE).' },
    { name: 'Justin Bieber', description: 'Pop star discovered on YouTube.', definition: 'A Canadian singer. He was discovered by American record executive Scooter Braun and signed with RBMG Records in 2008, gaining recognition with the release of his debut seven-track EP My World (2009).' },
    { name: 'Marilyn Monroe', description: 'Hollywood icon with the flying white dress.', definition: 'An American actress, model, and singer. Famous for playing comedic "blonde bombshell" characters, she became one of the most popular sex symbols of the 1950s and early 1960s and was emblematic of the era\'s sexual revolution.' },
    { name: 'Elvis Presley', description: 'King of Rock and Roll shaking his hips.', definition: 'An American singer and actor. Dubbed the "King of Rock and Roll", he is regarded as one of the most significant cultural icons of the 20th century.' }
];

const CHAMELEON_LEADERS_WORDS = [
    { name: 'Barack Obama', description: 'First African American US President.', definition: 'An American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, he was the first African-American president of the United States.' },
    { name: 'Donald Trump', description: 'Businessman turned President with a red hat.', definition: 'An American politician, media personality, and businessman who served as the 45th president of the United States from 2017 to 2021.' },
    { name: 'Vladimir Putin', description: 'Russian leader extending power for decades.', definition: 'A Russian politician and former intelligence officer who is the president of Russia. He has held continuous positions as president or prime minister since 1999.' },
    { name: 'Kim Jong-un', description: 'North Korean supreme leader with dynastic control.', definition: 'A North Korean politician who has been Supreme Leader of North Korea since 2011 and the leader of the Workers\' Party of Korea (WPK) since 2012.' },
    { name: 'Queen Elizabeth II', description: 'Longest-reigning British monarch.', definition: 'Queen of the United Kingdom and other Commonwealth realms from 6 February 1952 until her death in 2022. She was queen regnant of 32 sovereign states during her lifetime and 15 at the time of her death.' },
    { name: 'Nelson Mandela', description: 'Anti-apartheid revolutionary and President.', definition: 'A South African anti-apartheid activist who served as the first president of South Africa from 1994 to 1999. He was the country\'s first black head of state and the first elected in a fully representative democratic election.' },
    { name: 'Abraham Lincoln', description: 'US President who abolished slavery.', definition: 'An American lawyer and statesman who served as the 16th president of the United States from 1861 until his assassination in 1865. Lincoln led the nation through the American Civil War, the country\'s greatest moral, constitutional, and political crisis.' },
    { name: 'Winston Churchill', description: 'British Prime Minister during WWII.', definition: 'A British statesman, soldier, and writer who served as Prime Minister of the United Kingdom from 1940 to 1945, during the Second World War, and again from 1951 to 1955.' },
    { name: 'Joseph Stalin', description: 'Soviet leader who ruled with iron control.', definition: 'A Georgian revolutionary and Soviet political leader who led the Soviet Union from 1924 until his death in 1953. He held power as General Secretary of the Communist Party of the Soviet Union (1922–1952) and Chairman of the Council of Ministers of the Soviet Union (1941–1953).' },
    { name: 'Mao Zedong', description: 'Chairman who led China’s cultural revolution.', definition: 'A Chinese communist revolutionary who was the founder of the People\'s Republic of China (PRC), which he led as the chairman of the Chinese Communist Party from the establishment of the PRC in 1949 until his death in 1976.' },
    { name: 'Julius Caesar', description: 'Roman dictator betrayed by the Senate.', definition: 'A Roman general and statesman. A member of the First Triumvirate, Caesar led the Roman armies in the Gallic Wars before defeating his political rival Pompey in a civil war, and subsequently became dictator of Rome from 49 BC until his assassination in 44 BC.' },
    { name: 'Mahatma Gandhi', description: 'Leader of nonviolent resistance in India.', definition: 'An Indian lawyer, anti-colonial nationalist and political ethicist who employed nonviolent resistance to lead the successful campaign for India\'s independence from British rule, and to later inspire movements for civil rights and freedom across the world.' },
    { name: 'John F. Kennedy', description: 'US President during the Space Race.', definition: 'An American politician who served as the 35th president of the United States from 1961 until his assassination in 1963. He was the youngest person to assume the presidency by election.' },
    { name: 'Fidel Castro', description: 'Cuban revolutionary who led for half a century.', definition: 'A Cuban revolutionary and politician who was the leader of Cuba from 1959 to 2008, serving as the prime minister of Cuba from 1959 to 1976 and president from 1976 to 2008.' },
    { name: 'Napoleon Bonaparte', description: 'French Emperor who conquered Europe.', definition: 'A French military and political leader who rose to prominence during the French Revolution and led several successful campaigns during the Revolutionary Wars. He was the de facto leader of the French Republic as First Consul from 1799 to 1804.' },
    { name: 'Benito Mussolini', description: 'Fascist ruler of Italy during WWII.', definition: 'An Italian dictator and journalist who founded and led the National Fascist Party. He was Prime Minister of Italy from the March on Rome in 1922 until his deposition in 1943.' }
];

const CHAMELEON_THEMES = {
    animals: {
        key: 'animals',
        label: 'Animals',
        dataset: CHAMELEON_ANIMALS_WORDS,
        hint: 'Creature comforts for clue givers.'
    },
    videogames: {
        key: 'videogames',
        label: 'Video Games',
        dataset: CHAMELEON_VIDEO_GAME_WORDS,
        hint: 'Pixel-perfect references from gaming culture.'
    },
    tvshows: {
        key: 'tvshows',
        label: 'TV Shows',
        dataset: CHAMELEON_TV_SHOWS_WORDS,
        hint: 'Bingeable hits from Friends to Squid Game.'
    },
    weather: {
        key: 'weather',
        label: 'Types of Weather',
        dataset: CHAMELEON_WEATHER_WORDS,
        hint: 'Forecast words everyone can picture.'
    },
    kitchen: {
        key: 'kitchen',
        label: 'In the Kitchen',
        dataset: CHAMELEON_KITCHEN_WORDS,
        hint: 'Appliances and tools from any home cook.'
    },
    bodyparts: {
        key: 'bodyparts',
        label: 'Body Parts',
        dataset: CHAMELEON_BODY_PARTS_WORDS,
        hint: 'Everyday anatomy from head to toe.'
    },
    superheroes: {
        key: 'superheroes',
        label: 'Superheroes',
        dataset: CHAMELEON_SUPERHERO_WORDS,
        hint: 'Cape-wearing icons from comics and film.'
    },
    philosophy: {
        key: 'philosophy',
        label: 'Philosophy',
        dataset: CHAMELEON_PHILOSOPHY_WORDS,
        hint: 'Deep thoughts from Plato to Nietzsche.'
    },
    professions: {
        key: 'professions',
        label: 'Professions',
        dataset: CHAMELEON_PROFESSIONS_WORDS,
        hint: 'Jobs everyone knows, from Doctor to Artist.'
    },
    celebrities: {
        key: 'celebrities',
        label: 'Celebrities',
        dataset: CHAMELEON_CELEBRITIES_WORDS,
        hint: 'Household names from music, sports, and film.'
    },
    leaders: {
        key: 'leaders',
        label: 'World Leaders',
        dataset: CHAMELEON_LEADERS_WORDS,
        hint: 'Good, bad, and ugly rulers of history.'
    }
};

const GAME_CONFIGS = {
    spyfall: {
        key: 'spyfall',
        name: 'Spyfall',
        overlayPrompt: 'Tap anywhere to reveal your role.',
        viewButtonLabel: 'View all locations',
        referenceTitle: 'Possible Locations',
        referenceHint: 'Tap a location to cross it out.',
        listLabel: 'Location',
        revealLine: DEFAULT_REVEAL_LINE,
        dataset: SPYFALL_LOCATIONS,
        defaultTheme: 'standard',
        optionsHint: 'Pick which set of locations to use.',
        themeLabel: 'Theme',
        themes: SPYFALL_THEMES,
        createHint: 'Generate a code to share with the table.',
        assignRole: assignSpyfallRole
    },
    chameleon: {
        key: 'chameleon',
        name: 'Chameleon',
        overlayPrompt: 'Tap anywhere to reveal your word.',
        viewButtonLabel: 'View word list',
        referenceTitle: 'Word Grid',
        referenceHint: 'Tap a word to mark it off.',
        listLabel: 'Word',
        revealLine: DEFAULT_REVEAL_LINE,
        dataset: CHAMELEON_ANIMALS_WORDS,
        defaultTheme: 'animals',
        optionsHint: 'Choose the category of words in play.',
        themeLabel: 'Theme',
        themes: CHAMELEON_THEMES,
        createHint: 'Generate a code to share with the table.',
        assignRole: assignChameleonRole
    }
};

const selectedThemes = Object.keys(GAME_CONFIGS).reduce((acc, key) => {
    const config = GAME_CONFIGS[key];
    const defaultTheme = config.defaultTheme || null;
    acc[key] = defaultTheme;
    return acc;
}, {});

function getActiveGameConfig() {
    return GAME_CONFIGS[currentGameKey] || GAME_CONFIGS.spyfall;
}

function setActiveGame(key, options = {}) {
    const validKey = GAME_CONFIGS[key] ? key : 'spyfall';
    const changed = currentGameKey !== validKey;
    currentGameKey = validKey;
    ensureThemeSelection(validKey);
    if (changed) {
        dismissedEntries.clear();
    }
    updateGameUI(options);
    if (!options.fromPayload && changed) {
        resetGeneratedGame();
    }
}

function updateGameUI(options = {}) {
    const config = getActiveGameConfig();
    if (gameTitle) {
        gameTitle.textContent = 'RoleReveal';
    }
    if (viewReferenceBtn) {
        viewReferenceBtn.textContent = config.viewButtonLabel;
    }
    if (sheetTitle) {
        sheetTitle.textContent = config.referenceTitle;
    }
    if (sheetHint) {
        sheetHint.textContent = config.referenceHint;
    }
    if (overlayPrompt) {
        overlayPrompt.textContent = config.overlayPrompt;
    }
    if (!currentGamePayload && createHint) {
        createHint.textContent = config.createHint;
    }
    if (gameSelect) {
        gameSelect.value = config.key;
    }
    if (optionsHint) {
        optionsHint.textContent = config.optionsHint || 'Adjust per-game settings.';
    }
    if (themeLabel) {
        themeLabel.textContent = config.themeLabel || 'Theme';
    }
    if (optionsTitle) {
        optionsTitle.textContent = `${config.name} options`;
    }
    if (optionsSheet && !optionsSheet.hidden) {
        populateThemeSelect();
    }
    if (referenceSheet && !referenceSheet.hidden) {
        populateReferenceList();
    }
}

function resetGeneratedGame() {
    currentGamePayload = null;
    currentSeed = null;
    roundNumber = 1;
    dismissedEntries.clear();
    latestAssignment = null;
    latestDetailPayload = null;
    activePlayerNumber = null;
    if (createForm) {
        createForm.reset();
    }
    if (gameSelect) {
        gameSelect.value = currentGameKey;
    }
    if (playerCountInput) {
        playerCountInput.value = '';
    }
    if (qrInstance) {
        qrInstance.clear();
        qrInstance = null;
    }
    qrOutput.innerHTML = '';
    shareStringField.value = '';
    manualStringInput.value = '';
    copyShareBtn.disabled = true;
    hostRevealBtn.disabled = true;
    if (viewQrBtn) {
        viewQrBtn.disabled = true;
    }
    if (playAgainBtn) {
        playAgainBtn.disabled = true;
    }
    closeQrDialog();
    updateCodeTimestamp();
    updateRevealMeta();
    updateGameUI();
}

initApp();

function initApp() {
    bindNavigation();
    bindGameSelect();
    bindOptionsSheetControls();
    bindThemeControls();
    bindCreateForm();
    bindClipboardActions();
    bindScanControls();
    bindManualEntryControls();
    bindHostControls();
    bindRevealControls();
    bindReferenceSheetControls();
    bindInfoDialogControls();
    bindDetailDialogControls();
    bindConfirmDialogControls();
    bindQrDialogControls();
    bindScanDialogControls();
    bindPlayAgainControl();
    bindReferenceListControls();
}

function bindNavigation() {
    navButtons.forEach((button) => {
        addClick(button, () => {
            const target = button.dataset.target;
            if (!target) {
                return;
            }
            prepareScreen(target);
            showScreen(target);
        });
    });

    addClick(homeNavBtn, () => {
        if (!confirmDialog || activeScreenId === 'screen-home') {
            showScreen('screen-home');
            return;
        }
        openConfirmDialog({
            title: 'Go back home?',
            message: 'Return to the main menu? Make sure every player is done before leaving this screen.',
            confirmLabel: 'Return Home',
            onConfirm: () => showScreen('screen-home')
        });
    });
}

function bindGameSelect() {
    addListener(gameSelect, 'change', (event) => {
        setActiveGame(event.target.value);
    });
}

function bindOptionsSheetControls() {
    addClick(optionsBtn, () => openOptionsSheet());
    addClick(closeOptionsBtn, () => closeOptionsSheet());
    addClick(optionsBackdrop, () => closeOptionsSheet());
}

function bindThemeControls() {
    addListener(themeSelect, 'change', (event) => {
        const applied = setSelectedTheme(currentGameKey, event.target.value);
        if (!applied) {
            return;
        }
        dismissedEntries.clear();
        populateReferenceList();
        const hadPayload = currentGamePayload && currentGamePayload.game === currentGameKey;
        if (hadPayload) {
            resetGeneratedGame();
        }
        const themeInfo = getThemeInfo(currentGameKey, applied);
        if (themeInfo) {
            const message = hadPayload ? `${themeInfo.label} theme set. Generate a new code.` : `${themeInfo.label} theme selected.`;
            showToast(message);
            if (optionsHint) {
                const config = getActiveGameConfig();
                optionsHint.textContent = config.optionsHint || themeInfo.hint || 'Adjust per-game settings.';
            }
        }
    });
}

function prepareScreen(id) {
    if (id === 'screen-create') {
        resetGeneratedGame();
        return;
    }
    if (id === 'screen-scan') {
        resetScanPanel(true);
        activePlayerNumber = null;
    }
}

function showScreen(id) {
    screens.forEach((screen) => {
        screen.classList.toggle('active', screen.id === id);
    });
    activeScreenId = id;
    if (id !== 'screen-scan') {
        closeScanDialog();
        resetScanPanel();
    } else {
        if (scanHint) {
            scanHint.textContent = 'Paste the string or tap Scan QR to use your camera once.';
        }
    }
    if (id !== 'screen-reveal') {
        resetRevealOverlay();
        closeReferenceSheet();
        if (playAgainBtn) {
            playAgainBtn.disabled = true;
        }
    }
}

function bindCreateForm() {
    addListener(createForm, 'submit', (event) => {
        event.preventDefault();
        const players = Number(playerCountInput.value);
        if (Number.isNaN(players) || players < 3 || players > 12) {
            showToast('Player count must be between 3 and 12.');
            return;
        }

        const payload = {
            version: 1,
            game: currentGameKey,
            players,
            seed: generateSeed(),
            created: Date.now(),
            theme: getThemeKeyForGame(currentGameKey)
        };

        currentGamePayload = payload;
        currentSeed = payload.seed;
        roundNumber = 1;
        dismissedEntries.clear();
        const encoded = encodeGamePayload(payload);
        drawQr(buildShareUrl(encoded));
        createHint.textContent = `Share this QR code with exactly ${players} players.`;
        shareStringField.value = encoded;
        copyShareBtn.disabled = false;
        hostRevealBtn.disabled = false;
        if (viewQrBtn) {
            viewQrBtn.disabled = false;
        }
        updateCodeTimestamp(payload.created);
        updateRevealMeta();
        showToast('QR code ready to share.');
    });
}

function drawQr(value) {
    const QRClass = window.QRCode;
    if (!QRClass) {
        showToast('QR library failed to load.');
        return;
    }
    if (qrInstance) {
        qrInstance.clear();
        qrOutput.innerHTML = '';
    }
    qrInstance = new QRClass(qrOutput, {
        text: value,
        width: 300,
        height: 300,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRClass.CorrectLevel.M
    });
}

function buildShareUrl(code) {
    const trimmed = (code || '').trim();
    if (!trimmed) {
        return SHARE_BASE_URL;
    }
    if (!SHARE_BASE_URL) {
        return trimmed;
    }
    return `${SHARE_BASE_URL}?code=${encodeURIComponent(trimmed)}`;
}

function bindClipboardActions() {
    addClick(copyShareBtn, async () => {
        const value = shareStringField.value.trim();
        if (!value) {
            showToast('Generate a game first.');
            return;
        }

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                throw new Error('Clipboard API unavailable');
            }
        } catch (error) {
            try {
                shareStringField.select();
                document.execCommand('copy');
            } catch (fallbackError) {
                console.error('Copy failed', fallbackError);
                showToast('Unable to copy automatically.');
                return;
            }
        }

        showToast('Game string copied.');
    });

    addClick(viewQrBtn, () => {
        if (!currentGamePayload) {
            showToast('Generate a game first.');
            return;
        }
        openQrDialog();
    });
}

function bindScanControls() {
    addClick(scanQrBtn, async () => {
        const playerNumber = readPlayerNumber();
        if (playerNumber === null) {
            return;
        }
        activePlayerNumber = playerNumber;
        openScanDialog();
        const started = await startScanner();
        if (!started) {
            closeScanDialog();
        }
    });
}

function bindManualEntryControls() {
    addClick(pasteStringBtn, async () => {
        if (!manualStringInput) {
            return;
        }
        let pasted = '';
        if (navigator.clipboard && navigator.clipboard.readText && window.isSecureContext) {
            try {
                pasted = await navigator.clipboard.readText();
            } catch (error) {
                console.warn('Clipboard read failed', error);
            }
        }
        if (!pasted) {
            const fallback = window.prompt('Paste the game string here:');
            pasted = fallback || '';
        }
        pasted = pasted.trim();
        if (!pasted) {
            showToast('Nothing to paste yet.');
            return;
        }
        manualStringInput.value = pasted;
        try {
            manualStringInput.focus();
            manualStringInput.setSelectionRange(pasted.length, pasted.length);
        } catch (error) {
            console.debug('Unable to move cursor', error);
        }
        showToast('Pasted. Tap Reveal My Role to continue.');
    });

    addClick(manualApplyBtn, () => {
        const playerNumber = readPlayerNumber();
        if (playerNumber === null) {
            return;
        }

        const rawString = manualStringInput.value.trim();
        if (!rawString) {
            showToast('Paste a game string first.');
            return;
        }

        activePlayerNumber = playerNumber;

        let data;
        try {
            data = decodeGamePayload(rawString);
        } catch (error) {
            showToast('Invalid game string.');
            return;
        }

        handleGamePayload(data);
    });
}

function bindHostControls() {
    addClick(hostRevealBtn, () => {
        if (!currentGamePayload) {
            showToast('Generate a game first.');
            return;
        }
        activePlayerNumber = 1;
        handleGamePayload(currentGamePayload);
    });
}

function bindRevealControls() {
    addClick(revealCard, () => {
        if (!revealOverlay.classList.contains('hidden')) {
            showRevealDetails();
        } else {
            resetRevealOverlay();
        }
    });

    addClick(revealInfoBtn, (event) => {
        event.stopPropagation();
        if (!latestDetailPayload) {
            showToast('No extra info yet.');
            return;
        }
        openDetailDialog(latestDetailPayload);
    });
}

function bindReferenceSheetControls() {
    addClick(viewReferenceBtn, () => openReferenceSheet());
    addClick(closeReferenceBtn, () => closeReferenceSheet());
    addClick(referenceBackdrop, () => closeReferenceSheet());
}

function bindInfoDialogControls() {
    addClick(openInfoBtn, () => openInfoDialog());
    addClick(closeInfoBtn, () => closeInfoDialog());
    addClick(infoBackdrop, () => closeInfoDialog());
}

function bindDetailDialogControls() {
    addClick(closeDetailBtn, () => closeDetailDialog());
    addClick(detailBackdrop, () => closeDetailDialog());
}

function bindConfirmDialogControls() {
    addClick(confirmCancelBtn, () => closeConfirmDialog());
    addClick(confirmBackdrop, () => closeConfirmDialog());
    addClick(confirmAcceptBtn, () => {
        const action = pendingConfirmAction;
        closeConfirmDialog();
        if (typeof action === 'function') {
            action();
        }
    });
}

function bindQrDialogControls() {
    addClick(closeQrBtn, () => closeQrDialog());
    addClick(qrBackdrop, () => closeQrDialog());
}

function bindScanDialogControls() {
    addClick(closeScanBtn, () => closeScanDialog());
    addClick(scanBackdrop, () => closeScanDialog());
}

function bindPlayAgainControl() {
    addClick(playAgainBtn, () => {
        if (!currentGamePayload) {
            showToast('No game in progress. Generate or scan a code first.');
            return;
        }
        if (typeof activePlayerNumber !== 'number' || activePlayerNumber < 1) {
            showToast('Enter your player number before starting another round.');
            return;
        }
        const nextGameNumber = roundNumber + 1;
        openConfirmDialog({
            title: 'Start next round?',
            message: `Reuse this code for Game #${nextGameNumber}? Make sure the current round is finished first.`,
            confirmLabel: 'Start Round',
            onConfirm: () => {
                roundNumber = nextGameNumber;
                dismissedEntries.clear();
                let assignment = null;
                try {
                    assignment = assignRole(currentGamePayload, activePlayerNumber);
                } catch (error) {
                    console.error('Unable to assign next round role.', error);
                }
                if (assignment) {
                    latestAssignment = assignment;
                    populateRevealDetails(assignment);
                } else {
                    latestAssignment = null;
                    clearRevealDetails();
                    updateRevealMeta();
                }
                resetRevealOverlay();
                populateReferenceList();
                playAgainBtn.disabled = false;
                showToast(`Game #${roundNumber} ready. Tap to reveal your role again.`);
            }
        });
    });
}

function bindReferenceListControls() {
    if (!referenceList) {
        return;
    }
    addListener(referenceList, 'click', (event) => {
        const infoBtn = event.target.closest('.reference-info-btn');
        if (infoBtn) {
            event.stopPropagation();
            openReferenceEntryDetail(infoBtn.dataset.referenceName);
            return;
        }
        const item = event.target.closest('li');
        if (!item) {
            return;
        }
        toggleReferenceItem(item);
    });
    addListener(referenceList, 'keydown', (event) => {
        const infoBtn = event.target.closest('.reference-info-btn');
        if (infoBtn && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openReferenceEntryDetail(infoBtn.dataset.referenceName);
            return;
        }
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        const item = event.target.closest('li');
        if (!item) {
            return;
        }
        toggleReferenceItem(item);
    });
}

async function startScanner() {
    if (scanning) {
        showToast('Scanner already running.');
        return true;
    }
    if (typeof Html5Qrcode === 'undefined') {
        showToast('QR scanner unavailable. Check your connection.');
        return false;
    }

    const cameraIssue = getCameraSupportIssue();
    if (cameraIssue) {
        showToast(cameraIssue);
        return false;
    }

    const config = { fps: 10, qrbox: { width: 300, height: 300 } };

    try {
        html5QrCode = new Html5Qrcode('reader');
        await html5QrCode.start({ facingMode: 'environment' }, config, onScanSuccess, onScanFailure);
        scanning = true;
        if (scanHint) {
            scanHint.textContent = 'Scanner active. Line up the QR once, then close this window.';
        }
        return true;
    } catch (error) {
        console.error('Camera start failed', error);
        showToast(resolveCameraErrorMessage(error));
        stopScanner();
        return false;
    }
}

function stopScanner() {
    if (!scanning || !html5QrCode) {
        scanning = false;
        html5QrCode = null;
        return;
    }
    html5QrCode
        .stop()
        .catch((error) => {
            console.error('Failed to stop scanner', error);
        })
        .finally(() => {
            scanning = false;
            html5QrCode = null;
        });
}

function onScanSuccess(decodedText) {
    stopScanner();
    let data;
    try {
        data = decodeGamePayload(decodedText);
    } catch (error) {
        showToast('Invalid QR code. Try again.');
        return;
    }

    closeScanDialog({ skipStop: true });
    handleGamePayload(data);
}

function onScanFailure() {
    // Ignored to avoid spamming the user.
}

function resetScanPanel(fullReset = false) {
    if (scanHint) {
        scanHint.textContent = 'Paste the string or tap Scan QR to use your camera once.';
    }
    if (manualStringInput) {
        manualStringInput.value = '';
    }
    if (fullReset && playerNumberInput) {
        playerNumberInput.value = '';
    }
}

function ensureThemeSelection(gameKey) {
    const config = GAME_CONFIGS[gameKey];
    if (!config) {
        selectedThemes[gameKey] = null;
        return null;
    }
    const themes = config.themes || {};
    const current = selectedThemes[gameKey];
    if (current && themes[current]) {
        return current;
    }
    const fallback = config.defaultTheme || Object.keys(themes)[0] || null;
    selectedThemes[gameKey] = fallback;
    return fallback;
}

function resolveThemeKey(gameKey, requestedKey) {
    const config = GAME_CONFIGS[gameKey];
    if (!config || !config.themes) {
        return null;
    }
    if (requestedKey && config.themes[requestedKey]) {
        return requestedKey;
    }
    return ensureThemeSelection(gameKey);
}

function setSelectedTheme(gameKey, requestedKey) {
    const resolved = resolveThemeKey(gameKey, requestedKey);
    if (resolved) {
        selectedThemes[gameKey] = resolved;
    }
    return resolved;
}

function getThemeKeyForGame(gameKey) {
    return ensureThemeSelection(gameKey);
}

function getThemeInfo(gameKey, themeKey) {
    const config = GAME_CONFIGS[gameKey];
    if (!config || !config.themes) {
        return null;
    }
    const resolved = resolveThemeKey(gameKey, themeKey);
    return config.themes[resolved] || null;
}

function getDatasetForGame(gameKey, themeKey) {
    const config = GAME_CONFIGS[gameKey] || GAME_CONFIGS.spyfall;
    if (config.themes) {
        const info = getThemeInfo(gameKey, themeKey);
        if (info && info.dataset) {
            return info.dataset;
        }
    }
    return config.dataset || [];
}

function getDatasetForCurrentGame() {
    return getDatasetForGame(currentGameKey, selectedThemes[currentGameKey]);
}

function getDatasetForPayload(payload) {
    if (!payload) {
        return [];
    }
    const gameKey = payload.game || 'spyfall';
    return getDatasetForGame(gameKey, payload.theme);
}

function assignRole(payload, playerNumber) {
    const config = GAME_CONFIGS[payload.game] || GAME_CONFIGS.spyfall;
    return config.assignRole(payload, playerNumber);
}

function assignSpyfallRole(payload, playerNumber) {
    const locations = getDatasetForPayload(payload);
    const activeLocations = locations.length ? locations : SPYFALL_LOCATIONS;
    const locationRng = createRng(getRoundSeed(payload.seed, 'location'));
    const location = activeLocations[Math.floor(locationRng() * activeLocations.length)];
    const spyRng = createRng(getRoundSeed(payload.seed, 'spy'));
    const spyIndex = Math.floor(spyRng() * payload.players) + 1;

    if (playerNumber === spyIndex) {
        return {
            type: 'Spy',
            title: 'The Spy',
            location: null,
            detail: 'Hint: click on locations in the locations list to mark them off.',
            descriptionSummary: 'A spy is the only player who does not know which location was generated for the round.',
            definitionSummary: 'The spy role represents an undercover impostor who has to deduce the true location by listening carefully while surviving group questioning.'
        };
    }

    const roleList = location.roles;
    const order = [];
    for (let idx = 1; idx <= payload.players; idx += 1) {
        if (idx !== spyIndex) {
            order.push(idx);
        }
    }
    const slot = Math.max(order.indexOf(playerNumber), 0);
    const role = roleList[slot % roleList.length];

    const entryDetails = buildEntryDetail(location, { kind: 'location' });

    return {
        type: 'Innocent',
        title: role,
        location: location.name,
        detail: location.description,
        descriptionSummary: entryDetails.description || location.description,
        definitionSummary: entryDetails.definition,
        trivia: entryDetails.trivia
    };
}

function assignChameleonRole(payload, playerNumber) {
    const words = getDatasetForPayload(payload);
    const activeWords = words.length ? words : CHAMELEON_ANIMALS_WORDS;
    const wordRng = createRng(getRoundSeed(payload.seed, 'word'));
    const word = activeWords[Math.floor(wordRng() * activeWords.length)];
    const spyRng = createRng(getRoundSeed(payload.seed, 'spy'));
    const spyIndex = Math.floor(spyRng() * payload.players) + 1;

    if (playerNumber === spyIndex) {
        return {
            type: 'Chameleon',
            title: 'The Chameleon',
            location: null,
            detail: 'Hint: click on words in the word list to mark them off.',
            descriptionSummary: 'The chameleon is missing the secret word while every other player knows it.',
            definitionSummary: 'The chameleon role forces a player to fake confidence, study everyone else’s clues, and guess the hidden word before being singled out.'
        };
    }

    const entryDetails = buildEntryDetail(word, { kind: 'word' });

    return {
        type: 'Clue Giver',
        title: word.name,
        location: null,
        infoLine: 'Describe the word without giving it away.',
        detail: word.description,
        descriptionSummary: entryDetails.description || word.description,
        definitionSummary: entryDetails.definition,
        trivia: entryDetails.trivia
    };
}

function isValidGamePayload(payload) {
    if (!payload || typeof payload.seed !== 'string') {
        return false;
    }
    const gameKey = payload.game || 'spyfall';
    if (!GAME_CONFIGS[gameKey]) {
        return false;
    }
    return Number.isInteger(payload.players) && payload.players >= 3 && payload.players <= 12;
}

function generateSeed() {
    if (window.crypto && crypto.getRandomValues) {
        const buffer = new Uint32Array(4);
        crypto.getRandomValues(buffer);
        return Array.from(buffer, (value) => value.toString(16).padStart(8, '0')).join('');
    }
    return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i += 1) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function generator() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        h ^= h >>> 16;
        return h >>> 0;
    };
}

function mulberry32(a) {
    return function rng() {
        let t = a += 0x6d2b79f5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function createRng(seed) {
    const seedFn = xmur3(seed);
    return mulberry32(seedFn());
}

function getRoundSeed(baseSeed, tag) {
    const safeSeed = baseSeed || 'seed';
    const roundSuffix = `round${Math.max(roundNumber, 1)}`;
    if (!tag) {
        return `${safeSeed}-${roundSuffix}`;
    }
    return `${safeSeed}-${roundSuffix}-${tag}`;
}

function showToast(message, duration = 2800) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

window.addEventListener('beforeunload', () => {
    stopScanner();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && referenceSheet && !referenceSheet.hidden) {
        closeReferenceSheet();
    }
    if (event.key === 'Escape' && infoDialog && !infoDialog.hidden) {
        closeInfoDialog();
    }
    if (event.key === 'Escape' && confirmDialog && !confirmDialog.hidden) {
        closeConfirmDialog();
    }
    if (event.key === 'Escape' && qrDialog && !qrDialog.hidden) {
        closeQrDialog();
    }
    if (event.key === 'Escape' && scanDialog && !scanDialog.hidden) {
        closeScanDialog();
    }
    if (event.key === 'Escape' && optionsSheet && !optionsSheet.hidden) {
        closeOptionsSheet();
    }
    if (event.key === 'Escape' && detailDialog && !detailDialog.hidden) {
        closeDetailDialog();
    }
});

function readPlayerNumber() {
    const playerNumber = Number(playerNumberInput.value);
    if (Number.isNaN(playerNumber)) {
        showToast('Enter your player number first.');
        return null;
    }

    if (playerNumber < 2) {
        showToast('Player 1 is reserved for the host. Pick your number starting from 2.');
        return null;
    }

    return playerNumber;
}

function handleGamePayload(data) {
    if (!isValidGamePayload(data)) {
        showToast('This data is not a supported game.');
        return;
    }

    const payloadGame = data.game || 'spyfall';
    data.game = payloadGame;
    setActiveGame(payloadGame, { fromPayload: true });
    const appliedTheme = setSelectedTheme(payloadGame, data.theme);
    data.theme = appliedTheme;
    currentGamePayload = data;
    dismissedEntries.clear();
    updateGameUI({ fromPayload: true });
    populateReferenceList();

    if (activePlayerNumber > data.players) {
        showToast(`This game only has ${data.players} players.`);
        return;
    }

    const incomingSeed = data.seed || '—';
    if (incomingSeed !== currentSeed) {
        currentSeed = incomingSeed;
        roundNumber = 1;
        dismissedEntries.clear();
    }

    const assignment = assignRole(data, activePlayerNumber);
    goToRevealScreen(assignment);
}

function goToRevealScreen(assignment) {
    latestAssignment = assignment;
    populateRevealDetails(assignment);
    resetRevealOverlay();
    showScreen('screen-reveal');
    if (playAgainBtn) {
        playAgainBtn.disabled = false;
    }
}

function populateRevealDetails(assignment) {
    const config = getActiveGameConfig();
    revealType.textContent = assignment.type;
    revealTitle.textContent = assignment.title;
    if (assignment.location) {
        revealLocation.textContent = `${config.listLabel}: ${assignment.location}`;
    } else if (assignment.infoLine) {
        revealLocation.textContent = assignment.infoLine;
    } else {
        revealLocation.textContent = config.revealLine || DEFAULT_REVEAL_LINE;
    }
    revealExtra.textContent = assignment.detail;
    latestDetailPayload = resolveAssignmentDetailPayload(assignment);
    if (revealInfoBtn) {
        const hasDetail = Boolean(latestDetailPayload);
        revealInfoBtn.hidden = !hasDetail;
        revealInfoBtn.disabled = !hasDetail;
    }
    updateRevealMeta();
}

function resolveAssignmentDetailPayload(assignment) {
    if (!assignment) {
        return null;
    }
    const description = assignment.descriptionSummary || assignment.detail || '';
    const definition = assignment.definitionSummary || assignment.infoSummary || '';
    const trivia = assignment.trivia || '';
    if (!description && !definition && !trivia) {
        return null;
    }
    const title = assignment.location || assignment.title || assignment.type || 'More info';
    return {
        title,
        description,
        definition: definition || 'No additional explanation yet.',
        trivia
    };
}

function clearRevealDetails() {
    if (!revealType || !revealTitle || !revealLocation || !revealExtra) {
        return;
    }
    revealType.textContent = '';
    revealTitle.textContent = 'Ready for the next player';
    revealLocation.textContent = '';
    revealExtra.textContent = '';
    latestDetailPayload = null;
    if (revealInfoBtn) {
        revealInfoBtn.hidden = true;
        revealInfoBtn.disabled = true;
    }
}

function resetRevealOverlay() {
    revealOverlay.classList.remove('hidden');
    revealRole.classList.add('concealed');
}

function showRevealDetails() {
    if (!latestAssignment) {
        return;
    }
    revealOverlay.classList.add('hidden');
    revealRole.classList.remove('concealed');
}

function populateReferenceList() {
    if (!referenceList) {
        return;
    }
    referenceList.innerHTML = '';
    const dataset = getDatasetForCurrentGame();
    currentReferenceDataset = dataset;
    dataset.forEach((entry) => {
        const item = document.createElement('li');
        item.dataset.referenceName = entry.name;
        item.tabIndex = 0;
        item.setAttribute('role', 'button');
        const dismissed = dismissedEntries.has(entry.name);
        if (dismissed) {
            item.classList.add('is-dismissed');
        }
        item.setAttribute('aria-pressed', String(dismissed));
        const header = document.createElement('div');
        header.className = 'reference-header';
        const title = document.createElement('h4');
        title.textContent = entry.name;
        header.appendChild(title);
        const infoButton = document.createElement('button');
        infoButton.type = 'button';
        infoButton.className = 'info-chip reference-info-btn';
        infoButton.textContent = '?';
        infoButton.setAttribute('aria-label', `More info about ${entry.name}`);
        infoButton.dataset.referenceName = entry.name;
        header.appendChild(infoButton);
        item.appendChild(header);
        if (entry.description) {
            const detail = document.createElement('p');
            detail.textContent = entry.description;
            item.appendChild(detail);
        }
        referenceList.appendChild(item);
    });
}

function openReferenceEntryDetail(name) {
    if (!name) {
        showToast('Select an entry first.');
        return;
    }
    const detail = getReferenceEntryDetail(name);
    if (detail) {
        openDetailDialog(detail);
    } else {
        showToast('More info unavailable for now.');
    }
}

function getReferenceEntryDetail(name) {
    if (!name) {
        return null;
    }
    const entry = (currentReferenceDataset || []).find((item) => item.name === name);
    if (!entry) {
        return null;
    }
    const config = getActiveGameConfig();
    const details = buildEntryDetail(entry, {
        kind: (config.listLabel || 'entry').toLowerCase()
    });
    return {
        title: entry.name,
        description: details.description,
        definition: details.definition,
        trivia: details.trivia
    };
}

function toggleReferenceItem(item) {
    const name = item.dataset.referenceName;
    const shouldDismiss = !item.classList.contains('is-dismissed');
    item.classList.toggle('is-dismissed', shouldDismiss);
    item.setAttribute('aria-pressed', String(shouldDismiss));
    if (!name) {
        return;
    }
    if (shouldDismiss) {
        dismissedEntries.add(name);
    } else {
        dismissedEntries.delete(name);
    }
}

function updateRevealMeta() {
    if (!revealMeta) {
        return;
    }
    const playerText = activePlayerNumber ? `Player #${activePlayerNumber}` : 'Player —';
    const seedText = currentSeed ? `Seed ${currentSeed}` : 'Seed —';
    revealMeta.textContent = `${playerText} · ${seedText} · Game #${roundNumber}`;
}

function updateCodeTimestamp(createdAt) {
    if (!codeTimestamp) {
        return;
    }
    if (!createdAt) {
        codeTimestamp.textContent = 'No code generated yet.';
        return;
    }
    try {
        const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
        codeTimestamp.textContent = `Generated ${formatter.format(new Date(createdAt))}`;
    } catch (error) {
        const date = new Date(createdAt);
        codeTimestamp.textContent = `Generated ${date.toLocaleString()}`;
    }
}

function openReferenceSheet() {
    if (!referenceSheet) {
        return;
    }
    populateReferenceList();
    referenceSheet.hidden = false;
    referenceSheet.setAttribute('aria-hidden', 'false');
}

function closeReferenceSheet() {
    if (!referenceSheet) {
        return;
    }
    referenceSheet.hidden = true;
    referenceSheet.setAttribute('aria-hidden', 'true');
}

function openOptionsSheet() {
    const config = getActiveGameConfig();
    if (!optionsSheet) {
        return;
    }
    if (!config.themes) {
        showToast('No additional options for this game.');
        return;
    }
    populateThemeSelect();
    optionsSheet.hidden = false;
    optionsSheet.setAttribute('aria-hidden', 'false');
}

function closeOptionsSheet() {
    if (!optionsSheet) {
        return;
    }
    optionsSheet.hidden = true;
    optionsSheet.setAttribute('aria-hidden', 'true');
}

function populateThemeSelect() {
    if (!themeSelect) {
        return;
    }
    const config = getActiveGameConfig();
    if (!config.themes) {
        themeSelect.innerHTML = '';
        return;
    }
    const fragment = document.createDocumentFragment();
    Object.values(config.themes).forEach((theme) => {
        const option = document.createElement('option');
        option.value = theme.key;
        option.textContent = theme.label;
        fragment.appendChild(option);
    });
    themeSelect.innerHTML = '';
    themeSelect.appendChild(fragment);
    const activeTheme = getThemeKeyForGame(currentGameKey);
    themeSelect.value = activeTheme;
    if (optionsHint) {
        const info = getThemeInfo(currentGameKey, activeTheme);
        optionsHint.textContent = config.optionsHint || info?.hint || 'Adjust per-game settings.';
    }
}

function openInfoDialog() {
    if (!infoDialog) {
        return;
    }
    infoDialog.hidden = false;
    infoDialog.setAttribute('aria-hidden', 'false');
}

function closeInfoDialog() {
    if (!infoDialog) {
        return;
    }
    infoDialog.hidden = true;
    infoDialog.setAttribute('aria-hidden', 'true');
}

function openDetailDialog(payload = {}) {
    if (!detailDialog || !detailTitle || !detailDefinition || !detailTrivia) {
        return;
    }
    detailTitle.textContent = payload.title || 'More info';
    if (detailDescription) {
        const descriptionText = payload.description || '';
        detailDescription.textContent = descriptionText;
        detailDescription.hidden = !descriptionText;
    }
    const definitionText = payload.definition || 'No additional explanation yet.';
    detailDefinition.textContent = definitionText;
    const triviaText = payload.trivia || '';
    detailTrivia.textContent = triviaText;
    detailTrivia.hidden = !triviaText;
    detailDialog.hidden = false;
    detailDialog.setAttribute('aria-hidden', 'false');
    if (closeDetailBtn) {
        closeDetailBtn.focus();
    }
}

function closeDetailDialog() {
    if (!detailDialog) {
        return;
    }
    detailDialog.hidden = true;
    detailDialog.setAttribute('aria-hidden', 'true');
}

function openConfirmDialog(options = {}) {
    if (!confirmDialog || !confirmTitle || !confirmMessage || !confirmAcceptBtn || !confirmCancelBtn) {
        if (typeof options.onConfirm === 'function') {
            options.onConfirm();
        }
        return;
    }
    const {
        title = 'Are you sure?',
        message = '',
        confirmLabel = 'Confirm',
        cancelLabel = 'Cancel',
        onConfirm = null
    } = options;
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmAcceptBtn.textContent = confirmLabel;
    confirmCancelBtn.textContent = cancelLabel;
    confirmDialog.hidden = false;
    confirmDialog.setAttribute('aria-hidden', 'false');
    pendingConfirmAction = typeof onConfirm === 'function' ? onConfirm : null;
    confirmAcceptBtn.focus();
}

function closeConfirmDialog() {
    if (!confirmDialog) {
        return;
    }
    confirmDialog.hidden = true;
    confirmDialog.setAttribute('aria-hidden', 'true');
    pendingConfirmAction = null;
}

function openQrDialog() {
    if (!qrDialog) {
        return;
    }
    qrDialog.hidden = false;
    qrDialog.setAttribute('aria-hidden', 'false');
}

function closeQrDialog() {
    if (!qrDialog) {
        return;
    }
    qrDialog.hidden = true;
    qrDialog.setAttribute('aria-hidden', 'true');
}

function openScanDialog() {
    if (!scanDialog) {
        return;
    }
    scanDialog.hidden = false;
    scanDialog.setAttribute('aria-hidden', 'false');
}

function closeScanDialog(options = {}) {
    if (!scanDialog) {
        return;
    }
    const { skipStop = false } = options;
    scanDialog.hidden = true;
    scanDialog.setAttribute('aria-hidden', 'true');
    if (scanHint) {
        scanHint.textContent = 'Paste the string or tap Scan QR to use your camera once.';
    }
    if (!skipStop) {
        stopScanner();
    }
}

function buildEntryDetail(entry, options = {}) {
    if (!entry) {
        return { description: '', definition: '', trivia: '' };
    }
    const name = entry.name || 'This option';
    const kindLabel = options.kind || 'entry';
    const description = entry.description || '';
    const definition = buildDefinitionText(entry, name, kindLabel);
    const triviaSentences = entry.trivia ? splitIntoSentences(entry.trivia) : [];
    const trivia = triviaSentences
        .slice(0, 3)
        .map((sentence) => ensureSentence(sentence))
        .join(' ');

    return { description, definition, trivia };
}

function ensureSentence(text) {
    if (!text) {
        return '';
    }
    const trimmed = text.trim();
    if (!trimmed) {
        return '';
    }
    const ending = trimmed.slice(-1);
    if ('.!?'.includes(ending)) {
        return trimmed;
    }
    return `${trimmed}.`;
}

function splitIntoSentences(text) {
    if (!text) {
        return [];
    }
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) {
        return [];
    }
    const matches = normalized.match(/[^.!?]+[.!?]?/g);
    if (!matches) {
        return [normalized];
    }
    return matches.map((segment) => segment.trim()).filter(Boolean);
}

function buildDefinitionText(entry, name, kindLabel) {
    const label = (kindLabel || 'entry').toLowerCase();
    const candidateSentences = [];
    if (entry.definition) {
        candidateSentences.push(...splitIntoSentences(entry.definition));
    } else if (entry.info) {
        candidateSentences.push(...splitIntoSentences(entry.info));
    } else if (entry.description) {
        candidateSentences.push(...splitIntoSentences(entry.description));
    }
    
    const sanitized = candidateSentences
        .map(cleanSentenceForDefinition)
        .filter(Boolean);
        
    if (sanitized.length) {
        return sanitized
            .slice(0, 6)
            .map((sentence) => ensureSentence(sentence))
            .join(' ');
    }
    
    return `${name} is a ${label} people commonly recognize in everyday conversation.`;
}

function cleanSentenceForDefinition(sentence) {
    if (!sentence) {
        return '';
    }
    const trimmed = sentence.trim();
    if (!trimmed) {
        return '';
    }
    if (/(describe|click|tap|hint|share|generate)/i.test(trimmed)) {
        return '';
    }
    return trimmed;
}

function lowercaseInitial(text) {
    if (!text) {
        return '';
    }
    return text.charAt(0).toLowerCase() + text.slice(1);
}

function formatList(items) {
    if (!items || !items.length) {
        return '';
    }
    if (items.length === 1) {
        return items[0];
    }
    if (items.length === 2) {
        return `${items[0]} and ${items[1]}`;
    }
    const rest = items.slice(0, -1).join(', ');
    const last = items[items.length - 1];
    return `${rest}, and ${last}`;
}

function prefillStringFromUrl() {
    let params;
    try {
        params = new URLSearchParams(window.location.search || '');
    } catch (error) {
        console.error('Unable to parse URL parameters.', error);
        return;
    }
    const codeParam = params.get('code');
    if (!codeParam) {
        return;
    }
    const trimmed = codeParam.trim();
    if (!trimmed) {
        return;
    }
    if (manualStringInput) {
        manualStringInput.value = trimmed;
    }
    if (shareStringField && !shareStringField.value) {
        shareStringField.value = trimmed;
    }
    showScreen('screen-scan');
    if (scanHint) {
        scanHint.textContent = 'String prefilled from QR. Enter your player number.';
    }
    showToast('Game string prefilled. Enter your player number.');
}

function getCameraSupportIssue() {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        return 'Camera access is not available on this device. Use the game string instead.';
    }
    const host = window.location.hostname;
    const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
    if (!window.isSecureContext && !isLocalhost) {
        return 'Camera access requires HTTPS. Use the game string or open this page from a secure origin.';
    }
    return null;
}

function resolveCameraErrorMessage(error) {
    if (!error) {
        return 'Unable to start the camera on this device.';
    }
    const name = error.name || '';
    const message = error.message || '';
    if (/NotAllowedError|PermissionDenied/i.test(name) || /permission/i.test(message)) {
        return 'Camera permission was denied.';
    }
    if (/NotFoundError|NoDeviceFound|DevicesNotFoundError/i.test(name) || /no camera/i.test(message)) {
        return 'No camera found on this device.';
    }
    if (/secure context|https/i.test(message)) {
        return 'Camera access requires HTTPS. Use the game string or open this page securely.';
    }
    return 'Unable to start the camera on this device.';
}

function encodeGamePayload(payload) {
    const body = JSON.stringify(payload);
    const base64 = base64Encode(body);
    return `spyfall|${payload.seed}|${base64}`;
}

function decodeGamePayload(text) {
    if (typeof text !== 'string') {
        throw new Error('Invalid QR data');
    }

    if (text.startsWith('spyfall|')) {
        const [, seed, ...rest] = text.split('|');
        const encodedBody = rest.join('|');
        if (!encodedBody) {
            throw new Error('Missing payload');
        }
        const raw = base64Decode(encodedBody);
        const parsed = JSON.parse(raw);
        if (!parsed.seed && seed) {
            parsed.seed = seed;
        }
        if (!parsed.game) {
            parsed.game = 'spyfall';
        }
        return parsed;
    }

    return JSON.parse(text);
}

function base64Encode(input) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
}

function base64Decode(input) {
    const binary = atob(input);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}

prefillStringFromUrl();
updateGameUI();
updateRevealMeta();
