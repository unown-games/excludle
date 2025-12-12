// word_bank.js
// Each day uses 4 games in order:
// Day 1 -> games[0..3], Day 2 -> games[4..7], etc.

const wordBank = {
  games: [
    {
      "category": "High _____",
      "word1": "School",
      "word2": "Five",
      "word3": "Quality",
      "word4": "Ground",
      "imposter": "Banana"
    },
    {
      "category": "Types of races",
      "word1": "Horse",
      "word2": "Car",
      "word3": "Person",
      "word4": "Dog",
      "imposter": "Dolphin"
    },
    {
      "category": "Units of time",
      "word1": "Minute",
      "word2": "Fortnight",
      "word3": "Eon",
      "word4": "Decade",
      "imposter": "League"
    },
    {
      "category": "Things that are pickled",
      "word1": "Cucumbers",
      "word2": "Plum",
      "word3": "Peppers",
      "word4": "Onion",
      "imposter": "Apple"
    },

    {
      "category": "Soft _____",
      "word1": "Drink",
      "word2": "Spot",
      "word3": "Landing",
      "word4": "Skills",
      "imposter": "Garlic"
    },
    {
      "category": "Broken _____",
      "word1": "Record",
      "word2": "Heart",
      "word3": "Promise",
      "word4": "Bone",
      "imposter": "Toothpaste"
    },
    {
      "category": "Things you can roast",
      "word1": "Peppers",
      "word2": "Coffee",
      "word3": "Nuts",
      "word4": "Marshmallows",
      "imposter": "Lettuce"
    },
    {
      "category": "Things that can be measured in karats",
      "word1": "Diamonds",
      "word2": "Sapphires",
      "word3": "Rubies",
      "word4": "Emeralds",
      "imposter": "Platinum"
    },

    {
      "category": "Cold _____",
      "word1": "Brew",
      "word2": "Front",
      "word3": "Case",
      "word4": "Shoulder",
      "imposter": "Corner"
    },
    {
      "category": "Things that can be rolled",
      "word1": "Dough",
      "word2": "Sleeves",
      "word3": "Credits",
      "word4": "Dice",
      "imposter": "Sand"
    },
    {
      "category": "Words that end in R",
      "word1": "Marker",
      "word2": "Eraser",
      "word3": "Stapler",
      "word4": "Warrior",
      "imposter": "Pencil"
    },
    {
      "category": "Famous last names",
      "word1": "Stone",
      "word2": "Fox",
      "word3": "Keys",
      "word4": "Rock",
      "imposter": "Metal"
    },

    {
      "category": "Colors with one letter changed",
      "word1": "Rad",
      "word2": "Punk",
      "word3": "Block",
      "word4": "Mellow",
      "imposter": "Cool"
    },
    {
      "category": "Light _____",
      "word1": "Bulb",
      "word2": "Year",
      "word3": "Rail",
      "word4": "Touch",
      "imposter": "Paper"
    },
    {
      "category": "Things you do on the road",
      "word1": "Pass",
      "word2": "Stop",
      "word3": "Turn",
      "word4": "Drive",
      "imposter": "Throw"
    },
    {
      "category": "Things used to melt ice",
      "word1": "Salt",
      "word2": "Fire",
      "word3": "Water",
      "word4": "Hair Dryer",
      "imposter": "Earth"
    },

    {
      "category": "\"The\" bands",
      "word1": "Police",
      "word2": "Cure",
      "word3": "Neighborhood",
      "word4": "Doors",
      "imposter": "EMT"
    },
    {
      "category": "Numbers divisible by 3",
      "word1": "21",
      "word2": "69",
      "word3": "420",
      "word4": "27",
      "imposter": "67"
    },
    {
      "category": "Things that you can go on",
      "word1": "Ride",
      "word2": "Date",
      "word3": "Trip",
      "word4": "Cruise",
      "imposter": "Pool"
    },
    {
      "category": "____ gram",
      "word1": "Tele",
      "word2": "Insta",
      "word3": "Pro",
      "word4": "Ana",
      "imposter": "Top"
    },

    {
      "category": "Words in Disney Pixar movies",
      "word1": "Monsters",
      "word2": "Story",
      "word3": "Bugs",
      "word4": "Dinosaur",
      "imposter": "Creatures"
    },
    {
      "category": "Words commonly followed by numbers",
      "word1": "High",
      "word2": "Fantastic",
      "word3": "Cloud",
      "word4": "Seven",
      "imposter": "Sky"
    },
    {
      "category": "Things Worn On Lapels",
      "word1": "Awareness Ribbon",
      "word2": "Lapel Pin",
      "word3": "Boutonnière",
      "word4": "Lavalier",
      "imposter": "Corset"
    },
    {
      "category": "Cocktails",
      "word1": "Cosmopolitan",
      "word2": "Greyhound",
      "word3": "Screwdriver",
      "word4": "Sea Breeze",
      "imposter": "Boxset"
    },

    {
      "category": "Deep _____",
      "word1": "End",
      "word2": "Sleep",
      "word3": "Dive",
      "word4": "Fryer",
      "imposter": "Ticket"
    },
    {
      "category": "Adhere",
      "word1": "Fix",
      "word2": "Bond",
      "word3": "Paste",
      "word4": "Stick",
      "imposter": "Bottle"
    },
    {
      "category": "Graze",
      "word1": "Brush",
      "word2": "Kiss",
      "word3": "Skim",
      "word4": "Stroke",
      "imposter": "Hug"
    },
    {
      "category": "Parts Of A Tooth",
      "word1": "Crown",
      "word2": "Enamel",
      "word3": "Pulp",
      "word4": "Root",
      "imposter": "Gum"
    },

    {
      "category": "Words That Sound Like Two Letters",
      "word1": "Any",
      "word2": "Arty",
      "word3": "Decay",
      "word4": "Essay",
      "imposter": "Queue"
    },
    {
      "category": "Stocky",
      "word1": "Husky",
      "word2": "Squat",
      "word3": "Solid",
      "word4": "Thick",
      "imposter": "Lunge"
    },
    {
      "category": "Steer",
      "word1": "Direct",
      "word2": "Lead",
      "word3": "Guide",
      "word4": "Shepherd",
      "imposter": "Sheep"
    },
    {
      "category": "Organ Plus A Letter",
      "word1": "Colony",
      "word2": "Hearth",
      "word3": "Lunge",
      "word4": "Skink",
      "imposter": "Kidney"
    },

    {
      "category": "Funny Person",
      "word1": "Clown",
      "word2": "Joker",
      "word3": "Comedian",
      "word4": "Riot",
      "imposter": "Scene"
    },
    {
      "category": "Kinds Of Tomatoes",
      "word1": "Cherry",
      "word2": "Grape",
      "word3": "Plum",
      "word4": "Roma",
      "imposter": "Olive"
    },
    {
      "category": "\"You Bet\"",
      "word1": "Absolutely",
      "word2": "Of Course",
      "word3": "Okey-Doke",
      "word4": "Sure Thing",
      "imposter": "Not Sure"
    },
    {
      "category": "Basketball Shots",
      "word1": "Alley-Oop",
      "word2": "Finger Roll",
      "word3": "Fadeaway",
      "word4": "Slam Dunk",
      "imposter": "Pivot"
    },

    {
      "category": "Starting With Synonyms For \"Scram!\"",
      "word1": "Go-Getter",
      "word2": "Scattergories",
      "word3": "Leavening",
      "word4": "Shoo-In",
      "imposter": "Sitcom"
    },
    {
      "category": "Things followed by Sweet",
      "word1": "Dreams",
      "word2": "Potato",
      "word3": "Tooth",
      "word4": "Heart",
      "imposter": "Cloud"
    },
    {
      "category": "_____ Ring",
      "word1": "Engagement",
      "word2": "Boxing",
      "word3": "Oura",
      "word4": "Napkin",
      "imposter": "Chair"
    },
    {
      "category": "Words that spell something else backwards",
      "word1": "Stressed",
      "word2": "Drawer",
      "word3": "Diaper",
      "word4": "Time",
      "imposter": "Plan"
    },

    {
      "category": "Sports where you hold a stick",
      "word1": "Baseball",
      "word2": "Lacrosse",
      "word3": "Hockey",
      "word4": "Golf",
      "imposter": "Football"
    },
    {
      "category": "Black and white animals",
      "word1": "Panda",
      "word2": "Zebra",
      "word3": "Skunk",
      "word4": "Orca",
      "imposter": "Lion"
    },
    {
      "category": "Words that start with \"ex\"",
      "word1": "Example",
      "word2": "Excite",
      "word3": "Exclude",
      "word4": "Examine",
      "imposter": "Include"
    },
    {
      "category": "Acronyms with multiple meanings",
      "word1": "PC",
      "word2": "LOL",
      "word3": "PT",
      "word4": "ATM",
      "imposter": "BTW"
    },

    {
      "category": "Things that have scales",
      "word1": "Fish",
      "word2": "Snake",
      "word3": "Lizard",
      "word4": "Dragon",
      "imposter": "Bird"
    },
    {
      "category": "Names that are also words",
      "word1": "Jack",
      "word2": "Bob",
      "word3": "Rob",
      "word4": "Will",
      "imposter": "Steve"
    },
    {
      "category": "Words that contain double letters",
      "word1": "Letter",
      "word2": "Bookkeeper",
      "word3": "Committee",
      "word4": "Success",
      "imposter": "Planet"
    },
    {
      "category": "Movies that blend animation and live action",
      "word1": "Who Framed Roger Rabbit",
      "word2": "Space Jam",
      "word3": "Enchanted",
      "word4": "The SpongeBob SquarePants Movie",
      "imposter": "The Lion King"
    },

    {
      "category": "USA Capital Cities",
      "word1": "Albany",
      "word2": "Austin",
      "word3": "Denver",
      "word4": "Phoenix",
      "imposter": "Pittsburgh"
    },
    {
      "category": "Famous Scientists",
      "word1": "Einstein",
      "word2": "Curie",
      "word3": "Newton",
      "word4": "Hawking",
      "imposter": "Epstein"
    },
    {
      "category": "Foods that are elevated with cheese",
      "word1": "Burger",
      "word2": "Macaroni",
      "word3": "Crackers",
      "word4": "Broccoli Soup",
      "imposter": "Chocolate"
    },
    {
      "category": "Words that are the same in Spanish and English",
      "word1": "Animal",
      "word2": "Hospital",
      "word3": "Chocolate",
      "word4": "Actor",
      "imposter": "Diary"
    },

    {
      "category": "Types of clouds",
      "word1": "Cumulus",
      "word2": "Stratus",
      "word3": "Cirrus",
      "word4": "Nimbus",
      "imposter": "Horizons"
    },
    {
      "category": "Famous painters",
      "word1": "Picasso",
      "word2": "Da Vinci",
      "word3": "Van Gogh",
      "word4": "Rembrandt",
      "imposter": "Beethoven"
    },
    {
      "category": "Musical instruments with strings",
      "word1": "Guitar",
      "word2": "Violin",
      "word3": "Harp",
      "word4": "Cello",
      "imposter": "Drums"
    },
    {
      "category": "Countries in Africa",
      "word1": "Nigeria",
      "word2": "Kenya",
      "word3": "Egypt",
      "word4": "Ghana",
      "imposter": "Brazil"
    },

    {
      "category": "Brands owned by PepsiCo",
      "word1": "Lay's",
      "word2": "Gatorade",
      "word3": "Quaker Oats",
      "word4": "Tropicana",
      "imposter": "Sprite"
    },
    {
      "category": "Famous bridges",
      "word1": "Golden Gate",
      "word2": "Brooklyn",
      "word3": "London",
      "word4": "Sydney Harbour",
      "imposter": "Eiffel Tower"
    },
    {
      "category": "Common fire starters",
      "word1": "Matches",
      "word2": "Wood",
      "word3": "Flint",
      "word4": "Magnifying Glass",
      "imposter": "Steel"
    },
    {
      "category": "Words that sound like letters",
      "word1": "Sea",
      "word2": "Jay",
      "word3": "Tea",
      "word4": "You",
      "imposter": "Lea"
    },

    {
      "category": "Arm muscles",
      "word1": "Biceps",
      "word2": "Triceps",
      "word3": "Deltoids",
      "word4": "Forearm",
      "imposter": "Quadriceps"
    },
    {
      "category": "_____ box",
      "word1": "Match",
      "word2": "Sand",
      "word3": "Lunch",
      "word4": "Juke",
      "imposter": "Lighter"
    },
    {
      "category": "Words with double consonants",
      "word1": "Ballet",
      "word2": "Address",
      "word3": "Occur",
      "word4": "Coffee",
      "imposter": "Purse"
    },
    {
      "category": "Hot _____",
      "word1": "Chocolate",
      "word2": "Dog",
      "word3": "Take",
      "word4": "Tub",
      "imposter": "Paper"
    },

    {
      "category": "Lil rappers",
      "word1": "Wayne",
      "word2": "Baby",
      "word3": "Pump",
      "word4": "Yachty",
      "imposter": "Polo"
    },
    {
      "category": "Environmentally friendly",
      "word1": "Cycling",
      "word2": "Walking",
      "word3": "Scootering",
      "word4": "Busing",
      "imposter": "Driving"
    },
    {
      "category": "Words that don't exist",
      "word1": "Wrorp",
      "word2": "Knorg",
      "word3": "Glimt",
      "word4": "Tronf",
      "imposter": "Plural"
    },
    {
      "category": "Keyboard keys",
      "word1": "Enter",
      "word2": "Shift",
      "word3": "Option",
      "word4": "Alt",
      "imposter": "Confirm"
    },

    {
      "category": "Minecraft wood",
      "word1": "Oak",
      "word2": "Birch",
      "word3": "Spruce",
      "word4": "Jungle",
      "imposter": "Pine"
    },
    {
      "category": "_____ wave",
      "word1": "Micro",
      "word2": "Heat",
      "word3": "Sound",
      "word4": "Shock",
      "imposter": "Max"
    },
    {
      "category": "Laundry day",
      "word1": "Hamper",
      "word2": "Detergent",
      "word3": "Sheets",
      "word4": "Bleach",
      "imposter": "Cart"
    },
    {
      "category": "London staples",
      "word1": "Queen",
      "word2": "Guard",
      "word3": "Ferris Wheel",
      "word4": "Phone Booth",
      "imposter": "President"
    },

    {
      "category": "_____ board",
      "word1": "Snow",
      "word2": "Cutting",
      "word3": "Surf",
      "word4": "Ironing",
      "imposter": "Basket"
    },
    {
      "category": "New Years resolutions",
      "word1": "Exercise",
      "word2": "Diet",
      "word3": "Walk",
      "word4": "Travel",
      "imposter": "Procrastinate"
    },
    {
      "category": "Sarcastic insults",
      "word1": "Genuis",
      "word2": "Wise Guy",
      "word3": "Sherlock",
      "word4": "Smart Alec",
      "imposter": "Intellect"
    },
    {
      "category": "Smartwatch data",
      "word1": "Steps",
      "word2": "Calories",
      "word3": "Heart Rate",
      "word4": "Distance",
      "imposter": "Blood Pressure"
    }
  ]
};

export default wordBank;
