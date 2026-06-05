const SUPABASE_URL = "https://qqxrifvdnnsajvnbqisr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeHJpZnZkbm5zYWp2bmJxaXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk3Njk2NiwiZXhwIjoyMDk1NTUyOTY2fQ.KbJYEYnko5Hx30RmUL75_UIkE9_RlKMxAqbTPZJ8oMI";

const users = [
  { email: "sarah@example.com",  password: "sarah@example.comA",  name: "Sarah Mitchell"  },
  { email: "james@example.com",  password: "james@example.comA",  name: "James Okonkwo"   },
  { email: "annika@example.com", password: "annika@example.comA", name: "Annika van Zyl"  },
  { email: "lerato@example.com", password: "lerato@example.comA", name: "Lerato Nkosi"    },
  { email: "thabo@example.com",  password: "thabo@example.comA",  name: "Thabo Pietersen" },
];

async function createUser(user) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.name },
    }),
  });

  const data = await res.json();

  if (data.id) {
    console.log(`✅ Created: ${user.name}`);
    console.log(`   Email   : ${user.email}`);
    console.log(`   UUID    : ${data.id}`);
    console.log(`   Password: ${user.password}`);
    console.log("");
  } else if (data.msg && data.msg.includes("already been registered")) {
    console.log(`⚠️  Already exists: ${user.email} — skipping`);
    console.log("");
  } else {
    console.error(`❌ Failed: ${user.name} — ${JSON.stringify(data)}`);
    console.log("");
  }

  return data;
}

async function main() {
  console.log("Creating seed users...\n");
  for (const user of users) {
    await createUser(user);
  }
  console.log("────────────────────────────────────────────────────");
  console.log("Done! Copy the UUIDs above and replace placeholders");
  console.log("in companion/scripts/seed-data.sql:");
  console.log("");
  console.log("  aaaaaaaa-0000-0000-0000-000000000001  →  Sarah UUID");
  console.log("  aaaaaaaa-0000-0000-0000-000000000002  →  James UUID");
  console.log("  aaaaaaaa-0000-0000-0000-000000000003  →  Annika UUID");
  console.log("  aaaaaaaa-0000-0000-0000-000000000004  →  Lerato UUID");
  console.log("  aaaaaaaa-0000-0000-0000-000000000005  →  Thabo UUID");
}

main();