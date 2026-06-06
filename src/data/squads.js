const squads = {
  "Czech Republic": {
    "GK": [
      "Matěj Kovář",
      "Jindřich Staněk",
      "Lukáš Horníček"
    ],
    "DF": [
      "David Zima",
      "Tomáš Holeš",
      "Robin Hranáč",
      "Vladimír Coufal",
      "Štěpán Chaloupek",
      "Ladislav Krejčí",
      "David Jurásek",
      "Jaroslav Zelený",
      "David Douděra"
    ],
    "MF": [
      "Vladimír Darida",
      "Lukáš Červ",
      "Lukáš Provod",
      "Michal Sadílek",
      "Tomáš Souček",
      "Alexandr Sojka",
      "Hugo Sochůrek"
    ],
    "FW": [
      "Adam Hložek",
      "Patrik Schick",
      "Jan Kuchta",
      "Mojmír Chytil",
      "Pavel Šulc",
      "Tomáš Chorý",
      "Denis Višinský"
    ]
  },
  "Mexico": {
    "GK": [
      "Raúl Rangel",
      "Carlos Acevedo",
      "Guillermo Ochoa"
    ],
    "DF": [
      "Jorge Sánchez",
      "César Montes",
      "Edson Álvarez",
      "Johan Vásquez",
      "Israel Reyes",
      "Mateo Chávez",
      "Jesús Gallardo"
    ],
    "MF": [
      "Érik Lira",
      "Luis Romo",
      "Álvaro Fidalgo",
      "Orbelín Pineda",
      "Obed Vargas",
      "Gilberto Mora",
      "Luis Chávez",
      "Brian Gutiérrez"
    ],
    "FW": [
      "Raúl Jiménez",
      "Alexis Vega",
      "Santiago Giménez",
      "Armando González",
      "Julián Quiñones",
      "César Huerta",
      "Guillermo Martínez",
      "Roberto Alvarado"
    ]
  },
  "South Africa": {
    "GK": [
      "Ronwen Williams",
      "Sipho Chaine",
      "Ricardo Goss"
    ],
    "DF": [
      "Thabang Matuludi",
      "Khulumani Ndamane",
      "Aubrey Modiba",
      "Mbekezeli Mbokazi",
      "Samukele Kabini",
      "Nkosinathi Sibisi",
      "Khuliso Mudau",
      "Ime Okon",
      "Olwethu Makhanya",
      "Bradley Cross"
    ],
    "MF": [
      "Teboho Mokoena",
      "Thalente Mbatha",
      "Themba Zwane",
      "Sphephelo Sithole",
      "Jayden Adams"
    ],
    "FW": [
      "Oswin Appollis",
      "Tshepang Moremi",
      "Lyle Foster",
      "Relebohile Mofokeng",
      "Thapelo Maseko",
      "Iqraam Rayners",
      "Evidence Makgopa",
      "Kamogelo Sebelebele"
    ]
  },
  "South Korea": {
    "GK": [
      "Kim Seung-gyu",
      "Song Bum-keun",
      "Jo Hyeon-woo"
    ],
    "DF": [
      "Lee Han-beom",
      "Kim Min-jae",
      "Kim Tae-hyeon",
      "Lee Tae-seok",
      "Cho Wi-je",
      "Kim Moon-hwan",
      "Park Jin-seob",
      "Seol Young-woo",
      "Jens Castrop"
    ],
    "MF": [
      "Lee Gi-hyuk",
      "Hwang In-beom",
      "Paik Seung-ho",
      "Lee Jae-sung",
      "Hwang Hee-chan",
      "Bae Jun-ho",
      "Lee Kang-in",
      "Yang Hyun-jun",
      "Kim Jin-gyu",
      "Eom Ji-sung",
      "Lee Dong-gyeong"
    ],
    "FW": [
      "Son Heung-min",
      "Cho Gue-sung",
      "Oh Hyeon-gyu"
    ]
  },
  "Bosnia and Herzegovina": {
    "GK": [
      "Nikola Vasilj",
      "Mladen Jurkas",
      "Martin Zlomislić"
    ],
    "DF": [
      "Nihad Mujakić",
      "Dennis Hadžikadunić",
      "Tarik Muharemović",
      "Sead Kolašinac",
      "Amar Dedić",
      "Nikola Katić",
      "Stjepan Radeljić",
      "Nidal Čelik"
    ],
    "MF": [
      "Benjamin Tahirović",
      "Armin Gigović",
      "Ivan Bašić",
      "Ivan Šunjić",
      "Amar Memić",
      "Amir Hadžiahmetović",
      "Dženis Burnić",
      "Ermin Mahmić"
    ],
    "FW": [
      "Samed Baždar",
      "Ermedin Demirović",
      "Edin Džeko",
      "Kerim Alajbegović",
      "Esmir Bajraktarević",
      "Haris Tabaković",
      "Jovo Lukić"
    ]
  },
  "Canada": {
    "GK": [
      "Dayne St. Clair",
      "Maxime Crépeau",
      "Owen Goodman"
    ],
    "DF": [
      "Alistair Johnston",
      "Alfie Jones",
      "Luc de Fougerolles",
      "Joel Waterman",
      "Derek Cornelius",
      "Moïse Bombito",
      "Alphonso Davies",
      "Richie Laryea",
      "Niko Sigur"
    ],
    "MF": [
      "Mathieu Choinière",
      "Stephen Eustáquio",
      "Ismaël Koné",
      "Liam Millar",
      "Jacob Shaffelburg",
      "Jonathan Osorio",
      "Nathan Saliba"
    ],
    "FW": [
      "Cyle Larin",
      "Jonathan David",
      "Tani Oluwaseyi",
      "Tajon Buchanan",
      "Ali Ahmed",
      "Promise David"
    ]
  },
  "Qatar": {
    "GK": [
      "Mahmud Abunada",
      "Salah Zakaria",
      "Meshaal Barsham"
    ],
    "DF": [
      "Pedro Miguel",
      "Lucas Mendes",
      "Issa Laye",
      "Jassem Gaber",
      "Ayoub Al-Oui",
      "Homam Ahmed",
      "Boualem Khoukhi",
      "Sultan Al-Brake",
      "Al-Hashmi Al-Hussain"
    ],
    "MF": [
      "Abdulaziz Hatem",
      "Karim Boudiaf",
      "Ahmed Al-Ganehi",
      "Ahmed Fathy",
      "Assim Madibo"
    ],
    "FW": [
      "Ahmed Alaaeldin",
      "Edmilson Junior",
      "Mohammed Muntari",
      "Hassan Al-Haydos",
      "Akram Afif",
      "Yusuf Abdurisag",
      "Almoez Ali",
      "Tahsin Jamshid",
      "Mohamed Manai"
    ]
  },
  "Switzerland": {
    "GK": [
      "Gregor Kobel",
      "Yvon Mvogo",
      "Marvin Keller"
    ],
    "DF": [
      "Miro Muheim",
      "Silvan Widmer",
      "Nico Elvedi",
      "Manuel Akanji",
      "Ricardo Rodriguez",
      "Eray Cömert",
      "Aurèle Amenda",
      "Luca Jaquez"
    ],
    "MF": [
      "Denis Zakaria",
      "Remo Freuler",
      "Johan Manzambi",
      "Granit Xhaka",
      "Ardon Jashari",
      "Djibril Sow",
      "Michel Aebischer",
      "Fabian Rieder"
    ],
    "FW": [
      "Breel Embolo",
      "Dan Ndoye",
      "Christian Fassnacht",
      "Rubén Vargas",
      "Noah Okafor",
      "Zeki Amdouni",
      "Cedric Itten"
    ]
  },
  "Brazil": {
    "GK": [
      "Alisson",
      "Weverton",
      "Ederson"
    ],
    "DF": [
      "Wesley",
      "Gabriel Magalhães",
      "Marquinhos",
      "Alex Sandro",
      "Danilo Luiz",
      "Bremer",
      "Léo Pereira",
      "Douglas Santos",
      "Roger Ibañez"
    ],
    "MF": [
      "Casemiro",
      "Bruno Guimarães",
      "Fabinho",
      "Danilo Santos",
      "Lucas Paquetá"
    ],
    "FW": [
      "Vinícius Júnior",
      "Matheus Cunha",
      "Neymar",
      "Raphinha",
      "Endrick",
      "Luiz Henrique",
      "Gabriel Martinelli",
      "Igor Thiago",
      "Rayan"
    ]
  },
  "Haiti": {
    "GK": [
      "Johny Placide",
      "Alexandre Pierre",
      "Josué Duverger"
    ],
    "DF": [
      "Carlens Arcus",
      "Keeto Thermoncy",
      "Ricardo Adé",
      "Hannes Delcroix",
      "Martin Expérience",
      "Duke Lacroix",
      "Jean-Kévin Duverne",
      "Wilguens Paugain"
    ],
    "MF": [
      "Carl Sainté",
      "Jean-Ricner Bellegarde",
      "Leverton Pierre",
      "Danley Jean Jacques",
      "Dominique Simon",
      "Woodensky Pierre"
    ],
    "FW": [
      "Derrick Etienne Jr.",
      "Duckens Nazon",
      "Louicius Deedson",
      "Ruben Providence",
      "Lenny Joseph",
      "Wilson Isidor",
      "Yassin Fortuné",
      "Frantzdy Pierrot",
      "Josué Casimir"
    ]
  },
  "Morocco": {
    "GK": [
      "Yassine Bounou",
      "Munir Mohamedi",
      "Ahmed Reda Tagnaouti"
    ],
    "DF": [
      "Achraf Hakimi",
      "Noussair Mazraoui",
      "Nayef Aguerd",
      "Zakaria El Ouahdi",
      "Issa Diop",
      "Chadi Riad",
      "Youssef Belammari",
      "Redouane Halhal",
      "Anass Salah-Eddine"
    ],
    "MF": [
      "Sofyan Amrabat",
      "Ayyoub Bouaddi",
      "Chemsdine Talbi",
      "Azzedine Ounahi",
      "Ismael Saibari",
      "Samir El Mourabet",
      "Gessime Yassine",
      "Bilal El Khannouss",
      "Neil El Aynaoui"
    ],
    "FW": [
      "Soufiane Rahimi",
      "Brahim Díaz",
      "Abde Ezzalzouli",
      "Ayoub El Kaabi",
      "Ayoube Amaimouni"
    ]
  },
  "Scotland": {
    "GK": [
      "Angus Gunn",
      "Liam Kelly",
      "Craig Gordon"
    ],
    "DF": [
      "Aaron Hickey",
      "Andy Robertson",
      "Grant Hanley",
      "Kieran Tierney",
      "Jack Hendry",
      "John Souttar",
      "Dominic Hyam",
      "Nathan Patterson",
      "Anthony Ralston",
      "Scott McKenna"
    ],
    "MF": [
      "Scott McTominay",
      "John McGinn",
      "Tyler Fletcher",
      "Ryan Christie",
      "Lewis Ferguson",
      "Kenny McLean"
    ],
    "FW": [
      "Lyndon Dykes",
      "Ché Adams",
      "Ross Stewart",
      "Ben Gannon-Doak",
      "George Hirst",
      "Lawrence Shankland",
      "Findlay Curtis"
    ]
  },
  "Australia": {
    "GK": [
      "Mathew Ryan",
      "Paul Izzo",
      "Patrick Beach"
    ],
    "DF": [
      "Miloš Degenek",
      "Alessandro Circati",
      "Jacob Italiano",
      "Jordan Bos",
      "Jason Geria",
      "Kai Trewin",
      "Aziz Behich",
      "Harry Souttar",
      "Cameron Burgess",
      "Lucas Herrington"
    ],
    "MF": [
      "Connor Metcalfe",
      "Aiden O'Neill",
      "Cammy Devlin",
      "Jackson Irvine",
      "Paul Okon-Engstler"
    ],
    "FW": [
      "Mathew Leckie",
      "Mohamed Touré",
      "Ajdin Hrustic",
      "Awer Mabil",
      "Nestory Irankunda",
      "Cristian Volpato",
      "Nishan Velupillay",
      "Tete Yengi"
    ]
  },
  "Paraguay": {
    "GK": [
      "Gatito Fernández",
      "Orlando Gill",
      "Gastón Olveira"
    ],
    "DF": [
      "Gustavo Velázquez",
      "Omar Alderete",
      "Juan José Cáceres",
      "Fabián Balbuena",
      "Júnior Alonso",
      "José Canale",
      "Gustavo Gómez",
      "Alexandro Maidana"
    ],
    "MF": [
      "Ramón Sosa",
      "Diego Gómez",
      "Miguel Almirón",
      "Maurício",
      "Andrés Cubas",
      "Damián Bobadilla",
      "Braian Ojeda",
      "Matías Galarza",
      "Gustavo Caballero"
    ],
    "FW": [
      "Antonio Sanabria",
      "Kaku",
      "Álex Arce",
      "Julio Enciso",
      "Gabriel Ávalos",
      "Isidro Pitta"
    ]
  },
  "Turkey": {
    "GK": [
      "Mert Günok",
      "Altay Bayındır",
      "Uğurcan Çakır"
    ],
    "DF": [
      "Zeki Çelik",
      "Merih Demiral",
      "Çağlar Söyüncü",
      "Eren Elmalı",
      "Abdülkerim Bardakcı",
      "Ozan Kabak",
      "Mert Müldür",
      "Ferdi Kadıoğlu",
      "Samet Akaydin"
    ],
    "MF": [
      "Salih Özcan",
      "Orkun Kökçü",
      "Hakan Çalhanoğlu",
      "İsmail Yüksek",
      "Kaan Ayhan"
    ],
    "FW": [
      "Kerem Aktürkoğlu",
      "Arda Güler",
      "Deniz Gül",
      "Kenan Yıldız",
      "İrfan Can Kahveci",
      "Yunus Akgün",
      "Barış Alper Yılmaz",
      "Oğuz Aydın",
      "Can Uzun"
    ]
  },
  "United States": {
    "GK": [
      "Matt Turner",
      "Matt Freese",
      "Chris Brady"
    ],
    "DF": [
      "Sergiño Dest",
      "Chris Richards",
      "Antonee Robinson",
      "Auston Trusty",
      "Miles Robinson",
      "Tim Ream",
      "Alex Freeman",
      "Maximilian Arfsten",
      "Mark McKenzie",
      "Joe Scally"
    ],
    "MF": [
      "Tyler Adams",
      "Giovanni Reyna",
      "Weston McKennie",
      "Sebastian Berhalter",
      "Cristian Roldan",
      "Malik Tillman"
    ],
    "FW": [
      "Ricardo Pepi",
      "Christian Pulisic",
      "Brenden Aaronson",
      "Haji Wright",
      "Folarin Balogun",
      "Timothy Weah",
      "Alejandro Zendejas"
    ]
  },
  "Curaçao": {
    "GK": [
      "Eloy Room",
      "Tyrick Bodak",
      "Trevor Doornbusch"
    ],
    "DF": [
      "Shurandy Sambo",
      "Juriën Gaari",
      "Roshon van Eijma",
      "Sherel Floranus",
      "Armando Obispo",
      "Joshua Brenet",
      "Riechedly Bazoer",
      "Deveron Fonville"
    ],
    "MF": [
      "Godfried Roemeratoe",
      "Juninho Bacuna",
      "Livano Comenencia",
      "Leandro Bacuna",
      "Ar'jany Martha",
      "Tahith Chong",
      "Kevin Felida"
    ],
    "FW": [
      "Jürgen Locadia",
      "Jeremy Antonisse",
      "Sontje Hansen",
      "Tyrese Noslin",
      "Kenji Gorré",
      "Jearl Margaritha",
      "Brandley Kuwas",
      "Gervane Kastaneer"
    ]
  },
  "Ecuador": {
    "GK": [
      "Hernán Galíndez",
      "Moisés Ramírez",
      "Gonzalo Valle"
    ],
    "DF": [
      "Félix Torres",
      "Piero Hincapié",
      "Joel Ordóñez",
      "Willian Pacho",
      "Pervis Estupiñán",
      "Ángelo Preciado",
      "Jackson Porozo",
      "Yaimar Medina"
    ],
    "MF": [
      "Jordy Alcívar",
      "Anthony Valencia",
      "Kendry Páez",
      "Alan Minda",
      "Pedro Vite",
      "Denil Castillo",
      "Alan Franco",
      "Moisés Caicedo"
    ],
    "FW": [
      "John Yeboah",
      "Kevin Rodríguez",
      "Enner Valencia",
      "Jordy Caicedo",
      "Gonzalo Plata",
      "Nilson Angulo",
      "Jeremy Arévalo"
    ]
  },
  "Germany": {
    "GK": [
      "Manuel Neuer",
      "Oliver Baumann",
      "Alexander Nübel"
    ],
    "DF": [
      "Antonio Rüdiger",
      "Waldemar Anton",
      "Jonathan Tah",
      "Joshua Kimmich",
      "Nico Schlotterbeck",
      "Nathaniel Brown",
      "David Raum",
      "Malick Thiaw"
    ],
    "MF": [
      "Aleksandar Pavlović",
      "Leon Goretzka",
      "Jamie Leweling",
      "Jamal Musiala",
      "Pascal Groß",
      "Angelo Stiller",
      "Florian Wirtz",
      "Leroy Sané",
      "Nadiem Amiri",
      "Felix Nmecha",
      "Assan Ouédraogo"
    ],
    "FW": [
      "Kai Havertz",
      "Nick Woltemade",
      "Maximilian Beier",
      "Deniz Undav"
    ]
  },
  "Ivory Coast": {
    "GK": [
      "Yahia Fofana",
      "Mohamed Koné",
      "Alban Lafont"
    ],
    "DF": [
      "Ousmane Diomande",
      "Ghislain Konan",
      "Wilfried Singo",
      "Odilon Kossounou",
      "Christopher Opéri",
      "Guéla Doué",
      "Emmanuel Agbadou",
      "Evan Ndicka"
    ],
    "MF": [
      "Jean Michaël Seri",
      "Seko Fofana",
      "Franck Kessié",
      "Ibrahim Sangaré",
      "Parfait Guiagon",
      "Christ Inao Oulaï"
    ],
    "FW": [
      "Ange-Yoan Bonny",
      "Simon Adingra",
      "Yan Diomande",
      "Elye Wahi",
      "Oumar Diakité",
      "Amad Diallo",
      "Nicolas Pépé",
      "Evann Guessand",
      "Bazoumana Touré"
    ]
  },
  "Japan": {
    "GK": [
      "Zion Suzuki",
      "Keisuke Ōsako",
      "Tomoki Hayakawa"
    ],
    "DF": [
      "Yukinari Sugawara",
      "Shōgo Taniguchi",
      "Kō Itakura",
      "Yūto Nagatomo",
      "Tsuyoshi Watanabe",
      "Ayumu Seko",
      "Hiroki Itō",
      "Takehiro Tomiyasu",
      "Junnosuke Suzuki"
    ],
    "MF": [
      "Wataru Endo",
      "Ao Tanaka",
      "Takefusa Kubo",
      "Ritsu Dōan",
      "Daizen Maeda",
      "Keito Nakamura",
      "Junya Itō",
      "Daichi Kamada",
      "Yuito Suzuki",
      "Kaishū Sano"
    ],
    "FW": [
      "Keisuke Gotō",
      "Ayase Ueda",
      "Kōki Ogawa",
      "Kento Shiogai"
    ]
  },
  "Netherlands": {
    "GK": [
      "Bart Verbruggen",
      "Robin Roefs",
      "Mark Flekken"
    ],
    "DF": [
      "Jurriën Timber",
      "Virgil van Dijk",
      "Nathan Aké",
      "Jan Paul van Hecke",
      "Mats Wieffer",
      "Micky van de Ven",
      "Denzel Dumfries",
      "Jorrel Hato"
    ],
    "MF": [
      "Marten de Roon",
      "Justin Kluivert",
      "Ryan Gravenberch",
      "Tijjani Reijnders",
      "Guus Til",
      "Teun Koopmeiners",
      "Frenkie de Jong",
      "Quinten Timber"
    ],
    "FW": [
      "Wout Weghorst",
      "Memphis Depay",
      "Cody Gakpo",
      "Noa Lang",
      "Donyell Malen",
      "Brian Brobbey",
      "Crysencio Summerville"
    ]
  },
  "Sweden": {
    "GK": [
      "Jacob Widell Zetterström",
      "Viktor Johansson",
      "Kristoffer Nordfeldt"
    ],
    "DF": [
      "Gustaf Lagerbielke",
      "Victor Lindelöf",
      "Isak Hien",
      "Gabriel Gudmundsson",
      "Herman Johansson",
      "Daniel Svensson",
      "Hjalmar Ekdal",
      "Carl Starfelt",
      "Eric Smith",
      "Alexander Bernhardsson",
      "Elliot Stroud"
    ],
    "MF": [
      "Lucas Bergvall",
      "Benjamin Nygren",
      "Ken Sema",
      "Jesper Karlström",
      "Yasin Ayari",
      "Mattias Svanberg",
      "Besfort Zeneli"
    ],
    "FW": [
      "Alexander Isak",
      "Anthony Elanga",
      "Viktor Gyökeres",
      "Gustaf Nilsson",
      "Taha Ali"
    ]
  },
  "Tunisia": {
    "GK": [
      "Mouhib Chamakh",
      "Aymen Dahmen",
      "Sabri Ben Hessen"
    ],
    "DF": [
      "Ali Abdi",
      "Montassar Talbi",
      "Omar Rekik",
      "Adem Arous",
      "Dylan Bronn",
      "Mortadha Ben Ouanes",
      "Yan Valery",
      "Mohamed Amine Ben Hamida",
      "Moutaz Neffati",
      "Raed Chikhaoui"
    ],
    "MF": [
      "Hannibal Mejbri",
      "Ismaël Gharbi",
      "Rani Khedira",
      "Khalil Ayari",
      "Hadj Mahmoud",
      "Ellyes Skhiri",
      "Anis Ben Slimane",
      "Sebastian Tounekti"
    ],
    "FW": [
      "Elias Achouri",
      "Elias Saad",
      "Hazem Mastouri",
      "Rayan Elloumi",
      "Firas Chaouat"
    ]
  },
  "Belgium": {
    "GK": [
      "Thibaut Courtois",
      "Senne Lammens",
      "Mike Penders"
    ],
    "DF": [
      "Zeno Debast",
      "Arthur Theate",
      "Brandon Mechele",
      "Maxim De Cuyper",
      "Thomas Meunier",
      "Koni De Winter",
      "Joaquin Seys",
      "Timothy Castagne",
      "Nathan Ngoy"
    ],
    "MF": [
      "Axel Witsel",
      "Kevin De Bruyne",
      "Youri Tielemans",
      "Diego Moreira",
      "Hans Vanaken",
      "Alexis Saelemaekers",
      "Nicolas Raskin",
      "Amadou Onana"
    ],
    "FW": [
      "Romelu Lukaku",
      "Leandro Trossard",
      "Jérémy Doku",
      "Dodi Lukébakio",
      "Charles De Ketelaere",
      "Matias Fernandez-Pardo"
    ]
  },
  "Egypt": {
    "GK": [
      "Mohamed El Shenawy",
      "El Mahdy Soliman",
      "Mostafa Shobeir",
      "Mohamed Alaa"
    ],
    "DF": [
      "Yasser Ibrahim",
      "Mohamed Hany",
      "Hossam Abdelmaguid",
      "Ramy Rabia",
      "Mohamed Abdelmonem",
      "Ahmed Fatouh",
      "Karim Hafez",
      "Tarek Alaa"
    ],
    "MF": [
      "Emam Ashour",
      "Mostafa Ziko",
      "Hamdy Fathy",
      "Mohanad Lasheen",
      "Nabil Emad",
      "Marwan Attia",
      "Mahmoud Saber"
    ],
    "FW": [
      "Trézéguet",
      "Hamza Abdelkarim",
      "Mohamed Salah",
      "Haissem Hassan",
      "Ibrahim Adel",
      "Omar Marmoush",
      "Zizo"
    ]
  },
  "Iran": {
    "GK": [
      "Alireza Beiranvand",
      "Payam Niazmand",
      "Hossein Hosseini"
    ],
    "DF": [
      "Saleh Hardani",
      "Ehsan Hajsafi",
      "Shojae Khalilzadeh",
      "Milad Mohammadi",
      "Hossein Kanaanizadegan",
      "Aria Yousefi",
      "Ali Nemati",
      "Ramin Rezaeian",
      "Danial Eiri"
    ],
    "MF": [
      "Saeid Ezatolahi",
      "Alireza Jahanbakhsh",
      "Mohammad Mohebi",
      "Saman Ghoddos",
      "Rouzbeh Cheshmi",
      "Mehdi Torabi",
      "Mohammad Ghorbani",
      "Amirmohammad Razzaghinia"
    ],
    "FW": [
      "Mehdi Taremi",
      "Mehdi Ghayedi",
      "Ali Alipour",
      "Amirhossein Hosseinzadeh",
      "Shahriyar Moghanlou",
      "Dennis Eckert"
    ]
  },
  "New Zealand": {
    "GK": [
      "Max Crocombe",
      "Alex Paulsen",
      "Michael Woud"
    ],
    "DF": [
      "Tim Payne",
      "Francis de Vries",
      "Tyler Bindon",
      "Michael Boxall",
      "Liberato Cacace",
      "Nando Pijnaker",
      "Finn Surman",
      "Callan Elliot",
      "Tommy Smith"
    ],
    "MF": [
      "Joe Bell",
      "Matthew Garbett",
      "Marko Stamenić",
      "Sarpreet Singh",
      "Elijah Just",
      "Alex Rufer",
      "Ben Old",
      "Callum McCowatt",
      "Ryan Thomas",
      "Lachlan Bayliss"
    ],
    "FW": [
      "Chris Wood",
      "Kosta Barbarouses",
      "Ben Waine",
      "Jesse Randall"
    ]
  },
  "Cape Verde": {
    "GK": [
      "Vozinha",
      "Márcio Rosa",
      "CJ dos Santos"
    ],
    "DF": [
      "Stopira",
      "Diney",
      "Roberto Lopes",
      "Logan Costa",
      "Sidny Lopes Cabral",
      "Steven Moreira",
      "Wagner Pina",
      "Kelvin Pires"
    ],
    "MF": [
      "Kevin Pina",
      "Jovane Cabral",
      "João Paulo",
      "Jamiro Monteiro",
      "Garry Rodrigues",
      "Deroy Duarte",
      "Laros Duarte",
      "Yannick Semedo",
      "Willy Semedo",
      "Telmo Arcanjo",
      "Nuno da Costa",
      "Hélio Varela"
    ],
    "FW": [
      "Gilson Benchimol",
      "Dailon Livramento",
      "Ryan Mendes"
    ]
  },
  "Saudi Arabia": {
    "GK": [
      "Nawaf Al-Aqidi",
      "Mohammed Al-Owais",
      "Ahmed Al-Kassar"
    ],
    "DF": [
      "Ali Majrashi",
      "Ali Lajami",
      "Abdulelah Al-Amri",
      "Hassan Al-Tambakti",
      "Saud Abdulhamid",
      "Nawaf Boushal",
      "Hassan Kadesh",
      "Moteb Al-Harbi",
      "Jehad Thakri",
      "Mohammed Abu Al-Shamat"
    ],
    "MF": [
      "Nasser Al-Dawsari",
      "Musab Al-Juwayr",
      "Abdullah Al-Khaibari",
      "Ziyad Al-Johani",
      "Alaa Al-Hejji",
      "Mohamed Kanno"
    ],
    "FW": [
      "Ayman Yahya",
      "Firas Al-Buraikan",
      "Salem Al-Dawsari",
      "Saleh Al-Shehri",
      "Khalid Al-Ghannam",
      "Abdullah Al-Hamdan",
      "Sultan Mandash"
    ]
  },
  "Spain": {
    "GK": [
      "David Raya",
      "Joan Garcia",
      "Unai Simón"
    ],
    "DF": [
      "Marc Pubill",
      "Álex Grimaldo",
      "Eric García",
      "Marcos Llorente",
      "Pedro Porro",
      "Aymeric Laporte",
      "Pau Cubarsí",
      "Marc Cucurella"
    ],
    "MF": [
      "Mikel Merino",
      "Fabián Ruiz",
      "Gavi",
      "Álex Baena",
      "Rodri",
      "Martín Zubimendi",
      "Pedri"
    ],
    "FW": [
      "Ferran Torres",
      "Dani Olmo",
      "Yéremy Pino",
      "Nico Williams",
      "Lamine Yamal",
      "Mikel Oyarzabal",
      "Víctor Muñoz",
      "Borja Iglesias"
    ]
  },
  "Uruguay": {
    "GK": [
      "Sergio Rochet",
      "Santiago Mele",
      "Fernando Muslera"
    ],
    "DF": [
      "José Giménez",
      "Sebastián Cáceres",
      "Ronald Araújo",
      "Guillermo Varela",
      "Mathías Olivera",
      "Matías Viña",
      "Santiago Bueno"
    ],
    "MF": [
      "Manuel Ugarte",
      "Rodrigo Bentancur",
      "Nicolás de la Cruz",
      "Federico Valverde",
      "Giorgian de Arrascaeta",
      "Agustín Canobbio",
      "Emiliano Martínez",
      "Maximiliano Araújo",
      "Joaquín Piquerez",
      "Juan Manuel Sanabria",
      "Rodrigo Zalazar"
    ],
    "FW": [
      "Darwin Núñez",
      "Facundo Pellistri",
      "Brian Rodríguez",
      "Rodrigo Aguirre",
      "Federico Viñas"
    ]
  },
  "France": {
    "GK": [
      "Brice Samba",
      "Mike Maignan",
      "Robin Risser"
    ],
    "DF": [
      "Malo Gusto",
      "Lucas Digne",
      "Dayot Upamecano",
      "Jules Koundé",
      "Ibrahima Konaté",
      "William Saliba",
      "Théo Hernandez",
      "Lucas Hernandez",
      "Maxence Lacroix"
    ],
    "MF": [
      "Manu Koné",
      "Aurélien Tchouaméni",
      "N'Golo Kanté",
      "Adrien Rabiot",
      "Warren Zaïre-Emery",
      "Rayan Cherki",
      "Maghnes Akliouche"
    ],
    "FW": [
      "Ousmane Dembélé",
      "Marcus Thuram",
      "Kylian Mbappé",
      "Michael Olise",
      "Bradley Barcola",
      "Désiré Doué",
      "Jean-Philippe Mateta"
    ]
  },
  "Iraq": {
    "GK": [
      "Fahad Talib",
      "Jalal Hassan",
      "Ahmed Basil"
    ],
    "DF": [
      "Rebin Sulaka",
      "Hussein Ali",
      "Zaid Tahseen",
      "Akam Hashim",
      "Manaf Younis",
      "Ahmed Yahya",
      "Merchas Doski",
      "Mustafa Saadoon",
      "Frans Putros"
    ],
    "MF": [
      "Youssef Amyn",
      "Ibrahim Bayesh",
      "Zidane Iqbal",
      "Amir Al-Ammari",
      "Kevin Yakob",
      "Aimar Sher",
      "Zaid Ismail"
    ],
    "FW": [
      "Ali Al-Hamadi",
      "Mohanad Ali",
      "Ahmed Qasem",
      "Ali Yousif",
      "Ali Jasim",
      "Aymen Hussein",
      "Marko Farji"
    ]
  },
  "Norway": {
    "GK": [
      "Ørjan Nyland",
      "Sander Tangvik",
      "Egil Selvik"
    ],
    "DF": [
      "Kristoffer Ajer",
      "Leo Østigård",
      "David Møller Wolfe",
      "Fredrik André Bjørkan",
      "Marcus Holmgren Pedersen",
      "Torbjørn Heggem",
      "Sondre Langås",
      "Henrik Falchener"
    ],
    "MF": [
      "Morten Thorsby",
      "Patrick Berg",
      "Sander Berge",
      "Martin Ødegaard",
      "Fredrik Aursnes",
      "Kristian Thorstvedt",
      "Thelo Aasgaard",
      "Andreas Schjelderup",
      "Oscar Bobb",
      "Jens Petter Hauge"
    ],
    "FW": [
      "Alexander Sørloth",
      "Erling Haaland",
      "Jørgen Strand Larsen",
      "Antonio Nusa",
      "Julian Ryerson"
    ]
  },
  "Senegal": {
    "GK": [
      "Yehvann Diouf",
      "Édouard Mendy",
      "Mory Diaw"
    ],
    "DF": [
      "Mamadou Sarr",
      "Kalidou Koulibaly",
      "Abdoulaye Seck",
      "Ismail Jakobs",
      "Krépin Diatta",
      "Moussa Niakhaté",
      "Antoine Mendy",
      "El Hadji Malick Diouf"
    ],
    "MF": [
      "Idrissa Gueye",
      "Pathé Ciss",
      "Lamine Camara",
      "Pape Matar Sarr",
      "Habib Diarra",
      "Bara Sapoko Ndiaye",
      "Pape Gueye"
    ],
    "FW": [
      "Assane Diao",
      "Bamba Dieng",
      "Sadio Mané",
      "Nicolas Jackson",
      "Cherif Ndiaye",
      "Iliman Ndiaye",
      "Ismaïla Sarr",
      "Ibrahim Mbaye"
    ]
  },
  "Algeria": {
    "GK": [
      "Melvin Mastil",
      "Oussama Benbot",
      "Luca Zidane"
    ],
    "DF": [
      "Aïssa Mandi",
      "Achref Abada",
      "Mohamed Amine Tougai",
      "Zineddine Belaïd",
      "Jaouen Hadjam",
      "Rayan Aït-Nouri",
      "Rafik Belghali",
      "Ramy Bensebaini",
      "Samir Chergui"
    ],
    "MF": [
      "Ramiz Zerrouki",
      "Houssem Aouar",
      "Farès Chaïbi",
      "Hicham Boudaoui",
      "Nabil Bentaleb",
      "Ibrahim Maza",
      "Yacine Titraoui"
    ],
    "FW": [
      "Riyad Mahrez",
      "Amine Gouiri",
      "Anis Hadj Moussa",
      "Nadhir Benbouali",
      "Mohamed Amoura",
      "Adil Boulbina",
      "Farès Ghedjemis"
    ]
  },
  "Argentina": {
    "GK": [
      "Juan Musso",
      "Gerónimo Rulli",
      "Emiliano Martínez"
    ],
    "DF": [
      "Leonardo Balerdi",
      "Nicolás Tagliafico",
      "Gonzalo Montiel",
      "Lisandro Martínez",
      "Cristian Romero",
      "Nicolás Otamendi",
      "Facundo Medina",
      "Nahuel Molina"
    ],
    "MF": [
      "Leandro Paredes",
      "Rodrigo De Paul",
      "Valentín Barco",
      "Giovani Lo Celso",
      "Exequiel Palacios",
      "Nicolás González",
      "Alexis Mac Allister",
      "Enzo Fernández"
    ],
    "FW": [
      "Julián Alvarez",
      "Lionel Messi",
      "Thiago Almada",
      "Giuliano Simeone",
      "Nico Paz",
      "José Manuel López",
      "Lautaro Martínez"
    ]
  },
  "Austria": {
    "GK": [
      "Alexander Schlager",
      "Florian Wiegele",
      "Patrick Pentz"
    ],
    "DF": [
      "David Affengruber",
      "Kevin Danso",
      "Stefan Posch",
      "David Alaba",
      "Philipp Lienhart",
      "Phillipp Mwene",
      "Marco Friedl",
      "Michael Svoboda"
    ],
    "MF": [
      "Xaver Schlager",
      "Nicolas Seiwald",
      "Marcel Sabitzer",
      "Florian Grillitsch",
      "Carney Chukwuemeka",
      "Romano Schmid",
      "Konrad Laimer",
      "Alexander Prass",
      "Paul Wanner",
      "Alessandro Schöpf"
    ],
    "FW": [
      "Marko Arnautović",
      "Michael Gregoritsch",
      "Saša Kalajdžić",
      "Patrick Wimmer"
    ]
  },
  "Jordan": {
    "GK": [
      "Yazeed Abulaila",
      "Nour Bani Attiah",
      "Abdallah Al-Fakhouri"
    ],
    "DF": [
      "Mohammad Abu Hashish",
      "Abdallah Nasib",
      "Husam Abu Dahab",
      "Yazan Al-Arab",
      "Mo Abualnadi",
      "Salim Obaid",
      "Saed Al-Rosan",
      "Ihsan Haddad",
      "Anas Badawi"
    ],
    "MF": [
      "Amer Jamous",
      "Noor Al-Rawabdeh",
      "Rajaei Ayed",
      "Ibrahim Sadeh",
      "Mohannad Abu Taha",
      "Nizar Al-Rashdan",
      "Mohammad Al-Dawoud"
    ],
    "FW": [
      "Mohammad Abu Zrayq",
      "Ali Olwan",
      "Musa Al-Taamari",
      "Odeh Al-Fakhouri",
      "Mahmoud Al-Mardi",
      "Ali Azaizeh"
    ]
  },
  "Colombia": {
    "GK": [
      "David Ospina",
      "Camilo Vargas",
      "Álvaro Montero"
    ],
    "DF": [
      "Daniel Muñoz",
      "Jhon Lucumí",
      "Santiago Arias",
      "Yerry Mina",
      "Gustavo Puerta",
      "Johan Mojica",
      "Willer Ditta",
      "Deiver Machado",
      "Davinson Sánchez"
    ],
    "MF": [
      "Kevin Castaño",
      "Richard Ríos",
      "Jorge Carrascal",
      "James Rodríguez",
      "Jhon Arias",
      "Juan Portilla",
      "Jefferson Lerma",
      "Juan Fernando Quintero"
    ],
    "FW": [
      "Luis Díaz",
      "Jhon Córdoba",
      "Cucho Hernández",
      "Jaminton Campaz",
      "Luis Suárez",
      "Andrés Gómez"
    ]
  },
  "DR Congo": {
    "GK": [
      "Lionel Mpasi",
      "Timothy Fayulu",
      "Matthieu Epolo"
    ],
    "DF": [
      "Aaron Wan-Bissaka",
      "Steve Kapuadi",
      "Axel Tuanzebe",
      "Dylan Batubinsika",
      "Joris Kayembe",
      "Chancel Mbemba",
      "Gédéon Kalulu",
      "Arthur Masuaku"
    ],
    "MF": [
      "Ngal'ayel Mukau",
      "Nathanaël Mbuku",
      "Samuel Moutoussamy",
      "Théo Bongonda",
      "Noah Sadiki",
      "Aaron Tshibola",
      "Charles Pickel",
      "Edo Kayembe"
    ],
    "FW": [
      "Brian Cipenga",
      "Gaël Kakuta",
      "Meschak Elia",
      "Cédric Bakambu",
      "Fiston Mayele",
      "Yoane Wissa",
      "Simon Banza"
    ]
  },
  "Portugal": {
    "GK": [
      "Diogo Costa",
      "José Sá",
      "Rui Silva"
    ],
    "DF": [
      "Nélson Semedo",
      "Rúben Dias",
      "Tomás Araújo",
      "Diogo Dalot",
      "Renato Veiga",
      "Gonçalo Inácio",
      "João Cancelo",
      "Samú Costa",
      "Nuno Mendes"
    ],
    "MF": [
      "Matheus Nunes",
      "Bruno Fernandes",
      "Bernardo Silva",
      "João Neves",
      "Rúben Neves",
      "Vitinha"
    ],
    "FW": [
      "Cristiano Ronaldo",
      "Gonçalo Ramos",
      "João Félix",
      "Francisco Trincão",
      "Rafael Leão",
      "Pedro Neto",
      "Gonçalo Guedes",
      "Francisco Conceição"
    ]
  },
  "Uzbekistan": {
    "GK": [
      "Utkir Yusupov",
      "Abduvohid Nematov",
      "Botirali Ergashev"
    ],
    "DF": [
      "Abdukodir Khusanov",
      "Khojiakbar Alijonov",
      "Farrukh Sayfiev",
      "Rustam Ashurmatov",
      "Sherzod Nasrullaev",
      "Umar Eshmurodov",
      "Abdulla Abdullaev",
      "Bekhruz Karimov",
      "Avazbek Ulmasaliev",
      "Jakhongir Urozov"
    ],
    "MF": [
      "Akmal Mozgovoy",
      "Otabek Shukurov",
      "Jamshid Iskanderov",
      "Odiljon Hamrobekov",
      "Jaloliddin Masharipov",
      "Oston Urunov",
      "Dostonbek Khamdamov",
      "Azizjon Ganiev",
      "Abbosbek Fayzullaev",
      "Sherzod Esanov"
    ],
    "FW": [
      "Eldor Shomurodov",
      "Azizbek Amonov",
      "Igor Sergeev"
    ]
  },
  "Croatia": {
    "GK": [
      "Dominik Livaković",
      "Ivor Pandur",
      "Dominik Kotarski"
    ],
    "DF": [
      "Josip Stanišić",
      "Marin Pongračić",
      "Joško Gvardiol",
      "Duje Ćaleta-Car",
      "Josip Šutalo",
      "Kristijan Jakić",
      "Luka Vušković",
      "Martin Erlić"
    ],
    "MF": [
      "Nikola Moro",
      "Mateo Kovačić",
      "Luka Modrić",
      "Nikola Vlašić",
      "Mario Pašalić",
      "Martin Baturina",
      "Petar Sučić",
      "Toni Fruk",
      "Luka Sučić"
    ],
    "FW": [
      "Andrej Kramarić",
      "Ante Budimir",
      "Ivan Perišić",
      "Igor Matanović",
      "Marco Pašalić",
      "Petar Musa"
    ]
  },
  "England": {
    "GK": [
      "Jordan Pickford",
      "Dean Henderson",
      "James Trafford"
    ],
    "DF": [
      "Ezri Konsa",
      "Nico O'Reilly",
      "John Stones",
      "Marc Guéhi",
      "Tino Livramento",
      "Dan Burn",
      "Reece James",
      "Djed Spence",
      "Jarell Quansah"
    ],
    "MF": [
      "Declan Rice",
      "Elliot Anderson",
      "Jude Bellingham",
      "Jordan Henderson",
      "Kobbie Mainoo",
      "Morgan Rogers",
      "Eberechi Eze"
    ],
    "FW": [
      "Bukayo Saka",
      "Harry Kane",
      "Marcus Rashford",
      "Anthony Gordon",
      "Ollie Watkins",
      "Noni Madueke",
      "Ivan Toney"
    ]
  },
  "Ghana": {
    "GK": [
      "Lawrence Ati-Zigi",
      "Joseph Anang",
      "Benjamin Asare"
    ],
    "DF": [
      "Alidu Seidu",
      "Jonas Adjetey",
      "Abdul Mumin",
      "Gideon Mensah",
      "Abdul Rahman Baba",
      "Jerome Opoku",
      "Kojo Peprah Oppong",
      "Derrick Luckassen",
      "Marvin Senaya"
    ],
    "MF": [
      "Caleb Yirenkyi",
      "Thomas Partey",
      "Kwasi Sibo",
      "Antoine Semenyo",
      "Elisha Owusu",
      "Augustine Boakye"
    ],
    "FW": [
      "Abdul Fatawu",
      "Jordan Ayew",
      "Brandon Thomas-Asante",
      "Christopher Bonsu Baah",
      "Iñaki Williams",
      "Kamaldeen Sulemana",
      "Ernest Nuamah",
      "Prince Kwabena Adu"
    ]
  },
  "Panama": {
    "GK": [
      "Luis Mejía",
      "César Samudio",
      "Orlando Mosquera"
    ],
    "DF": [
      "César Blackman",
      "José Córdoba",
      "Fidel Escobar",
      "Edgardo Fariña",
      "Jiovany Ramos",
      "Carlos Harvey",
      "Eric Davis",
      "Andrés Andrade",
      "Michael Amir Murillo",
      "Roderick Miller",
      "Jorge Gutiérrez"
    ],
    "MF": [
      "Cristian Martínez",
      "José Luis Rodríguez",
      "Adalberto Carrasquilla",
      "Ismael Díaz",
      "Yoel Bárcenas",
      "Alberto Quintero",
      "Aníbal Godoy",
      "César Yanis"
    ],
    "FW": [
      "Tomás Rodríguez",
      "José Fajardo",
      "Cecilio Waterman",
      "Azarias Londoño"
    ]
  }
};

export default squads;
