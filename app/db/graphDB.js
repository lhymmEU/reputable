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
 * @property {string} name - The name of the reputation.
 * @property {string} skill - To which skill category the reputation belongs.
 * @property {string} description - The description of the reputation.
 * @property {string} deliverable - The requirements to successfully claim the repuation.
 * @property {DecayFunction} decay - The decay function of the reputation.
 *
 * @typedef {Object} DecayFunction
 * @property {string} name - The name of the decay function.
 * @property {number} params - The value of the parameters of the decay function.
 */
export const createReputation = async (driver, info) => {
  // Open a session
  const session = driver.session();
  // Execute the write command
  const res = await session.executeWrite((tx) =>
    tx.run(
      `MERGE (n:Reputation { name: $name, skill: $skill, description: $description, deliverable: $deliverable, decay: $decay }) RETURN n`,
      {
        name: info.name,
        skill: info.skill,
        description: info.description,
        deliverable: info.deliverable,
        decay: info.decay,
      }
    )
  );

  if (res.records.length === 0) {
    return false;
  }

  return true;
};

// This function first verify if a user already exists,
// If so, it will retrieve the user's information, otherwise it will create a new user.
export const authUser = async (driver, info) => {
  const session = driver.session();
  // Verify if the user already exists.
  const existanceResults = await session.executeRead((tx) =>
    tx.run(
      `MATCH (n:WorldUser { userId: $id }) RETURN n`,
      {
        id: info.userId,
      }
    )
  );

  // If the user does not exist, create a new user.
  if (existanceResults.records.length === 0) {
    // For newly created users the reputation array should be empty.
    const res = await session.executeWrite((tx) =>
      tx.run(
        `MERGE (n:WorldUser { userId: $id }) RETURN n`,
        {
          id: info.userId,
        }
      )
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
