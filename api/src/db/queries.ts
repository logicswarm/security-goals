const { releaseModel } = require("./model");
const chalk = require("chalk");
const log = console.log;

const note = message => {
  // @ts-ignore
  log(chalk.black.bgGreen("\n\n" + message));
};

export const getControl = async control => {
  note(`=== get control ===`);

  // @todo update this query to target single release
  // add => { $match: { 'controls.control': control, release } },

  const result = await releaseModel
    .aggregate([
      { $unwind: "$controls" },
      { $match: { "controls.control": control } },
      {
        $project: {
          release: 1,
          timestamp: "$createdAt",
          controls: 1,
          passed: 1,
          passing: 1,
          total: 1,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ])
    .exec();

  return result;
};

// SAVE ==========================================

const sumArray = (a, c) => a + c;

const sumReleaseControls = async results => {
  const checks = results.reduce((accumulator, item) => {
    const verifications = item.controls.verifications;
    const keys = Object.keys(verifications);
    const verified = keys.filter(i => {
      return verifications[i].passed;
    });

    let passing = 0;

    if (verified.length === keys.length) {
      passing++;
    }

    return [...accumulator, passing];
  }, []);

  const passing = checks.reduce(sumArray, 0);
  const total = checks.length;
  let passed = false;

  if (passing === total) {
    passed = true;
  }

  return {
    passed,
    passing,
    total,
  };
};

const checkExists = async obj => {
  const result = await releaseModel.find({ release: obj.release }).exec();
  return result;
};

const saveReleaseToDB = async obj => {
  const query = { release: obj.release };

  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  // find and update or insert new
  try {
    await releaseModel.findOneAndUpdate(query, obj, options).exec();
    await sumRelease(obj.release);
    return;
  } catch (e) {
    console.log(e.message);
  }
};

const unwindReleaseControls = async sha => {
  return releaseModel
    .aggregate([{ $match: { release: sha } }, { $unwind: "$controls" }])
    .exec();
};

export const getMinMaxReleaseDates = async () => {
  const max = await releaseModel
    .find({})
    .sort({ releaseTimeStamp: -1 })
    .limit(1)
    .exec();

  const min = await releaseModel
    .find({})
    .sort({ releaseTimeStamp: 1 })
    .limit(1)
    .exec();

  return {
    min: min[0].releaseTimeStamp,
    max: max[0].releaseTimeStamp,
  };
};

const getReleaseDate = async results => {
  let release = results[0].controls.verifications[0].release;
  let d = new Date(0);
  if (release.lastIndexOf("-") != -1) {
    return d.setUTCMilliseconds(
      release.substring(release.lastIndexOf("-") + 1),
    );
  } else {
    return d.setUTCMilliseconds(release);
  }
};

const sumRelease = async sha => {
  const results = await unwindReleaseControls(sha);
  const totals = await sumReleaseControls(results);
  const releaseDate = await getReleaseDate(results);
  return updateRelease(sha, totals, releaseDate);
};

// update release with totals
const updateRelease = async (sha, { passing, total }, releaseDate) => {
  await releaseModel
    .findOneAndUpdate(
      { release: sha },
      {
        passing: passing,
        total: total,
        passed: passing === total,
        releaseTimeStamp: releaseDate,
      },
    )
    .exec();
};

module.exports = {
  getMinMaxReleaseDates,
  getControl,
  sumRelease,
  checkExists,
  saveReleaseToDB,
};
