import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding chapters and missions...')

  const chaptersData = [
    {
      number: 1,
      title: "The Awakening",
      lore: "You wake up with a neural implant that gives you access to the city's hidden data streams. Master the basics of Python syntax, data processing, and analysis.",
      unlockXp: 0,
      isLocked: false,
      npcName: "Ghost",
      npcRole: "Underground Guide",
      npcPersona: "Ex-corporate data scientist turned underground. Cryptic but helpful. Speaks in terse, data-driven metaphors.",
      missions: [
        {
          title: "Mission 1.1: Systems Uplink",
          type: "MAIN",
          briefing: "Welcome to Neural City. The corporate watchdogs are sniffing around your sector, but we can blind them if we spoof our connection variables. Create two variables, `agent_handle` as 'Specter' and `uplink_key` as 9482, then print them using f-strings to establish a baseline connection.",
          starterCode: `# SPOOF SYSTEM VARIABLES
# TODO: Define agent_handle as a string "Specter"
# TODO: Define uplink_key as an integer 9482

agent_handle = ""
uplink_key = 0

print(f"Uplink active: {agent_handle} with key {uplink_key}")`,
          judgeHint: "Check that agent_handle is set to 'Specter', and uplink_key is set to 9482. Confirm the printed output matches the spoof message.",
          xpReward: 100,
          isLocked: false
        }
      ]
    },
    {
      number: 2,
      title: "Control Flow City",
      lore: "The megacorp's security drones operate on simple logic loops. Learn to hijack them using conditionals, feature engineering, and scikit-learn models.",
      unlockXp: 500,
      isLocked: true,
      npcName: "Vex",
      npcRole: "Streetwise Smuggler",
      npcPersona: "A streetwise data smuggler. Impatient, slang-heavy, respects those who can bypass security quickly.",
      missions: []
    }
  ];

  for (const cData of chaptersData) {
    const chapter = await prisma.chapter.upsert({
      where: { number: cData.number },
      update: {
        title: cData.title,
        lore: cData.lore,
        unlockXp: cData.unlockXp,
        isLocked: cData.isLocked,
        npcName: cData.npcName,
        npcRole: cData.npcRole,
        npcPersona: cData.npcPersona,
      },
      create: {
        number: cData.number,
        title: cData.title,
        lore: cData.lore,
        unlockXp: cData.unlockXp,
        isLocked: cData.isLocked,
        npcName: cData.npcName,
        npcRole: cData.npcRole,
        npcPersona: cData.npcPersona,
      }
    });

    console.log(`Synced chapter: ${chapter.title}`);

    for (const mData of cData.missions) {
      await prisma.mission.upsert({
        where: {
          id: `${chapter.id}-${mData.title.replace(/\s+/g, '-').toLowerCase()}`
        },
        update: {
          title: mData.title,
          type: mData.type as any,
          briefing: mData.briefing,
          starterCode: mData.starterCode,
          judgeHint: mData.judgeHint,
          xpReward: mData.xpReward,
          isLocked: mData.isLocked,
        },
        create: {
          id: `${chapter.id}-${mData.title.replace(/\s+/g, '-').toLowerCase()}`,
          chapterId: chapter.id,
          title: mData.title,
          type: mData.type as any,
          briefing: mData.briefing,
          starterCode: mData.starterCode,
          judgeHint: mData.judgeHint,
          xpReward: mData.xpReward,
          isLocked: mData.isLocked,
        }
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
