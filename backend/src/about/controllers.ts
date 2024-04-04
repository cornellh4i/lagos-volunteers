import prisma from "../../client";

/**
 * Gets all about pages
 * @returns the contents of every about page
 */
const getAboutPageContent = async () => {
  return prisma.about.findFirst();
};

/**
 * Updates the about page's content
 * @param pageid about page id
 * @param pageContent: new content to be updated
 * @returns promise with updated about page or error
 */
const updateAboutPageContent = async (pageid: string, newContent: string) => {
  return prisma.about.update({
    where: { id: pageid },
    data: {
      content: newContent,
    },
  });
};

export default { getAboutPageContent, updateAboutPageContent };
