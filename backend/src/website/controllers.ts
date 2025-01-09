// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

const downloadAllWebsiteData = async () => {
  const getAllUsers = await prisma.user.findMany({
    include: {
      profile: true,
      preferences: true,
      events: true,
    },
  });

  const getAlEvents = await prisma.event.findMany({});

  const getAllEnrollments = await prisma.eventEnrollment.findMany({
    include: {
      event: {
        select: {
          name: true,
          description: true,
          location: true,
          startDate: true,
          endDate: true,
        },
      },
      user: {
        select: {
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
  });

  return Promise.all([getAllUsers, getAlEvents, getAllEnrollments]);
};

export default { downloadAllWebsiteData };
