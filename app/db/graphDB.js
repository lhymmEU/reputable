import neo4j, { driver } from "neo4j-driver";

const initDriver = async (uri, username, password) => {
  let driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

  const serverInfo = await driver.getServerInfo();
  console.log(
    `Connected to ${serverInfo.address} with protocol version: ${serverInfo.protocolVersion}`
  );

  return driver;
};

export const connect = async () => {
  const driver = await initDriver(
    process.env.NEO4J_URI,
    process.env.NEO4J_USERNAME,
    process.env.NEO4J_PASSWORD
  );

  return driver;
};

export const disConnect = async (driver) => {
  await driver.close();
};

/**
 * This function adds new reputation node to neo4j.
 *
 *
 * @param {Driver} driver
 * @param {ReputationInfo} info
 * @returns {Promise<boolean>}
 *
 * @typedef {Object} ReputationInfo
 * @property {string} creator - The identifier of the creator.
 * @property {string} name - The name of the reputation.
 * @property {string} skill - To which skill category the reputation belongs.
 * @property {string} description - The description of the reputation.
 * @property {string} deliverable - The requirements to successfully claim the repuation.
 * @property {string} decayFn - The decay function of the reputation.
 * @property {string} decayParam - The parameters of the dacay function.
 */
export const createReputation = async (driver, info) => {
  // Open a session
  const session = driver.session();
  // Execute the write command
  const res = await session.executeWrite((tx) =>
    tx.run(
      `
      MATCH (u:WorldUser { userId: $creator })
      MERGE (r:Reputation {
        name: $name,
        skill: $skill,
        description: $description,
        deliverable: $deliverable,
        decayFn: $decayFn,
        decayParam: $decayParam
      })
      MERGE (u)-[:CREATED]->(r) // Creates the relationship
      RETURN r
      `,
      {
        creator: info.creator,
        name: info.name,
        skill: info.skill,
        description: info.description,
        deliverable: info.deliverable,
        decayFn: info.decayFn,
        decayParam: info.decayParam,
      }
    )
  );

  if (res.records.length === 0) {
    return false;
  }

  return true;
};

export const getReputation = async (driver, userId) => {
  const session = driver.session();
  const res = await session.executeRead((tx) =>
    tx.run(
      `
      MATCH (u:WorldUser { userId: $userId })-[:CREATED]->(r:Reputation)
      RETURN r
      `,
      {
        userId: userId,
      }
    )
  );

  if (res.records.length === 0) {
    return [];
  }

  // Map over the records to extract the properties of each "r" node
  return res.records.map((record) => record.get("r").properties);
};

export const claimRep = async (driver, info) => {
  const session = driver.session();
  try {
    const claimResult = await session.executeWrite((tx) =>
      tx.run(
        `
        MATCH (n:WorldUser { userId: $userId })
        MERGE (r:Reputation { id: $repName }) 
        MERGE (n)-[c:HAS_REPUTATION { submission: $link }]->(r)
        `,
        {
          userId: info.userId,
          repName: info.repName, // Include the ID or unique property of the Reputation node
          link: info.link, // Pass the link to the submission
        }
      )
    );

    if (claimResult.records.length === 0) {
      return undefined;
    }

    return claimResult.records[0].get("c").properties;
  } catch (error) {
    console.error("Error claiming reputation:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// This function first verify if a user already exists,
// If so, it will retrieve the user's information, otherwise it will create a new user.
export const authUser = async (driver, info) => {
  console.log("Authenticating user: ", info);
  const session = driver.session();
  // Verify if the user already exists.
  const existanceResults = await session.executeRead((tx) =>
    tx.run(`MATCH (n:WorldUser { userId: $id }) RETURN n`, {
      id: info.userId,
    })
  );

  // If the user does not exist, create a new user.
  if (existanceResults.records.length === 0) {
    // For newly created users the reputation array should be empty.
    const res = await session.executeWrite((tx) =>
      tx.run(
        `MERGE (n:WorldUser { userId: $id, username: $username }) RETURN n`,
        {
          id: info.userId,
          username: info.username,
        }
      )
    );

    console.log(
      "Returns from creating a new user: ",
      res.records[0].get("n").properties
    );

    if (res.records.length === 0) {
      return undefined;
    }

    return res.records[0].get("n").properties;
  } else {
    // If the user already exists, retrieve the user's information.
    const user = existanceResults.records[0].get("n");
    return user.properties;
  }
};
