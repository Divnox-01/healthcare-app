import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INDIAN_DOCTORS = [
  { firstName: 'Rahul', lastName: 'Sharma', specialization: 'Cardiologist', location: 'Mumbai, Maharashtra', rating: 4.9 },
  { firstName: 'Priya', lastName: 'Mehta', specialization: 'Neurologist', location: 'Delhi, NCR', rating: 4.8 },
  { firstName: 'Anil', lastName: 'Desai', specialization: 'Orthopedic', location: 'Bangalore, Karnataka', rating: 4.7 },
  { firstName: 'Sunita', lastName: 'Reddy', specialization: 'Dermatologist', location: 'Chennai, Tamil Nadu', rating: 4.6 },
  { firstName: 'Vikram', lastName: 'Singh', specialization: 'General Physician', location: 'Pune, Maharashtra', rating: 4.5 },
  { firstName: 'Neha', lastName: 'Gupta', specialization: 'Pediatrician', location: 'Hyderabad, Telangana', rating: 4.9 },
  { firstName: 'Sanjay', lastName: 'Patel', specialization: 'Cardiologist', location: 'Ahmedabad, Gujarat', rating: 4.8 },
  { firstName: 'Divya', lastName: 'Iyer', specialization: 'Neurologist', location: 'Kochi, Kerala', rating: 4.7 },
];

async function main() {
  console.log('Seeding Database with Indian Doctors...');

  // Reset existing for clean seed (optional, commented out for safety)
  // await prisma.doctorProfile.deleteMany();
  // await prisma.user.deleteMany();

  for (const doc of INDIAN_DOCTORS) {
    const email = `${doc.firstName.toLowerCase()}.${doc.lastName.toLowerCase()}@hospital.in`;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: 'seededpassword123',
          role: 'DOCTOR'
        }
      });

      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          firstName: doc.firstName,
          lastName: doc.lastName,
          specialization: doc.specialization,
          location: doc.location,
          rating: doc.rating
        }
      });
      console.log(`Created Dr. ${doc.firstName} ${doc.lastName} - ${doc.specialization}`);
    }
  }

  console.log('Seeding Complete ✅');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
