export interface JourneyNodeData {
  id: string;
  node_id?: string;
  date: string;
  title: string;
  desc: string;
  image?: string;
  link?: string;
  icon?: string;
  sort_order?: number;
}

export const DEFAULT_JOURNEY_NODES: JourneyNodeData[] = [
  {
    id: "01",
    node_id: "01",
    date: "AUG 2019",
    title: "THE BEGINNING",
    desc: "Chapter established as a non-profit for community engineering.",
    icon: "Flag",
    sort_order: 1
  },
  {
    id: "founder",
    node_id: "founder",
    date: "2019",
    title: "THE FIRST TEAM",
    desc: "The founding members and pioneers who laid the core foundation.",
    icon: "Users",
    link: "/history/first-team",
    sort_order: 2
  },
  {
    id: "02",
    node_id: "02",
    date: "NOV 8-9, 2024",
    title: "INNOFIESTA 2024",
    desc: "Flagship multidisciplinary fest at HITAM.",
    icon: "Zap",
    sort_order: 3
  },
  {
    id: "03",
    node_id: "03",
    date: "MAR 29, 2025",
    title: "AKSHAYA PATRA VISIT",
    desc: "Industrial visit to the world's largest automated NGO kitchen.",
    icon: "Factory",
    sort_order: 4
  },
  {
    id: "04",
    node_id: "04",
    date: "MAY 9-10, 2025",
    title: "HACK YOUR PATH 6.0",
    desc: "24-hour hackathon with 60 interdisciplinary teams.",
    icon: "Code",
    sort_order: 5
  },
  {
    id: "05",
    node_id: "05",
    date: "MAY 27, 2025",
    title: "RESEARCH WRITING WORKSHOP",
    desc: "Training on paper structure and citation practices.",
    icon: "BookOpen",
    sort_order: 6
  },
  {
    id: "06",
    node_id: "06",
    date: "JULY 11-13, 2025",
    title: "AUNSF 3.0",
    desc: "Participation in Aeronox and Ignova domains at Anurag University.",
    icon: "Rocket",
    sort_order: 7
  },
  {
    id: "07",
    node_id: "07",
    date: "JULY 25, 2025",
    title: "INTRODUCTION TO ICTIEE",
    desc: "Session on academic research publication culture.",
    icon: "FileText",
    sort_order: 8
  },
  {
    id: "08",
    node_id: "08",
    date: "JULY 26 & 28, 2025",
    title: "DT PROJECT EXPO I",
    desc: "Showcasing prototypes developed through Design Thinking.",
    icon: "Lightbulb",
    sort_order: 9
  },
  {
    id: "09",
    node_id: "09",
    date: "AUG 31, 2025",
    title: "ICTIEE SUBMISSIONS",
    desc: "4 research papers submitted on GenAI, AR, and Gamification.",
    icon: "Upload",
    sort_order: 10
  },
  {
    id: "10",
    node_id: "10",
    date: "SEP 5, 2025",
    title: "THINKSPRINT IDEATHON",
    desc: "SDG-focused ideathon involving 7 pitching teams.",
    icon: "Brain",
    sort_order: 11
  },
  {
    id: "11",
    node_id: "11",
    date: "OCT 25, 2025",
    title: "SCHOOL VISITS",
    desc: "Needs assessment at Krushi Home and ZPHS Gowdavelly.",
    icon: "School",
    sort_order: 12
  },
  {
    id: "12",
    node_id: "12",
    date: "OCT 31, 2025",
    title: "AKSHAYAKALPA FARM VISIT",
    desc: "Exploration of tech integration in organic farming.",
    icon: "Leaf",
    sort_order: 13
  },
  {
    id: "13",
    node_id: "13",
    date: "DEC 9, 2025",
    title: "MR. PETER INTERACTION",
    desc: "Session with ED of EWB East Africa on humanitarian engineering.",
    icon: "Globe",
    sort_order: 14
  },
  {
    id: "14",
    node_id: "14",
    date: "DEC 19-20, 2025",
    title: "DT PROJECT EXPO II",
    desc: "Platform for human-centered solutions addressing real-world problems.",
    icon: "Wrench",
    sort_order: 15
  },
  {
    id: "15",
    node_id: "15",
    date: "JAN 7-10, 2026",
    title: "ICTIEE 2026 AWARD",
    desc: "Won the Student Chapter Award at the national conference.",
    icon: "Trophy",
    sort_order: 16
  },
  {
    id: "16",
    node_id: "16",
    date: "JAN 15, 2026",
    title: "IASF MENTORSHIP",
    desc: "AI Crop Disease & Waste Mgmt projects selected for elite mentorship.",
    icon: "Sprout",
    sort_order: 17
  },
  {
    id: "17",
    node_id: "17",
    date: "JAN 20, 2026",
    title: "EDUAITHON TOP 15",
    desc: "Team Label2Learn ranked among the top 15 teams nationally.",
    icon: "Medal",
    sort_order: 18
  },
  {
    id: "18",
    node_id: "18",
    date: "JAN 28-29, 2026",
    title: "INNOFIESTA 2026",
    desc: "Innovation event featuring Reverse Engineering challenges.",
    icon: "Cpu",
    sort_order: 19
  },
  {
    id: "19",
    node_id: "19",
    date: "FEB 2026",
    title: "RO PLANT INSTALLATION",
    desc: "Implementation of safe drinking water infrastructure at ZPHS Gowdavelly.",
    icon: "Droplets",
    sort_order: 20
  },
  {
    id: "investiture-ceremony",
    node_id: "investiture-ceremony",
    date: "MAR 2026",
    title: "INVESTITURE CEREMONY",
    desc: "Official induction of the new executive board and core team.",
    icon: "Medal",
    link: "/investiture-ceremony",
    sort_order: 21
  },
  {
    id: "present-team",
    node_id: "present-team",
    date: "2026",
    title: "PRESENT TEAM",
    desc: "Meet the current members driving our chapter's mission forward.",
    icon: "Users",
    link: "/team",
    sort_order: 22
  },
  {
    id: "20",
    node_id: "20",
    date: "APR 10, 2026",
    title: "IGNITE 2026",
    desc: "Welcoming the incoming batch to the chapter.",
    icon: "PartyPopper",
    link: "/ignite",
    sort_order: 23
  },
  {
    id: "22",
    node_id: "22",
    date: "APR 15, 2026",
    title: "HELPING HEARTS NGO VISIT",
    desc: "A visit to Helping Hearts NGO.",
    icon: "Users",
    image: "/images/events/NGOvisit%231.jpeg",
    sort_order: 24
  },
  {
    id: "24",
    node_id: "24",
    date: "APR 20, 2026",
    title: "IASF ADDRESSAL EVENT",
    desc: "Project addressal and validation event for the IUCEEE Annual Student Forum projects.",
    icon: "Brain",
    image: "/images/events/iasf-addressal.jpg",
    link: "/iasf-addressal-event",
    sort_order: 25
  },
  {
    id: "23",
    node_id: "23",
    date: "APR 25, 2026",
    title: "WILLIAM OAKES VISIT",
    desc: "Interactive mentorship and project design review session by Dr. William Oakes from Purdue University.",
    icon: "School",
    sort_order: 26
  },
  {
    id: "21",
    node_id: "21",
    date: "FUTURE",
    title: "TO BE CONTINUED...",
    desc: "Our journey of impact and innovation never stops.",
    icon: "Hourglass",
    sort_order: 27
  }
];
