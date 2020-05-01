/* eslint-disable no-restricted-syntax */
import { promises } from "fs";
import { join } from "path";

import { parse, stringify, MRC } from ".";

const testData: [string, string, MRC][] = [];

beforeAll(async () => {
  const dir = join(__dirname, "../files");
  const files = await promises.readdir(dir);
  const workouts = files.filter((filename) => /(mrc|erg)$/.test(filename));

  for await (const fileName of workouts) {
    const workout = await promises.readFile(join(dir, fileName), {
      encoding: "utf8",
    });
    const rawJson = await promises.readFile(join(dir, `${fileName}.json`), {
      encoding: "utf8",
    });

    const json = JSON.parse(rawJson);

    testData.push([fileName, workout, json]);
  }
});

describe(`mrc module`, () => {
  describe(`exports a parse method, that`, () => {
    describe(`parses mrc files:`, () => {
      it(`matches snapshots`, () => {
        testData.forEach(([, workout, json]) => {
          const parsed = parse(workout);
          expect(parsed).toStrictEqual(json);
        });
      });
    });
  });

  describe(`exports a stringify method, that`, () => {
    describe(`given a valid MRC file object, returns .mrc file`, () => {
      it(`matches snapshots`, () => {
        testData.forEach(([, workout, json]) => {
          const stringified = stringify(json);
          expect(stringified).toBe(workout);
        });
      });
    });
  });
});
